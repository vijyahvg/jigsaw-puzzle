import React from 'react';

const DraggablePiece = ({
  piece,
  pieceSize,
  containerSize,
  selectedImage,
  draggedPiece,
  handleDragStart,
  setDraggedPiece
}) => (
  <div data-testid={`draggable-piece-${piece.id}`}
    className="absolute touch-none cursor-grab active:cursor-grabbing"
    style={{
      width: pieceSize,
      height: pieceSize,
      left: piece.currentPosition.col * pieceSize,
      top: piece.currentPosition.row * pieceSize,
      transition: 'all 0.2s ease',
      zIndex: draggedPiece?.id === piece.id ? 10 : 1,
      transform: draggedPiece?.id === piece.id ? 'scale(1.05)' : 'scale(1)',
      touchAction: 'none'
    }}
    draggable="true"
    onDragStart={(e) => handleDragStart(e, piece)}
    onDragEnd={(e) => {
      e.target.style.opacity = '1';
      setDraggedPiece(null);
    }}
  >
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `url(${selectedImage.src})`,
        backgroundSize: `${containerSize}px ${containerSize}px`,
        backgroundPosition: `-${piece.correctPosition.col * pieceSize}px -${piece.correctPosition.row * pieceSize}px`,
        border: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        pointerEvents: 'none'
      }}
    />
  </div>
);

export default DraggablePiece;