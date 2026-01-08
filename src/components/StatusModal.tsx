import React from 'react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'success' | 'error';
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, title, message, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1a1a1a] border border-gray-700 w-full max-w-md rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] p-6 transform transition-all scale-100">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          {type === 'success' ? (
            <div className="w-16 h-16 rounded-full bg-green-900/30 flex items-center justify-center border-2 border-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-900/30 flex items-center justify-center border-2 border-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <h3 className={`text-2xl font-bold text-center mb-2 ${type === 'success' ? 'text-white' : 'text-red-500'}`}>
          {title}
        </h3>
        <p className="text-gray-400 text-center mb-6">
          {message}
        </p>

        {/* Button */}
        <button
          onClick={onClose}
          className={`w-full py-3 rounded-md font-bold text-white transition duration-200 uppercase tracking-wide
            ${type === 'success' 
              ? 'bg-green-700 hover:bg-green-600 shadow-lg shadow-green-900/20' 
              : 'bg-red-700 hover:bg-red-600 shadow-lg shadow-red-900/20'
            }`}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default StatusModal;