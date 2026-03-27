import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../../../components/ImageUploader'; // Đường dẫn import của bạn

// 1. Interface chuẩn cho Event (Tránh dùng tên 'Event' gây conflict)
export interface EventCreate {
  id: string;
  title: string;
  description: string;
  detailTittle?: string;
  thumbnail: string;
  date: string;
  bannerUrl?: string;
  posterUrl?: string;
  venues?: string;
  website?: string;
}

interface AddEventFormProps {
  // 2. Dùng EventCreate thay vì Event
  editData?: EventCreate | null;
  onSuccess?: (event: EventCreate) => void;
  onCancel?: () => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({ editData, onSuccess, onCancel }) => {
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // 3. FIX ESLint: Khởi tạo state ngay lập tức từ editData
  // Không cần useEffect để set lại state nữa
  const [formData, setFormData] = useState<Omit<EventCreate, 'id'>>({
    title: editData?.title || '',
    description: editData?.description || '',
    thumbnail: editData?.thumbnail || '',
    date: editData?.date || '',
    detailTittle: editData?.detailTittle || '',
    venues: editData?.venues || '',
    bannerUrl: editData?.bannerUrl || '',
    posterUrl: editData?.posterUrl || '',
    website: editData?.website || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.thumbnail) {
      alert("Vui lòng nhập tên sự kiện và ảnh Thumbnail!");
      return;
    }

    const newEvent: EventCreate = {
      ...formData,
      id: editData?.id || Date.now().toString(), // Giữ ID nếu sửa, tạo mới nếu thêm
    };

    console.log("Dữ liệu gửi đi:", newEvent);
    
    // await dispatch(createEvent(newEvent)); 
    
    alert("Lưu sự kiện thành công!");
    
    if (onSuccess) {
      onSuccess(newEvent);
    } else {
      navigate('/events');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/events');
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-[#0B1220] text-white rounded-lg shadow-xl border border-gray-800">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2">
        {editData ? 'Cập Nhật Sự Kiện' : 'Thêm Sự Kiện Mới'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Hàng 1: Tiêu đề & Ngày */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên sự kiện <span className="text-red-500">*</span></label>
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Nhập tên sự kiện..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày diễn ra</label>
            <input
              type="date"
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
        </div>

        {/* Mô tả & Website */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium mb-1">Mô tả ngắn</label>
                <textarea
                    className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none h-[108px]"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Mô tả danh sách..."
                />
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tiêu đề chi tiết</label>
                    <input
                        type="text"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none"
                        value={formData.detailTittle}
                        onChange={(e) => setFormData({...formData, detailTittle: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Website</label>
                    <input
                        type="text"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none"
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        placeholder="https://..."
                    />
                </div>
            </div>
        </div>

        {/* Nội dung chi tiết */}
        <div>
          <label className="block text-sm font-medium mb-1">Nội dung chi tiết (Venues)</label>
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded focus:border-blue-500 outline-none"
            value={formData.venues}
            onChange={(e) => setFormData({...formData, venues: e.target.value})}
          />
        </div>

        {/* --- KHU VỰC 3 ẢNH --- */}
        <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Hình ảnh sự kiện</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Thumbnail */}
                <div>
                    <ImageUploader 
                        label="1. Thumbnail (Danh sách)" 
                        initialImage={formData.thumbnail}
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, thumbnail: url }))} 
                    />
                </div>

                {/* 2. Banner */}
                <div>
                    <ImageUploader 
                        label="2. Banner (Trang chủ/Chi tiết)" 
                        initialImage={formData.bannerUrl}
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, bannerUrl: url }))} 
                    />
                </div>

                {/* 3. Poster */}
                <div>
                    <ImageUploader 
                        label="3. Poster" 
                        initialImage={formData.posterUrl}
                        onUploadSuccess={(url) => setFormData(prev => ({ ...prev, posterUrl: url }))} 
                    />
                </div>
            </div>
        </div>
        
        {/* Nút Action */}
        <div className="flex gap-4 pt-6 mt-6 border-t border-gray-700">
          <button 
            type="button" 
            onClick={handleCancel}
            className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 transition text-gray-200"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold transition flex-1 text-white"
          >
            {editData ? 'Lưu Thay Đổi' : 'Tạo Sự Kiện'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddEventForm;