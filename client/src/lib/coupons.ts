export interface Coupon {
  code: string;
  discount: number; // percentual (ex: 10 para 10%)
  maxUses?: number;
  expiresAt?: string;
  active: boolean;
}

const COUPONS_KEY = "custom_shop_coupons";
const USED_COUPONS_KEY = "custom_shop_used_coupons";

// Cupons padrão (você pode editar esses valores)
const DEFAULT_COUPONS: Coupon[] = [
  {
    code: "PRIMEIRACOMPRA",
    discount: 15,
    maxUses: 100,
    active: true,
  },
  {
    code: "NATAL10",
    discount: 10,
    active: true,
  },
  {
    code: "VIP20",
    discount: 20,
    maxUses: 50,
    active: true,
  },
];

export function getCoupons(): Coupon[] {
  if (typeof window === "undefined") return DEFAULT_COUPONS;
  
  try {
    const stored = window.localStorage.getItem(COUPONS_KEY);
    if (!stored) {
      window.localStorage.setItem(COUPONS_KEY, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    return JSON.parse(stored);
  } catch {
    return DEFAULT_COUPONS;
  }
}

export function validateCoupon(code: string): { valid: boolean; discount?: number; message: string } {
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

  if (!coupon) {
    return { valid: false, message: "Cupom não encontrado" };
  }

  if (!coupon.active) {
    return { valid: false, message: "Cupom inativo" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: "Cupom expirado" };
  }

  // Verificar usos
  if (coupon.maxUses) {
    const usedCoupons = getUsedCoupons();
    const uses = usedCoupons.filter(c => c.code === coupon.code).length;
    if (uses >= coupon.maxUses) {
      return { valid: false, message: "Cupom atingiu o limite de usos" };
    }
  }

  return { valid: true, discount: coupon.discount, message: "Cupom válido!" };
}

export function getUsedCoupons(): { code: string; usedAt: string }[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = window.localStorage.getItem(USED_COUPONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function recordCouponUse(code: string) {
  const usedCoupons = getUsedCoupons();
  usedCoupons.push({
    code: code.toUpperCase(),
    usedAt: new Date().toISOString(),
  });
  window.localStorage.setItem(USED_COUPONS_KEY, JSON.stringify(usedCoupons));
}

export function saveCoupons(coupons: Coupon[]) {
  window.localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
}
