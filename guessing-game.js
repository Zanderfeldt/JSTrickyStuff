function guessingGame() {
  const ANSWER = Math.floor(Math.random() * 100);
  let gameOver = false;
  let guesses = 0;

  return function guess(num) {
    if (gameOver) return "The game is over, you already won!";
    guesses++;
    if (num === ANSWER) {
      gameOver = true;
      const guess = guesses === 1 ? "guess" : "guesses";
      return `You win! You found ${num} in ${guesses} ${guess}.`;
    }
    if (num < ANSWER) return `${num} is too low!`;
    if (num > ANSWER) return `${num} is too high!`;
  };
}

module.exports = { guessingGame };
