import Button from "./Button";
function Help({ closeModal }) {
  return (
    <>
      <span>
        <h3>How To Play</h3>

        <Button className="closeButton" closeModal={closeModal}>
          ✖
        </Button>
      </span>
      <h4>Guess the Wordle in 6 tries.</h4>
      <ul>
        <li>Each guess must be a valid 5-letter word.</li>
        <li>
          The color of the tiles will change to show how close your guess was to
          the word.
        </li>
      </ul>
      <h4>Examples</h4>
      <div className="examples">
        <div className="example">
          <div className="modalTiles">
            <div className="correct">W</div>
            <div>E</div>
            <div>A</div>
            <div>R</div>
            <div>Y</div>
          </div>
          <p>
            <strong>W</strong> is in the word and in the correct spot.
          </p>
        </div>
        <div className="example">
          <div className="modalTiles">
            <div>P</div>
            <div className="included">I</div>
            <div>L</div>
            <div>L</div>
            <div>S</div>
          </div>
          <p>
            <strong>I</strong> is in the word but in the wrong spot.
          </p>
        </div>
        <div className="example">
          <div className="modalTiles">
            <div>V</div>
            <div>A</div>
            <div>G</div>
            <div className="wrong">U</div>
            <div>E</div>
          </div>
          <p>
            <strong>U</strong> is not in the word in any spot.
          </p>
        </div>
      </div>
    </>
  );
}

export default Help;
