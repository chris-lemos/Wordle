## A remake of the popular web game WORDLE including features such as:
* correct validation behavior - in the original WORDLE, certain edge cases are dealt with solutions that make the board state more obvious for the user. This behavior is usually ommited from wordle clones leading to confusing gameplay, this project attempts to capture the original's logic
* **game history** - all games are recorded to the user's localstorage and used for calculating player statistics
* **new animations** - In addition to the original animations, the project uses new transitions and effects to create a more app-like feel.
* **possible words** - a unique feature of this project is the implementation of an algorithm that displays how many possible words are left given the board state.

###### Created using React and Framer-Motion
###### preview: https://effortless-palmier-fc57c7.netlify.app/ 

###### note: Netlify introduces a bug where the last letter of the current row is flipped on the keyboard, this bug is not present in my local build
