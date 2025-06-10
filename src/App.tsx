import React, { useState } from 'react';
import RPLogo from '/src/assets/RPLogo2.png';
import './styles.css';

function generateRandomNumber(): number {
  return Math.floor(Math.random() * 100) + 1;
}

export default function App(): JSX.Element {
  const [secretNumber, setSecretNumber] = useState<number>(generateRandomNumber());
  const [guess, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('Guess a number between 1 and 100');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const handleGuess = () => {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      setFeedback('Please enter a valid number between 1 and 100.');
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (numGuess < secretNumber) {
      setFeedback('Too low! Try again.');
    } else if (numGuess > secretNumber) {
      setFeedback('Too high! Try again.');
    } else {
      setFeedback(`Correct! You guessed the number in ${newAttempts} attempts.`);
      setGameOver(true);
      if (typeof window.sendDataToGameLab === 'function') {
        window.sendDataToGameLab({
          event: 'game_over',
          secretNumber,
          attempts: newAttempts,
          timestamp: new Date().toISOString(),
        });
      }
    }
    setGuess('');
  };

  const handleNewGame = () => {
    const newNumber = generateRandomNumber();
    setSecretNumber(newNumber);
    setGuess('');
    setFeedback('Guess a number between 1 and 100');
    setAttempts(0);
    setGameOver(false);
  };

  return (
    <div className="App">
      <img src={RPLogo} alt="RandomPlayables Logo" className="logo" />
      <h1>Number Guessing Game</h1>
      <p>{feedback}</p>
      {!gameOver && (
        <div className="input-group">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
          />
          <button onClick={handleGuess}>Guess</button>
        </div>
      )}
      {!gameOver && <p>Attempts: {attempts}</p>}
      {gameOver && <button onClick={handleNewGame}>New Game</button>}
    </div>
  );
}