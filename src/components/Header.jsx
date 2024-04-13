import { useGame } from "../context/gameContext";
import Tile from "./Tile";
import { motion } from "framer-motion";

function Header() {
  const { startScreenTiles, dispatch, triggerStates } = useGame();

  function handleTransition(e) {
    if (e.target.classList.contains("logo")) {
      dispatch({
        type: "stateTriggered",
        payload: { element: "starterHeader", state: "complete" },
      });
    }
  }
  return (
    <motion.div
      layout
      animate={triggerStates.gameStarted && { scale: 0.6 }}
      onTransitionEnd={handleTransition}
      className={!triggerStates.gameStarted ? "logo" : "logo gameStarted"}
    >
      {startScreenTiles.map((_, i) => (
        <Tile info={startScreenTiles[i]} key={i} index={i}></Tile>
      ))}
    </motion.div>
  );
}

export default Header;
