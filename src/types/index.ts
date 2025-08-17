export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  rating?: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
