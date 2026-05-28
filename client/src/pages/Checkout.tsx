import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/contexts/CartContext";
import { calculateShipping, formatCurrency, saveLocalOrder } from "@/lib/shop";
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ShieldCheck, QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, itemCount, clearCart } = useCartContext();
  const shipping = calculateShipping(total);
  const grandTotal = total + shipping;
  const [copied, setCopied] = useState(false);
  const [showPix, setShowPix] = useState(false);
  
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "E-mail inválido";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.state.trim() || formData.state.length !== 2) newErrors.state = "UF inválida";
    if (!formData.zipCode.trim()) newErrors.zipCode = "CEP é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

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

  const pixKey = "12345678901234567890123456789012";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.brcode0136${pixKey}520400005303986540510.005802BR5913CUSTOM%20SHOP6009SAO%20PAULO62410503***63041D3D`;

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    toast.success("Chave PIX copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg">
          <PackageCheck className="mx-auto mb-5 h-12 w-12 text-slate-400" />
          <h1 className="text-3xl font-black text-slate-900">Carrinho vazio</h1>
          <p className="mt-3 text-slate-600">Adicione produtos antes de finalizar a compra.</p>
          <Button onClick={() => navigate("/produtos")} className="mt-6 rounded-full bg-blue-600 hover:bg-blue-700">Ir para produtos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="container flex max-w-7xl items-center justify-between py-4 px-4">
          <button onClick={() => navigate("/carrinho")} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition">
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-600 sm:flex">
            <ShieldCheck className="h-4 w-4 text-blue-600" /> Checkout seguro
          </div>
        </div>
      </header>

      <main className="container max-w-7xl py-10 px-4">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">Finalização</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900">Confirme seu pedido</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Preencha seus dados e escolha a forma de pagamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Dados pessoais</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Input 
                    name="fullName" 
                    placeholder="Nome completo" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className={`h-12 rounded-lg border-slate-300 ${errors.fullName ? "border-red-500" : ""}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Input 
                    name="email" 
                    type="email" 
                    placeholder="E-mail" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={`h-12 rounded-lg border-slate-300 ${errors.email ? "border-red-500" : ""}`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <Input 
                    name="phone" 
                    placeholder="(11) 99999-9999" 
                    value={formData.phone} 
                    onChange={handleChange}
                    className={`h-12 rounded-lg border-slate-300 ${errors.phone ? "border-red-500" : ""}`}
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
              </div>
            </section>

            {/* Endereço */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Endereço de entrega</h2>
              <div className="space-y-4">
                <div>
                  <Input 
                    name="address" 
                    placeholder="Rua, número e complemento" 
                    value={formData.address} 
                    onChange={handleChange}
                    className={`h-12 rounded-lg border-slate-300 ${errors.address ? "border-red-500" : ""}`}
                  />
                  {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                </div>
                <div className="grid gap-4 md:grid-cols-[1fr_120px_140px]">
                  <div>
                    <Input 
                      name="city" 
                      placeholder="Cidade" 
                      value={formData.city} 
                      onChange={handleChange}
                      className={`h-12 rounded-lg border-slate-300 ${errors.city ? "border-red-500" : ""}`}
                    />
                    {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <Input 
                      name="state" 
                      placeholder="SP" 
                      value={formData.state} 
                      onChange={handleChange}
                      maxLength={2}
                      className={`h-12 rounded-lg border-slate-300 uppercase ${errors.state ? "border-red-500" : ""}`}
                    />
                    {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <Input 
                      name="zipCode" 
                      placeholder="12345-678" 
                      value={formData.zipCode} 
                      onChange={handleChange}
                      className={`h-12 rounded-lg border-slate-300 ${errors.zipCode ? "border-red-500" : ""}`}
                    />
                    {errors.zipCode && <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>}
                  </div>
                </div>
              </div>
            </section>

            {/* Pagamento */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Método de pagamento</h2>
              <div className="space-y-3">
                {[
                  { value: "pix", label: "PIX (Recomendado)", desc: "Instantâneo e seguro" },
                  { value: "card", label: "Cartão de Crédito", desc: "Parcelado em até 12x" },
                  { value: "boleto", label: "Boleto", desc: "Vencimento em 3 dias" },
                ].map((method) => (
                  <label key={method.value} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition ${
                    formData.paymentMethod === method.value
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method.value} 
                      checked={formData.paymentMethod === method.value} 
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{method.label}</p>
                      <p className="text-xs text-slate-600">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* PIX Details */}
              {formData.paymentMethod === "pix" && !showPix && (
                <Button
                  type="button"
                  onClick={() => setShowPix(true)}
                  variant="outline"
                  className="w-full mt-4 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Ver QR Code PIX
                </Button>
              )}

              {formData.paymentMethod === "pix" && showPix && (
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-semibold text-slate-900 mb-3">Dados para pagamento PIX:</p>
                  <div className="flex gap-2 mb-3">
                    <Input value={pixKey} readOnly className="text-xs font-mono bg-white border-slate-300" />
                    <Button
                      type="button"
                      onClick={copyPixKey}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <img src={qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 mx-auto rounded-lg" />
                </div>
              )}
            </section>
          </div>

          {/* Resumo */}
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-lg lg:sticky lg:top-24">
            <h2 className="text-2xl font-black text-slate-900 mb-6">Resumo</h2>
            <div className="space-y-3 border-b border-slate-200 pb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <img src={item.image} alt={item.productName} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm leading-tight">{item.productName}</p>
                    <p className="mt-1 text-xs text-slate-600">{item.quantity}x · {item.customization.text || "Sem texto"}</p>
                  </div>
                  <strong className="text-sm text-slate-900">{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-b border-slate-200 pb-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Itens</span>
                <strong className="text-slate-900">{itemCount}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <strong className="text-slate-900">{formatCurrency(total)}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Frete</span>
                <strong className="text-slate-900">{shipping === 0 ? "Grátis" : formatCurrency(shipping)}</strong>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between font-black mb-6">
              <span className="text-slate-900">Total</span>
              <span className="text-3xl text-blue-600">{formatCurrency(grandTotal)}</span>
            </div>

            <Button type="submit" className="w-full h-12 rounded-lg text-base font-black bg-blue-600 hover:bg-blue-700">
              <CreditCard className="mr-2 h-5 w-5" /> Confirmar pedido
            </Button>

            <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900">
              <p className="flex gap-2"><CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5" /> Pedido seguro e protegido</p>
            </div>
          </aside>
        </form>
      </main>
    </div>
  );
}
