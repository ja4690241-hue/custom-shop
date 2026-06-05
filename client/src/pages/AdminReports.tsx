import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Calendar, DollarSign, ShoppingBag, CreditCard } from "lucide-react";
import { getLocalOrders, formatCurrency, type LocalOrder } from "@/lib/shop";

export default function AdminReports() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");

  useEffect(() => {
    setOrders(getLocalOrders());
  }, []);

  const getFilteredOrders = () => {
    const now = new Date();
    const startDate = new Date();

    if (period === "week") startDate.setDate(now.getDate() - 7);
    else if (period === "month") startDate.setMonth(now.getMonth() - 1);
    else startDate.setFullYear(now.getFullYear() - 1);

    return orders.filter(o => new Date(o.createdAt) >= startDate);
  };

  const filteredOrders = getFilteredOrders();
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalItems = filteredOrders.reduce((sum, o) => sum + o.items.length, 0);

  // Status breakdown
  const statusBreakdown = {
    pending: filteredOrders.filter(o => o.status === "pending").length,
    processing: filteredOrders.filter(o => o.status === "processing").length,
    shipped: filteredOrders.filter(o => o.status === "shipped").length,
    delivered: filteredOrders.filter(o => o.status === "delivered").length,
  };

  // Payment method breakdown
  const paymentBreakdown = {
    pix: filteredOrders.filter(o => o.paymentMethod === "pix").length,
    card: filteredOrders.filter(o => o.paymentMethod === "card").length,
    transfer: filteredOrders.filter(o => o.paymentMethod === "transfer").length,
  };

  // Daily revenue
  const dailyRevenue: Record<string, number> = {};
  filteredOrders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString("pt-BR");
    dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
  });

  const stats = [
    { label: "Receita Total", value: `R$ ${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Total Pedidos", value: totalOrders.toString(), icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: "Ticket Médio", value: `R$ ${averageOrder.toFixed(2)}`, icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
    { label: "Itens Vendidos", value: totalItems.toString(), icon: BarChart3, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Relatórios</h1>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["week", "month", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  period === p
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {p === "week" ? "Semana" : p === "month" ? "Mês" : "Ano"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Status Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              Status dos Pedidos
            </h2>
            <div className="space-y-6">
              {[
                { status: "Pendente", count: statusBreakdown.pending, color: "bg-slate-500" },
                { status: "Em Produção", count: statusBreakdown.processing, color: "bg-amber-500" },
                { status: "Enviado", count: statusBreakdown.shipped, color: "bg-blue-500" },
                { status: "Entregue", count: statusBreakdown.delivered, color: "bg-emerald-500" },
              ].map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{item.status}</span>
                      <p className="text-xs text-slate-400 font-bold">{item.count} pedidos</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" />
              Métodos de Pagamento
            </h2>
            <div className="space-y-6">
              {[
                { method: "PIX", count: paymentBreakdown.pix, color: "bg-blue-600" },
                { method: "Cartão", count: paymentBreakdown.card, color: "bg-purple-600" },
                { method: "Transferência", count: paymentBreakdown.transfer, color: "bg-orange-600" },
              ].map((item) => (
                <div key={item.method}>
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-sm font-bold text-slate-900">{item.method}</span>
                      <p className="text-xs text-slate-400 font-bold">{item.count} pedidos</p>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {totalOrders > 0 ? Math.round((item.count / totalOrders) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-1000`}
                      style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Revenue Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h2 className="text-xl font-black text-slate-900">Histórico de Receita</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-8 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                  <th className="px-8 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Faturamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(dailyRevenue)
                  .sort(([a], [b]) => new Date(b.split("/").reverse().join("-")).getTime() - new Date(a.split("/").reverse().join("-")).getTime())
                  .map(([date, revenue]) => (
                    <tr key={date} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 text-sm font-bold text-slate-900">{date}</td>
                      <td className="px-8 py-4 text-right font-black text-emerald-600">
                        R$ {revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                {Object.keys(dailyRevenue).length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-8 py-10 text-center text-slate-400 font-bold">
                      Nenhuma venda registrada no período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
