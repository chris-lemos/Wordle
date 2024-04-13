import Button from "./Button";

import { useGame } from "../context/gameContext";

import { motion } from "framer-motion";

function StartScreen() {
  const { triggerStates, dispatch } = useGame();

  const handleTransitionEnd = (e) => {
    dispatch({
      type: "stateTriggered",
      payload: { element: "titleText", state: "complete" },
    });
  };

  return (
    <div className="startScreen">
      <div
        className="introductionText"
        style={{ opacity: triggerStates.startScreenFlipAnimationEnd ? 100 : 0 }}
      >
        <motion.h1
          className={triggerStates.gameStarted && "removed"}
          onTransitionEnd={handleTransitionEnd}
        >
          Get 6 chances to guess a 5-letter word.
        </motion.h1>
      </div>
      <motion.span
        animate={triggerStates.gameStarted && { scale: 0 }}
        className="introductionText"
        style={{ opacity: triggerStates.startScreenFlipAnimationEnd ? 100 : 0 }}
      >
        <Button
          className={triggerStates.gameStarted && "flipping"}
          actions={[{ type: "startGame" }, { type: "modal", payload: "help" }]}
        >
          How To Play
        </Button>
        <Button
          actions={{ type: "startGame" }}
          className={
            triggerStates.gameStarted ? "btn-primary flipping" : "btn-primary"
          }
        >
          Play
        </Button>
      </motion.span>
    </div>
  );
}

export default StartScreen;
