import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';

const randomFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(randomFood(INITIAL_SNAKE));
    setScore(0);
    setIsGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
  };

  const handleKeydown = useCallback((e: KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }

    if (!hasStarted && !isGameOver) {
      setHasStarted(true);
    }

    if (e.key === ' ' && hasStarted && !isGameOver) {
      setIsPaused(p => !p);
      return;
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir !== 'DOWN') setDirection('UP');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir !== 'UP') setDirection('DOWN');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir !== 'RIGHT') setDirection('LEFT');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir !== 'LEFT') setDirection('RIGHT');
        break;
    }
  }, [hasStarted, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [handleKeydown]);

  useEffect(() => {
    if (!hasStarted || isPaused || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const newScore = s + 10;
            setHighScore(curr => Math.max(curr, newScore));
            return newScore;
          });
          setFood(randomFood(newSnake));
        } else {
          newSnake.pop(); 
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [hasStarted, isPaused, isGameOver, food, score]);

  return (
    <div className="w-full aspect-square max-h-[500px] border-4 border-white/10 rounded-xl relative overflow-hidden bg-black shadow-2xl z-20 flex flex-col">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-white/10 glass-panel shrink-0 z-30">
        <div className="flex flex-col items-start justify-center">
          <span className="text-[10px] uppercase tracking-widest text-white/50 mono">Current Score</span>
          <span className="text-xl font-bold mono text-[#FF00FF]">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end justify-center">
          <span className="text-[10px] uppercase tracking-widest text-white/50 mono flex items-center gap-1"><Trophy className="w-3 h-3 text-white/40" /> High Score</span>
          <span className="text-xl font-bold mono text-[#00FFFF]">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="flex-1 relative border-t border-transparent overflow-hidden flex items-center justify-center">
         {!hasStarted && !isGameOver && (
           <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-sm cursor-pointer" onClick={() => setHasStarted(true)}>
             <p className="font-mono text-green-400 text-lg md:text-xl animate-pulse text-center">
               Press any arrow key<br/>to start
             </p>
           </div>
         )}

         {isPaused && hasStarted && !isGameOver && (
           <div className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center backdrop-blur-sm">
             <div className="text-center font-mono">
               <Pause className="w-16 h-16 text-cyan-400 mx-auto mb-4 opacity-80 filter drop-shadow-[0_0_10px_#00ffff]" />
               <p className="text-cyan-400 text-xl font-bold tracking-widest">PAUSED</p>
               <p className="text-xs text-cyan-400/70 mt-2">Press Space to resume</p>
             </div>
           </div>
         )}

         {isGameOver && (
           <div className="absolute inset-0 bg-red-950/80 z-30 flex flex-col items-center justify-center backdrop-blur-md">
             <h2 className="text-3xl font-black text-red-500 mb-2 uppercase tracking-wider" style={{ textShadow: '0 0 15px #ef4444' }}>System Failure</h2>
             <p className="font-mono text-xl text-white mb-8">Final Score: {score}</p>
             <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 rounded bg-red-500/20 hover:bg-red-500/40 border border-red-500 text-white font-mono uppercase tracking-wider transition-colors shadow-[0_0_10px_rgba(239,68,68,0.5)]"
             >
               <RotateCcw className="w-5 h-5" /> Reboot Sequence
             </button>
           </div>
         )}

         <div className="relative w-full h-full" style={{ aspectRatio: '1/1' }}>
            {/* Grid background styling */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, #39FF14 1px, transparent 0)',
                backgroundSize: `${100/GRID_SIZE}% ${100/GRID_SIZE}%`
              }} 
            />

            <div
              className="absolute bg-pink-500 rounded-[2px] shadow-[0_0_12px_#ff00ff] z-10 transition-all duration-100"
              style={{
                width: `${100 / GRID_SIZE}%`,
                height: `${100 / GRID_SIZE}%`,
                left: `${(food.x / GRID_SIZE) * 100}%`,
                top: `${(food.y / GRID_SIZE) * 100}%`,
                transform: 'scale(0.85)',
              }}
            />

            {snake.map((segment, index) => {
              const isHead = index === 0;
              return (
                <div
                  key={`${segment.x}-${segment.y}-${index}`}
                  className={`absolute rounded-[2px] ${isHead ? 'bg-white z-20 shadow-[0_0_15px_#fff]' : 'bg-green-500 z-10 shadow-[0_0_8px_#39ff14]'}`}
                  style={{
                    width: `${100 / GRID_SIZE}%`,
                    height: `${100 / GRID_SIZE}%`,
                    left: `${(segment.x / GRID_SIZE) * 100}%`,
                    top: `${(segment.y / GRID_SIZE) * 100}%`,
                    transform: isHead ? 'scale(0.95)' : 'scale(0.85)',
                  }}
                />
              );
            })}
         </div>
      </div>
    </div>
  );
}
