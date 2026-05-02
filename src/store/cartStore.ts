import { create } from "zustand";

interface PaymentMethod {
  tipo: "efectivo" | "tarjeta" | "transferencia";
  monto: number;
  cambio?: number;
}

interface Product {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  codigo: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  payment: PaymentMethod | null;
  setPayment: (payment: PaymentMethod) => void;
  addItem: (product: Product) => void;
  removeItem: (product: number) => void;
  updateQuantity: (producId: number, quantity: number) => void;
  clearCart: () => void;
  calcularTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
  payment: null,
  addItem: (product, quantity = 1) => {
    const { items, calcularTotal } = get();

    const existingItem = items.find((item) => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ product, quantity });
    }

    set({ items: [...items] });
    calcularTotal();
  },
  clearCart: () => {
    set({ items: [], total: 0, payment: null });
  },

  setPayment: (payment) => set({ payment }),
  updateQuantity: (productId, quantity) => {
    const { items, calcularTotal } = get();

    const item = items.find((item) => item.product.id === productId);

    if (item && quantity > 0) {
      item.quantity = quantity;
      set({ items: [...items] });
      calcularTotal();
    }
  },

  removeItem: (productId) => {
    const { items, calcularTotal } = get();
    const updatedItems = items.filter((item) => item.product.id != productId);
    set({ items: updatedItems });
    calcularTotal();
  },

  calcularTotal: () => {
    const { items } = get();

    const total = items.reduce(
      (sum, item) => sum + item.product.precio * item.quantity,
      0
    );

    set({ total });
  },
}));
