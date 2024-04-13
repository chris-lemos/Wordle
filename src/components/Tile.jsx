import { useGame } from "../context/gameContext";
import { motion } from "framer-motion";

function Tile({ info, index }) {
  const { currentGuess, grid, dispatch, currentRow, gameState, triggerStates } =
    useGame();
  let flipTiming;

  if (triggerStates.startScreenFlipAnimationEnd) {
    flipTiming = {
      transitionDelay: `${index * 0.2 - currentRow + 1}s`,
    };
  } else {
    flipTiming = {
      transitionDelay: `${index * 0.05 - currentRow}s`,
    };
  }
  const flipBackTiming = {
    transitionDelay: `${(grid.length - index - 1) * 0.02 - currentRow}s`,
  };

  const handleTransitionEnd = (e) => {
    const classList = e.target.classList;

    if (triggerStates.gameStarted) {
      if (classList.contains("inputted")) {
        const classListArray = Array.from(classList);
        const filteredArray = classListArray.filter((el) => el !== "inputted");
        e.target.className = filteredArray.join(" ");
      }

      if (classList.contains("flipping")) {
        if ((index + 1) % 5 === 0) {
          dispatch({ type: "halfFlip/last/ended" });
        }
      }

      if (classList.contains("flipping-back")) {
        dispatch({ type: "reset/flip", payload: index });
        if (index === 0) {
          dispatch({ type: "reset/flip/last" });
        }
      } else if (triggerStates.isFlipping) {
        if ((index + 1) % 5 === 0) {
          dispatch({ type: "fullFlip/ended/Tile", payload: index });
          dispatch({ type: "fullFlip/ended/lastTile", payload: index });
        } else {
          dispatch({ type: "fullFlip/ended/Tile", payload: index });
        }
      }
    } else {
      if (classList.contains("flipping")) {
        dispatch({ type: "startScreen/flipping", payload: index });
      }
    }
  };

  const handleAnimationEnd = (e) => {
    const classList = e.target.classList;

    if (classList.contains("tile") && !triggerStates.gameStarted) {
      dispatch({ type: "gameLoaded" });
    }

    if (classList.contains("shuffle")) {
      dispatch({ type: "shuffle/error/ended/tile", payload: index });
      if (index === currentGuess - 1) {
        setTimeout(() => {
          dispatch({ type: "shuffle/error/ended/lastTile", payload: index });
        }, 200);
      }
    }

    if (classList.contains("shuffle-win")) {
      if ((index + 1) % 5 === 0) {
        dispatch({ type: "shuffle/won/ended/last", payload: index });
        dispatch({ type: "shuffle/won/ended", payload: index });
      } else {
        dispatch({ type: "shuffle/won/ended", payload: index });
      }
    }
  };

  return (
    <motion.p
      animate={triggerStates.gameStarted && { margin: 0 }}
      onTransitionEnd={handleTransitionEnd}
      onAnimationEnd={handleAnimationEnd}
      style={{
        ...(info.state.includes("flipping")
          ? flipTiming
          : info.state.includes("flipping-back")
          ? flipBackTiming
          : null),
        animationDelay: `${(index % 5) * 0.1}s`,
      }}
      className={`
      ${index === currentGuess && gameState !== "WON" ? "currentTile" : ""} 
      
      ${
        info.state.includes("flipping")
          ? "flipping"
          : info.state.filter((el) => el !== "flipping").join(" ")
      } 
      tile`}
    >
      {info.value}
    </motion.p>
  );
}

export default Tile;
