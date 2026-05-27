import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  colors: string[];
  sizes: string[];
  active: boolean;
  createdAt: number;
}

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  loading: boolean;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = "custom_shop_products";

// Produtos padrão de demonstração
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Caneca Personalizada Premium",
    description: "Caneca de cerâmica de alta qualidade com acabamento premium. Perfeita para presentes e personalização.",
    price: 49.90,
    category: "Canecas",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=500&h=500&fit=crop",
    stock: 25,
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    sizes: ["Único"],
    active: true,
    createdAt: Date.now(),
  },
  {
    id: "2",
    name: "Camiseta Básica Personalizada",
    description: "Camiseta 100% algodão com impressão de alta qualidade. Confortável e durável.",
    price: 79.90,
    category: "Camisetas",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    stock: 30,
    colors: ["#000000", "#FFFFFF", "#FF0000", "#0000FF"],
    sizes: ["P", "M", "G", "GG"],
    active: true,
    createdAt: Date.now(),
  },
  {
    id: "3",
    name: "Kit Presente Personalizado",
    description: "Kit completo com caneca, camiseta e acessórios. Ideal para presentes especiais.",
    price: 129.90,
    category: "Kits",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop",
    stock: 15,
    colors: ["#000000", "#FFFFFF"],
    sizes: ["Único"],
    active: true,
    createdAt: Date.now(),
  },
];

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos do localStorage na inicialização
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Se não houver produtos salvos, usar os padrões
        setProducts(DEFAULT_PRODUCTS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setProducts(DEFAULT_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Salvar produtos no localStorage sempre que mudarem
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, loading]);

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((product) => product.id === id);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        loading,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }
  return context;
}
