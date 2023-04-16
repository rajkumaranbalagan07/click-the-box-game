import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Howl } from 'howler';
import Head from 'next/head';
import Image from 'next/image';

const clickSound = new Howl({
  src: ['https://www.myinstants.com/media/sounds/click-nice_1.mp3'],
});

const Game = () => {
  const [score, setScore] = useState(0);
  const [boxPosition, setBoxPosition] = useState({ top: 0, left: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const startGame = () => {
    setIsPlaying(true);
  };
  const getRandomPosition = () => {
    const top = Math.random() * (window.innerHeight - 100);
    const left = Math.random() * (window.innerWidth - 100);
    return { top, left };
  };


  const handleClick = () => {
    setScore(score + 1);
    clickSound.play();
  };

  useEffect(() => {
    if (isPlaying) {
      const moveBox = () => {
        const top = Math.random() * (window.innerHeight - 100);
        const left = Math.random() * (window.innerWidth - 100);
        setBoxPosition({ top, left });
      };
      const interval = setInterval(moveBox, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const handleTimerEnd = () => {
    setIsPlaying(false);
    setIsEnded(true);
  };

  const handleRestart = () => {
    setIsPlaying(true);
    setScore(0);
    setBoxPosition(getRandomPosition());
    setIsEnded(false);
  };


  return (
    <div className="relative h-screen w-screen bg-gradient-to-r from-blue-500 to-green-500">
      <Head>
        <title>Click the Box Game</title>
      </Head>
      {!isPlaying && !isEnded && (
        <button
          onClick={startGame}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 text-xl font-bold rounded-lg focus:outline-none"
        >
          Start Game
        </button>
      )}

      {isPlaying && (
        <>
          <div
            className="absolute top-0 left-0 p-4 text-white font-bold text-5xl animate-pulse"
            style={{ zIndex: 10 }}
          >
            Score: {score}
          </div>

          <div className="absolute top-0 right-0 p-4">
            <CountdownCircleTimer
              isPlaying={isPlaying}
              duration={30}
              size={100}
              strokeWidth={10}
              strokeLinecap="round"
              colors={[['#FFFFFF', 0.33], ['#F7B801', 0.33], ['#A30000']]}
              onComplete={handleTimerEnd}
            >
              {({ remainingTime }) => (
                <div className="text-white font-bold">{remainingTime}</div>
              )}
            </CountdownCircleTimer>
          </div>

          <div
            className="bg-red-500 w-20 h-20 absolute rounded-lg cursor-pointer"
            onClick={handleClick}
            style={{
              top: `${boxPosition.top}px`,
              left: `${boxPosition.left}px`,
            }}
          ></div>
        </>
      )}

      {isEnded && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl font-bold">
          Game Over! Your score is: {score}
          <Confetti
            width={typeof window !== 'undefined' ? window.innerWidth : 0}
            height={typeof window !== 'undefined' ? window.innerHeight : 0}
            numberOfPieces={500}
          />
          {/* Add the restart button */}

          <div>
            <button
              className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded"
              onClick={handleRestart}
            >
              Restart
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Game;
