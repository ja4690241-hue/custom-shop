import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCartContext } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { formatCurrency } from "@/lib/shop";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Palette,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";

const benefits = [
  { icon: Palette, title: "Preview sob medida", description: "Escolha texto, cor e tamanho antes de comprar." },
  { icon: ShieldCheck, title: "Qualidade premium", description: "Materiais selecionados e acabamento profissional." },
  { icon: Truck, title: "Frete grátis", description: "Em pedidos a partir de R$ 199,00." },
  { icon: Clock, title: "Produção rápida", description: "Pedido preparado em até 3 dias úteis." },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCartContext();
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const { data: featuredProducts = [] } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="container flex max-w-7xl items-center justify-between py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-lg shadow-accent/20">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="text-left">
              <strong className="block text-xl tracking-tight">Custom Shop</strong>
              <span className="hidden text-xs text-muted-foreground sm:block">Produtos únicos, feitos para você</span>
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => navigate("/produtos")} className="text-sm font-medium hover:text-accent">
              Catálogo
            </button>
            <a href="#como-funciona" className="text-sm font-medium hover:text-accent">
              Como funciona
            </a>
            <a href="#destaques" className="text-sm font-medium hover:text-accent">
              Mais vendidos
            </a>
            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")} className="text-sm font-medium hover:text-accent">
                Admin
              </button>
            )}
            <button onClick={() => navigate("/pedidos")} className="text-sm font-medium hover:text-accent">
              Pedidos
            </button>
          </div>

          <Button onClick={() => navigate("/carrinho")} className="relative rounded-full px-5">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Carrinho
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-foreground px-1.5 text-xs font-bold text-background">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.22),transparent_34%),linear-gradient(135deg,rgba(17,24,39,0.04),transparent_40%)]" />
          <div className="container grid max-w-7xl gap-12 py-16 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
            <div className="flex flex-col justify-center animate-fade-in-up">
              <Badge className="mb-6 w-fit rounded-full bg-accent/15 px-4 py-2 text-accent-foreground hover:bg-accent/20">
                <Star className="mr-2 h-4 w-4 fill-current" /> Loja de presentes personalizados
              </Badge>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Crie produtos personalizados com visual de marca premium.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Canecas, camisetas e kits feitos para presentear, divulgar sua empresa ou eternizar uma ideia. Escolha o produto, personalize no editor e revise tudo no carrinho.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button onClick={() => navigate("/produtos")} size="lg" className="rounded-full px-8 text-base">
                  Começar personalização
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button onClick={() => navigate("/produtos")} size="lg" variant="outline" className="rounded-full px-8 text-base">
                  Ver catálogo completo
                </Button>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-border pt-6">
                <div>
                  <strong className="block text-3xl">4.9</strong>
                  <span className="text-xs text-muted-foreground">avaliação média</span>
                </div>
                <div>
                  <strong className="block text-3xl">3 dias</strong>
                  <span className="text-xs text-muted-foreground">produção média</span>
                </div>
                <div>
                  <strong className="block text-3xl">100%</strong>
                  <span className="text-xs text-muted-foreground">feito sob pedido</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl animate-slide-in-right">
              <div className="absolute -left-6 top-12 z-10 rounded-3xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur animate-scale-in" style={{animationDelay: '0.2s'}}>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Preview</p>
                <p className="mt-1 text-sm font-bold">Texto + cor + tamanho</p>
              </div>
              <div className="rounded-[2.2rem] border border-border bg-card p-5 shadow-2xl shadow-accent/10 transition-smooth hover:shadow-accent/20">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] bg-muted">
                    <img
                      src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85"
                      alt="Camiseta personalizada"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-background/90 px-5 py-2 text-sm font-black shadow-xl">
                      SUA MARCA
                    </span>
                  </div>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] bg-muted sm:mt-12">
                    <img
                      src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85"
                      alt="Caneca personalizada"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-6 top-8 rounded-2xl bg-accent px-4 py-2 text-sm font-black text-accent-foreground shadow-xl">
                      Presente único
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="border-b border-border/70 bg-secondary/40 py-12">
          <div className="container grid max-w-7xl gap-4 md:grid-cols-4">
            {benefits.map((benefit, idx) => (
              <div key={benefit.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-smooth hover:shadow-lg hover:border-accent/50 hover:-translate-y-1" style={{animationDelay: `${idx * 0.1}s`}}>
                <benefit.icon className="mb-4 h-7 w-7 text-accent transition-smooth group-hover:scale-110" />
                <h2 className="text-xl font-bold">{benefit.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Categorias</p>
                <h2 className="mt-3 text-4xl font-black">Escolha o tipo de criação</h2>
              </div>
              <Button onClick={() => navigate("/produtos")} variant="outline" className="rounded-full">
                Ver todos
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/produtos?categoria=${category.slug}`)}
                  className="group rounded-[2rem] border border-border bg-card p-7 text-left shadow-sm transition hover:-translate-y-1 hover:border-accent hover:shadow-xl"
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-black">{category.name}</h3>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-muted-foreground">{category.description}</p>
                  <span className="mt-7 inline-flex items-center text-sm font-bold text-accent">
                    Explorar categoria <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="destaques" className="bg-foreground text-background py-16">
          <div className="container max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Mais pedidos</p>
                <h2 className="mt-3 text-4xl font-black">Produtos prontos para personalizar</h2>
              </div>
              <p className="max-w-lg text-sm leading-6 text-background/70">
                Cards com preço, estoque e chamada clara para abrir o editor de customização, inspirado nas melhores práticas de e-commerce.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/produtos/${product.id}`)}
                  className="group overflow-hidden rounded-[1.7rem] bg-background text-left text-foreground shadow-xl"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                    <Badge className="absolute left-4 top-4 rounded-full">Personalizável</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-xl font-black">{product.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Produção sob pedido</p>
                    <div className="mt-5 flex items-center justify-between">
                      <strong className="text-xl text-accent">{formatCurrency(Number(product.price))}</strong>
                      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container max-w-7xl">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-sm md:p-12">
              <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Garantia de clareza</p>
                  <h2 className="mt-3 text-4xl font-black">Você revisa a personalização antes de finalizar.</h2>
                  <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
                    O carrinho guarda cada detalhe escolhido: texto, cor, tamanho, quantidade e preço final. Assim, a compra fica transparente do primeiro clique até a confirmação.
                  </p>
                </div>
                <div className="space-y-3">
                  {["Preço atualizado em tempo real", "Resumo completo no checkout", "Histórico local de pedidos", "Design responsivo para celular"].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-secondary p-4">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <span className="font-semibold">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-secondary/40 py-10">
        <div className="container flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <strong className="text-xl">Custom Shop</strong>
            <p className="mt-2 text-sm text-muted-foreground">Produtos personalizados com experiência premium de compra.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <button onClick={() => navigate("/produtos")} className="hover:text-accent">Produtos</button>
            <button onClick={() => navigate("/carrinho")} className="hover:text-accent">Carrinho</button>
            <button onClick={() => navigate("/pedidos")} className="hover:text-accent">Pedidos</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
