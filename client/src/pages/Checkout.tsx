import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/contexts/CartContext";
import { calculateShipping, formatCurrency, saveLocalOrder } from "@/lib/shop";
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, itemCount, clearCart } = useCartContext();
  const shipping = calculateShipping(total);
  const grandTotal = total + shipping;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "pix",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (items.length === 0) {
      toast.error("Seu carrinho está vazio.");
      navigate("/produtos");
      return;
    }

    const order = {
      id: crypto.randomUUID(),
      number: `CS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "processing" as const,
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      },
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        state: formData.state.toUpperCase(),
        zipCode: formData.zipCode,
      },
      items,
      subtotal: total,
      shipping,
      total: grandTotal,
      paymentMethod: formData.paymentMethod,
    };

    saveLocalOrder(order);
    clearCart();
    toast.success(`Pedido ${order.number} confirmado com sucesso.`);
    navigate("/pedidos");
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
          <PackageCheck className="mx-auto mb-5 h-12 w-12 text-accent" />
          <h1 className="text-3xl font-black">Nenhum item para finalizar</h1>
          <p className="mt-3 text-muted-foreground">Adicione produtos personalizados ao carrinho antes de abrir o checkout.</p>
          <Button onClick={() => navigate("/produtos")} className="mt-6 rounded-full">Ir para produtos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex max-w-7xl items-center justify-between py-4">
          <button onClick={() => navigate("/carrinho")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Voltar ao carrinho
          </button>
          <div className="hidden items-center gap-2 text-sm font-semibold text-muted-foreground sm:flex">
            <ShieldCheck className="h-4 w-4 text-accent" /> Checkout seguro e revisável
          </div>
        </div>
      </header>

      <main className="container max-w-7xl py-10">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-accent">Finalização</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight">Confirme seu pedido.</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            Preencha seus dados e revise o resumo. Este checkout registra o pedido localmente para protótipo e demonstração.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_390px]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-3xl font-black">Dados pessoais</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input name="fullName" placeholder="Nome completo" value={formData.fullName} onChange={handleChange} required className="h-12 rounded-2xl" />
                <Input name="email" type="email" placeholder="E-mail" value={formData.email} onChange={handleChange} required className="h-12 rounded-2xl" />
                <Input name="phone" placeholder="Telefone" value={formData.phone} onChange={handleChange} required className="h-12 rounded-2xl md:col-span-2" />
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-3xl font-black">Endereço de entrega</h2>
              <div className="mt-6 grid gap-4">
                <Input name="address" placeholder="Rua, número e complemento" value={formData.address} onChange={handleChange} required className="h-12 rounded-2xl" />
                <div className="grid gap-4 md:grid-cols-[1fr_120px_180px]">
                  <Input name="city" placeholder="Cidade" value={formData.city} onChange={handleChange} required className="h-12 rounded-2xl" />
                  <Input name="state" placeholder="UF" value={formData.state} onChange={handleChange} required maxLength={2} className="h-12 rounded-2xl uppercase" />
                  <Input name="zipCode" placeholder="CEP" value={formData.zipCode} onChange={handleChange} required className="h-12 rounded-2xl" />
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <h2 className="text-3xl font-black">Pagamento</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Para evitar dados sensíveis em ambiente de demonstração, o site não coleta número de cartão. Integrações reais podem ser adicionadas depois com gateway seguro.
              </p>
              <label className="mt-5 block text-sm font-bold">Método preferido</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="pix">Pix na confirmação</option>
                <option value="card-link">Link de cartão enviado por e-mail</option>
                <option value="whatsapp">Combinar pelo WhatsApp</option>
              </select>
            </section>
          </div>

          <aside className="h-fit rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-3xl font-black">Resumo</h2>
            <div className="mt-6 space-y-4 border-b border-border pb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.productName} className="h-16 w-16 rounded-2xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold leading-tight">{item.productName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.quantity} un. · {item.customization.text || "Sem texto"}</p>
                  </div>
                  <strong className="text-sm">{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-b border-border pb-6 text-sm">
              <div className="flex justify-between"><span>Itens</span><strong>{itemCount}</strong></div>
              <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(total)}</strong></div>
              <div className="flex justify-between"><span>Frete</span><strong>{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</strong></div>
            </div>
            <div className="mt-6 flex items-center justify-between font-black">
              <span>Total</span>
              <span className="text-3xl text-accent">{formatCurrency(grandTotal)}</span>
            </div>

            <Button type="submit" className="mt-6 h-14 w-full rounded-full text-base font-black">
              <CreditCard className="mr-2 h-5 w-5" /> Confirmar pedido
            </Button>
            <div className="mt-5 rounded-2xl bg-secondary p-4 text-sm leading-6 text-muted-foreground">
              <p className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Ao confirmar, o pedido aparece em “Meus pedidos” com todos os itens personalizados.</p>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
