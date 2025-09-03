import React, { useState, useRef } from 'react';

interface ControlPanelProps {
  imageSrc: string;
  setImageSrc: (src: string) => void;
  difficulty: number;
  setDifficulty: (d: number) => void;
  onStartGame: () => void;
  loading: boolean;
}

const defaultImages = [
  'https://picsum.photos/id/10/600/600',
  'https://picsum.photos/id/1002/600/600',
  'https://picsum.photos/id/1025/600/600',
  'https://picsum.photos/id/1040/600/600',
  'https://picsum.photos/id/1060/600/600',
  'https://picsum.photos/id/237/600/600',
];

const difficulties = [
    { label: '簡單 (3x3)', value: 3 },
    { label: '中等 (4x4)', value: 4 },
    { label: '困難 (5x5)', value: 5 },
    { label: '專家 (6x6)', value: 6 },
];

const ControlPanel: React.FC<ControlPanelProps> = ({
  imageSrc,
  setImageSrc,
  difficulty,
  setDifficulty,
  onStartGame,
  loading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center space-y-8 animate-fade-in">
      {/* Image Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">1. 選擇圖片</h2>
        <div className="grid grid-cols-3 gap-4">
          {defaultImages.map((src) => (
            <img
              key={src}
              src={src}
              alt="Default puzzle option"
              onClick={() => setImageSrc(src)}
              className={`w-32 h-32 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                imageSrc === src ? 'ring-4 ring-purple-500 scale-105' : 'hover:scale-105'
              }`}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
            <button onClick={triggerFileUpload} className="text-purple-400 hover:text-purple-300 transition-colors">
                或上傳您自己的圖片
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
        </div>
      </div>

      {/* Difficulty Selection */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-center">2. 選擇難度</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {difficulties.map(({label, value}) => (
            <button
              key={value}
              onClick={() => setDifficulty(value)}
              className={`w-full sm:w-auto px-4 py-3 sm:py-2 rounded-md font-semibold transition-all duration-300 ${
                difficulty === value ? 'bg-purple-600 text-white shadow-lg' : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStartGame}
        disabled={loading || !imageSrc}
        className="w-full max-w-xs px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
      >
        {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              正在創建拼圖...
            </>
        ) : (
          '開始遊戲'
        )}
      </button>
    </div>
  );
};

export default ControlPanel;