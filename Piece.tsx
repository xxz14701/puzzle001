
import React from 'react';

interface PieceProps {
  id: number;
  imgUrl: string;
  onDragStart: (id: number) => void;
}

const Piece: React.FC<PieceProps> = ({ id, imgUrl, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    onDragStart(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <img
      src={imgUrl}
      draggable="true"
      onDragStart={handleDragStart}
      className="max-w-full max-h-full object-contain rounded-md cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105"
      alt={`Puzzle piece ${id}`}
    />
  );
};

export default Piece;
