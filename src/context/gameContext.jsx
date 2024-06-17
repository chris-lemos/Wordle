import { useReducer, useContext, createContext, useEffect } from "react";
import useControls from "./Controls";
import { dictionary, qwerty, alphabet, rank } from "../data";
import { generateWord } from "../utils";

const GameContext = createContext();
const games = localStorage.getItem("gamesPlayed");

const initialState = {
  gameState: null,
  possibleWords: dictionary,
  grid: Array.from({ length: 5 * 6 }, () => ({ value: "", state: [] })),
  wordOfTheDay: generateWord(),
  currentGuess: null,
  rowComplete: false,
  currentRow: 0,
  controls: false,
  message: "",
  tempGrid: [],
  activeModalType: null,
  gamesPlayed: JSON.parse(games) || [],
  startScreenTiles: ["", "", "", "", "", ""].map((letter) => ({
    state: [],
    value: letter,
  })),
  triggerStates: {
    gameStarted: false,
    startScreenFlipAnimationEnd: false,
    shuffleAnimationEnd: false,
    isFlipping: false,
  },
};

function reducer(state, action) {
  let updatedGrid;
  let guessedWord;
  let guessedWordString;
  let boardState;
  let tempPossibleWords;
  let updatedStartScreenTiles;

  function validateLetters(grid, wordOfTheDay) {
    const correctLetters = [];
    const wrongLetters = [];

    grid.forEach((tile) => {
      if (wordOfTheDay.includes(tile.value) && tile.value !== "") {
        correctLetters.push(tile.value);
      } else if (tile.value !== "") {
        wrongLetters.push(tile.value);
      }
    });

    return { correctLetters, wrongLetters };
  }

  function filterPossibleWordsByLetters(grid, wordOfTheDay, possibleWords) {
    const { correctLetters, wrongLetters } = validateLetters(
      grid,
      wordOfTheDay
    );

    return possibleWords.filter((word) => {
      return (
        correctLetters.every((letter) => word.includes(letter)) &&
        !wrongLetters.some((letter) => word.includes(letter))
      );
    });
  }

  function filterPossibleWordsByRegexPattern(
    guessedWord,
    wordOfTheDay,
    possibleWords
  ) {
    // create regex pattern
    const { regexPattern, regexPatternArray } = createRegexPattern(
      guessedWord,
      state.wordOfTheDay
    );

    //filter possible words using regex pattern
    possibleWords = possibleWords.filter((word) => {
      return regexPattern.test(word);
    });

    console.log(possibleWords);

    return { regexPatternArray, newPossibleWords: possibleWords };
  }

  function shuffleAnimation(grid, currentRow, currentGuess, error) {
    if (error) {
      guessedWord = grid.slice(currentRow * 5, currentGuess + 1);
      guessedWord.forEach((_, i) => {
        if (error && i < currentGuess)
          grid[i + currentRow * 5].state.push("shuffle");
      });
    } else {
      guessedWord = grid.slice(state.currentGuess - 4, state.currentGuess + 1);
      guessedWord.forEach((_, i) => {
        grid[currentRow * 5 + i - 5].state.push("shuffle-win");
      });
    }
  }

  function createRegexPattern(guessedWord, wordOfTheDay) {
    const regexPatternArray = Array.from({ length: 5 }, () => "");
    const tempWordOfTheDay = [];
    const tempGuessedWord = [];

    guessedWord.forEach(({ value }, i) => {
      if (value === wordOfTheDay[i]) {
        regexPatternArray[i] = value;
        tempWordOfTheDay.push("");
        tempGuessedWord.push("");
      } else {
        tempWordOfTheDay.push(wordOfTheDay[i]);
        tempGuessedWord.push(value);
      }
    });

    tempGuessedWord.forEach((letter, i) => {
      if (!letter) return;
      if (tempWordOfTheDay.includes(letter)) {
        const nonMatchingCount = regexPatternArray.filter(
          (el) => el === `[^${letter}]`
        ).length;
        regexPatternArray[i] =
          nonMatchingCount < tempWordOfTheDay.filter((l) => l === letter).length
            ? `[^${letter}]`
            : ".";
      } else {
        regexPatternArray[i] = ".";
      }
    });

    return {
      regexPattern: new RegExp(regexPatternArray.join("")),
      regexPatternArray,
    };
  }

  function updateGridStates(grid, regexPatternArray, currentRow) {
    regexPatternArray.forEach((regEl, i) => {
      const states = ["flipping"];

      if (qwerty.includes(regEl)) {
        states.push("correct");
      } else if (regEl == ".") {
        states.push("wrong");
      } else {
        states.push("included");
      }
      grid[i + currentRow * 5].state.push(...states);
    });
  }

  function addGame(gameState, currentRow) {
    return {
      date: Date.now(),
      winningRow: gameState === "WON" ? currentRow : null,
    };
  }

  switch (action.type) {
    //utils
    case "wordGenerated":
      return { ...state, wordOfTheDay: action.payload };
    case "clearMessage":
      return { ...state, message: "" };
    case "modal":
      return { ...state, activeModalType: action.payload };
    case "modal/close":
      return { ...state, activeModalType: null };
    //animation logic
    // row flip
    case "halfFlip/last/ended": //deep copy grid
      return {
        ...state,
        triggerStates: { ...state.triggerStates, isFlipping: false },
        currentGuess: state.currentGuess + 1,
        tempGrid: JSON.parse(JSON.stringify(state.grid)),
      };
    case "fullFlip/ended/Tile": // update flip animation, check win/lost condition
      tempPossibleWords = [...state.possibleWords];
      updatedGrid = [...state.grid];
      guessedWord = updatedGrid.slice(
        state.currentGuess - 5,
        state.currentGuess
      );
      guessedWordString = guessedWord.map((letter) => letter.value).join("");

      // remove flip animation from tile
      updatedGrid[action.payload].state = updatedGrid[
        action.payload
      ].state.filter((cl) => cl !== "flipping" && cl !== "inputted");

      if (
        guessedWordString == state.wordOfTheDay &&
        (action.payload + 1) % 5 === 0
      ) {
        boardState = "WON";
      } else if (state.currentGuess === 30) {
        boardState = "LOST";
      } else {
        tempPossibleWords = tempPossibleWords.filter(
          (y) => y !== guessedWordString
        );
        boardState = null;
      }

      return {
        ...state,
        grid: updatedGrid,
        gameState: boardState,
        possibleWords: tempPossibleWords,
      };
    case "fullFlip/ended/lastTile": //turn controls back on
      return { ...state, controls: true };
    case "startScreen/flipping":
      const wordleText = "WORDLE";

      updatedStartScreenTiles = [...state.startScreenTiles];
      updatedStartScreenTiles[action.payload].state.push("wrong");
      updatedStartScreenTiles[action.payload].value =
        wordleText[action.payload];
      updatedStartScreenTiles[action.payload].state = updatedStartScreenTiles[
        action.payload
      ].state.filter((cl) => cl !== "flipping" && cl !== "inputted");

      return {
        ...state,
        startScreenTiles: updatedStartScreenTiles,
        triggerStates: {
          ...state.triggerStates,
          startScreenFlipAnimationEnd: action.payload === 5 ? true : false,
        },
      };
    //reset
    case "reset/flip/last":
      return { ...state, controls: true };
    case "reset/flip":
      updatedGrid = [...state.grid];
      updatedGrid[action.payload].state = updatedGrid[action.payload].state =
        [];
      updatedGrid[action.payload].value = "";

      return {
        ...state,
        updatedGrid,
        currentGuess: action.payload,
        controls: false,
      };

    //clear shuffle animations
    case "shuffle/won/ended":
      updatedGrid = [...state.grid];
      updatedGrid[action.payload].state = updatedGrid[
        action.payload
      ].state.filter((cl) => cl !== "shuffle-win");

      return {
        ...state,
        grid: updatedGrid,
        message: "",
        triggerStates: { ...state.triggerStates, shuffleAnimationEnd: true },
        activeModalType: "stats",
      };
    case "shuffle/won/ended/last":
      return {
        ...state,
        gamesPlayed: [
          ...state.gamesPlayed,
          addGame(state.gameState, state.currentRow),
        ],
      };
    case "shuffle/error/ended/tile":
      updatedGrid = [...state.grid];
      updatedGrid[action.payload].state = updatedGrid[
        action.payload
      ].state.filter((cl) => cl !== "shuffle" && cl !== "inputted");
      return { ...state, grid: updatedGrid, controls: false };
    case "shuffle/error/ended/lastTile":
      return { ...state, message: "", controls: true };

    //inputs
    case "letterInputted":
      if (!state.controls) return { ...state };

      updatedGrid = [...state.grid];
      updatedGrid[state.currentGuess].value = action.payload;
      updatedGrid[state.currentGuess].state.push("inputted");

      if ((state.currentGuess + 1) % 5 === 0 && state.currentGuess) {
        return { ...state, grid: updatedGrid, rowComplete: true };
      }

      return {
        ...state,
        grid: updatedGrid,
        currentGuess: state.currentGuess + 1,
      };
    case "backspace":
      if (!state.controls) return { ...state };
      updatedGrid = [...state.grid];
      let newPosition = state.currentGuess;

      if (state.currentGuess % 5 === 0) {
        updatedGrid[state.currentGuess].value = "";
      } else {
        if (state.rowComplete) {
          updatedGrid[state.currentGuess].value = "";
        } else {
          updatedGrid[state.currentGuess - 1].value = "";
          newPosition = state.currentGuess - 1;
        }
      }
      return {
        ...state,
        currentGuess: newPosition,
        grid: updatedGrid,
        rowComplete: false,
      };
    case "publish": //
      if (!state.controls) return { ...state };
      console.log(state.gameState);
      updatedGrid = [...state.grid];
      guessedWord = updatedGrid.slice(
        state.currentGuess - 4,
        state.currentGuess + 1
      );
      guessedWordString = guessedWord.map((letter) => letter.value).join("");

      //error checking
      if (!state.rowComplete || !dictionary.includes(guessedWordString)) {
        shuffleAnimation(
          updatedGrid,
          state.currentRow,
          state.currentGuess,
          true
        );
        return {
          ...state,
          controls: false,
          grid: updatedGrid,
          message: !state.rowComplete
            ? "Not enough letters"
            : "Word not in dictionary",
        };
      }

      // filter by letters
      let possibleWords = filterPossibleWordsByLetters(
        state.grid,
        state.wordOfTheDay,
        state.possibleWords
      );

      // filter by regex pattern, return regexPatternArray
      const { regexPatternArray, newPossibleWords } =
        filterPossibleWordsByRegexPattern(
          guessedWord,
          state.wordOfTheDay,
          possibleWords
        );

      // Update grid states based on regexPatternArray
      updateGridStates(updatedGrid, regexPatternArray, state.currentRow);

      return {
        ...state,
        grid: updatedGrid,
        currentRow: state.currentRow + 1,
        rowComplete: false,
        controls: false,
        triggerStates: { ...state.triggerStates, isFlipping: true },
        possibleWords: newPossibleWords,
      };

    //game state
    case "LOST": // message
      return {
        ...state,
        message: state.wordOfTheDay,
        gamesPlayed: [
          ...state.gamesPlayed,
          addGame(state.gameState, state.currentRow),
        ],
        activeModalType: "stats",
      };
    case "WON": // shuffle-win animation, message
      updatedGrid = [...state.grid];
      guessedWord = updatedGrid.slice(
        state.currentGuess - 4,
        state.currentGuess + 1
      );

      shuffleAnimation(
        updatedGrid,
        state.currentRow,
        state.currentGuess,
        false
      );

      return {
        ...state,
        grid: updatedGrid,
        controls: false,
        message: rank[state.currentRow - 1],
      };
    case "reset": // reset state, flip-back animation
    if (!state.controls && state.gameState !== "WON") return { ...state };

      

      document.activeElement.blur();
      updatedGrid = [...state.grid];
      updatedGrid.forEach((el, i) => {
        if (i < state.currentGuess + 1) {
          el.state.push("flipping-back");
        }
      });

      return {
        wordOfTheDay: generateWord(),
        currentGuess: state.currentGuess,
        grid: updatedGrid,
        rowComplete: false,
        currentRow: 0,
        gameState: null,
        controls: true,
        possibleWords: dictionary,
        message: "",
        tempGrid: [],
        activeModalType: null,
        gamesPlayed: state.gamesPlayed,
        startScreenTiles: state.startScreenTiles,
        triggerStates: {
          ...state.triggerStates,
          gameStarted: true,
          startScreenFlipAnimationEnd: true,
          shuffleAnimationEnd: false,
          isFlipping: false,
        },
      };
    case "startGame":
      return {
        ...state,
        triggerStates: { ...state.triggerStates, gameStarted: true },
        controls: true,
        currentGuess: 0,
      };

    case "share":
      const wrongSquare = "⬛";
      const includedSquare = "🟨";
      const correctSquare = "🟩";
      let clipboard = `This is my wordle result \n \n`;

      updatedGrid = [...state.grid];
      updatedGrid.forEach((sq, index) => {
        if (sq.state.includes("correct")) clipboard += correctSquare;
        else if (sq.state.includes("wrong")) clipboard += wrongSquare;
        else if (sq.state.includes("included")) clipboard += includedSquare;
        else clipboard += wrongSquare;

        if ((index + 1) % 5 === 0) clipboard += "\n";
      });

      clipboard += "\n Play now => https://wordleunlimited.org";

      console.log(clipboard);
      navigator.clipboard.writeText(clipboard);

      return { ...state, message: `Copied to clipboard: \n \n ${clipboard}` };

    case "gameLoaded":
      updatedStartScreenTiles = [...state.startScreenTiles];
      updatedStartScreenTiles = updatedStartScreenTiles.map((tile) => ({
        state: ["flipping"],
        value: "",
      }));

      return { ...state, startScreenTiles: updatedStartScreenTiles };

    case "stateTriggered":
      return {
        ...state,
        triggerStates: {
          ...state.triggerStates,
          [action.payload.element]: action.payload.state,
        },
      };

    default:
      throw new Error(`uknown action type: ${action.type}`);
  }
}

