import React from 'react';
import { handleImageUpload } from './imageUtils';

const ImageUpload = ({
  uploadError,
  setUploadError,
  isLoading,
  setIsLoading,
  imagePreview,
  setImagePreview,
  setSelectedImage,
}) => {
  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors relative
          ${uploadError ? 'border-red-500' : 'border-gray-300 hover:border-blue-500'}
          ${isLoading ? 'opacity-50' : ''}`}
        onClick={() => !isLoading && document.getElementById('imageUpload').click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isLoading) e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (isLoading) return;
          e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
          handleImageUpload(e.dataTransfer.files[0], setUploadError, setIsLoading, setImagePreview);
        }}
      >
        <input
          id="imageUpload"
          type="file"
          data-testid="image-upload-input"
          accept="image/*"
          className="hidden"
          disabled={isLoading}
          onChange={(e) => handleImageUpload(e.target.files[0], setUploadError, setIsLoading, setImagePreview)}
        />
        {isLoading ? (
          <div className="text-blue-500">Processing image...</div>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-2">Upload your own image</h3>
            <p className="text-gray-500">Click to browse or drag an image here</p>
          </>
        )}
      </div>

      {uploadError && (
        <div className="text-red-500 text-center">{uploadError}</div>
      )}

      {imagePreview && !uploadError && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Preview:</h4>
          <div className="relative aspect-square max-w-xs mx-auto">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={() => {
                setImagePreview(null);
                setSelectedImage(null);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Remove
            </button>
            <button
              onClick={() => {
                setSelectedImage({
                  id: 'uploaded',
                  title: 'Uploaded Image',
                  src: imagePreview,
                  alt: 'Uploaded image'
                });
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Use This Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;