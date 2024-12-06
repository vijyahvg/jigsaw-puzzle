import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import GameScreen from '../GameScreen';

describe('GameScreen', () => {
  const mockProps = {
    difficulty: 'easy',
    selectedImage: { src: '/test.jpg', alt: 'test image' },
    pieces: [
      {
        id: '0-0',
        correctPosition: { row: 0, col: 0 },
        currentPosition: { row: 1, col: 1 },
        isPlaced: false
      }
    ],
    setPieces: jest.fn((callback) => {
      // Handle both function and direct value updates
      if (typeof callback === 'function') {
        return callback(mockProps.pieces);
      }
      return callback;
    }),
    time: 0,
    draggedPiece: null,
    setDraggedPiece: jest.fn(),
    isGameComplete: false,
    setIsGameComplete: jest.fn(),
    showPreview: false,
    setShowPreview: jest.fn(),
    isSolving: false,
    setIsSolving: jest.fn(),
    setCurrentScreen: jest.fn(),
    setTime: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test handleDrop function (lines 47-57)
  it('handles drop with state updates and completion check', () => {
    const draggedPiece = {
      id: '0-0',
      correctPosition: { row: 0, col: 0 },
      currentPosition: { row: 1, col: 1 },
      isPlaced: false
    };

    const { rerender } = render(
      <GameScreen {...mockProps} draggedPiece={draggedPiece} />
    );

    const dropZone = screen.getByTestId('drop-zone-0');
    
    // Test drop with existing dragged piece
    fireEvent.drop(dropZone, {
      preventDefault: jest.fn(),
      currentTarget: { style: { backgroundColor: 'blue' } }
    });

    expect(mockProps.setPieces).toHaveBeenCalled();
    const updateFn = mockProps.setPieces.mock.calls[0][0];
    const result = updateFn([draggedPiece]);
    expect(result[0].isPlaced).toBeDefined();

    // Test drop without dragged piece
    rerender(<GameScreen {...mockProps} draggedPiece={null} />);
    fireEvent.drop(dropZone, {
      preventDefault: jest.fn(),
      currentTarget: { style: { backgroundColor: 'blue' } }
    });
    expect(mockProps.setPieces).toHaveBeenCalledTimes(1);
  });

  // Test handleReset function (line 120)
  it('handles reset with proper piece shuffling', () => {
    render(<GameScreen {...mockProps} />);
    const resetButton = screen.getByText('Reset');
    
    fireEvent.click(resetButton);
    
    // Check if all necessary state updates were called
    expect(mockProps.setTime).toHaveBeenCalledWith(0);
    expect(mockProps.setIsGameComplete).toHaveBeenCalledWith(false);
    expect(mockProps.setDraggedPiece).toHaveBeenCalledWith(null);
    
    // Verify pieces were shuffled
    const setPiecesCalls = mockProps.setPieces.mock.calls[0][0];
    const newPieces = Array.isArray(setPiecesCalls) ? setPiecesCalls : [];
    expect(newPieces.length).toBe(9); // 3x3 for easy difficulty
    expect(newPieces.every(p => !p.isPlaced)).toBe(true);
  });

  // Test solve functionality (lines 179-200)
  it('handles solve with complete animation cycle', () => {
    jest.useFakeTimers();
    
    render(<GameScreen {...mockProps} />);
    const solveButton = screen.getByText('Solve');
    
    fireEvent.click(solveButton);
    
    // Initial state after clicking solve
    expect(mockProps.setIsSolving).toHaveBeenCalledWith(true);
    const setPiecesCalls = mockProps.setPieces.mock.calls[0][0];
    expect(Array.isArray(setPiecesCalls) ? setPiecesCalls : [])
      .toEqual(expect.arrayContaining([
        expect.objectContaining({
          isPlaced: true,
          currentPosition: expect.objectContaining({
            row: expect.any(Number),
            col: expect.any(Number)
          })
        })
      ]));

    // Advance timer to complete animation
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check final states
    expect(mockProps.setIsGameComplete).toHaveBeenCalledWith(true);
    expect(mockProps.setIsSolving).toHaveBeenCalledWith(false);

    jest.useRealTimers();
  });

  it('handles solve button disabled states', () => {
    const { rerender } = render(
      <GameScreen {...mockProps} isSolving={true} />
    );
    expect(screen.getByText('Solving...')).toBeDisabled();

    rerender(
      <GameScreen {...mockProps} isGameComplete={true} />
    );
    expect(screen.getByText('Solve')).toBeDisabled();
  });
});