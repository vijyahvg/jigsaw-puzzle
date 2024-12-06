import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CompletionModal from '../CompletionModal';

describe('CompletionModal', () => {
  const mockProps = {
    time: 65, // 1:05
    onPlayAgain: jest.fn(),
    onNewPuzzle: jest.fn()
  };

  beforeEach(() => {
    mockProps.onPlayAgain.mockClear();
    mockProps.onNewPuzzle.mockClear();
  });

  it('displays completion message and time', () => {
    render(<CompletionModal {...mockProps} />);
    expect(screen.getByText('Puzzle Completed!')).toBeInTheDocument();
    expect(screen.getByText('Time taken: 01:05')).toBeInTheDocument();
  });

  it('handles play again button click', () => {
    render(<CompletionModal {...mockProps} />);
    const playAgainButton = screen.getByText('Play Again');
    fireEvent.click(playAgainButton);
    expect(mockProps.onPlayAgain).toHaveBeenCalledTimes(1);
  });

  it('handles new puzzle button click', () => {
    render(<CompletionModal {...mockProps} />);
    const newPuzzleButton = screen.getByText('New Puzzle');
    fireEvent.click(newPuzzleButton);
    expect(mockProps.onNewPuzzle).toHaveBeenCalledTimes(1);
  });
});