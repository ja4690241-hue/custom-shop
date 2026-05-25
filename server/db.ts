import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  categories,
  cartItems,
  orders,
  orderItems,
  type Category,
  type Product,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

const now = new Date();

const demoCategories: Category[] = [
  {
    id: 1,
    name: "Canecas personalizadas",
    slug: "canecas",
    description: "Canecas premium para presentes, empresas e momentos especiais.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Camisetas exclusivas",
    slug: "camisetas",
    description: "Camisetas confortáveis com estampas, nomes e mensagens únicas.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Kits presenteáveis",
    slug: "kits",
    description: "Combinações prontas para surpreender com embalagem especial.",
    createdAt: now,
    updatedAt: now,
  },
];

const demoProducts: Product[] = [
  {
    id: 1,
    categoryId: 1,
    name: "Caneca Signature 325ml",
    description:
      "Caneca cerâmica premium com acabamento brilhante, ideal para nomes, frases e artes minimalistas.",
    price: "49.90",
    imageUrl:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=1200&q=85",
    imageKey: "demo/mug-signature.jpg",
    availableColors: JSON.stringify(["#ffffff", "#111827", "#d4af37", "#ef4444", "#2563eb"]),
    availableSizes: JSON.stringify(["Único"]),
    stock: 42,
    active: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    categoryId: 2,
    name: "Camiseta Premium Cotton",
    description:
      "Camiseta 100% algodão penteado, toque macio e modelagem moderna para estampas personalizadas.",
    price: "89.90",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85",
    imageKey: "demo/tshirt-premium.jpg",
    availableColors: JSON.stringify(["#ffffff", "#111827", "#f8fafc", "#dc2626", "#0f766e"]),
    availableSizes: JSON.stringify(["P", "M", "G", "GG"]),
    stock: 28,
    active: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    categoryId: 1,
    name: "Caneca Mágica Termossensível",
    description:
      "Caneca que revela a arte com líquido quente, perfeita para presentes memoráveis e campanhas criativas.",
    price: "69.90",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85",
    imageKey: "demo/mug-magic.jpg",
    availableColors: JSON.stringify(["#111827", "#7c2d12", "#1e3a8a"]),
    availableSizes: JSON.stringify(["Único"]),
    stock: 18,
    active: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    categoryId: 2,
    name: "Camiseta Oversized Creator",
    description:
      "Peça oversized de alto padrão para marcas pessoais, eventos, squads e coleções exclusivas.",
    price: "119.90",
    imageUrl:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=85",
    imageKey: "demo/tshirt-oversized.jpg",
    availableColors: JSON.stringify(["#111827", "#f5f5dc", "#64748b", "#7f1d1d"]),
    availableSizes: JSON.stringify(["P", "M", "G", "GG", "XG"]),
    stock: 14,
    active: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    categoryId: 3,
    name: "Kit Café com Afeto",
    description:
      "Kit com caneca personalizada, embalagem premium e cartão com mensagem para datas especiais.",
    price: "129.90",
    imageUrl:
      "https://images.unsplash.com/photo-1521302080334-4bebac2763a6?auto=format&fit=crop&w=1200&q=85",
    imageKey: "demo/gift-kit.jpg",
    availableColors: JSON.stringify(["#ffffff", "#d4af37", "#92400e"]),
    availableSizes: JSON.stringify(["Único"]),
    stock: 21,
    active: 1,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    categoryId: 3,
    name: "Combo Marca Criativa",
    description:
      "Camiseta e caneca coordenadas para empresas, creators e pequenos negócios com identidade visual consistente.",
    price: "179.90",
    imageUrl:
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=1200&q=85",
    imageKey: "demo/brand-combo.jpg",
    availableColors: JSON.stringify(["#111827", "#ffffff", "#d4af37", "#0f766e"]),
    availableSizes: JSON.stringify(["P", "M", "G", "GG"]),
    stock: 12,
    active: 1,
    createdAt: now,
    updatedAt: now,
  },
];

const activeDemoProducts = () => demoProducts.filter((product) => product.active === 1);

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getProducts(limit?: number, offset = 0) {
  const db = await getDb();
  if (!db) {
    const list = activeDemoProducts();
    return typeof limit === "number" ? list.slice(offset, offset + limit) : list.slice(offset);
  }

  const baseQuery = db.select().from(products).where(eq(products.active, 1));

  if (typeof limit === "number") {
    return baseQuery.limit(limit).offset(offset);
  }

  return baseQuery;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return activeDemoProducts().find((product) => product.id === id);

  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductsByCategory(categoryId: number) {
  const db = await getDb();
  if (!db) return activeDemoProducts().filter((product) => product.categoryId === categoryId);

  return await db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.active, 1)));
}

// Category queries
export async function getCategories() {
  const db = await getDb();
  if (!db) return demoCategories;

  return await db.select().from(categories);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return demoCategories.find((category) => category.slug === slug);

  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Cart queries
export async function getCartItems(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

// Order queries
export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}
