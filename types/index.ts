export interface User {
  id: number;
  email: string;
  name: string;
  username: string | null;
  phone: string | null;
  address: string | null;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
}

export interface ProductImage {
  id: number;
  url: string;
  publicId: string;
  isMain: boolean;
}

export interface ProductVariant {
  id: number;
  productId: number;
  color: string | null;
  storage: string | null;
  ram: string | null;
  cpu: string | null;
  version: string | null;
  originalPrice: number;
  salePrice: number;
  stock: number;
  sold: number;
  imageUrl: string | null;
  imagePublicId: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  brand: string;
  categoryId: number;
  isActive: boolean;
  createdAt: string;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
  avgRating?: number;
  reviewCount?: number;
  minSalePrice?: number;
  maxSalePrice?: number;
}

export interface Banner {
  id: number;
  productId: number;
  imageUrl: string;
  publicId: string;
  isActive: boolean;
  product: {
    id: number;
    name: string;
    slug: string;
    images: ProductImage[];
  };
}

export interface ReviewUser {
  id: number;
  name: string;
}

export interface ReviewLike {
  id: number;
  userId: number;
  isLike: boolean;
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
  likeCount: number;
  dislikeCount: number;
  likes: ReviewLike[];
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  variantId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    brand: string;
    images: ProductImage[];
  };
  variant: ProductVariant;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED";
export type PaymentMethod = "VNPAY" | "COD";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: { id: number; name: string; slug: string; images: ProductImage[] };
  variant: ProductVariant;
}

export interface Order {
  id: number;
  code: string;
  status: OrderStatus;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  isPaid: boolean;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  coupon?: { code: string };
}

export interface WishlistItem {
  id: number;
  productId: number;
  product: Product;
}

export interface CanReviewResult {
  canReview: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
}
