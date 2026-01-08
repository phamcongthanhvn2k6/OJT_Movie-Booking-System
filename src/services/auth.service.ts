/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose"; // [Cite: Document thư viện jose]

const API_BASE_URL = "http://localhost:5000";
const USER_TOKEN_KEY = import.meta.env.VITE_USER_TOKEN_KEY
const USER_DATA_KEY = import.meta.env.VITE_USER_DATA_KEY
// jose yêu cầu key dưới dạng Uint8Array
const JWT_SECRET = new TextEncoder().encode('movie-zone-super-secret-key-2024');

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  token?: string;
}

// --- CÁC HÀM LƯU TRỮ (GIỮ NGUYÊN) ---
export const saveAuthToken = (token: string) =>
  localStorage.setItem(USER_TOKEN_KEY, token);

export const getAuthToken = () => localStorage.getItem(USER_TOKEN_KEY);

export const saveUserData = (user: any) => {
  const dataToStore = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataToStore));
};

export const removeAuthToken = () => {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};

// --- HÀM MỚI: Lấy profile từ Server bằng cách giải mã JWT ---
export const fetchUserProfile = async (token: string): Promise<any | null> => {
  try {
    // 1. Dùng jose để verify token và lấy payload
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // 2. Lấy userId từ payload (lúc tạo token ta đã nhét id vào field 'sub' hoặc custom field)
    const userId = payload.sub; 

    if (!userId) return null;

    // 3. Gọi API lấy thông tin user mới nhất
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    if (response.ok) {
      const user = await response.json();
      return user; // Trả về user đầy đủ để Redux/App cập nhật state
    }
    return null;
  } catch (error) {
    // Nếu token hết hạn hoặc không hợp lệ, jwtVerify sẽ ném lỗi
    console.error("Token không hợp lệ hoặc đã hết hạn:", error);
    return null;
  }
};

// --- HÀM ĐĂNG KÝ (GIỮ NGUYÊN) ---
export const register = async (userData: any): Promise<AuthResponse> => {
  try {
    const checkRes = await fetch(
      `${API_BASE_URL}/users?email=${encodeURIComponent(userData.email)}`
    );
    const existingUsers = await checkRes.json();
    if (existingUsers.length > 0) {
      return { success: false, message: "Email đã được sử dụng." };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...userData,
        password: hashedPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
        status: "ACTIVE",
        role: "user",
        favorites: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }),
    });

    return response.ok
      ? { success: true, message: "Đăng ký thành công!" }
      : { success: false, message: "Đăng ký thất bại." };
  } catch (error) {
    console.error("Register Error:", error);
    return { success: false, message: "Lỗi kết nối máy chủ." };
  }
};

// --- HÀM ĐĂNG NHẬP (CẬP NHẬT LOGIC JWT) ---
export const login = async (credentials: any): Promise<AuthResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users?email=${encodeURIComponent(credentials.email)}`
    );
    if (!response.ok)
      return { success: false, message: `Lỗi kết nối server (${response.status})` };

    const users = await response.json();

    if (users.length === 0)
      return { success: false, message: "Email không tồn tại." };

    const user = users[0];
    if (user.status !== "ACTIVE")
      return { success: false, message: "Tài khoản đang bị khóa." };

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    
    if (isMatch) {
      // --- THAY ĐỔI Ở ĐÂY: TẠO TOKEN JWT CHUẨN ---
      
      const jwtToken = await new SignJWT({ 
          role: user.role, 
          email: user.email 
        })
        .setProtectedHeader({ alg: 'HS256' }) // Thuật toán mã hóa
        .setSubject(user.id.toString())       // 'sub' là trường chuẩn để chứa ID user
        .setIssuedAt()                        // Thời điểm tạo
        .setExpirationTime('2h')              // Token hết hạn sau 2 giờ
        .sign(JWT_SECRET);                    // Ký bằng secret key

      return { success: true, user, token: jwtToken };
    }
    
    return { success: false, message: "Mật khẩu không chính xác." };
  } catch (error) {
    console.error("Login System Error:", error);
    return { success: false, message: "Có lỗi hệ thống xảy ra." };
  }
};