import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Package, ShoppingCart, TrendingUp, Users, DollarSign, BarChart3, Settings, LogOut } from "lucide-react";
import { useProducts } from "@/contexts/ProductsContext";
import { getLocalOrders, type LocalOrder } from "@/lib/shop";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { products } = useProducts();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const localOrders = getLocalOrders();
    setOrders(localOrders);
    const revenue = localOrders.reduce((sum, order) => sum + order.total, 0);
    setTotalRevenue(revenue);
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalCustomers = new Set(orders.map(o => o.customer.email)).size;
  const pendingOrders = orders.filter(o => o.status === "processing").length;

  const stats = [
    { 
      label: "Receita Total", 
      value: `R$ ${totalRevenue.toFixed(2)}`, 
      icon: DollarSign, 
      color: "text-emerald-600 bg-emerald-50",
      border: "border-emerald-200"
    },
    { 
      label: "Produtos", 
      value: products.length.toString(), 
      icon: Package, 
      color: "text-blue-600 bg-blue-50",
      border: "border-blue-200"
    },
    { 
      label: "Pedidos", 
      value: orders.length.toString(), 
      icon: ShoppingCart, 
      color: "text-purple-600 bg-purple-50",
      border: "border-purple-200"
    },
    { 
      label: "Clientes", 
      value: totalCustomers.toString(), 
      icon: Users, 
      color: "text-orange-600 bg-orange-50",
      border: "border-orange-200"
    },
    { 
      label: "Estoque", 
      value: totalStock.toString(), 
      icon: BarChart3, 
      color: "text-pink-600 bg-pink-50",
      border: "border-pink-200"
    },
    { 
      label: "Valor em Estoque", 
      value: `R$ ${totalValue.toFixed(2)}`, 
      icon: TrendingUp, 
      color: "text-cyan-600 bg-cyan-50",
      border: "border-cyan-200"
    },
  ];

  const handleLogout = () => {
    toast.success("Desconectado com sucesso");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-2 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
            <h1 className="text-3xl font-black text-slate-900">Painel Administrativo</h1>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-slate-300 text-slate-600 hover:text-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-2xl border ${stat.border} ${stat.color} p-6 shadow-lg hover:shadow-xl transition`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-600 mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className="w-8 h-8 opacity-80" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/admin/produtos/novo")}
              className="h-12 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
            <Button
              onClick={() => navigate("/admin/produtos")}
              className="h-12 bg-slate-600 hover:bg-slate-700 rounded-lg"
            >
              <Package className="w-4 h-4 mr-2" />
              Gerenciar Produtos
            </Button>
            <Button
              onClick={() => navigate("/admin/pedidos")}
              className="h-12 bg-purple-600 hover:bg-purple-700 rounded-lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ver Pedidos ({pendingOrders})
            </Button>
            <Button
              onClick={() => navigate("/admin/configuracoes")}
              className="h-12 bg-slate-600 hover:bg-slate-700 rounded-lg"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Produtos */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Produtos</h2>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Gerencie todos os produtos da loja. Adicione, edite, remova itens e controle estoque.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/admin/produtos")}
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
              >
                Gerenciar Produtos
              </Button>
              <Button
                onClick={() => navigate("/admin/produtos/novo")}
                variant="outline"
                className="w-full h-11 border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>
          </div>

          {/* Pedidos */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Pedidos</h2>
              <ShoppingCart className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Visualize, acompanhe e gerencie todos os pedidos realizados pelos clientes.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate("/admin/pedidos")}
                className="w-full h-11 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
              >
                Ver Todos os Pedidos ({orders.length})
              </Button>
              {pendingOrders > 0 && (
                <Button
                  onClick={() => navigate("/admin/pedidos")}
                  variant="outline"
                  className="w-full h-11 border-orange-300 text-orange-600 hover:bg-orange-50 rounded-lg font-semibold"
                >
                  ⚠️ {pendingOrders} Pedido{pendingOrders > 1 ? "s" : ""} em Produção
                </Button>
              )}
            </div>
          </div>

          {/* Categorias */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Categorias</h2>
              <BarChart3 className="w-8 h-8 text-emerald-600" />
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Crie, edite e organize as categorias de produtos da loja.
            </p>
            <Button
              onClick={() => navigate("/admin/categorias")}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-semibold"
            >
              Gerenciar Categorias
            </Button>
          </div>

          {/* Relatórios */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-slate-900">Relatórios</h2>
              <TrendingUp className="w-8 h-8 text-cyan-600" />
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Visualize estatísticas de vendas, lucro e desempenho da loja.
            </p>
            <Button
              onClick={() => navigate("/admin/relatorios")}
              className="w-full h-11 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold"
            >
              Ver Relatórios
            </Button>
          </div>
        </div>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Pedidos Recentes</h2>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Pedido</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Cliente</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Total</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(-5).reverse().map((order) => (
                      <tr key={order.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                        <td className="px-6 py-4 font-mono text-sm font-semibold text-slate-900">{order.number}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{order.customer.fullName}</td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600">R$ {order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === "delivered" ? "bg-emerald-100 text-emerald-900" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-900" :
                            "bg-amber-100 text-amber-900"
                          }`}>
                            {order.status === "delivered" ? "Entregue" : order.status === "shipped" ? "Enviado" : "Em Produção"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
