import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/contexts/CartContext";
import { calculateShipping, formatCurrency, getColorLabel } from "@/lib/shop";
import { ArrowLeft, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";

export default function Cart() {
  const [, navigate] = useLocation();
  const { items, removeItem, updateQuantity, total, itemCount } = useCartContext();
  const shipping = calculateShipping(total);
  const grandTotal = total + shipping;
  const freeShippingRemaining = Math.max(0, 199 - total);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex max-w-7xl items-center justify-between py-4">
          <button onClick={() => navigate("/produtos")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Continuar comprando
          </button>
          <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">Início</Button>
        </div>
      </header>

      <main className="container max-w-7xl py-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Carrinho</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">Revise sua personalização.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Confira textos, cores, tamanhos, quantidades e valores antes de finalizar o pedido.
          </p>
        </div>

        {items.length === 0 ? (
          <section className="rounded-[2rem] border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-10 w-10 text-accent" />
            </div>
            <h2 className="text-3xl font-black">Seu carrinho está vazio</h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Escolha uma caneca, camiseta ou kit e monte uma versão exclusiva no editor de personalização.
            </p>
            <Button onClick={() => navigate("/produtos")} className="mt-6 rounded-full px-8">Ver produtos</Button>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <section className="space-y-4">
              {items.map((item) => (
                <article key={item.id} className="grid gap-5 rounded-[1.8rem] border border-border bg-card p-5 shadow-sm md:grid-cols-[150px_1fr_auto]">
                  <div className="aspect-square overflow-hidden rounded-[1.3rem] bg-muted">
                    <img src={item.image} alt={item.productName} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">{item.productName}</h2>
                    <div className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                      <span><strong className="text-foreground">Texto:</strong> {item.customization.text || "Sem texto"}</span>
                      <span><strong className="text-foreground">Cor:</strong> {getColorLabel(item.customization.color)}</span>
                      <span><strong className="text-foreground">Tamanho:</strong> {item.customization.size || "Único"}</span>
                      <span><strong className="text-foreground">Unitário:</strong> {formatCurrency(item.price)}</span>
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:border-accent" type="button">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-10 w-12 items-center justify-center rounded-xl bg-secondary font-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-border hover:border-accent" type="button">
                        <Plus className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeItem(item.id)} className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-destructive hover:underline" type="button">
                        <Trash2 className="h-4 w-4" /> Remover
                      </button>
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Subtotal</p>
                    <strong className="mt-2 block text-2xl text-accent">{formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-3xl font-black">Resumo do pedido</h2>
              <div className="mt-6 space-y-4 border-b border-border pb-6">
                <div className="flex justify-between text-sm"><span>Itens</span><strong>{itemCount}</strong></div>
                <div className="flex justify-between text-sm"><span>Subtotal</span><strong>{formatCurrency(total)}</strong></div>
                <div className="flex justify-between text-sm"><span>Frete</span><strong>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</strong></div>
                {freeShippingRemaining > 0 && (
                  <div className="rounded-2xl bg-secondary p-4 text-sm text-muted-foreground">
                    Faltam <strong className="text-foreground">{formatCurrency(freeShippingRemaining)}</strong> para frete grátis.
                  </div>
                )}
              </div>
              <div className="mt-6 flex items-center justify-between text-lg font-black">
                <span>Total</span>
                <span className="text-3xl text-accent">{formatCurrency(grandTotal)}</span>
              </div>
              <Button onClick={() => navigate("/checkout")} className="mt-6 h-14 w-full rounded-full text-base font-black">
                Finalizar compra
              </Button>
              <div className="mt-5 space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Dados revisados antes da confirmação.</p>
                <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Produção sob pedido em até 3 dias úteis.</p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
