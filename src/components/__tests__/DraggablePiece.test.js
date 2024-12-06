import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DraggablePiece from '../DraggablePiece';

describe('DraggablePiece', () => {
  const mockProps = {
    piece: {
      id: '0-0',
      correctPosition: { row: 0, col: 0 },
      currentPosition: { row: 0, col: 0 }
    },
    pieceSize: 100,
    containerSize: 300,
    selectedImage: { src: '/test.jpg' },
    draggedPiece: null,
    handleDragStart: jest.fn(),
    setDraggedPiece: jest.fn()
  };

  it('renders with correct styles', () => {
    const { container } = render(<DraggablePiece {...mockProps} />);
    const piece = container.firstChild;
    
    expect(piece).toHaveStyle({
      width: '100px',
      height: '100px'
    });
  });

  it('handles drag start', () => {
    const { container } = render(<DraggablePiece {...mockProps} />);
    const piece = container.firstChild;
    
    fireEvent.dragStart(piece);
    expect(mockProps.handleDragStart).toHaveBeenCalled();
  });

  it('handles drag end', () => {
    const { container } = render(<DraggablePiece {...mockProps} />);
    const piece = container.firstChild;
    
    fireEvent.dragEnd(piece);
    expect(mockProps.setDraggedPiece).toHaveBeenCalledWith(null);
  });
});