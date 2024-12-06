export const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "Image size should be less than 5MB";
    }
    return null;
  };
  
  export const handleImageUpload = async (file, setUploadError, setIsLoading, setImagePreview) => {
    if (!file) return;
    
    setUploadError(null);
    setIsLoading(true);
  
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file');
      setIsLoading(false);
      return;
    }
  
    const sizeError = validateImage(file);
    if (sizeError) {
      setUploadError(sizeError);
      setIsLoading(false);
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImagePreview(e.target.result);
        setIsLoading(false);
      };
      img.onerror = () => {
        setUploadError('Failed to load image');
        setIsLoading(false);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setUploadError('Failed to read file');
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };