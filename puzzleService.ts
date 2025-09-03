
import { PuzzlePieceType } from '../types';

function shuffleArray<T,>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const createPuzzlePieces = (
  imageSrc: string,
  difficulty: number
): Promise<PuzzlePieceType[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context not available'));
      }

      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const aspectRatio = naturalWidth / naturalHeight;
      
      const puzzleSize = 600;
      canvas.width = puzzleSize;
      canvas.height = puzzleSize / aspectRatio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const pieceWidth = canvas.width / difficulty;
      const pieceHeight = canvas.height / difficulty;

      const pieces: Omit<PuzzlePieceType, 'currentPosition'>[] = [];
      let pieceId = 0;

      for (let y = 0; y < difficulty; y++) {
        for (let x = 0; x < difficulty; x++) {
          const pieceCanvas = document.createElement('canvas');
          pieceCanvas.width = pieceWidth;
          pieceCanvas.height = pieceHeight;
          const pieceCtx = pieceCanvas.getContext('2d');
          if (!pieceCtx) continue;

          pieceCtx.drawImage(
            canvas,
            x * pieceWidth,
            y * pieceHeight,
            pieceWidth,
            pieceHeight,
            0,
            0,
            pieceWidth,
            pieceHeight
          );

          pieces.push({
            id: pieceId,
            imgUrl: pieceCanvas.toDataURL(),
            correctPosition: pieceId,
          });
          pieceId++;
        }
      }

      const positions = pieces.map(p => p.correctPosition);
      const shuffledPositions = shuffleArray(positions);

      const finalPieces = pieces.map((piece, index) => ({
        ...piece,
        currentPosition: shuffledPositions[index],
      }));
      
      resolve(finalPieces);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image. It might be due to CORS policy. Try another image.'));
    };
    img.src = imageSrc;
  });
};

export const isPuzzleSolved = (pieces: PuzzlePieceType[]): boolean => {
  return pieces.every(p => p.correctPosition === p.currentPosition);
};
