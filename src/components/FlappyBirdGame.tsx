import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw } from "lucide-react";

interface FlappyBirdGameProps {
  onClose: () => void;
}

const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;

const FlappyBirdGame = ({ onClose }: FlappyBirdGameProps) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>('ready');
  const [birdY, setBirdY] = useState(200);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappy_highscore');
    return saved ? parseInt(saved) : 0;
  });
  const gameRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  const GAME_WIDTH = 300;
  const GAME_HEIGHT = 400;

  const jump = useCallback(() => {
    if (gameState === 'ready') {
      setGameState('playing');
      setBirdVelocity(JUMP_STRENGTH);
    } else if (gameState === 'playing') {
      setBirdVelocity(JUMP_STRENGTH);
    }
  }, [gameState]);

  const resetGame = useCallback(() => {
    setBirdY(200);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameState('ready');
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameState('gameover');
          return prev;
        }
        return newY;
      });

      setBirdVelocity(prev => prev + GRAVITY);

      setPipes(prev => {
        let newPipes = prev
          .map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        // Add new pipe
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
          const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
          newPipes.push({ x: GAME_WIDTH, topHeight });
        }

        return newPipes;
      });

      // Check collision and score
      setPipes(currentPipes => {
        currentPipes.forEach(pipe => {
          const birdLeft = 50;
          const birdRight = 50 + BIRD_SIZE;
          const birdTop = birdY;
          const birdBottom = birdY + BIRD_SIZE;

          const pipeLeft = pipe.x;
          const pipeRight = pipe.x + PIPE_WIDTH;
          const topPipeBottom = pipe.topHeight;
          const bottomPipeTop = pipe.topHeight + PIPE_GAP;

          if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdTop < topPipeBottom || birdBottom > bottomPipeTop) {
              setGameState('gameover');
            }
          }

          // Score when passing pipe
          if (pipe.x + PIPE_WIDTH < 50 && pipe.x + PIPE_WIDTH + PIPE_SPEED >= 50) {
            setScore(prev => {
              const newScore = prev + 1;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('flappy_highscore', newScore.toString());
              }
              return newScore;
            });
          }
        });
        return currentPipes;
      });

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameState, birdVelocity, birdY, highScore]);

  return (
    <div className="flex flex-col items-center gap-3 p-4 bg-gradient-to-b from-sky-400 to-sky-600 rounded-lg">
      <div className="flex justify-between w-full text-white text-sm font-bold">
        <span>Score: {score}</span>
        <span>Best: {highScore}</span>
      </div>
      
      <div
        ref={gameRef}
        className="relative overflow-hidden bg-sky-300 rounded-lg cursor-pointer border-4 border-green-700"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
        onTouchStart={jump}
      >
        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-700 to-green-500" />
        
        {/* Bird */}
        <div
          className="absolute transition-transform duration-75"
          style={{
            left: 50,
            top: birdY,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`,
          }}
        >
          <div className="w-full h-full bg-yellow-400 rounded-full border-2 border-yellow-600 relative">
            <div className="absolute right-1 top-1/3 w-2 h-2 bg-white rounded-full" />
            <div className="absolute right-0 top-1/3 w-1 h-1 bg-black rounded-full" />
            <div className="absolute right-0 top-1/2 w-3 h-2 bg-orange-500 rounded-r-full" />
          </div>
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-500 border-2 border-green-700"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.topHeight,
              }}
            >
              <div className="absolute -left-1 bottom-0 w-[54px] h-6 bg-gradient-to-r from-green-700 to-green-600 border-2 border-green-800" />
            </div>
            {/* Bottom pipe */}
            <div
              className="absolute bg-gradient-to-r from-green-600 to-green-500 border-2 border-green-700"
              style={{
                left: pipe.x,
                top: pipe.topHeight + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP - 40,
              }}
            >
              <div className="absolute -left-1 top-0 w-[54px] h-6 bg-gradient-to-r from-green-700 to-green-600 border-2 border-green-800" />
            </div>
          </div>
        ))}

        {/* Ready screen */}
        {gameState === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
            <span className="text-white text-xl font-bold mb-4 drop-shadow-lg">Toque para jogar!</span>
            <Play className="w-12 h-12 text-white animate-pulse" />
          </div>
        )}

        {/* Game over screen */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
            <span className="text-white text-2xl font-bold mb-2 drop-shadow-lg">Game Over!</span>
            <span className="text-white text-lg mb-4">Score: {score}</span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              size="sm"
              className="bg-green-500 hover:bg-green-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Jogar Novamente
            </Button>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClose}
        className="text-white border-white/50 hover:bg-white/20"
      >
        Voltar ao Chat
      </Button>
    </div>
  );
};

export default FlappyBirdGame;
