import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function Products() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products, isLoading } = trpc.products.list.useQuery({
    categoryId: selectedCategory,
    limit: 20,
    offset: 0,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-foreground">Nossos Produtos</h1>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-xl font-bold text-foreground mb-6">Categorias</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedCategory(undefined)}
                  className={`w-full text-left px-4 py-2 rounded transition-colors ${
                    selectedCategory === undefined
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  Todos os Produtos
                </button>
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded transition-colors ${
                      selectedCategory === category.id
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Products Grid */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="w-full aspect-square rounded-lg" />
                    <Skeleton className="w-full h-6" />
                    <Skeleton className="w-1/2 h-6" />
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/produtos/${product.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-lg bg-muted mb-4 aspect-square">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/produtos/${product.id}`);
                          }}
                          className="bg-accent text-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <ShoppingBag className="w-5 h-5 mr-2" />
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-foreground/60 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-accent font-bold text-xl">
                      R$ {parseFloat(product.price as any).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 text-lg">
                  Nenhum produto encontrado nesta categoria.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
