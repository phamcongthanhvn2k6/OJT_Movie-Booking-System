/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as bcrypt from 'bcryptjs';

import type { RootState, AppDispatch } from '../../store';
import { updateUserThunk } from '../../store/slices/user.slices';
import { setUser } from '../../store/slices/authSlice';
import type { User } from '../../types/user.type';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import StatusModal from '../../components/StatusModal';

// --- CẤU HÌNH CLOUDINARY ---
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user: currentUser } = useSelector((state: RootState) => state.auth);

  // --- STATE ---
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [passData, setPassData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // --- MODAL HELPERS ---
  const showModal = (title: string, message: string, type: 'success' | 'error') => setModal({ isOpen: true, title, message, type });
  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  // --- SYNC DATA ---
  useEffect(() => {
    if (currentUser) {
      setFormData({ ...currentUser });
    } else {
        navigate('/login');
    }
  }, [currentUser, navigate]);

  // --- HANDLERS NHẬP LIỆU ---
  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPassData((prev) => ({ ...prev, [name]: value }));
  };

  // --- LOGIC 1: ĐỔI ẢNH ĐẠI DIỆN (UPLOAD & SAVE NGAY) ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    // Validate
    if (!file.type.startsWith('image/')) {
        showModal("Lỗi định dạng", "Vui lòng chỉ chọn file ảnh.", "error");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showModal("File quá lớn", "Vui lòng chọn ảnh nhỏ hơn 5MB.", "error");
        return;
    }

    setIsUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("cloud_name", CLOUD_NAME);

    try {
        // 1. Upload lên Cloudinary
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: "POST",
            body: data
        });
        const uploadedImage = await res.json();
        
        if (uploadedImage.secure_url) {
            const newAvatarUrl = uploadedImage.secure_url;
            
            // 2. Lưu NGAY LẬP TỨC vào database (Update User)
            const resultAction = await dispatch(updateUserThunk({ 
                ...currentUser, 
                avatar: newAvatarUrl 
            }));

            if (updateUserThunk.fulfilled.match(resultAction)) {
                // 3. Cập nhật State toàn cục và Form
                dispatch(setUser(resultAction.payload));
                setFormData(prev => ({ ...prev, avatar: newAvatarUrl }));
                showModal("Thành công", "Đổi ảnh đại diện thành công!", "success");
            } else {
                showModal("Lỗi lưu trữ", "Không thể cập nhật ảnh vào hồ sơ.", "error");
            }
        } else {
            throw new Error("Không nhận được link ảnh");
        }
    } catch (err) {
        console.error(err);
        showModal("Lỗi Upload", "Không thể tải ảnh lên. Vui lòng thử lại.", "error");
    } finally {
        setIsUploading(false);
    }
  };

  // --- LOGIC 2: LƯU THÔNG TIN ---
  const handleSaveInfo = async () => {
    if (!formData.id) return;
    const resultAction = await dispatch(updateUserThunk(formData as User));
    if (updateUserThunk.fulfilled.match(resultAction)) {
      showModal("Thành công", "Đã cập nhật thông tin cá nhân.", "success");
      dispatch(setUser(resultAction.payload));
      setIsEditing(false);
    } else {
      showModal("Thất bại", resultAction.error.message || "Lỗi cập nhật", "error");
    }
  };

  // --- LOGIC 3: ĐỔI MẬT KHẨU ---
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.password) return showModal("Lỗi", "Vui lòng đăng nhập lại.", "error");
    if (!passData.currentPassword || !passData.newPassword || !passData.confirmPassword) return showModal("Thiếu thông tin", "Nhập đủ các trường.", "error");

    try {
        if (!bcrypt.compareSync(passData.currentPassword, currentUser.password)) return showModal("Lỗi", "Mật khẩu cũ không đúng.", "error");
    } catch (err) { return showModal("Lỗi hệ thống", "Không thể kiểm tra mật khẩu.", "error"); }

    if (passData.newPassword.length < 6) return showModal("Lỗi", "Mật khẩu mới quá ngắn.", "error");
    if (passData.newPassword !== passData.confirmPassword) return showModal("Lỗi", "Xác nhận mật khẩu không khớp.", "error");

    const hashedPassword = bcrypt.hashSync(passData.newPassword, 10);
    const resultAction = await dispatch(updateUserThunk({ ...(formData as User), password: hashedPassword }));

    if (updateUserThunk.fulfilled.match(resultAction)) {
      showModal("Thành công", "Đổi mật khẩu thành công!", "success");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      dispatch(setUser(resultAction.payload)); 
    } else {
      showModal("Thất bại", resultAction.error.message || "Lỗi", "error");
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-200 font-sans">
        <Header />
        <StatusModal isOpen={modal.isOpen} onClose={closeModal} title={modal.title} message={modal.message} type={modal.type} />

        <div className="grow py-12 px-4 relative">
            {/* Background Decor */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-900/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto bg-[#1a1a1a] rounded-xl shadow-2xl border border-gray-800 overflow-hidden">
                
                {/* Banner Profile */}
                <div className="h-52 bg-linear-to-r from-red-950 via-black to-black relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                    
                    <div className="absolute -bottom-14 left-10 flex items-end gap-6 w-full">
                        
                        {/* --- AVATAR SECTION (ĐỘC LẬP) --- */}
                        <div className="relative group z-10">
                            {/* Label này bao trùm ảnh để click vào là chọn file ngay */}
                            <label 
                                htmlFor="avatar-upload" 
                                className={`block relative cursor-pointer ${isUploading ? 'pointer-events-none' : ''}`}
                                title="Bấm để đổi ảnh đại diện"
                            >
                                {/* Ảnh Avatar */}
                                <img
                                    src={currentUser.avatar || "https://via.placeholder.com/150"}
                                    alt="Avatar"
                                    className={`w-36 h-36 rounded-full border-4 border-[#1a1a1a] shadow-2xl object-cover bg-gray-800 transition-all duration-300 group-hover:brightness-75 ${isUploading ? 'opacity-50' : ''}`}
                                />
                                
                                {/* Loading */}
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                                    </div>
                                )}

                                {/* Icon Cây bút (Edit) - Luôn hiện hoặc hiện khi hover */}
                                <div className="absolute bottom-1 right-1 bg-red-600 text-white p-2 rounded-full shadow-lg border-2 border-[#1a1a1a] transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </label>

                            {/* Hidden Input File */}
                            <input 
                                id="avatar-upload" 
                                type="file" 
                                accept="image/*"
                                className="hidden" 
                                onChange={handleImageUpload}
                            />
                        </div>
                        {/* ----------------------------- */}

                        <div className="mb-4 pb-2">
                            <h2 className="text-3xl font-extrabold text-white uppercase tracking-wider font-oswald flex items-center gap-2">
                                {formData.first_name} {formData.last_name}
                                <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded border border-red-800/50 ml-2">{currentUser.role}</span>
                            </h2>
                            <p className="text-gray-400 text-sm">{formData.email}</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-20 px-8 flex gap-8 border-b border-gray-800">
                    <button 
                        onClick={() => { setActiveTab('info'); setIsEditing(false); }}
                        className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all duration-300 relative ${
                            activeTab === 'info' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        Thông tin cá nhân
                        {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_10px_red]"></span>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('password')}
                        className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-all duration-300 relative ${
                            activeTab === 'password' ? 'text-red-500' : 'text-gray-500 hover:text-white'
                        }`}
                    >
                        Bảo mật & Mật khẩu
                        {activeTab === 'password' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_10px_red]"></span>}
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 min-h-100">
                    
                    {/* TAB 1: USER INFO */}
                    {activeTab === 'info' && (
                        <div className="animate-fade-in-up">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-bold text-white uppercase border-l-4 border-red-600 pl-3">Hồ sơ của tôi</h3>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="px-6 py-2 border border-red-600 text-red-500 font-bold rounded hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                        Chỉnh sửa thông tin
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button onClick={() => { setIsEditing(false); setFormData(currentUser); }} className="px-4 py-2 text-gray-400 hover:text-white transition">Hủy bỏ</button>
                                        <button onClick={handleSaveInfo} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition shadow-[0_0_10px_rgba(220,38,38,0.5)]">Lưu thay đổi</button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <FormGroup label="Họ" name="first_name" value={formData.first_name} onChange={handleChangeInfo} disabled={!isEditing} />
                                <FormGroup label="Tên" name="last_name" value={formData.last_name} onChange={handleChangeInfo} disabled={!isEditing} />
                                <FormGroup label="Email" value={formData.email} disabled={true} extraClass="opacity-50 cursor-not-allowed bg-black/20" />
                                <FormGroup label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChangeInfo} disabled={!isEditing} placeholder="Thêm số điện thoại" />
                                <div className="md:col-span-2">
                                    <FormGroup label="Địa chỉ" name="address" value={formData.address} onChange={handleChangeInfo} disabled={!isEditing} placeholder="Thêm địa chỉ" icon={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: PASSWORD */}
                    {activeTab === 'password' && (
                        <div className="animate-fade-in-up flex justify-center">
                            <div className="w-full max-w-md bg-black/40 p-8 rounded-lg border border-gray-800 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white mb-6 text-center">Thay đổi mật khẩu</h3>
                                <form onSubmit={handleChangePasswordSubmit} className="space-y-5">
                                    <FormGroup label="Mật khẩu hiện tại" name="currentPassword" value={passData.currentPassword} onChange={handleChangePassInput} type="password" placeholder="••••••••" />
                                    <FormGroup label="Mật khẩu mới" name="newPassword" value={passData.newPassword} onChange={handleChangePassInput} type="password" placeholder="Ít nhất 6 ký tự" />
                                    <FormGroup label="Xác nhận mật khẩu" name="confirmPassword" value={passData.confirmPassword} onChange={handleChangePassInput} type="password" placeholder="Nhập lại mật khẩu mới" />
                                    <div className="pt-4">
                                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-900/30 uppercase tracking-wider transform hover:-translate-y-0.5">Xác nhận đổi</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
        <Footer />
    </div>
  );
};

const FormGroup = ({ label, name, value, onChange, disabled, placeholder, extraClass = "", icon, type = "text" }: any) => (
    <div className="group">
        <label className={`block text-xs font-bold uppercase tracking-wider mb-2 transition-colors duration-300 ${disabled ? 'text-gray-600' : 'text-gray-500 group-focus-within:text-red-500'}`}>{label}</label>
        <div className="relative">
            <input type={type} name={name} value={value || ''} onChange={onChange} disabled={disabled} placeholder={placeholder} className={`w-full px-4 py-3 rounded border transition-all duration-300 ${disabled ? `bg-transparent border-b border-t-0 border-l-0 border-r-0 border-gray-800 text-gray-400 rounded-none px-0 ${extraClass}` : 'bg-[#111] border-gray-700 text-white focus:border-red-600 focus:ring-0 focus:shadow-[0_0_15px_rgba(220,38,38,0.15)] placeholder-gray-700'} ${extraClass}`} />
            {!disabled && icon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
        </div>
    </div>
);

export default UserProfile;