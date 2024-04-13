import { useState, useRef } from "react";

import Keyboard from "./components/Keyboard";
import { useGame } from "./context/gameContext";
import Button from "./components/Button";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import Header from "./components/Header";

import "./App.css";
import Board from "./components/Board";
import StartScreen from "./components/StartScreen";
import { motion } from "framer-motion";

function App() {
  const { triggerStates } = useGame();

  return (
    <motion.div
      className="main"
      style={
        triggerStates?.["titleText"] === "complete"
          ? { justifyContent: "space-between" }
          : {}
      }
    >
      <Header />
      {triggerStates?.["starterHeader"] !== "complete" && <StartScreen />}
      {triggerStates?.["starterHeader"] === "complete" && (
        <>
          <Modal />
          <motion.div
            className="game"
            animate={{ opacity: 100, scale: 1 }}
            initial={{ opacity: 0, scale: 0 }}
          >
            <Board />
            <Keyboard />
          </motion.div>
          <Footer />
        </>
      )}
    </motion.div>
  );
}

export default App;
