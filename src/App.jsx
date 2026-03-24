import React from "react";
import GameBoard from "./components/GameBoard";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <h1>🍭 Match-3 Game</h1>
      <GameBoard />
    </div>
  );
}