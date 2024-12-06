import React from 'react';
import ImageUpload from './ImageUpload';
import { PRESET_IMAGES, GRID_SIZE } from './constants';
import { initializeGame } from './gameUtils';
const HomeScreen = ({ 
  difficulty, 
  setDifficulty, 
  selectedImage, 
  setSelectedImage,
  uploadError,
  setUploadError,
  isLoading,
  setIsLoading,
  imagePreview,
  setImagePreview,
  setCurrentScreen,
  setPieces,
  setTime,
  setIsGameComplete
}) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Jigsaw Puzzle</h1>
      
      <div className="space-y-8">
        <div>
          <label className="block text-lg mb-2">Select Difficulty:</label>
          <select 
            className="w-full p-3 border rounded-lg shadow-sm"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy (3x3)</option>
            <option value="medium">Medium (4x4)</option>
            <option value="hard">Hard (5x5)</option>
          </select>
        </div>

        <ImageUpload
          uploadError={uploadError}
          setUploadError={setUploadError}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          setSelectedImage={setSelectedImage}
        />

        <div className="text-center text-xl font-semibold">- OR -</div>

        <div className="grid grid-cols-3 gap-6">
          {PRESET_IMAGES.map((image) => (
            <div
              key={image.id}
              className={`relative rounded-lg overflow-hidden cursor-pointer
                ${selectedImage?.id === image.id ? 'ring-4 ring-blue-500' : ''}
              `}
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 text-white p-3 text-center">
                {image.title}
              </div>
            </div>
          ))}
        </div>

        <button
          className={`w-full py-4 rounded-lg text-white text-xl font-semibold
            ${selectedImage ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}
          `}
          disabled={!selectedImage}
          onClick={() => initializeGame(difficulty, GRID_SIZE, setPieces, setTime, setIsGameComplete, setCurrentScreen)}
        >
          Start Puzzle
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;