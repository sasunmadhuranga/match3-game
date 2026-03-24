import { useEffect, useState, useCallback  } from "react";
import { findMatches } from "../utils/checkMatches";
import { clone, isAdjacent } from "../utils/utils";
import { Tile } from "./Tile";
import "./App.css";

const SIZE = 8;
const TYPES = ["🍒", "🍋", "🍇", "🍊", "🍉", "🍎"];

const randomTile = () =>
  TYPES[Math.floor(Math.random() * TYPES.length)];

const createBoard = () =>
  Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, () => ({
      type: randomTile(),
      power: null,
      id: Math.random(),
    }))
  );

export default function GameBoard() {
  const [board, setBoard] = useState(createBoard());
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);


  const handleClick = (r, c) => {
    if (isAnimating) return;

    const tile = board[r][c];

    if (tile?.power) {
      const newBoard = clone(board);
      const cleared = activatePower(newBoard, r, c);
      setScore((s) => s + cleared * 10);
      setBoard(refill(applyGravity(newBoard)));
      return;
    }

    if (!selected) {
      setSelected({ r, c });
    } else {
      swap(selected, { r, c });
      setSelected(null);
    }
  };

  const swap = (a, b) => {
    if (!isAdjacent(a, b)) return;

    const newBoard = clone(board);

    [newBoard[a.r][a.c], newBoard[b.r][b.c]] = [
      newBoard[b.r][b.c],
      newBoard[a.r][a.c],
    ];

    const matches = findMatches(newBoard);

    if (!matches.length) {
      setBoard(newBoard);
      setTimeout(() => setBoard(board), 150);
      return;
    }

    setBoard(newBoard);
  };

  const activatePower = useCallback((board, r, c, visited = new Set()) => {
    const key = `${r},${c}`;
    if (!board[r]?.[c] || visited.has(key)) return 0;

    visited.add(key);
    const tile = board[r][c];
    let cleared = 1;
    board[r][c] = null;

    if (tile.power === "line") {
        for (let i = 0; i < SIZE; i++) {
        if (board[r][i]) cleared += activatePower(board, r, i, visited);
        }
    }

    if (tile.power === "bomb") {
        for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (board[nr]?.[nc]) cleared += activatePower(board, nr, nc, visited);
        }
        }
    }

    return cleared;
    }, []);

  const handleMatches = useCallback((matches) => {
    setIsAnimating(true);

    const newBoard = clone(board);
    let gained = 0;
    let powerScore = 0;

    let createPower = null;
    if (matches.length >= 5) createPower = "bomb";
    else if (matches.length >= 4) createPower = "line";

    const [pr, pc] = matches[0];
    const powerType = board[pr][pc].type;

    matches.forEach(([r, c]) => {
      if (newBoard[r][c]?.power) {
        powerScore += activatePower(newBoard, r, c);
      }

      if (createPower && r === pr && c === pc) return;

      newBoard[r][c] = null;
      gained++;
    });

    if (createPower) {
      newBoard[pr][pc] = {
        type: powerType,
        power: createPower,
        id: Math.random(),
      };
    }

    setScore((s) => s + (gained + powerScore) * 10 * (combo + 1));

    setTimeout(() => {
      setBoard(refill(applyGravity(newBoard)));
      setIsAnimating(false);
    }, 300);
  }, [board, combo, activatePower]);


    useEffect(() => {
        const timer = setTimeout(() => {
            const matches = findMatches(board);
            if (matches.length) {
            setCombo((c) => c + 1);
            handleMatches(matches);
            } else {
            setCombo(0);
            }
        }, 250);

        return () => clearTimeout(timer);
        }, [board, handleMatches]);

  const applyGravity = (board) => {
    for (let c = 0; c < SIZE; c++) {
      let stack = [];

      for (let r = SIZE - 1; r >= 0; r--) {
        if (board[r][c]) stack.push(board[r][c]);
      }

      for (let r = SIZE - 1; r >= 0; r--) {
        board[r][c] = stack.shift() || null;
      }
    }
    return board;
  };

  const refill = (board) =>
    board.map((row) =>
      row.map(
        (cell) =>
          cell || {
            type: randomTile(),
            power: null,
            id: Math.random(),
          }
      )
    );

  return (
    <div>
      <h2>Score: {score}</h2>
      <h3>Combo: x{combo}</h3>

      <div className="board">
        {board.map((row, r) =>
          row.map((tile, c) => (
            <Tile
              key={tile?.id || `${r}-${c}`}
              tile={tile}
              onClick={() => handleClick(r, c)}
              selected={selected?.r === r && selected?.c === c}
            />
          ))
        )}
      </div>
    </div>
  );
}