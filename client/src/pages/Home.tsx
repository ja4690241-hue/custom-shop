import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCartContext } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { ShoppingBag, Sparkles } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCartContext();
  const { data: categories } = trpc.categories.list.useQuery();
  const { data: featuredProducts } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">Custom Shop</h1>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/produtos")}
              className="text-foreground hover:text-accent transition-colors"
            >
              Produtos
            </button>
            {user ? (
              <>
                <button
                  onClick={() => navigate("/pedidos")}
                  className="text-foreground hover:text-accent transition-colors"
                >
                  Meus Pedidos
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => navigate("/admin")}
                    className="text-foreground hover:text-accent transition-colors"
                  >
                    Admin
                  </button>
                )}
              </>
            ) : null}
            <button
              onClick={() => navigate("/carrinho")}
              className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity relative"
            >
              <ShoppingBag className="w-5 h-5" />
              Carrinho
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-foreground/5 to-accent/10 py-24">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-6xl font-bold text-foreground mb-6">
            Produtos Personalizados com Elegância
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Canecas e camisetas exclusivas, personalizadas especialmente para você. Qualidade premium em cada detalhe.
          </p>
          <Button
            onClick={() => navigate("/produtos")}
            className="bg-accent text-accent-foreground px-8 py-3 text-lg hover:opacity-90"
          >
            Explorar Produtos
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 border-b border-border">
        <div className="container max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-foreground mb-12 text-center">
            Categorias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories?.map((category) => (
              <button
                key={category.id}
                onClick={() => navigate(`/produtos?categoria=${category.slug}`)}
                className="group relative overflow-hidden rounded-lg bg-card border border-border p-8 hover:border-accent transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-foreground mb-2">
                    {category.name}
                  </h4>
                  <p className="text-foreground/60 mb-4">{category.description}</p>
                  <span className="text-accent font-semibold">Ver produtos →</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h3 className="text-4xl font-bold text-foreground mb-12 text-center">
            Produtos em Destaque
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product) => (
              <button
                key={product.id}
                onClick={() => navigate(`/produtos/${product.id}`)}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg bg-muted mb-4 aspect-square">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h4>
                <p className="text-accent font-bold text-xl">
                  R$ {parseFloat(product.price as any).toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12 mt-16">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h5 className="font-bold text-foreground mb-4">Sobre</h5>
              <p className="text-foreground/60">
                Custom Shop oferece produtos personalizados de alta qualidade.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-4">Links</h5>
              <ul className="space-y-2 text-foreground/60">
                <li>
                  <button
                    onClick={() => navigate("/produtos")}
                    className="hover:text-accent transition-colors"
                  >
                    Produtos
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-foreground mb-4">Contato</h5>
              <p className="text-foreground/60">
                Email: contato@customshop.com
                <br />
                Telefone: (11) 9999-9999
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-foreground/60">
            <p>&copy; 2026 Custom Shop. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
