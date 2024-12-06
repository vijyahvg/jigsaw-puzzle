const PreviewModal = ({ selectedImage, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
        <img
          src={selectedImage.src}
          alt="Preview"
          className="max-w-full max-h-[calc(90vh-8rem)] object-contain"
        />
        <button
          onClick={onClose}
          className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
  
  export default PreviewModal;