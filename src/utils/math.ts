export function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function uuid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
