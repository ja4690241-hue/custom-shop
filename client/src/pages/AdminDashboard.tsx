import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Plus, Package, ShoppingCart, TrendingUp, Users, 
  DollarSign, BarChart3, Settings, LogOut, Tag, Clock, CheckCircle2
} from "lucide-react";
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
  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "processing").length;
  const completedOrders = orders.filter(o => o.status === "delivered").length;

  const stats = [
    { 
      label: "Faturamento Total", 
      value: `R$ ${totalRevenue.toFixed(2)}`, 
      icon: DollarSign, 
      color: "text-emerald-600 bg-emerald-50",
      border: "border-emerald-200"
    },
    { 
      label: "Pedidos Ativos", 
      value: pendingOrders.toString(), 
      icon: Clock, 
      color: "text-amber-600 bg-amber-50",
      border: "border-amber-200"
    },
    { 
      label: "Pedidos Entregues", 
      value: completedOrders.toString(), 
      icon: CheckCircle2, 
      color: "text-blue-600 bg-blue-50",
      border: "border-blue-200"
    },
    { 
      label: "Total de Produtos", 
      value: products.length.toString(), 
      icon: Package, 
      color: "text-purple-600 bg-purple-50",
      border: "border-purple-200"
    },
    { 
      label: "Base de Clientes", 
      value: totalCustomers.toString(), 
      icon: Users, 
      color: "text-orange-600 bg-orange-50",
      border: "border-orange-200"
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Painel de Controle</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-slate-600"
            >
              Ver Loja
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-10">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Olá, Administrador! 👋</h2>
          <p className="text-slate-500">Aqui está o resumo do que está acontecendo na sua loja hoje.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-2xl border ${stat.border} bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main Actions */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produtos */}
            <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                  <Package className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-3xl font-black text-slate-200 group-hover:text-blue-100 transition-colors">01</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Produtos</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Gerencie seu catálogo completo. Adicione novos itens, controle estoque e preços.</p>
              <div className="flex flex-col gap-2">
                <Button onClick={() => navigate("/admin/produtos")} className="w-full bg-slate-900 hover:bg-blue-600 h-11 rounded-xl font-bold">Gerenciar Todos</Button>
                <Button onClick={() => navigate("/admin/produtos/novo")} variant="outline" className="w-full border-slate-200 h-11 rounded-xl font-bold">Novo Produto</Button>
              </div>
            </div>

            {/* Pedidos */}
            <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                  <ShoppingCart className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-3xl font-black text-slate-200 group-hover:text-purple-100 transition-colors">02</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Pedidos</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Acompanhe suas vendas em tempo real e atualize o status de entrega para seus clientes.</p>
              <Button onClick={() => navigate("/admin/pedidos")} className="w-full bg-slate-900 hover:bg-purple-600 h-11 rounded-xl font-bold">Ver Pedidos ({orders.length})</Button>
            </div>

            {/* Categorias */}
            <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors duration-300">
                  <Tag className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-100 transition-colors">03</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Categorias</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Organize sua loja criando e editando categorias para facilitar a navegação dos clientes.</p>
              <Button onClick={() => navigate("/admin/categorias")} className="w-full bg-slate-900 hover:bg-emerald-600 h-11 rounded-xl font-bold">Gerenciar Categorias</Button>
            </div>

            {/* Relatórios */}
            <div className="group bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:border-cyan-200 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 transition-colors duration-300">
                  <BarChart3 className="w-7 h-7 text-cyan-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <span className="text-3xl font-black text-slate-200 group-hover:text-cyan-100 transition-colors">04</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Relatórios</h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">Análise detalhada de faturamento, lucro e produtos mais vendidos da sua loja.</p>
              <Button onClick={() => navigate("/admin/relatorios")} className="w-full bg-slate-900 hover:bg-cyan-600 h-11 rounded-xl font-bold">Ver Relatórios</Button>
            </div>
          </div>

          {/* Sidebar / Recent Activity */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-fit">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              Últimos Pedidos
            </h3>
            <div className="space-y-6">
              {orders.slice(-4).reverse().map((order) => (
                <div key={order.id} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate("/admin/pedidos")}>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    #{order.number.slice(-3)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{order.customer.fullName}</p>
                    <p className="text-xs font-bold text-emerald-600">R$ {order.total.toFixed(2)}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    order.status === "delivered" ? "bg-emerald-500" :
                    order.status === "shipped" ? "bg-blue-500" : "bg-amber-500"
                  }`} />
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-slate-400 text-sm text-center py-4">Nenhum pedido realizado ainda.</p>
              )}
            </div>
            <Button 
              onClick={() => navigate("/admin/pedidos")}
              variant="ghost" 
              className="w-full mt-8 text-slate-500 font-bold hover:text-blue-600"
            >
              Ver Todos os Pedidos
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
