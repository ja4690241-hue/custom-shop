import type { CartItem } from "@/hooks/useCart";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export type LocalOrderStatus = "processing" | "shipped" | "delivered";

export interface LocalOrder {
  id: string;
  number: string;
  createdAt: string;
  status: LocalOrderStatus;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
}

const ORDERS_KEY = "custom_shop_orders";

export function getLocalOrders(): LocalOrder[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalOrder(order: LocalOrder) {
  const orders = getLocalOrders();
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...orders]));
}

export const calculateShipping = (subtotal: number) => {
  if (subtotal <= 0) return 0;
  if (subtotal >= 199) return 0;
  return 19.9;
};

export const getColorLabel = (hex?: string) => {
  const colors: Record<string, string> = {
    "#ffffff": "Branco",
    "#f8fafc": "Off-white",
    "#111827": "Preto",
    "#000000": "Preto",
    "#d4af37": "Dourado",
    "#ef4444": "Vermelho",
    "#dc2626": "Vermelho",
    "#2563eb": "Azul",
    "#1e3a8a": "Azul marinho",
    "#7c2d12": "Café",
    "#0f766e": "Verde petróleo",
    "#f5f5dc": "Areia",
    "#64748b": "Cinza",
    "#7f1d1d": "Vinho",
    "#92400e": "Caramelo",
  };

  return hex ? colors[hex.toLowerCase()] ?? hex : "Não selecionada";
};
