import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { User, Mail, Lock, Phone, MapPin, UserPlus } from 'lucide-react';
import { register as registerUser } from '../../services/auth.service';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const navigate = useNavigate();

  const inputClasses = "block w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 transition-all";
  const iconClasses = "absolute left-3 top-3 h-5 w-5 text-gray-400";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerUser(formData);

    if (result.success) {
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="grow flex items-center justify-center bg-gray-900 py-12 px-4">
        <div className="max-w-xl w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Đăng ký thành viên</h2>
            <p className="mt-2 text-sm text-gray-300">Nhập thông tin để trải nghiệm đặt vé online</p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <User className={iconClasses} />
                <input name="last_name" required value={formData.last_name} onChange={handleChange} placeholder="Họ" className={inputClasses} />
              </div>
              <input name="first_name" required value={formData.first_name} onChange={handleChange} placeholder="Tên" className="block w-full px-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600" />
            </div>

            <div className="relative">
              <Mail className={iconClasses} />
              <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Email" className={inputClasses} />
            </div>

            <div className="relative">
              <Lock className={iconClasses} />
              <input name="password" type="password" required minLength={6} value={formData.password} onChange={handleChange} placeholder="Mật khẩu" className={inputClasses} />
            </div>

            <div className="relative">
              <Phone className={iconClasses} />
              <input name="phone" required value={formData.phone} onChange={handleChange} placeholder="Số điện thoại" className={inputClasses} />
            </div>

            <div className="relative">
              <MapPin className={iconClasses} />
              <input name="address" required value={formData.address} onChange={handleChange} placeholder="Địa chỉ cư trú" className={inputClasses} />
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex justify-center items-center gap-2 mt-6 shadow-md hover:shadow-red-500/30">
              <UserPlus className="h-5 w-5" /> Đăng ký tài khoản
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-300">Đã có tài khoản? </span>
            <Link to="/login" className="font-bold text-red-500 hover:text-red-400">Đăng nhập</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};