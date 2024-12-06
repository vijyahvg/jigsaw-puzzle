import React from 'react';
import PreviewModal from './PreviewModal';
import CompletionModal from './CompletionModal';
import DraggablePiece from './DraggablePiece';
import DropZone from './DropZone';
import { formatTime } from './gameUtils';
import { CONTAINER_SIZE } from './constants';

const GameScreen = ({
  difficulty,
  selectedImage,
  pieces,
  setPieces,
  time,
  draggedPiece,
  setDraggedPiece,
  isGameComplete,
  setIsGameComplete,
  showPreview,
  setShowPreview,
  isSolving,
  setIsSolving,
  setCurrentScreen,
  setTime
}) => {
  const size = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
  const pieceSize = CONTAINER_SIZE / size;

  const handleDragStart = (e, piece) => {
    e.dataTransfer.effectAllowed = 'move';
    const rect = e.target.getBoundingClientRect();
    e.dataTransfer.setDragImage(e.target, rect.width / 2, rect.height / 2);
    setDraggedPiece(piece);
    e.target.style.opacity = '0.6';
  };

  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = 'white';
    if (!draggedPiece) return;

    const isCorrectPosition = 
      targetPosition.row === draggedPiece.correctPosition.row && 
      targetPosition.col === draggedPiece.correctPosition.col;

    setPieces(prevPieces => {
      const updatedPieces = prevPieces.map(p => {
        if (p.id === draggedPiece.id) {
          return { ...p, currentPosition: targetPosition, isPlaced: isCorrectPosition };
        }
        return p;
      });
      
      if (isCorrectPosition && updatedPieces.every(p => p.isPlaced)) {
        setIsGameComplete(true);
      }
      return updatedPieces;
    });
  };

  const handleSolve = () => {
    setIsSolving(true);
    setPieces(pieces.map(piece => ({
      ...piece,
      currentPosition: piece.correctPosition,
      isPlaced: true
    })));
    setTimeout(() => {
      setIsGameComplete(true);
      setIsSolving(false);
    }, 1000);
  };

  const handleReset = () => {
    const newPieces = [];
    
    // Create pieces
    for (let i = 0; i < size * size; i++) {
      const correctRow = Math.floor(i / size);
      const correctCol = i % size;
      newPieces.push({
        id: `${correctRow}-${correctCol}`,
        correctPosition: { row: correctRow, col: correctCol },
        currentPosition: { row: correctRow, col: correctCol },
        isPlaced: false
      });
    }

    // Shuffle pieces
    const shuffledPieces = [...newPieces]
      .sort(() => Math.random() - 0.5)
      .map(piece => ({
        ...piece,
        isPlaced: false
      }));

    // Make sure no piece starts in its correct position
    shuffledPieces.forEach((piece, i) => {
      if (piece.currentPosition.row === piece.correctPosition.row && 
          piece.currentPosition.col === piece.correctPosition.col) {
        // Swap with the next piece
        const swapIndex = (i + 1) % shuffledPieces.length;
        const temp = piece.currentPosition;
        piece.currentPosition = shuffledPieces[swapIndex].currentPosition;
        shuffledPieces[swapIndex].currentPosition = temp;
      }
    });

    // Reset states
    setPieces(shuffledPieces);
    setTime(0);
    setIsGameComplete(false);
    setDraggedPiece(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentScreen('home')}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          ← Back
        </button>
        <div className="text-xl font-bold">Time: {formatTime(time)}</div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Source Board */}
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden"
             style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
          <div className="w-full h-full bg-gray-200 relative">
            {pieces.map((piece) => !piece.isPlaced && (
              <DraggablePiece
              data-testid={`draggable-piece-${piece.id}`}
                key={piece.id}
                piece={piece}
                pieceSize={pieceSize}
                containerSize={CONTAINER_SIZE}
                selectedImage={selectedImage}
                draggedPiece={draggedPiece}
                handleDragStart={handleDragStart}
                setDraggedPiece={setDraggedPiece}
              />
            ))}
          </div>
        </div>

        {/* Target Board */}
        <div className="relative bg-white shadow-lg rounded-lg overflow-hidden"
             style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
          <div className="w-full h-full grid gap-px bg-gray-200"
               style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
            {Array.from({ length: size * size }).map((_, index) => (
              <DropZone
              data-testid={`drop-zone-${index}`}
                key={index}
                index={index}
                size={size}
                pieces={pieces}
                selectedImage={selectedImage}
                containerSize={CONTAINER_SIZE}
                pieceSize={pieceSize}
                handleDrop={handleDrop}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <button 
          onClick={handleReset}
          className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Reset
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Preview
        </button>
        <button
          onClick={handleSolve}
          disabled={isSolving || isGameComplete}
          className={`px-6 py-2 rounded-lg ${
            isSolving || isGameComplete 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSolving ? 'Solving...' : 'Solve'}
        </button>
      </div>

      {showPreview && (
        <PreviewModal
          selectedImage={selectedImage}
          onClose={() => setShowPreview(false)}
        />
      )}

      {isGameComplete && (
        <CompletionModal
          time={time}
          onPlayAgain={handleReset}
          onNewPuzzle={() => {
            setCurrentScreen('home');
            setIsGameComplete(false);
            setTime(0);
          }}
        />
      )}
    </div>
  );
};

export default GameScreen;