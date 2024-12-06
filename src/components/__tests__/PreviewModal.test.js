import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PreviewModal from '../PreviewModal';

describe('PreviewModal', () => {
  const mockProps = {
    selectedImage: {
      src: '/test.jpg',
      alt: 'Test image'
    },
    onClose: jest.fn()
  };

  beforeEach(() => {
    // Reset mock function
    mockProps.onClose.mockClear();
  });

  it('renders preview image', () => {
    render(<PreviewModal {...mockProps} />);
    const image = screen.getByAltText('Preview');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test.jpg');
  });

  it('closes modal when close button is clicked', () => {
    render(<PreviewModal {...mockProps} />);
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('has proper backdrop and modal styling', () => {
    const { container } = render(<PreviewModal {...mockProps} />);
    const backdrop = container.firstChild;
    const modal = backdrop.firstChild;

    expect(backdrop).toHaveClass('fixed inset-0 bg-black bg-opacity-50');
    expect(modal).toHaveClass('bg-white p-4 rounded-lg');
  });
});