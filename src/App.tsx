// App.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "./store/slices/favoriteSlice";
import { getAuthToken, fetchUserProfile } from "./services/auth.service";
import { setUser, setLoading } from "./store/slices/authSlice"; // <--- GIỮ NGUYÊN
import type { AppDispatch, RootState } from "./store";
import RouterSetup from "./RouterSetup";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy user từ authSlice như cũ
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const rawUser = await fetchUserProfile(token);
          if (rawUser) {
            // --- CHỈ SỬA ĐOẠN NÀY ĐỂ FIX LỖI REDUX ---
            // Convert Date sang String trước khi lưu vào Redux
            const serializedUser = {
              ...rawUser,
              created_at:
                typeof rawUser.created_at === "object"
                  ? new Date(rawUser.created_at).toISOString()
                  : rawUser.created_at,
              updated_at:
                typeof rawUser.updated_at === "object"
                  ? new Date(rawUser.updated_at).toISOString()
                  : rawUser.updated_at,
            };
            // ------------------------------------------
            dispatch(setUser(serializedUser));
          } else {
            dispatch(setUser(null));
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setLoading(false));
      }
    };
    initAuth();
  }, [dispatch]);

  // Logic lấy favorite giữ nguyên
  useEffect(() => {
    if (user && user.id && user.id !== "") {
      dispatch(fetchFavorites());
    }
  }, [dispatch, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
      </div>
    );
  }

  return <RouterSetup />;
}

export default App;
