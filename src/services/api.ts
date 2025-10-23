// Use relative /api paths in development so the Vite dev proxy can forward requests to the backend
// In production you can keep an absolute backend origin if needed.
export const API = (path: string) => {
  try {
    // Vite exposes import.meta.env.DEV at build time
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV) {
      return path // relative path like '/api/menu' will be proxied by Vite dev server
    }
  } catch {}
  return `http://localhost:8080${path}`
}

const TOKEN_KEY = 'access_token'
const ROLE_KEY = 'user_role'
const CUSTOMER_USERNAME_KEY = 'customer_username'

export function setAccessToken(token: string | null, role?: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
    if (role) localStorage.setItem(ROLE_KEY, role)
  } else {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(ROLE_KEY)
  }
  // notify other windows/components that auth changed and include role
  try { window.dispatchEvent(new CustomEvent('auth:change', { detail: { token, role } })) } catch {}
}

// store customer username (for customer dashboard/order payloads)
export function setCustomerUsername(username: string | null) {
  try {
    if (username) localStorage.setItem(CUSTOMER_USERNAME_KEY, username)
    else localStorage.removeItem(CUSTOMER_USERNAME_KEY)
    // also notify listeners of auth change so components can react
    try { window.dispatchEvent(new CustomEvent('auth:change', { detail: { token: getAccessToken(), role: getUserRole(), customerUsername: username } })) } catch {}
  } catch {}
}

export function getAccessToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function getCustomerUsername(): string | null {
  try { return localStorage.getItem(CUSTOMER_USERNAME_KEY) } catch { return null }
}

export function getUserRole(): string | null {
  try { return localStorage.getItem(ROLE_KEY) } catch { return null }
}

// Wait for a token to appear (listens for auth:change). Resolves with token or null after timeout.
async function waitForToken(ms = 2000): Promise<string | null> {
  const existing = getAccessToken()
  if (existing) return existing
  return await new Promise(resolve => {
    let done = false
    const onAuth = (e: any) => {
      if (done) return
      const t = e?.detail?.token || getAccessToken()
      if (t) {
        done = true
        window.removeEventListener('auth:change', onAuth as EventListener)
        clearTimeout(timer)
        resolve(t)
      }
    }
    const timer = setTimeout(() => {
      if (done) return
      done = true
      window.removeEventListener('auth:change', onAuth as EventListener)
      resolve(null)
    }, ms)
    window.addEventListener('auth:change', onAuth as EventListener)
  })
}

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = API(path)
  const headers = new Headers(opts.headers || {})

  // Read token; if missing, wait (but skip waiting for the login endpoint itself)
  let token = getAccessToken()
  if (!token && !path.includes('/api/auth/login')) {
    try { token = await waitForToken(2000) } catch {}
  }

  if (token) headers.set('Authorization', `Bearer ${token}`)
  // ensure JSON content type for bodies unless explicitly set otherwise
  if (opts.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  // Debug: log outgoing request (mask token)
  try {
    const authHeader = headers.get('Authorization')
    const masked = authHeader ? `${authHeader.slice(0, 20)}...` : 'none'
    console.debug('[api] request]', opts.method || 'GET', url, 'Authorization=', masked)
  } catch {}

  const res = await fetch(url, { ...opts, headers })
  // if server indicates unauthorized, clear stored token to prompt re-auth
  if (res.status === 401) {
    try { setAccessToken(null) } catch {}
    const text = await res.text().catch(() => '')
    // Debug: log unauthorized response
    try { console.error('[api] 401 response]', url, text) } catch {}
    const err = new Error(text || 'Unauthorized') as any
    err.status = res.status
    err.body = text
    throw err
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    // Debug: log full error response for easier diagnosis
    try { console.error('[api] error response]', res.status, url, text || res.statusText) } catch {}
    const err = new Error(text || `${res.status} ${res.statusText}`) as any
    err.status = res.status
    err.body = text
    throw err
  }
  // try parse json, but allow empty responses
  const text = await res.text()
  try { return text ? JSON.parse(text) : (undefined as unknown as T) }
  catch { return (text as unknown) as T }
}

export async function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' })
}

export async function post<T>(path: string, body: any): Promise<T> {
  const opts: RequestInit = { method: 'POST' }
  if (body !== undefined) opts.body = JSON.stringify(body)
  return request<T>(path, opts)
}

export async function postRaw<T>(path: string, opts: RequestInit = {}): Promise<T> {
  // helper for POSTs that rely on query params and no JSON body
  return request<T>(path, { ...opts, method: opts.method || 'POST' })
}

// add login helper that posts credentials and stores the returned access token
export type LoginResponse = { accessToken?: string; token?: string; role?: string; user?: { role?: string }; [key: string]: any }

export async function login(username: string, password: string, role?: string): Promise<{ token: string; role: string | null }> {
  // Decide endpoint based on requested role. Admins use the auth endpoint; customers use the customer login endpoint.
  const isAdmin = (role || '').toLowerCase() === 'admin'
  let res: LoginResponse | null = null
  if (isAdmin) {
    const body: any = { username, password }
    if (role) body.role = role
    res = await request<LoginResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
  } else {
    // Customer login: POST { username, password, role: 'customer' } to /api/v1/customers/login per backend expectation
    const body = { username, password, role: role || 'customer' }
    res = await request<LoginResponse>('/api/v1/customers/login', { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } })
  }

  // Robust token extraction: support several common shapes
  const extractToken = (r: any): string | undefined => {
    if (!r) return undefined
    return r.accessToken || r.token || r.access_token || r.data?.accessToken || r.data?.token || r.data?.access_token
  }
  const extractRole = (r: any): string | null => {
    if (!r) return null
    return r.role || r.user?.role || r.data?.role || null
  }

  const token = extractToken(res) || ''
  if (!token) {
    // Provide a helpful error containing the raw response body for debugging
    const respBody = JSON.stringify(res || {})
    console.error('[auth] login did not return token, response:', respBody)
    throw new Error('Login did not return an access token')
  }
  // prefer role returned from server if available, otherwise use requested role
  const respRole = extractRole(res) || role || null
  // store token and role together so App can react to role-based redirects
  setAccessToken(token, respRole)
  // Debug: log what the login returned and the masked token stored (dev only)
  try {
    const masked = token ? `${token.slice(0, 20)}...` : 'none'
    console.debug('[auth] login response:', res, 'stored token:', masked, 'role:', respRole)
  } catch {}
  return { token, role: respRole }
}

// New helper to register customers using the provided backend endpoint
export type RegisterRequest = { username: string; name: string; age?: number; contact: string; address?: string; password: string }
export type RegisterResponse = { id?: string; message?: string; [key: string]: any }

export async function registerCustomer(body: RegisterRequest): Promise<RegisterResponse> {
  // POST to the customer register endpoint used by the user's curl example
  return post<RegisterResponse>('/api/v1/customers/register', body)
}
