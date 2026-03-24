export const clone = (board) =>
  board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));

export const isAdjacent = (a, b) => {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
};