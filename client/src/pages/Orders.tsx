import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getLocalOrders, type LocalOrder } from "@/lib/shop";
import { ArrowLeft, Box, CalendarDays, PackageCheck, ShoppingBag, Truck } from "lucide-react";

const statusConfig = {
  processing: { label: "Em produção", className: "bg-amber-100 text-amber-900 hover:bg-amber-100" },
  shipped: { label: "Enviado", className: "bg-blue-100 text-blue-900 hover:bg-blue-100" },
  delivered: { label: "Entregue", className: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100" },
};

export default function Orders() {
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState<LocalOrder[]>([]);

  useEffect(() => {
    setOrders(getLocalOrders());
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex max-w-7xl items-center justify-between py-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Voltar ao início
          </button>
          <Button onClick={() => navigate("/produtos")} className="rounded-full">Comprar novamente</Button>
        </div>
      </header>

      <main className="container max-w-7xl py-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Pedidos</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">Histórico de compras.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Acompanhe os pedidos gerados neste navegador, incluindo itens, personalizações, valores e endereço de entrega.
          </p>
        </div>

        {orders.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-5 h-14 w-14 text-accent" />
            <h2 className="text-3xl font-black">Nenhum pedido registrado</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Finalize uma compra para ver o resumo completo do seu pedido aqui.
            </p>
            <Button onClick={() => navigate("/produtos")} className="mt-6 rounded-full px-8">Explorar produtos</Button>
          </section>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = statusConfig[order.status];
              return (
                <article key={order.id} className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-col gap-5 border-b border-border pb-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-black">Pedido {order.number}</h2>
                        <Badge className={`rounded-full ${status.className}`}>{status.label}</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {new Date(order.createdAt).toLocaleDateString("pt-BR")}</span>
                        <span className="flex items-center gap-2"><Box className="h-4 w-4" /> {order.items.length} item(ns)</span>
                        <span className="flex items-center gap-2"><Truck className="h-4 w-4" /> {order.shipping === 0 ? "Frete grátis" : formatCurrency(order.shipping)}</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                      <strong className="text-3xl text-accent">{formatCurrency(order.total)}</strong>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex gap-4 rounded-2xl bg-secondary p-4">
                          <img src={item.image} alt={item.productName} className="h-20 w-20 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h3 className="font-black">{item.productName}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Qtd. {item.quantity} · {formatCurrency(item.price)} cada</p>
                            <p className="mt-1 text-xs text-muted-foreground">Texto: {item.customization.text || "Sem texto"} · Tamanho: {item.customization.size || "Único"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-border p-5">
                      <h3 className="text-xl font-black">Entrega</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {order.customer.fullName}<br />
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}/{order.shippingAddress.state} · CEP {order.shippingAddress.zipCode}
                      </p>
                      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-secondary p-4 text-sm font-semibold">
                        <PackageCheck className="h-5 w-5 text-accent" /> Pedido registrado com sucesso.
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
