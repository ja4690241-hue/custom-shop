import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, CheckCircle2, Truck, Package } from "lucide-react";
import { getLocalOrders, saveLocalOrder, formatCurrency, type LocalOrder } from "@/lib/shop";
import { toast } from "sonner";

export default function AdminOrders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<LocalOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<LocalOrder | null>(null);
  const [filter, setFilter] = useState<"all" | "processing" | "shipped" | "delivered">("all");

  useEffect(() => {
    setOrders(getLocalOrders());
  }, []);

  const filteredOrders = orders.filter(order => 
    filter === "all" ? true : order.status === filter
  );

  const updateOrderStatus = (orderId: string, newStatus: "processing" | "shipped" | "delivered") => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      saveLocalOrder(order);
      setOrders([...orders]);
      setSelectedOrder(order);
      toast.success(`Pedido atualizado para: ${
        newStatus === "delivered" ? "Entregue" :
        newStatus === "shipped" ? "Enviado" :
        "Em Produção"
      }`);
    }
  };

  const statusConfig = {
    processing: { label: "Em Produção", icon: Package, color: "bg-amber-100 text-amber-900", nextStatus: "shipped" as const },
    shipped: { label: "Enviado", icon: Truck, color: "bg-blue-100 text-blue-900", nextStatus: "delivered" as const },
    delivered: { label: "Entregue", icon: CheckCircle2, color: "bg-emerald-100 text-emerald-900", nextStatus: null },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-2 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-black text-slate-900">Gerenciar Pedidos</h1>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
          {(["all", "processing", "shipped", "delivered"] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? "default" : "outline"}
              className={`whitespace-nowrap rounded-lg ${
                filter === f
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {f === "all" ? "Todos" :
               f === "processing" ? "Em Produção" :
               f === "shipped" ? "Enviados" :
               "Entregues"}
              {f !== "all" && ` (${orders.filter(o => o.status === f).length})`}
            </Button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-lg">
                <Package className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900">Nenhum pedido encontrado</h3>
                <p className="mt-2 text-slate-600">Não há pedidos nesta categoria.</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const status = statusConfig[order.status];
                const StatusIcon = status.icon;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`rounded-2xl border-2 bg-white p-6 shadow-lg hover:shadow-xl transition cursor-pointer ${
                      selectedOrder?.id === order.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900">{order.number}</h3>
                        <p className="text-sm text-slate-600 mt-1">{order.customer.fullName}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${status.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600">
                          {order.items.length} item{order.items.length > 1 ? "ns" : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <p className="text-xl font-black text-blue-600">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Details */}
          {selectedOrder && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg h-fit lg:sticky lg:top-24">
              <h3 className="text-xl font-black text-slate-900 mb-6">Detalhes do Pedido</h3>

              {/* Customer Info */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Cliente</p>
                <p className="font-bold text-slate-900">{selectedOrder.customer.fullName}</p>
                <p className="text-sm text-slate-600 mt-1">{selectedOrder.customer.email}</p>
                <p className="text-sm text-slate-600">{selectedOrder.customer.phone}</p>
              </div>

              {/* Shipping Address */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Endereço</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedOrder.shippingAddress.address}<br />
                  {selectedOrder.shippingAddress.city}/{selectedOrder.shippingAddress.state} · CEP {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>

              {/* Items */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Itens</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex gap-2 text-sm">
                      <span className="font-semibold text-slate-900">{item.quantity}x</span>
                      <span className="text-slate-600">{item.productName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Frete</span>
                    <span className="font-semibold text-slate-900">{selectedOrder.shipping === 0 ? "Grátis" : formatCurrency(selectedOrder.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black">
                    <span className="text-slate-900">Total</span>
                    <span className="text-blue-600">{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-3">Atualizar Status</p>
                <div className="space-y-2">
                  {(["processing", "shipped", "delivered"] as const).map((status) => (
                    <Button
                      key={status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      className={`w-full h-10 rounded-lg text-sm font-semibold ${
                        selectedOrder.status === status
                          ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {status === "processing" ? "Em Produção" :
                       status === "shipped" ? "Marcar como Enviado" :
                       "Marcar como Entregue"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
