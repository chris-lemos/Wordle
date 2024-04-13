import { useGame } from "../context/gameContext";
import Tile from "./Tile";
import Message from "./Message";

function Board() {
  const { grid } = useGame();

  return (
    <>
      <Message></Message>
      <div className="board">
        {grid.map((_, i) => (
          <Tile info={grid[i]} key={i} index={i}></Tile>
        ))}
      </div>
    </>
  );
}

export default Board;
