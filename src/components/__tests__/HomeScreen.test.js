import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomeScreen from '../HomeScreen';

describe('HomeScreen', () => {
  const mockProps = {
    difficulty: 'easy',
    setDifficulty: jest.fn(),
    selectedImage: null,
    setSelectedImage: jest.fn(),
    uploadError: null,
    setUploadError: jest.fn(),
    isLoading: false,
    setIsLoading: jest.fn(),
    imagePreview: null,
    setImagePreview: jest.fn(),
    setCurrentScreen: jest.fn(),
    setPieces: jest.fn(),
    setTime: jest.fn(),
    setIsGameComplete: jest.fn()
  };

  it('renders difficulty selector', () => {
    render(<HomeScreen {...mockProps} />);
    expect(screen.getByText('Select Difficulty:')).toBeInTheDocument();
    expect(screen.getByText('Easy (3x3)')).toBeInTheDocument();
    expect(screen.getByText('Medium (4x4)')).toBeInTheDocument();
    expect(screen.getByText('Hard (5x5)')).toBeInTheDocument();
  });

  it('displays preset images', () => {
    render(<HomeScreen {...mockProps} />);
    expect(screen.getByText('Nature')).toBeInTheDocument();
    expect(screen.getByText('Peacock')).toBeInTheDocument();
    expect(screen.getByText('Animals')).toBeInTheDocument();
  });

  it('disables start button when no image is selected', () => {
    render(<HomeScreen {...mockProps} />);
    expect(screen.getByText('Start Puzzle')).toBeDisabled();
  });

  it('enables start button when image is selected', () => {
    const propsWithImage = {
      ...mockProps,
      selectedImage: { id: 'nature', title: 'Nature', src: '/test.jpg', alt: 'test' }
    };
    render(<HomeScreen {...propsWithImage} />);
    expect(screen.getByText('Start Puzzle')).toBeEnabled();
  });
});