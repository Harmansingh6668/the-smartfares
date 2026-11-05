export type FaqItem = { question: string; answer: string };

export type Store = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  is_featured: boolean;
  is_popular: boolean;
  coupon_count: number;
  offer_count: number;
  about_content: string[] | null;
  saving_tips: string[] | null;
  support_tips: string[] | null;
  refund_policy: string | null;
  faq: FaqItem[] | null;
  primary_category_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
};

export type CouponType = "code" | "deal" | "offer";

export type Coupon = {
  id: string;
  store_id: string;
  category_id: string | null;
  title: string;
  description: string | null;
  code: string | null;
  discount_value: string | null;
  coupon_type: CouponType;
  affiliate_url: string;
  usage_count: number;
  is_verified: boolean;
  is_exclusive: boolean;
  is_featured: boolean;
  is_trending: boolean;
  is_active: boolean;
  expires_at: string | null;
  starts_at: string;
  created_at: string;
  updated_at: string;
};

export type CouponWithStore = Coupon & { store: Store; category: Category | null };

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  author: string;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Profile = {
  id: string;
  role: "admin" | "editor";
  created_at: string;
};
