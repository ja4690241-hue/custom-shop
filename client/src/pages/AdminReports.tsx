import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, BarChart3, PieChart, Calendar } from "lucide-react";
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
    processing: filteredOrders.filter(o => o.status === "processing").length,
    shipped: filteredOrders.filter(o => o.status === "shipped").length,
    delivered: filteredOrders.filter(o => o.status === "delivered").length,
  };

  // Payment method breakdown
  const paymentBreakdown = {
    pix: filteredOrders.filter(o => o.paymentMethod === "pix").length,
    card: filteredOrders.filter(o => o.paymentMethod === "card").length,
    boleto: filteredOrders.filter(o => o.paymentMethod === "boleto").length,
  };

  // Daily revenue
  const dailyRevenue: Record<string, number> = {};
  filteredOrders.forEach(order => {
    const date = new Date(order.createdAt).toLocaleDateString("pt-BR");
    dailyRevenue[date] = (dailyRevenue[date] || 0) + order.total;
  });

  const stats = [
    { label: "Receita Total", value: `R$ ${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
    { label: "Número de Pedidos", value: totalOrders.toString(), icon: BarChart3, color: "text-blue-600 bg-blue-50" },
    { label: "Ticket Médio", value: `R$ ${averageOrder.toFixed(2)}`, icon: PieChart, color: "text-purple-600 bg-purple-50" },
    { label: "Itens Vendidos", value: totalItems.toString(), icon: Calendar, color: "text-orange-600 bg-orange-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-black text-slate-900">Relatórios de Vendas</h1>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Period Filter */}
        <div className="mb-8 flex gap-3">
          {(["week", "month", "year"] as const).map((p) => (
            <Button
              key={p}
              onClick={() => setPeriod(p)}
              variant={period === p ? "default" : "outline"}
              className={`rounded-lg ${
                period === p
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {p === "week" ? "Última Semana" : p === "month" ? "Último Mês" : "Último Ano"}
            </Button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`rounded-2xl border border-slate-200 ${stat.color} p-6 shadow-lg`}>
                <Icon className="w-8 h-8 mb-4 opacity-80" />
                <p className="text-sm font-semibold text-slate-600 mb-2">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2 mb-12">
          {/* Status Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-xl font-black text-slate-900 mb-6">Status dos Pedidos</h2>
            <div className="space-y-4">
              {[
                { status: "Em Produção", count: statusBreakdown.processing, color: "bg-amber-100 text-amber-900" },
                { status: "Enviado", count: statusBreakdown.shipped, color: "bg-blue-100 text-blue-900" },
                { status: "Entregue", count: statusBreakdown.delivered, color: "bg-emerald-100 text-emerald-900" },
              ].map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-slate-900">{item.status}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.color}`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === "Em Produção"
                          ? "bg-amber-500"
                          : item.status === "Enviado"
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <h2 className="text-xl font-black text-slate-900 mb-6">Métodos de Pagamento</h2>
            <div className="space-y-4">
              {[
                { method: "PIX", count: paymentBreakdown.pix, color: "bg-blue-100 text-blue-900" },
                { method: "Cartão", count: paymentBreakdown.card, color: "bg-purple-100 text-purple-900" },
                { method: "Boleto", count: paymentBreakdown.boleto, color: "bg-orange-100 text-orange-900" },
              ].map((item) => (
                <div key={item.method}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-slate-900">{item.method}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.color}`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.method === "PIX"
                          ? "bg-blue-500"
                          : item.method === "Cartão"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                      }`}
                      style={{ width: `${totalOrders > 0 ? (item.count / totalOrders) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Revenue Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="p-8 border-b border-slate-200">
            <h2 className="text-xl font-black text-slate-900">Receita Diária</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Data</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Receita</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dailyRevenue)
                  .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                  .map(([date, revenue]) => (
                    <tr key={date} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-semibold text-slate-900">{date}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">
                        R$ {revenue.toFixed(2)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
