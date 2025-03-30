export interface Product {
    id: string
    name: string;
    price: number;
    images: string[];
    colors: string[];
    sizes : {
      size: string;
      quantity : number
    }[];
    discount : number;
    description? : string;
    category : string;
    stock : number;
    tags : string[];
  }

interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    size: string | null;
    price: number;
    product: Product;
}

interface Address {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    country: string | null;
    pincode: string;
    landmark: string | null;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: string
    paymentStatus: string;
    paymentMethod: string | null;
    addressId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
    address: Address;
    state : string;
    user? : {
      id : string;
      name : string;
      email? : string;
      phone : string;
    }
}
