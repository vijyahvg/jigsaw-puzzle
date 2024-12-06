import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ImageUpload from '../ImageUpload';

describe('ImageUpload', () => {
  const mockProps = {
    uploadError: null,
    setUploadError: jest.fn(),
    isLoading: false,
    setIsLoading: jest.fn(),
    imagePreview: null,
    setImagePreview: jest.fn(),
    setSelectedImage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles valid file upload', () => {
    render(<ImageUpload {...mockProps} />);
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const input = document.getElementById('imageUpload');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);
    expect(mockProps.setIsLoading).toHaveBeenCalledWith(true);
  });

  it('handles invalid file type', () => {
    render(<ImageUpload {...mockProps} />);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = document.getElementById('imageUpload');

    Object.defineProperty(input, 'files', {
      value: [file]
    });

    fireEvent.change(input);
    expect(mockProps.setUploadError).toHaveBeenCalledWith('Please upload an image file');
  });

  it('handles drag and drop events', () => {
    const { container } = render(<ImageUpload {...mockProps} />);
    const dropZone = container.querySelector('.border-2');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Test dragOver
    fireEvent.dragOver(dropZone, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [file] }
    });
    
    expect(dropZone.classList.contains('border-blue-500')).toBe(true);
    expect(dropZone.classList.contains('bg-blue-50')).toBe(true);

    // Test dragLeave
    fireEvent.dragLeave(dropZone, {
      preventDefault: jest.fn()
    });
    
    expect(dropZone.classList.contains('border-blue-500')).toBe(false);
    expect(dropZone.classList.contains('bg-blue-50')).toBe(false);

    // Test drop
    fireEvent.drop(dropZone, {
      preventDefault: jest.fn(),
      dataTransfer: { files: [file] }
    });
    
    expect(mockProps.setIsLoading).toHaveBeenCalledWith(true);
  });

  it('shows loading state', () => {
    render(<ImageUpload {...mockProps} isLoading={true} />);
    expect(screen.getByText('Processing image...')).toBeInTheDocument();
    expect(screen.queryByText('Upload your own image')).not.toBeInTheDocument();
  });

  it('displays image preview when available', () => {
    render(<ImageUpload {...mockProps} imagePreview="test-image-url" />);
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
  });

  it('handles remove button click in preview', () => {
    render(<ImageUpload {...mockProps} imagePreview="test-image-url" />);
    const removeButton = screen.getByText('Remove');
    
    fireEvent.click(removeButton);
    expect(mockProps.setImagePreview).toHaveBeenCalledWith(null);
    expect(mockProps.setSelectedImage).toHaveBeenCalledWith(null);
  });

  it('handles use image button click in preview', () => {
    render(<ImageUpload {...mockProps} imagePreview="test-image-url" />);
    const useImageButton = screen.getByText('Use This Image');
    
    fireEvent.click(useImageButton);
    expect(mockProps.setSelectedImage).toHaveBeenCalledWith({
      id: 'uploaded',
      title: 'Uploaded Image',
      src: 'test-image-url',
      alt: 'Uploaded image'
    });
  });

  it('displays error message when upload fails', () => {
    render(<ImageUpload {...mockProps} uploadError="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('prevents click when loading', () => {
    render(<ImageUpload {...mockProps} isLoading={true} />);
    const dropZone = screen.getByText('Processing image...').parentElement;
    
    fireEvent.click(dropZone);
    expect(document.getElementById('imageUpload').click).not.toHaveBeenCalled;
  });
});