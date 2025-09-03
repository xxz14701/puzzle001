
import React from 'react';

interface WinModalProps {
  moves: number;
  time: number;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ moves, time, onPlayAgain, onNewGame }) => {
  const formattedTime = new Date(time * 1000).toISOString().slice(11, 19);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700 text-center transform scale-95 transition-transform duration-300 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-4">
          恭喜！
        </h2>
        <p className="text-slate-300 text-lg mb-6">您已完成拼圖！</p>
        <div className="flex justify-center space-x-8 mb-8">
          <div>
            <p className="text-slate-400">步數</p>
            <p className="text-3xl font-bold text-green-400">{moves}</p>
          </div>
          <div>
            <p className="text-slate-400">時間</p>
            <p className="text-3xl font-bold text-green-400">{formattedTime}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-colors duration-300"
          >
            再玩一次
          </button>
          <button
            onClick={onNewGame}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg shadow-lg transition-colors duration-300"
          >
            新遊戲
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WinModal;
