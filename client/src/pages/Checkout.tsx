import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartContext } from "@/contexts/CartContext";
import { calculateShipping, formatCurrency, saveLocalOrder } from "@/lib/shop";
import { ArrowLeft, CheckCircle2, CreditCard, PackageCheck, ShieldCheck, QrCode, Copy, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PixPayment } from "@/components/PixPayment";
import { CardPayment } from "@/components/CardPayment";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, total, itemCount, clearCart } = useCartContext();
  const shipping = calculateShipping(total);
  const grandTotal = total + shipping;
  const [copied, setCopied] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    neighborhood: "",
    complement: "",
    city: "",
    state: "",
    zipCode: "",
    cpf: "",
    paymentMethod: "pix",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Formato de e-mail inválido";
    if (!formData.phone.trim()) newErrors.phone = "Telefone de contato é obrigatório";
    if (!formData.street.trim()) newErrors.street = "Nome da rua/avenida é obrigatório";
    if (!formData.number.trim()) newErrors.number = "Número é obrigatório";
    if (!formData.neighborhood.trim()) newErrors.neighborhood = "Bairro é obrigatório";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.state.trim() || formData.state.length !== 2) newErrors.state = "Estado (UF) é obrigatório (2 letras)";
    if (!formData.zipCode.trim()) newErrors.zipCode = "CEP é obrigatório";
    // CPF obrigatório para todos os métodos para garantir consistência com Mercado Pago
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório para processar o pedido";
    else if (formData.cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = "CPF deve conter 11 dígitos";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
      .slice(0, 14);
  };

  const formatCEP = (value: string) => {
    const cleanValue = value.replace(/\D/g, "");
    return cleanValue
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = event.target;
    let { value } = event.target;
    
    if (name === "cpf") {
      value = formatCPF(value);
    } else if (name === "zipCode") {
      value = formatCEP(value);
      const cleanCep = value.replace(/\D/g, "");
      if (cleanCep.length === 8) {
        fetchAddress(cleanCep);
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro ao digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const fetchAddress = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          street: data.logradouro || prev.street,
          neighborhood: data.bairro || prev.neighborhood,
          city: data.localidade || prev.city,
          state: data.uf || prev.state,
        }));
        
        setErrors((prev) => ({
          ...prev,
          street: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        }));
        
        toast.success("Endereço preenchido automaticamente!");
      } else {
        setErrors((prev) => ({ ...prev, zipCode: "CEP não encontrado" }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const handleCepBlur = () => {
    const cleanCep = formData.zipCode.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      fetchAddress(cleanCep);
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
        address: `${formData.street}, ${formData.number}${formData.complement ? ` - ${formData.complement}` : ""} - ${formData.neighborhood}`,
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

    if (formData.paymentMethod === "pix" && !showPix) {
      // Garantir que o CPF vá apenas com números
      const cleanOrder = {
        ...order,
        cpf: formData.cpf.replace(/\D/g, '')
      };
      setConfirmedOrder(cleanOrder);
      setShowPix(true);
      toast.info("Gere o QR Code para pagar via PIX");
      return;
    }

    setIsProcessing(true);
    
    // Simular processamento
    setTimeout(() => {
      saveLocalOrder(order);
      clearCart();
      setIsProcessing(false);
      toast.success(`Pedido ${order.number} confirmado com sucesso.`);
      navigate("/pedidos");
    }, 2000);
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
                <div className="md:col-span-2">
                  <Input 
                    name="cpf" 
                    placeholder="CPF (apenas números)" 
                    value={formData.cpf} 
                    onChange={handleChange}
                    maxLength={14}
                    className={`h-12 rounded-lg border-slate-300 ${errors.cpf ? "border-red-500" : ""}`}
                  />
                  {errors.cpf && <p className="text-xs text-red-600 mt-1">{errors.cpf}</p>}
                  <p className="text-[10px] text-slate-500 mt-1">O CPF é obrigatório para a emissão do pagamento e segurança da transação.</p>
                </div>
              </div>
            </section>

            {/* Endereço */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-black text-slate-900 mb-6">Endereço de entrega</h2>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-[140px_1fr]">
                  <div>
                    <Input 
                      name="zipCode" 
                      placeholder="CEP" 
                      value={formData.zipCode} 
                      onChange={handleChange}
                      onBlur={handleCepBlur}
                      className={`h-12 rounded-lg border-slate-300 ${errors.zipCode ? "border-red-500" : ""}`}
                    />
                    {errors.zipCode && <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>}
                  </div>
                  <div className="flex items-center text-[10px] text-slate-500">
                    Digite o CEP para preencher o endereço automaticamente.
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_100px]">
                  <div>
                    <Input 
                      name="street" 
                      placeholder="Rua / Avenida" 
                      value={formData.street} 
                      onChange={handleChange}
                      className={`h-12 rounded-lg border-slate-300 ${errors.street ? "border-red-500" : ""}`}
                    />
                    {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
                  </div>
                  <div>
                    <Input 
                      name="number" 
                      placeholder="Número" 
                      value={formData.number} 
                      onChange={handleChange}
                      className={`h-12 rounded-lg border-slate-300 ${errors.number ? "border-red-500" : ""}`}
                    />
                    {errors.number && <p className="text-xs text-red-600 mt-1">{errors.number}</p>}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input 
                      name="neighborhood" 
                      placeholder="Bairro" 
                      value={formData.neighborhood} 
                      onChange={handleChange}
                      className={`h-12 rounded-lg border-slate-300 ${errors.neighborhood ? "border-red-500" : ""}`}
                    />
                    {errors.neighborhood && <p className="text-xs text-red-600 mt-1">{errors.neighborhood}</p>}
                  </div>
                  <div>
                    <Input 
                      name="complement" 
                      placeholder="Complemento (opcional)" 
                      value={formData.complement} 
                      onChange={handleChange}
                      className="h-12 rounded-lg border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_100px]">
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
                      placeholder="UF" 
                      value={formData.state} 
                      onChange={handleChange}
                      maxLength={2}
                      className={`h-12 rounded-lg border-slate-300 uppercase ${errors.state ? "border-red-500" : ""}`}
                    />
                    {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
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
                  { value: "transfer", label: "Transferência Bancária", desc: "Direto para sua conta" },
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

              {/* Transferência Bancária */}
              {formData.paymentMethod === "transfer" && (
                <div className="mt-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-sm font-semibold text-slate-900 mb-4">Dados para Transferência Bancária:</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Banco:</span>
                      <span className="font-bold text-slate-900">Nu Pagamentos S.A. (Nubank)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Agência:</span>
                      <span className="font-bold text-slate-900">0001</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Conta:</span>
                      <span className="font-bold text-slate-900">68014024-6</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-emerald-200">
                      <span className="text-slate-600">Valor:</span>
                      <span className="text-lg font-bold text-emerald-600">{formatCurrency(grandTotal)}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-emerald-700 bg-white/50 p-3 rounded-lg">
                    ⚠️ Após realizar a transferência, clique em "Confirmar pedido" para finalizar sua compra. Seu pedido será processado assim que recebermos o pagamento.
                  </p>
                </div>
              )}

              {/* Cartão de Crédito */}
              {formData.paymentMethod === "card" && (
                <div className="mt-6">
                  <CardPayment
                    amount={grandTotal}
                    orderId={`CS-${Date.now().toString().slice(-6)}`}
                    customerEmail={formData.email}
                    customerCPF={formData.cpf}
                    customerName={formData.fullName}
                    onSuccess={() => {
                      const order = {
                        id: crypto.randomUUID(),
                        number: `CS-${Date.now().toString().slice(-6)}`,
                        createdAt: new Date().toISOString(),
                        status: "processing",
                        customer: {
                          fullName: formData.fullName,
                          email: formData.email,
                          phone: formData.phone,
                        },
                        shippingAddress: {
                          street: formData.street,
                          number: formData.number,
                          neighborhood: formData.neighborhood,
                          complement: formData.complement,
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
                      navigate("/pedidos");
                    }}
                  />
                </div>
              )}

              {/* PIX Details */}
              {formData.paymentMethod === "pix" && showPix && confirmedOrder && (
                <div className="mt-6">
                  <PixPayment 
                    amount={grandTotal} 
                    orderId={confirmedOrder.number}
                    customerName={formData.fullName}
                    customerEmail={formData.email}
                    customerCpf={formData.cpf}
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      saveLocalOrder(confirmedOrder);
                      clearCart();
                      toast.success("Pagamento confirmado!");
                      navigate("/pedidos");
                    }}
                    className="w-full mt-4 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                  >
                    Já realizei o pagamento
                  </Button>
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

            <Button 
              type="submit" 
              disabled={isProcessing || (formData.paymentMethod === "pix" && showPix)}
              className="w-full h-12 rounded-lg text-base font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
            >
              {isProcessing ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processando...</>
              ) : formData.paymentMethod === "pix" && !showPix ? (
                "Gerar PIX e Confirmar"
              ) : (
                "Confirmar pedido"
              )}
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
