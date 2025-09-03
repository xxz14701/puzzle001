
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { PuzzlePieceType, GameState } from './types';
import { createPuzzlePieces, isPuzzleSolved } from './services/puzzleService';
import PuzzleBoard from './components/PuzzleBoard';
import ControlPanel from './components/ControlPanel';
import WinModal from './components/WinModal';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [pieces, setPieces] = useState<PuzzlePieceType[]>([]);
  const [imageSrc, setImageSrc] = useState<string>('https://picsum.photos/id/10/600/600');
  const [difficulty, setDifficulty] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [time, setTime] = useState<number>(0);

  const gridTemplateColumns = useMemo(() => `repeat(${difficulty}, 1fr)`, [difficulty]);

  useEffect(() => {
    let timer: number | undefined;
    if (gameState === GameState.PLAYING) {
      timer = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameState]);


  const startGame = useCallback(async () => {
    if (!imageSrc) return;
    setLoading(true);
    setGameState(GameState.PLAYING);
    setMoves(0);
    setTime(0);
    try {
      const newPieces = await createPuzzlePieces(imageSrc, difficulty);
      setPieces(newPieces);
    } catch (error) {
      console.error("Error creating puzzle pieces:", error);
      alert("Could not load the image. Please try another one.");
      setGameState(GameState.SETUP);
    } finally {
      setLoading(false);
    }
  }, [imageSrc, difficulty]);

  const handlePieceDrop = useCallback((draggedId: number, droppedOnId: number) => {
    setPieces(prevPieces => {
      const draggedPiece = prevPieces.find(p => p.id === draggedId);
      const droppedOnPiece = prevPieces.find(p => p.id === droppedOnId);

      if (!draggedPiece || !droppedOnPiece) return prevPieces;

      const newPieces = prevPieces.map(piece => {
        if (piece.id === draggedId) {
          return { ...piece, currentPosition: droppedOnPiece.currentPosition };
        }
        if (piece.id === droppedOnId) {
          return { ...piece, currentPosition: draggedPiece.currentPosition };
        }
        return piece;
      });

      setMoves(m => m + 1);

      if (isPuzzleSolved(newPieces)) {
        setGameState(GameState.SOLVED);
      }
      
      return newPieces;
    });
  }, []);

  const resetGame = () => {
    setGameState(GameState.SETUP);
    setPieces([]);
    setMoves(0);
    setTime(0);
  };
  
  const playAgain = () => {
    setGameState(GameState.SOLVED); // to close modal
    startGame();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          趣味拼圖
        </h1>
        <p className="text-slate-400 mt-2">創建、洗牌、解決！</p>
      </header>
      
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-start justify-center gap-8">
        <main className="w-full flex-1 bg-slate-800/50 rounded-2xl shadow-2xl p-4 md:p-8 backdrop-blur-sm border border-slate-700">
          {gameState === GameState.SETUP && (
            <ControlPanel
              imageSrc={imageSrc}
              setImageSrc={setImageSrc}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              onStartGame={startGame}
              loading={loading}
            />
          )}
          
          {gameState === GameState.PLAYING && (
            <div className="flex flex-col items-center">
              <div className="flex justify-between items-center w-full max-w-[600px] mb-4 px-2">
                <div className="text-lg">步數: <span className="font-bold text-purple-400">{moves}</span></div>
                <div className="text-lg">時間: <span className="font-bold text-purple-400">{new Date(time * 1000).toISOString().slice(14, 19)}</span></div>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md transition-colors duration-300 font-semibold"
                >
                  重置
                </button>
              </div>
              {loading ? (
                <div className="w-full h-[600px] flex items-center justify-center">
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 animate-spin border-t-purple-500"></div>
                </div>
              ) : (
                 <PuzzleBoard
                  pieces={pieces}
                  onPieceDrop={handlePieceDrop}
                  difficulty={difficulty}
                  gridTemplateColumns={gridTemplateColumns}
                />
              )}
            </div>
          )}
          
          {gameState === GameState.SOLVED && (
            <WinModal moves={moves} time={time} onPlayAgain={playAgain} onNewGame={resetGame} />
          )}
        </main>

        {gameState === GameState.PLAYING && !loading && imageSrc && (
          <aside className="w-full lg:w-48 flex-shrink-0 animate-fade-in">
            <div className="sticky top-8 bg-slate-800/50 rounded-2xl shadow-xl p-4 border border-slate-700 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-slate-300 mb-3 text-center">參考圖片</h3>
              <img 
                src={imageSrc} 
                alt="Reference"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </aside>
        )}
      </div>

      <footer className="mt-8 text-slate-500 text-sm">
        <p>由世界一流的資深前端 React 工程師打造。</p>
      </footer>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
