// central map of subtle dual-color gradients for section headers (single base color with small variations)
export const SECTION_GRADIENTS: Record<string, string> = {
  // base purple: #8e44ff (small, perceptible variations around this)
  default: 'linear-gradient(90deg,#8e44ff,#8840ff)',
  // slightly lighter / warmer purple
  rolls: 'linear-gradient(90deg,#8e44ff,#9a4cff)',
  // slight magenta-leaning tint
  breakfast: 'linear-gradient(90deg,#8e44ff,#8b39ff)',
  // slightly deeper purple
  thali: 'linear-gradient(90deg,#8e44ff,#7f3fff)',
  // subtle warmer purple
  starters: 'linear-gradient(90deg,#8e44ff,#a053ff)',
  // slightly more blue
  biryani: 'linear-gradient(90deg,#8e44ff,#7a44ff)',
  // slightly darker / dusk purple
  party: 'linear-gradient(90deg,#8e44ff,#6f36ff)',
  // a touch more vivid / lighter
  beverages: 'linear-gradient(90deg,#8e44ff,#8e62ff)',
  // small variation toward indigo
  main: 'linear-gradient(90deg,#8e44ff,#8544ff)',
  // Sunday Special: teal -> green (used for the Sunday Special header)
  sundaySpecial: 'linear-gradient(90deg,#11c3b3,#68e06f)',
  // Friday Special: purple -> green (matches the Friday header visual)
  fridaySpecial: 'linear-gradient(90deg,#8e44ff,#34d399)',
  // Saturday Special: blue -> purple (used for Saturday header)
  saturdaySpecial: 'linear-gradient(90deg,#1f6feb,#c084fc)',
  // Platters: coral -> purple (matches the Platters visual header)
  platters: 'linear-gradient(90deg,#ff6b6b,#8e44ff)'
}
