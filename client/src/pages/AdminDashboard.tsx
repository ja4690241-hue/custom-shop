import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const stats = [
    { label: "Produtos", value: "24", icon: Package, color: "text-blue-500" },
    { label: "Pedidos", value: "156", icon: ShoppingCart, color: "text-green-500" },
    { label: "Vendas", value: "R$ 12.450", icon: TrendingUp, color: "text-accent" },
  ];

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
          <h1 className="text-4xl font-bold text-foreground">Painel Administrativo</h1>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground/60 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Produtos */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Produtos</h2>
              <Package className="w-6 h-6 text-accent" />
            </div>
            <p className="text-foreground/60 mb-6">
              Gerencie todos os produtos da loja. Adicione, edite ou remova itens.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => navigate("/admin/produtos")}
                className="w-full bg-accent text-accent-foreground"
              >
                Gerenciar Produtos
              </Button>
              <Button
                onClick={() => navigate("/admin/produtos/novo")}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>

          {/* Pedidos */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Pedidos</h2>
              <ShoppingCart className="w-6 h-6 text-accent" />
            </div>
            <p className="text-foreground/60 mb-6">
              Visualize e gerencie todos os pedidos realizados pelos clientes.
            </p>
            <Button
              onClick={() => navigate("/admin/pedidos")}
              className="w-full bg-accent text-accent-foreground"
            >
              Ver Pedidos
            </Button>
          </div>

          {/* Categorias */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Categorias</h2>
              <Package className="w-6 h-6 text-accent" />
            </div>
            <p className="text-foreground/60 mb-6">
              Crie e gerencie as categorias de produtos.
            </p>
            <Button
              onClick={() => navigate("/admin/categorias")}
              className="w-full bg-accent text-accent-foreground"
            >
              Gerenciar Categorias
            </Button>
          </div>

          {/* Configurações */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <p className="text-foreground/60 mb-6">
              Configure as opções gerais da loja.
            </p>
            <Button
              onClick={() => navigate("/admin/configuracoes")}
              className="w-full bg-accent text-accent-foreground"
            >
              Acessar Configurações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
