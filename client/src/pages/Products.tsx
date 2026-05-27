import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/shop";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { useProducts } from "@/contexts/ProductsContext";

const getInitialCategorySlug = () => {
  if (typeof window === "undefined") return "todos";
  return new URLSearchParams(window.location.search).get("categoria") ?? "todos";
};

export default function Products() {
  const [, navigate] = useLocation();
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(getInitialCategorySlug);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const { products, loading: isLoading } = useProducts();

  // Extrair categorias únicas dos produtos
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)));
    return uniqueCategories.map((name, idx) => ({
      id: idx + 1,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [products]);

  const selectedCategory = categories.find((category) => category.slug === selectedCategorySlug);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const searched = products
      .filter((product) => product.active)
      .filter((product) => {
        if (selectedCategorySlug !== "todos" && product.category.toLowerCase().replace(/\s+/g, "-") !== selectedCategorySlug) {
          return false;
        }
        if (!normalizedQuery) return true;
        return `${product.name} ${product.description ?? ""}`.toLowerCase().includes(normalizedQuery);
      });

    return [...searched].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "stock") return b.stock - a.stock;
      return 0;
    });
  }, [products, query, sort, selectedCategorySlug]);

  const handleCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
    const url = slug === "todos" ? "/produtos" : `/produtos?categoria=${slug}`;
    window.history.replaceState(null, "", url);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Voltar para início
          </button>
          <Button onClick={() => navigate("/carrinho")} className="rounded-full">
            Ver carrinho
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl py-10">
        <section className="mb-10 overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-sm transition-smooth hover:shadow-lg md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div className="animate-fade-in-up">
              <Badge className="mb-5 rounded-full bg-accent/15 px-4 py-2 text-accent-foreground hover:bg-accent/20">
                <Sparkles className="mr-2 h-4 w-4" /> Catálogo personalizável
              </Badge>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Produtos para criar algo único.</h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                Filtre por categoria, busque pelo produto ideal e abra o editor para escolher texto, cor, tamanho e quantidade com preço atualizado em tempo real.
              </p>
            </div>
            <div className="rounded-3xl bg-secondary p-5 animate-slide-in-right">
              <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <SlidersHorizontal className="h-5 w-5 text-accent" /> Recomendações aplicadas
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Busca clara, filtros visíveis, cards com preço e estoque, e CTA direcionado para personalização reduzem fricção na jornada de compra.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8 grid gap-4 rounded-[1.7rem] border border-border bg-card p-4 shadow-sm lg:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por caneca, camiseta, kit ou presente..."
              className="h-12 rounded-full pl-12"
            />
          </label>
          <select
            value={selectedCategorySlug}
            onChange={(event) => handleCategory(event.target.value)}
            className="h-12 rounded-full border border-input bg-background px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todos">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="h-12 rounded-full border border-input bg-background px-4 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="featured">Destaques</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="stock">Maior estoque</option>
          </select>
        </section>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[420px] rounded-[1.7rem]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-border bg-card p-12 text-center">
            <h2 className="text-3xl font-black">Nenhum produto encontrado</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Tente remover filtros ou buscar por outro termo. Novas opções de personalização podem ser adicionadas pelo painel administrativo.
            </p>
            <Button onClick={() => { setQuery(""); handleCategory("todos"); }} className="mt-6 rounded-full">
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, idx) => {
                  const category = categories.find((item) => item.name === product.category);
              return (
                <button
                  key={product.id}
                  onClick={() => navigate(`/produtos/${product.id}`)}
                  className="group overflow-hidden rounded-[1.8rem] border border-border bg-card text-left shadow-sm transition-smooth hover:-translate-y-1 hover:border-accent hover:shadow-2xl"
                  style={{animationDelay: `${idx * 0.05}s`}}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-smooth duration-500 group-hover:scale-110" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                      <Badge className="rounded-full text-xs sm:text-sm">{category?.name ?? "Personalizável"}</Badge>
                      {product.stock <= 15 && <Badge variant="secondary" className="rounded-full text-xs sm:text-sm">Últimas unidades</Badge>}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h2 className="text-xl font-black tracking-tight sm:text-2xl">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 min-h-12 text-xs leading-6 text-muted-foreground sm:mt-3 sm:text-sm">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4 sm:mt-6 sm:pt-5">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">A partir de</span>
                        <strong className="block text-xl text-accent sm:text-2xl">{formatCurrency(Number(product.price))}</strong>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-foreground px-3 py-2 text-xs font-bold text-background transition-smooth group-hover:gap-1 sm:px-4 sm:py-2 sm:text-sm">
                        Personalizar <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5 sm:ml-2 sm:h-4 sm:w-4" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
