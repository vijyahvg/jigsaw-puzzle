import React from 'react';
import { formatTime } from './gameUtils';

const CompletionModal = ({ time, onPlayAgain, onNewPuzzle }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-lg text-center max-w-md w-full mx-4">
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        Puzzle Completed!
      </h2>
      <p className="text-xl mb-6">
        Time taken: {formatTime(time)}
      </p>
      <div className="flex flex-col gap-3">
        <button
          onClick={onPlayAgain}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
        >
          Play Again
        </button>
        <button
          onClick={onNewPuzzle}
          className="w-full py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold"
        >
          New Puzzle
        </button>
      </div>
    </div>
  </div>
);

export default CompletionModal;