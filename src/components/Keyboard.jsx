import { useState } from "react";
import { useGame } from "../context/gameContext";
import { qwerty } from "../data";

function Keyboard() {
  const { dispatch, tempGrid } = useGame();

  const keyboard = qwerty.split(" ").map((row) => row.split(""));
  console.log(keyboard);

  keyboard[2].unshift("ENTER");
  keyboard[2].push("⌫");

  const handleTransitionEnd = (e) => {
    if (e.target.classList.contains("inputted")) {
      const classListArray = Array.from(e.target.classList);
      const filteredArray = classListArray.filter((el) => el !== "inputted");
      e.target.className = filteredArray.join(" ");
    }
  };

  const handleClick = (letter) => (e) => {
    e.target.classList.add("inputted");
    if (letter === "⌫") {
      dispatch({ type: "backspace", payload: letter });
    } else if (letter === "ENTER") {
      dispatch({ type: "publish", payload: letter });
    } else {
      dispatch({ type: "letterInputted", payload: letter });
    }
  };

  return (
    <div className="keyboard">
      {keyboard.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((letter) => (
            <div
              onTransitionEnd={handleTransitionEnd}
              onClick={handleClick(letter)}
              className={`${
                letter === "ENTER"
                  ? "left specialKey"
                  : letter === "⌫"
                  ? "right specialKey"
                  : ""
              } key ${tempGrid
                .filter((tile) => tile.value === letter)
                .map((el) =>
                  el?.state
                    .filter((el) => el !== "shuffle-win" && el !== "shuffle")
                    .join(" ")
                )}`}
            >
              <p>{letter}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
