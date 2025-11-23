export function randomColor(): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#FFD93D',
    '#1A535C',
    '#FF9F1C',
    '#6A4C93',
    '#2EC4B6',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
