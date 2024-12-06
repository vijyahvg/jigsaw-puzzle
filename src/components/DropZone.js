const DropZone = ({
    index,
    size,
    pieces,
    selectedImage,
    containerSize,
    pieceSize,
    handleDrop
  }) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const piece = pieces.find(p => 
      p.isPlaced && 
      p.correctPosition.row === row && 
      p.correctPosition.col === col
    );
  
    return (
      <div data-testid={`drop-zone-${index}`}
        className="relative bg-white border border-dashed border-gray-300 transition-colors duration-200"
        style={{ aspectRatio: '1/1' }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        }}
        onDragLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
        }}
        onDrop={(e) => handleDrop(e, { row, col })}
      >
        {piece && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${selectedImage.src})`,
              backgroundSize: `${containerSize}px ${containerSize}px`,
              backgroundPosition: `-${piece.correctPosition.col * pieceSize}px -${piece.correctPosition.row * pieceSize}px`
            }}
          />
        )}
      </div>
    );
  };
  
  export default DropZone;