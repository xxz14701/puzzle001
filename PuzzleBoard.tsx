import React, { useState } from 'react';
import { PuzzlePieceType } from '../types';
import Piece from './Piece';

interface PuzzleBoardProps {
  pieces: PuzzlePieceType[];
  onPieceDrop: (draggedId: number, droppedOnId: number) => void;
  difficulty: number;
  gridTemplateColumns: string;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ pieces, onPieceDrop, difficulty, gridTemplateColumns }) => {
  const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
  
  const handleDragStart = (id: number) => {
    setDraggedItemId(id);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (droppedOnId: number) => {
    if (draggedItemId !== null && draggedItemId !== droppedOnId) {
      onPieceDrop(draggedItemId, droppedOnId);
    }
    setDraggedItemId(null);
  };

  const sortedPieces = [...pieces].sort((a, b) => a.currentPosition - b.currentPosition);

  return (
    <div
      className="grid gap-1 bg-slate-900/50 p-2 rounded-lg shadow-inner w-full max-w-[600px] aspect-square"
      style={{
        gridTemplateColumns: gridTemplateColumns,
      }}
    >
      {sortedPieces.map((piece) => (
        <div
          key={piece.id}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(piece.id)}
          className="w-full h-full bg-slate-700/50 rounded flex items-center justify-center transition-all duration-300"
        >
          <Piece
            id={piece.id}
            imgUrl={piece.imgUrl}
            onDragStart={handleDragStart}
          />
        </div>
      ))}
    </div>
  );
};

export default PuzzleBoard;