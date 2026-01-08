import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, X } from 'lucide-react';
import ImageUploader from '../../../components/ImageUploader';

interface NewsPost {
  id: string;
  title: string;
  image: string;
  date: string;
  lead?: string;
  content?: string;
  details?: string[];
  detailImage?: string;
}

interface AddNewsFormProps {
  editingNews?: NewsPost | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

const AddNewsForm: React.FC<AddNewsFormProps> = ({ 
  editingNews = null,
  onSuccess, 
  onCancel,
  isModal = false 
}) => {
  const navigate = useNavigate();

  // State form data
  const [formData, setFormData] = useState(() => {
    if (editingNews) {
      return {
        title: editingNews.title,
        date: editingNews.date,
        lead: editingNews.lead || '',
        content: editingNews.content || '',
        image: editingNews.image,
        detailImage: editingNews.detailImage || '',
        details: editingNews.details || []
      };
    }
    return {
      title: '',
      date: new Date().toISOString().split('T')[0],
      lead: '',
      content: '',
      image: '',
      detailImage: '',
      details: [] as string[]
    };
  });

  const [detailInput, setDetailInput] = useState('');
  const [activeId, setActiveId] = useState(editingNews?.id);

  // Cập nhật form khi editingNews thay đổi (nếu component không unmount)
  if (editingNews?.id !== activeId) {
    setActiveId(editingNews?.id);
    setFormData(editingNews
      ? {
          title: editingNews.title,
          date: editingNews.date,
          lead: editingNews.lead || '',
          content: editingNews.content || '',
          image: editingNews.image,
          detailImage: editingNews.detailImage || '',
          details: editingNews.details || [],
        }
      : {
          title: '',
          date: new Date().toISOString().split('T')[0],
          lead: '',
          content: '',
          image: '',
          detailImage: '',
          details: [],
        }
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.image) {
      alert("Vui lòng nhập tiêu đề và ảnh bài viết!");
      return;
    }

    // Tạo object dữ liệu mới
    const newsData = {
      ...formData,
      // Nếu đang sửa thì giữ ID cũ, nếu mới thì tạo ID bằng timestamp
      id: editingNews?.id || Date.now().toString(), 
    };

    try {
      // --- LOGIC LƯU LOCAL STORAGE ---
      const storedNews: NewsPost[] = JSON.parse(localStorage.getItem('localNews') || '[]');
      
      if (editingNews) {
        // Chế độ sửa
        // SỬA LỖI: Thay 'any' bằng 'NewsPost'
        const index = storedNews.findIndex((n: NewsPost) => n.id === editingNews.id);
        
        if (index !== -1) {
          // Nếu tìm thấy trong Local Storage -> Cập nhật
          storedNews[index] = newsData;
        } else {
          // Nếu không thấy trong Local (tức là đang sửa bài từ API)
          // Thêm mới vào local để ghi đè hiển thị
          storedNews.unshift(newsData);
        }
      } else {
        // Chế độ thêm mới: Đưa lên đầu danh sách
        storedNews.unshift(newsData);
      }
      
      // Lưu lại vào localStorage
      localStorage.setItem('localNews', JSON.stringify(storedNews));
      // -------------------------------

      alert(editingNews ? 'Cập nhật thành công!' : 'Đăng tin thành công!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/media');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi lưu dữ liệu!');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/media');
    }
  };

  const addDetail = () => {
    if (detailInput.trim()) {
      setFormData(prev => ({
        ...prev,
        details: [...prev.details, detailInput.trim()]
      }));
      setDetailInput('');
    }
  };

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }));
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Tiêu đề */}
      <div>
        <label className="block text-sm font-medium mb-2 text-black">
          Tiêu đề bài viết <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full p-3 bg-gray-300 border border-gray-600 rounded-lg text-black focus:border-indigo-600 outline-none"
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          placeholder="Nhập tiêu đề tin tức..."
        />
      </div>

      {/* Ngày đăng */}
      <div>
        <label className="block text-sm font-medium mb-2">Ngày đăng</label>
        <input
          type="date"
          className="w-full p-3 bg-gray-300 border border-gray-600 rounded-lg text-black focus:border-indigo-600 outline-none"
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
        />
      </div>

      {/* Lead */}
      <div>
        <label className="block text-sm font-medium mb-2">Đoạn mở đầu (Lead)</label>
        <textarea
          className="w-full p-3 bg-gray-300 border border-gray-600 rounded-lg text-black focus:border-indigo-600 outline-none h-24"
          value={formData.lead}
          onChange={(e) => setFormData({...formData, lead: e.target.value})}
          placeholder="Tóm tắt ngắn gọn nội dung..."
        />
      </div>

      {/* Nội dung chính */}
      <div>
        <label className="block text-sm font-medium mb-2">Nội dung chi tiết</label>
        <textarea
          className="w-full p-3 bg-gray-300 border border-gray-600 rounded-lg text-black focus:border-indigo-600 outline-none h-40"
          value={formData.content}
          onChange={(e) => setFormData({...formData, content: e.target.value})}
          placeholder="Nội dung đầy đủ của bài viết..."
        />
      </div>

      {/* Chi tiết bổ sung */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Chi tiết bổ sung (Danh sách)
        </label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-300 border border-gray-600 rounded-lg text-black focus:border-indigo-600 outline-none"
            value={detailInput}
            onChange={(e) => setDetailInput(e.target.value)}
            placeholder="VD: Địa điểm: Rạp NCC Hà Nội"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDetail())}
          />
          <button
            type="button"
            onClick={addDetail}
            className="px-4 py-2 bg-indigo-600 text-white border border-indigo-600 rounded-lg cursor-pointer hover:bg-white hover:text-indigo-600 transition"
          >
            Thêm
          </button>
        </div>
        {formData.details.length > 0 && (
          <ul className="space-y-2">
            {formData.details.map((detail, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-300 p-3 rounded-lg border border-gray-700">
                <span className="text-gray-300">{detail}</span>
                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upload Ảnh */}
      <div>
        <span className="text-black">Ảnh đại diện bài viết <span className="text-red-500">*</span></span>
        <ImageUploader 
          label="" 
          initialImage={formData.image}
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, image: url }))} 
        />
      </div>

      <div>
        <span className="text-black">Ảnh chi tiết (tùy chọn)</span>
        <ImageUploader 
          label="" 
          initialImage={formData.detailImage}
          onUploadSuccess={(url) => setFormData(prev => ({ ...prev, detailImage: url }))} 
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
        <button 
          type="button" 
          onClick={handleCancel}
          className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-gray-200"
        >
          Hủy bỏ
        </button>
        <button 
          type="submit" 
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 font-semibold"
        >
          <PenTool size={18} />
          {editingNews ? 'Cập nhật' : 'Đăng bài'}
        </button>
      </div>
    </form>
  );

  if (isModal) {
    return <div className="p-6 max-h-[70vh] overflow-y-auto">{formContent}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-white rounded-lg shadow-xl border border-gray-200 mt-6">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-2">
        {editingNews ? 'Chỉnh sửa tin tức' : 'Đăng Tin Tức Mới'}
      </h2>
      {formContent}
    </div>
  );
};

export default AddNewsForm;