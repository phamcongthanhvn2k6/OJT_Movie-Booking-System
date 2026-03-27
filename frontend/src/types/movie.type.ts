export type MovieType = "2D" | "3D";

export interface Movie {
  id: string;
  title: string;
  description?: string;
  author?: string;
  image?: string;
  trailer?: string;
  type: MovieType;
  genre?: string; // thêm thể loại phim
  country?: string;
  actors?: string;
  duration: number; // Tính bằng phút
  release_date: Date;
  created_at: Date;
  updated_at: Date;
}
