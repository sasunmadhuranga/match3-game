export const findMatches = (board) => {
  const matches = [];
  const size = board.length;

  for (let r = 0; r < size; r++) {
    let streak = 1;

    for (let c = 1; c <= size; c++) {
      if (
        c < size &&
        board[r][c] &&
        board[r][c - 1] &&
        board[r][c].type === board[r][c - 1].type
      ) {
        streak++;
      } else {
        if (streak >= 3) {
          for (let i = 0; i < streak; i++) {
            matches.push([r, c - 1 - i]);
          }
        }
        streak = 1;
      }
    }
  }

  for (let c = 0; c < size; c++) {
    let streak = 1;

    for (let r = 1; r <= size; r++) {
      if (
        r < size &&
        board[r][c] &&
        board[r - 1][c] &&
        board[r][c].type === board[r - 1][c].type
      ) {
        streak++;
      } else {
        if (streak >= 3) {
          for (let i = 0; i < streak; i++) {
            matches.push([r - 1 - i, c]);
          }
        }
        streak = 1;
      }
    }
  }

  return matches;
};