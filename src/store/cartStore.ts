import { create } from "zustand";

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
  addItem: (product: Product) => void;
  calcularTotal: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  total: 0,
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
  calcularTotal: () => {
    const { items } = get();

    const total = items.reduce(
      (sum, item) => sum + item.product.precio * item.quantity,
      0
    );

    set({ total });
  },
}));
