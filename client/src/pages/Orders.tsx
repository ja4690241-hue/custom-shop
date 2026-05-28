import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getLocalOrders, type LocalOrder } from "@/lib/shop";
import { ArrowLeft, Box, CalendarDays, PackageCheck, ShoppingBag, Truck, CheckCircle2, Clock, Zap } from "lucide-react";

const statusConfig = {
  processing: { label: "Em produção", icon: Zap, className: "bg-amber-100 text-amber-900 border-amber-300" },
  shipped: { label: "Enviado", icon: Truck, className: "bg-blue-100 text-blue-900 border-blue-300" },
  delivered: { label: "Entregue", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-900 border-emerald-300" },
};

export default function Orders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<LocalOrder[]>([]);

  useEffect(() => {
    setOrders(getLocalOrders());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container flex max-w-7xl items-center justify-between py-4 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <Button onClick={() => navigate("/produtos")} className="rounded-full bg-blue-600 hover:bg-blue-700">Comprar novamente</Button>
        </div>
      </header>

      <main className="container max-w-7xl py-10 px-4">
        <div className="mb-12">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">Pedidos</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-slate-900">Histórico de compras</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Acompanhe todos os seus pedidos, personalizações, valores e status de entrega.
          </p>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-lg">
            <ShoppingBag className="mx-auto mb-5 h-14 w-14 text-slate-400" />
            <h2 className="text-3xl font-black text-slate-900">Nenhum pedido registrado</h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-600">
              Finalize uma compra para ver o resumo completo do seu pedido aqui.
            </p>
            <Button onClick={() => navigate("/produtos")} className="mt-6 rounded-full px-8 bg-blue-600 hover:bg-blue-700">Explorar produtos</Button>
          </section>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <article key={order.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg hover:shadow-xl transition">
                  <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-black text-slate-900">Pedido {order.number}</h2>
                        <Badge className={`rounded-full border ${status.className}`}>
                          <StatusIcon className="mr-2 h-4 w-4" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-blue-600" /> 
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="flex items-center gap-2">
                          <Box className="h-4 w-4 text-blue-600" /> 
                          {order.items.length} item{order.items.length > 1 ? "ns" : ""}
                        </span>
                        <span className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-600" /> 
                          {order.shipping === 0 ? "Frete grátis" : formatCurrency(order.shipping)}
                        </span>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Total</p>
                      <strong className="text-3xl text-blue-600">{formatCurrency(order.total)}</strong>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-4">Itens do pedido</h3>
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 hover:border-blue-300 transition">
                          <img src={item.image} alt={item.productName} className="h-20 w-20 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h3 className="font-bold text-slate-900">{item.productName}</h3>
                            <p className="mt-1 text-sm text-slate-600">Qtd. {item.quantity} · {formatCurrency(item.price)} cada</p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                              {item.customization.text && <span className="px-2 py-1 bg-blue-50 rounded text-blue-700">Texto: {item.customization.text}</span>}
                              {item.customization.size && <span className="px-2 py-1 bg-blue-50 rounded text-blue-700">Tamanho: {item.customization.size}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-6">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
                        <Truck className="h-5 w-5 text-blue-600" />
                        Endereço de Entrega
                      </h3>
                      <p className="text-sm leading-6 text-slate-700">
                        <strong className="text-slate-900">{order.customer.fullName}</strong><br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}/{order.shippingAddress.state} · CEP {order.shippingAddress.zipCode}
                      </p>
                      <div className="mt-5 flex items-center gap-2 rounded-lg bg-blue-100 border border-blue-300 p-4 text-sm font-semibold text-blue-900">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> 
                        Pedido registrado com sucesso
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
