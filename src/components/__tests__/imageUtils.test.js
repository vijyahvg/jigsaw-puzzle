import { validateImage, handleImageUpload } from '../imageUtils';

describe('imageUtils', () => {
  const mockSetters = {
    setUploadError: jest.fn(),
    setIsLoading: jest.fn(),
    setImagePreview: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up all modifications to global objects
    global.FileReader = undefined;
    global.Image = undefined;
  });

  // Test validateImage
  describe('validateImage', () => {
    it('validates file size correctly', () => {
      const smallFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(smallFile, 'size', { value: 1024 * 1024 }); // 1MB
      
      const largeFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB
      
      expect(validateImage(smallFile)).toBeNull();
      expect(validateImage(largeFile)).toBe('Image size should be less than 5MB');
    });
  });

  // Test handleImageUpload
  describe('handleImageUpload', () => {
    it('handles invalid file type', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      await handleImageUpload(
        file,
        mockSetters.setUploadError,
        mockSetters.setIsLoading,
        mockSetters.setImagePreview
      );

      expect(mockSetters.setUploadError).toHaveBeenCalledWith('Please upload an image file');
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(false);
    });

    it('handles file size validation', async () => {
      const largeFile = new File(['test'], 'large.jpg', { type: 'image/jpeg' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB
      
      await handleImageUpload(
        largeFile,
        mockSetters.setUploadError,
        mockSetters.setIsLoading,
        mockSetters.setImagePreview
      );

      expect(mockSetters.setUploadError).toHaveBeenCalledWith('Image size should be less than 5MB');
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(true);
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(false);
    });

    // Test FileReader error (lines 42-43)
    it('handles FileReader error', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock FileReader with error
      global.FileReader = class {
        constructor() {
          setTimeout(() => this.onerror(), 0);
        }
        readAsDataURL() {}
      };

      await handleImageUpload(
        file,
        mockSetters.setUploadError,
        mockSetters.setIsLoading,
        mockSetters.setImagePreview
      );

      expect(mockSetters.setUploadError).toHaveBeenCalledWith('Failed to read file');
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(false);
    });

    // Test Image loading error (lines 30-39)
    it('handles Image loading error', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock FileReader with successful load but Image with error
      global.FileReader = class {
        constructor() {
          setTimeout(() => {
            this.onload({ target: { result: 'data:image/jpeg;base64,test' } });
          }, 0);
        }
        readAsDataURL() {}
      };

      global.Image = class {
        constructor() {
          setTimeout(() => this.onerror(), 0);
        }
      };

      await handleImageUpload(
        file,
        mockSetters.setUploadError,
        mockSetters.setIsLoading,
        mockSetters.setImagePreview
      );

      expect(mockSetters.setUploadError).toHaveBeenCalledWith('Failed to load image');
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(false);
    });

    // Test successful upload
    it('handles successful upload', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      
      // Mock successful FileReader and Image load
      global.FileReader = class {
        constructor() {
          setTimeout(() => {
            this.onload({ target: { result: 'data:image/jpeg;base64,test' } });
          }, 0);
        }
        readAsDataURL() {}
      };

      global.Image = class {
        constructor() {
          setTimeout(() => this.onload(), 0);
        }
      };

      await handleImageUpload(
        file,
        mockSetters.setUploadError,
        mockSetters.setIsLoading,
        mockSetters.setImagePreview
      );

      expect(mockSetters.setImagePreview).toHaveBeenCalledWith('data:image/jpeg;base64,test');
      expect(mockSetters.setIsLoading).toHaveBeenCalledWith(false);
      expect(mockSetters.setUploadError).toHaveBeenCalledWith(null);
    });

    it('handles null file input', async () => {
      await handleImageUpload(
        null,
        mockSetters.setUploadError,
        mockSetters.setIsLoading,
        mockSetters.setImagePreview
      );

      expect(mockSetters.setUploadError).not.toHaveBeenCalled();
      expect(mockSetters.setIsLoading).not.toHaveBeenCalled();
      expect(mockSetters.setImagePreview).not.toHaveBeenCalled();
    });
  });
});