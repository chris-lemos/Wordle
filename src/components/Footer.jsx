import { useGame } from "../context/gameContext";
import Button from "./Button";
import { GrPowerReset } from "react-icons/gr";
import { BiHelpCircle } from "react-icons/bi";
import { IoIosStats } from "react-icons/io";
import { motion } from "framer-motion";

function Footer() {
  const { possibleWords } = useGame();
  return (
    <motion.footer
      animate={{ opacity: 100, scale: 1 }}
      initial={{ opacity: 0, scale: 0 }}
    >
      <h5>{`POSSIBLE WORDS: ${possibleWords.length}`}</h5>

      <div className="footer-buttons">
        <Button actions={{ type: "reset" }}>
          <GrPowerReset></GrPowerReset>
        </Button>
        <Button actions={{ type: "modal", payload: "help" }}>
          <BiHelpCircle></BiHelpCircle>
        </Button>
        <Button actions={{ type: "modal", payload: "stats" }}>
          <IoIosStats></IoIosStats>
        </Button>
      </div>
    </motion.footer>
  );
}

export default Footer;
