import { useGame } from "../context/gameContext";
import GuessDistribution from "./GuessDistribution";
import Button from "./Button";

function Stats({ closeModal }) {
  const { gamesPlayed, gameState } = useGame();

  function winPercentage() {
    const numberOfWins = gamesPlayed.filter((game) => game.winningRow).length;
    return Math.round(100 / (gamesPlayed.length / numberOfWins));
  }

  function maxStreak() {
    let currentStreak = 0;
    let maxStreak = 0;

    for (const game of gamesPlayed) {
      if (game.winningRow) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    return maxStreak;
  }

  function currentWinStreak() {
    let currentStreak = 0;
    for (let i = gamesPlayed.length - 1; i > 0; i--) {
      if (gamesPlayed[i].winningRow !== null) currentStreak++;
      else break;
    }
    return currentStreak;
  }

  return (
    <>
      <span>
        <Button className="closeButton" closeModal={closeModal}>
          ✖
        </Button>
        <h3>Stats</h3>
      </span>
      <div className="statsHeader">
        <span>
          <h1>{gamesPlayed.length}</h1>
          <h4>played</h4>
        </span>
        <span>
          <h1>{winPercentage()}</h1>
          <h4>win %</h4>
        </span>
        <span>
          <h1>{currentWinStreak()}</h1>
          <h4>
            Current <br></br> Streak
          </h4>
        </span>
        <span>
          <h1>{maxStreak()}</h1>
          <h4>Max Streak</h4>
        </span>
      </div>
      <h3>Guess Destribution</h3>
      <GuessDistribution></GuessDistribution>
      <div className="statButtons">
        <Button
          className="btn-secondary"
          closeModal={closeModal}
          actions={{ type: "reset" }}
        >
          Retry
        </Button>
        <Button
          className={
            gameState === "WON" ? "btn-secondary" : "btn-secondary disabled"
          }
          closeModal={gameState && closeModal}
          actions={gameState && { type: "share" }}
        >
          Share
        </Button>
      </div>
    </>
  );
}

export default Stats;
