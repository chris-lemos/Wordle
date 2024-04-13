import { useEffect } from "react";

export default function useControls(keyCodes, callback, controls) {
  function handler({ key }) {
    if (keyCodes.includes(key) && controls) {
      callback(key);
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [controls]);
}
