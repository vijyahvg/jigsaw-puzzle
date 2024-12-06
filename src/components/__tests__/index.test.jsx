import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JigsawPuzzle from '../index';

describe('JigsawPuzzle', () => {
  it('renders the home screen by default', () => {
    render(<JigsawPuzzle />);
    expect(screen.getByText('Jigsaw Puzzle')).toBeInTheDocument();
    expect(screen.getByText('Select Difficulty:')).toBeInTheDocument();
  });

  it('switches between difficulty levels', () => {
    render(<JigsawPuzzle />);
    const select = screen.getByRole('combobox');
    
    fireEvent.change(select, { target: { value: 'medium' } });
    expect(select.value).toBe('medium');
    
    fireEvent.change(select, { target: { value: 'hard' } });
    expect(select.value).toBe('hard');
  });

  it('starts game when image is selected and start button is clicked', () => {
    render(<JigsawPuzzle />);
    const natureImage = screen.getByText('Nature').closest('div');
    fireEvent.click(natureImage);
    
    const startButton = screen.getByText('Start Puzzle');
    fireEvent.click(startButton);
    
    expect(screen.getByText('Time: 00:00')).toBeInTheDocument();
  });
});