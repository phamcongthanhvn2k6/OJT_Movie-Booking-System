import React, { useState, useEffect } from 'react';
import { uploadImageToCloudinary } from '../services/upload.service';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  label?: string;
  initialImage?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onUploadSuccess, 
  label = "Chọn ảnh",
  initialImage 
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage || null);

  // --- QUAN TRỌNG: Cập nhật preview khi dữ liệu cha thay đổi (khi bấm sửa) ---
  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);
  // --------------------------------------------------------------------------

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Hiện preview ngay để trải nghiệm mượt hơn
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);

    try {
      const uploadedUrl = await uploadImageToCloudinary(file);
      onUploadSuccess(uploadedUrl);
      console.log("Upload thành công:", uploadedUrl);
    } catch (error) {
      console.error("Lỗi upload:", error);
      alert("Upload thất bại!");
      setPreview(initialImage || null); // Quay về ảnh cũ nếu lỗi
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-300 font-medium text-sm">{label}</label>
      
      <div className="border border-dashed border-gray-600 rounded-lg p-2 flex flex-col items-center justify-center bg-gray-900 hover:bg-gray-800 transition relative h-48 group">
        
        {loading ? (
          <div className="text-blue-400 animate-pulse text-sm">Đang tải lên...</div>
        ) : preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain rounded" 
            />
            {/* Lớp phủ khi hover */}
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white text-xs rounded pointer-events-none">
              Nhấn để thay đổi
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        ) : (
          <div className="relative cursor-pointer text-center flex flex-col items-center">
             <span className="text-3xl text-gray-500 mb-1">+</span>
             <span className="text-gray-400 text-xs">Tải ảnh</span>
             <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;