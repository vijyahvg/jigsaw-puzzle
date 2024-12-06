import React, { useState, useEffect } from 'react';
import HomeScreen from './HomeScreen';
import GameScreen from './GameScreen';
//import { validateImage } from './imageUtils';
//import { GRID_SIZE } from './constants';

const JigsawPuzzle = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [difficulty, setDifficulty] = useState('easy');
  const [selectedImage, setSelectedImage] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [time, setTime] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSolving, setIsSolving] = useState(false);

  useEffect(() => {
    let timer;
    if (currentScreen === 'game' && !isGameComplete) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentScreen, isGameComplete]);

  return currentScreen === 'home' ? (
    <HomeScreen
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
      uploadError={uploadError}
      setUploadError={setUploadError}
      isLoading={isLoading}
      setIsLoading={setIsLoading}
      imagePreview={imagePreview}
      setImagePreview={setImagePreview}
      setCurrentScreen={setCurrentScreen}
      setPieces={setPieces}
      setTime={setTime}
      setIsGameComplete={setIsGameComplete}
    />
  ) : (
    <GameScreen
      difficulty={difficulty}
      selectedImage={selectedImage}
      pieces={pieces}
      setPieces={setPieces}
      time={time}
      draggedPiece={draggedPiece}
      setDraggedPiece={setDraggedPiece}
      isGameComplete={isGameComplete}
      setIsGameComplete={setIsGameComplete}
      showPreview={showPreview}
      setShowPreview={setShowPreview}
      isSolving={isSolving}
      setIsSolving={setIsSolving}
      setCurrentScreen={setCurrentScreen}
      setTime={setTime}
    />
  );
};

export default JigsawPuzzle;