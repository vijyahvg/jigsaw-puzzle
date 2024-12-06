import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DropZone from '../DropZone';

describe('DropZone', () => {
  const mockProps = {
    index: 0,
    size: 3,
    pieces: [],
    selectedImage: { src: '/test.jpg' },
    containerSize: 400,
    pieceSize: 100,
    handleDrop: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty drop zone', () => {
    const { container } = render(<DropZone {...mockProps} />);
    expect(container.firstChild).toHaveClass('relative bg-white border');
  });

  it('renders drop zone with piece', () => {
    const propsWithPiece = {
      ...mockProps,
      pieces: [{
        correctPosition: { row: 0, col: 0 },
        isPlaced: true
      }]
    };
    const { container } = render(<DropZone {...propsWithPiece} />);
    const piece = container.querySelector('.absolute');
    expect(piece).toBeInTheDocument();
  });

  it('handles drag events', () => {
    const preventDefault = jest.fn();
    const { container } = render(<DropZone {...mockProps} />);
    const dropZone = container.firstChild;

    // Test dragOver
    fireEvent.dragOver(dropZone, { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(dropZone).toHaveStyle({ backgroundColor: 'rgba(59, 130, 246, 0.1)' });

    // Test dragLeave
    fireEvent.dragLeave(dropZone);
    expect(dropZone).toHaveStyle({ backgroundColor: 'white' });

    // Test drop
    fireEvent.drop(dropZone, { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
    expect(mockProps.handleDrop).toHaveBeenCalled();
  });
});