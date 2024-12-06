import { formatTime } from '../gameUtils';
import { validateImage, handleImageUpload } from '../imageUtils';

describe('gameUtils', () => {
  describe('formatTime', () => {
    it('formats seconds correctly', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(59)).toBe('00:59');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(3599)).toBe('59:59');
    });
  });
});

describe('imageUtils', () => {
  describe('validateImage', () => {
    it('validates image size', () => {
      const smallFile = { size: 1024 * 1024 }; // 1MB
      const largeFile = { size: 6 * 1024 * 1024 }; // 6MB

      expect(validateImage(smallFile)).toBeNull();
      expect(validateImage(largeFile)).toBe('Image size should be less than 5MB');
    });
  });

  describe('handleImageUpload', () => {
    const mockSetters = {
      setUploadError: jest.fn(),
      setIsLoading: jest.fn(),
      setImagePreview: jest.fn()
    };

    beforeEach(() => {
      // Reset all mocks
      Object.values(mockSetters).forEach(mock => mock.mockClear());
    });

    it('handles invalid file type', async () => {
      const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
      await handleImageUpload(invalidFile, ...Object.values(mockSetters));
      
      expect(mockSetters.setUploadError).toHaveBeenCalledWith('Please upload an image file');
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(false);
    });

    it('handles missing file', async () => {
      await handleImageUpload(null, ...Object.values(mockSetters));
      expect(mockSetters.setIsLoading).not.toHaveBeenCalled();
    });
  });
});