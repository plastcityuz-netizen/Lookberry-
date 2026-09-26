export type CategoryId = 'all' | 'qulupnay' | 'shokolad' | 'kruassan' | 'mevali' | 'gift' | 'bestseller';

export type SortId = 'popular' | 'cheap' | 'expensive' | 'new';

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  shortIngredients: string;
  ingredients: string[];
  description: string;
  category: Exclude<CategoryId, 'all' | 'bestseller'>;
  tags: string[];
  badge?: string;
  popular: boolean;
  isNew: boolean;
  available: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type DeliveryType = 'delivery' | 'pickup';

export type CheckoutForm = {
  name: string;
  phone: string;
  delivery: DeliveryType;
  address: string;
  day: string;
  time: string;
  comment: string;
};

export type OrderProductInput = {
  productId: string;
  quantity: number;
};

export type OrderStatus = 'Yangi' | 'Qabul qilindi' | 'Tayyorlanmoqda' | 'Yetkazilmoqda' | 'Yetkazildi' | 'Bekor qilindi';

export type OrderRecord = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    address?: string;
  };
  delivery: DeliveryType;
  deliveryLabel: string;
  day: string;
  time: string;
  comment?: string;
  products: Array<{
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    lineTotal: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
};

export type SiteSettings = {
  deliveryFee: number;
  city: string;
  deliveryNote: string;
  orderStartHour: string;
  orderEndHour: string;
};
