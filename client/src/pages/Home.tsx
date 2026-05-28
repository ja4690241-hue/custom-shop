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
  Zap,
} from "lucide-react";

const benefits = [
  { icon: Palette, title: "Personalização Completa", description: "Escolha cores, tamanhos e adicione seu texto personalizado." },
  { icon: Zap, title: "IA para Sugestões", description: "Deixe a IA sugerir designs baseado no seu estilo." },
  { icon: ShieldCheck, title: "Qualidade Premium", description: "Materiais selecionados e acabamento profissional." },
  { icon: Truck, title: "Frete Rápido", description: "Entrega em até 7 dias úteis para todo Brasil." },
  { icon: Clock, title: "Produção Rápida", description: "Seu pedido fica pronto em até 3 dias úteis." },
  { icon: CheckCircle2, title: "Garantia Total", description: "Satisfação garantida ou seu dinheiro de volta." },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { itemCount } = useCartContext();
  const { data: categories = [] } = trpc.categories.list.useQuery();
  const { data: featuredProducts = [] } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container flex max-w-7xl items-center justify-between py-4 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-3 hover:opacity-80 transition">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="text-left">
              <strong className="block text-xl tracking-tight text-slate-900">Custom Shop</strong>
              <span className="hidden text-xs text-slate-600 sm:block">Produtos únicos, feitos para você</span>
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button onClick={() => navigate("/produtos")} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Catálogo
            </button>
            <a href="#beneficios" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Por que escolher
            </a>
            <a href="#destaques" className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Destaques
            </a>
            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
                Admin
              </button>
            )}
            <button onClick={() => navigate("/pedidos")} className="text-sm font-medium text-slate-700 hover:text-blue-600 transition">
              Meus Pedidos
            </button>
          </div>

          <Button onClick={() => navigate("/carrinho")} className="relative rounded-full px-5 bg-blue-600 hover:bg-blue-700">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Carrinho
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          </div>

          <div className="container grid max-w-7xl gap-12 py-20 lg:grid-cols-2 lg:py-32 px-4">
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                <Star className="mr-2 h-4 w-4 fill-current" /> Loja de presentes personalizados
              </Badge>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl text-slate-900">
                Crie produtos únicos com sua marca
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                Personalize bonés, camisetas, moletons e muito mais. Nossa ferramenta com IA ajuda você a encontrar o estilo perfeito. Escolha, personalize, compre e receba em casa.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Button onClick={() => navigate("/produtos")} size="lg" className="rounded-full px-8 text-base bg-blue-600 hover:bg-blue-700">
                  Começar Personalização
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button onClick={() => navigate("/produtos")} size="lg" variant="outline" className="rounded-full px-8 text-base border-slate-300 text-slate-900 hover:bg-slate-50">
                  Ver Catálogo Completo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-2xl opacity-20" />
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 shadow-xl">
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <ShoppingBag className="h-24 w-24 text-blue-600 mx-auto mb-4 opacity-20" />
                    <p className="text-slate-600 font-medium">Sua criação aqui</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-16 bg-white border-t border-slate-200">
            <div className="container max-w-7xl px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-12">Categorias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => navigate(`/produtos?categoria=${cat.slug}`)}
                    className="p-6 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition text-left group"
                  >
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition">{cat.name}</h3>
                    <p className="text-sm text-slate-600 mt-2">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section id="beneficios" className="py-20 bg-gradient-to-b from-slate-50 to-white">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Por que escolher a Custom Shop?</h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">Oferecemos a melhor experiência de personalização com qualidade e rapidez</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <div key={idx} className="p-8 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-lg transition bg-white">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                        <p className="text-slate-600 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section id="destaques" className="py-20 bg-white border-t border-slate-200">
            <div className="container max-w-7xl px-4">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-slate-900">Produtos em Destaque</h2>
                  <p className="text-slate-600 mt-2">Confira nossos produtos mais populares</p>
                </div>
                <Button onClick={() => navigate("/produtos")} variant="outline" className="hidden sm:flex">
                  Ver Todos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => navigate(`/produto/${product.id}`)}
                    className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 hover:shadow-xl transition bg-white"
                  >
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <ShoppingBag className="h-16 w-16 text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">{product.name}</h3>
                      <p className="text-2xl font-bold text-blue-600 mt-2">R$ {parseFloat(product.price).toFixed(2)}</p>
                      <p className="text-sm text-slate-600 mt-1">{product.stock} em estoque</p>
                    </div>
                  </button>
                ))}
              </div>

              <Button onClick={() => navigate("/produtos")} size="lg" className="w-full mt-8 rounded-full bg-blue-600 hover:bg-blue-700 sm:hidden">
                Ver Todos os Produtos
              </Button>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="container max-w-7xl px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Pronto para criar algo único?</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Escolha um produto, personalize com a ajuda da IA e receba em casa em poucos dias.
            </p>
            <Button onClick={() => navigate("/produtos")} size="lg" className="rounded-full px-8 bg-white text-blue-600 hover:bg-blue-50">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-white mb-4">Custom Shop</h3>
              <p className="text-sm">Produtos personalizados de qualidade premium</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/produtos?categoria=bones")} className="hover:text-white transition">Bonés</button></li>
                <li><button onClick={() => navigate("/produtos?categoria=camisetas")} className="hover:text-white transition">Camisetas</button></li>
                <li><button onClick={() => navigate("/produtos?categoria=moletons")} className="hover:text-white transition">Moletons</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Contato</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Políticas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Termos</a></li>
                <li><a href="#" className="hover:text-white transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2026 Custom Shop. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
