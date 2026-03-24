import { motion } from "framer-motion";

export const Tile = ({ tile, onClick, selected }) => {
  if (!tile) return <div className="tile empty" />;

  return (
    <motion.div
      layout
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileTap={{ scale: 0.85 }}
      className={`tile ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {tile.type}
      {tile.power === "line" && <span className="power">⚡</span>}
      {tile.power === "bomb" && <span className="power">💣</span>}
    </motion.div>
  );
};