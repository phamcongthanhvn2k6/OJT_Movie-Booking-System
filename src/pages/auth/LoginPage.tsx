import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Mail, Lock, LogIn } from 'lucide-react';
import { login, saveAuthToken, saveUserData } from '../../services/auth.service';
import { loginSuccess } from '../../store/slices/authSlice'; // 2. Import Action

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 3. Khởi tạo dispatch

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await login({ email, password });

    if (result.success) {
      // BƯỚC QUAN TRỌNG NHẤT: Bơm dữ liệu vào RAM (Redux) để Header cập nhật ngay
      dispatch(loginSuccess({ 
        user: result.user, 
        token: result.token! 
      }));

      // Lưu Token vào localStorage để duy trì phiên khi F5
      saveAuthToken(result.token!);
      
      // Tùy chọn: Nếu bạn vẫn muốn lưu UserData ở LocalStorage (Dù đã có Redux bảo mật hơn)
      saveUserData(result.user);
      
      alert("Đăng nhập thành công!");

      // Điều hướng dựa trên vai trò
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <main className="grow flex items-center justify-center bg-gray-900 py-12 px-4">
        <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Đăng nhập</h2>
            <p className="mt-2 text-sm text-gray-300">Sử dụng tài khoản NCC Cinema của bạn</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email" 
                  className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mật khẩu" 
                  className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-red-600 transition-all"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-red-500/30">
              <LogIn className="h-5 w-5" /> Đăng nhập
            </button>
          </form>

          <div className="text-center text-sm">
            <span className="text-gray-300">Chưa có tài khoản? </span>
            <Link to="/register" className="font-bold text-red-500 hover:text-red-400">Đăng ký ngay</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};