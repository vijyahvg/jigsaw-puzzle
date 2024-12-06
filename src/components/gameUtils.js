export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  export const initializeGame = (difficulty, gridSize, setPieces, setTime, setIsGameComplete, setCurrentScreen) => {
    const size = gridSize[difficulty];
    //const pieceSize = 400 / size;
    const newPieces = [];
  
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
  
    const shuffledPieces = shufflePieces(newPieces);
    setPieces(shuffledPieces);
    setTime(0);
    setIsGameComplete(false);
    setCurrentScreen('game');
  };
  
  const shufflePieces = (pieces) => {
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = temp;
    }
    return shuffled;
  };
  
  export const checkCompletion = (currentPieces) => {
    return currentPieces.every(piece => piece.isPlaced);
  };