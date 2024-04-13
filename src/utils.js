import { words } from "./data";

function generateWord() {
  return words[Math.floor(Math.random() * 50)];
}

export { generateWord };
