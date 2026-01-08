import axios from 'axios';

// Lấy config từ biến môi trường
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_API_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

interface CloudinaryResponse {
  secure_url: string; // URL ảnh https
  public_id: string;  // ID của ảnh
  [key: string]: unknown;
}

/**
 * Hàm upload file lên Cloudinary
 * @param file File ảnh lấy từ input
 * @returns Promise<string> - Trả về URL ảnh
 */
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await axios.post<CloudinaryResponse>(CLOUDINARY_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Trả về link ảnh (secure_url)
    return response.data.secure_url;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    throw error;
  }
};