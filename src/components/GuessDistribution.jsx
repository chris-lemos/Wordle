import { useGame } from "../context/gameContext";

function GuessDistribution() {
  const { gamesPlayed, currentRow, gameState } = useGame();
  const initialWinningRows = [0, 0, 0, 0, 0, 0];

  const rowCounts = gamesPlayed.reduce((rows, game) => {
    if (game.winningRow) rows[game.winningRow - 1]++;
    return rows;
  }, initialWinningRows);

  const maxCount = Math.max(...rowCounts);

  return (
    <div className="guessDistribution">
      {rowCounts.map((row, index) => {
        const widthPercentage = (row / maxCount) * 100;
        console.log(currentRow);

        return (
          <span key={index}>
            <h3>{index + 1}</h3>
            <div
              style={{ width: `${widthPercentage}%` }}
              className={
                gameState !== null && currentRow - 1 === index
                  ? "correct guessBar"
                  : "guessBar"
              }
            >
              <h5>{row}</h5>
            </div>
          </span>
        );
      })}
    </div>
  );
}

export default GuessDistribution;