function GameProvider({ children }) {
  const [
    {
      wordOfTheDay,
      currentGuess,
      grid,
      rowComplete,
      currentRow,
      gameState,
      controls,
      possibleWords,
      message,
      tempGrid,
      activeModalType,
      gamesPlayed,
      startScreenTiles,
      triggerStates,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("gamesPlayed", JSON.stringify(gamesPlayed));
  }, [gamesPlayed]);

  // controls
  useControls(["Escape"], () => dispatch({ type: "reset" }), true);
  useControls(["Enter"], () => dispatch({ type: "publish" }), controls);
  useControls(["Backspace"], () => dispatch({ type: "backspace" }), controls);
  useControls(
    alphabet,
    (key) => dispatch({ type: "letterInputted", payload: key }),
    controls
  );

  // delayed triggers
  useEffect(() => {
    if (gameState === "WON") {
      setTimeout(() => {
        dispatch({ type: "WON" });
      }, 1000);
    }
  }, [gameState]);

  useEffect(() => {
    if (currentGuess === 30) {
      dispatch({ type: "LOST" });
    }
  }, [currentGuess]);

  useEffect(() => {
    if (gameState !== "LOST") {
      setTimeout(() => dispatch({ type: "clearMessage" }), 2000);
    }
  }, [message]);

  return (
    <GameContext.Provider
      value={{
        wordOfTheDay,
        currentGuess,
        dispatch,
        generateWord,
        grid,
        rowComplete,
        currentRow,
        gameState,
        controls,
        possibleWords,
        message,
        tempGrid,
        activeModalType,
        gamesPlayed,

        startScreenTiles,
        triggerStates,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) throw new Error("Context is undefined");
  return context;
}

export { GameProvider, useGame };
