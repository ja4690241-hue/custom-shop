import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useCartContext } from "@/contexts/CartContext";
import { useProducts } from "@/contexts/ProductsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, getColorLabel } from "@/lib/shop";
import { ArrowLeft, CheckCircle2, Minus, Plus, RotateCcw, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

const calculateCustomizationPrice = (text: string, color: string, size: string) => {
  let price = 0;
  if (text.trim()) price += 15;
  if (color && color.toLowerCase() !== "#ffffff" && color.toLowerCase() !== "#000000") price += 5;
  if (size && size !== "Único") price += 10;
  return price;
};

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/produtos/:id");
  const productId = params?.id;

  const { addItem } = useCartContext();
  const { products, loading: isLoading } = useProducts();
  
  const product = useMemo(() => {
    if (!productId) return undefined;
    return products.find(p => p.id === productId);
  }, [products, productId]);

  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const availableColors = useMemo(() => product?.colors || [], [product?.colors]);
  const availableSizes = useMemo(() => product?.sizes || [], [product?.sizes]);

  useEffect(() => {
    if (!selectedColor && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  useEffect(() => {
    if (!selectedSize && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  const customizationPrice = calculateCustomizationPrice(customText, selectedColor, selectedSize);
  const basePrice = Number(product?.price ?? 0);
  const unitPrice = basePrice + customizationPrice;
  const totalPrice = unitPrice * quantity;
  const stock = product?.stock ?? 0;

  const resetCustomization = () => {
    setCustomText("");
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (stock <= 0) {
      toast.error("Este produto está fora de estoque.");
      return;
    }

    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Selecione uma cor para continuar.");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Selecione um tamanho para continuar.");
      return;
    }

    addItem({
      id: nanoid(),
      productId: Number(product.id), // Mantendo compatibilidade com tipo number do carrinho se necessário
      productName: product.name,
      price: unitPrice,
      quantity,
      customization: {
        text: customText.trim() || undefined,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      },
      image: product.imageUrl,
    });

    toast.success("Produto adicionado ao carrinho com sua personalização.");
    resetCustomization();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl py-12">
          <Skeleton className="mb-8 h-8 w-36" />
          <div className="grid gap-10 lg:grid-cols-2">
            <Skeleton className="aspect-square rounded-[2rem]" />
            <div className="space-y-5">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-80 w-full rounded-[2rem]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-[2rem] border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="text-3xl font-black">Produto não encontrado</h1>
          <p className="mt-3 text-muted-foreground">O item solicitado não está disponível no catálogo.</p>
          <Button onClick={() => navigate("/produtos")} className="mt-6 rounded-full">Voltar aos produtos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="container flex max-w-7xl items-center justify-between py-4">
          <button onClick={() => navigate("/produtos")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Voltar ao catálogo
          </button>
          <Button onClick={() => navigate("/carrinho")} variant="outline" className="rounded-full">
            Ver carrinho
          </Button>
        </div>
      </header>

      <main className="container max-w-7xl py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <section className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-4 shadow-sm transition-smooth hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-muted">
                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-smooth" />
                <div className="absolute inset-x-6 bottom-6 rounded-[1.5rem] border border-white/40 bg-background/90 p-5 shadow-2xl backdrop-blur transition-smooth">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">Preview</p>
                      <p className="mt-1 text-2xl font-black transition-colors" style={{ color: selectedColor || undefined }}>
                        {customText.trim() || "Seu texto aqui"}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-accent text-accent-foreground animate-pulse">Ao vivo</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Arte revisada", "Compra segura", "Produção rápida"].map((item, idx) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm font-semibold transition-smooth hover:border-accent/50 hover:shadow-md" style={{animationDelay: `${idx * 0.1}s`}}>
                  <CheckCircle2 className="h-4 w-4 text-accent" /> {item}
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-7">
            <div>
              <Badge className="mb-4 rounded-full bg-accent/15 text-accent-foreground hover:bg-accent/20">
                <Sparkles className="mr-2 h-4 w-4" /> Produto personalizável
              </Badge>
              <h1 className="text-5xl font-black tracking-tight">{product.name}</h1>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">{product.description}</p>
              <div className="mt-6 rounded-[1.5rem] border border-border bg-card p-5">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Preço unitário</p>
                    <strong className="mt-1 block text-4xl text-accent">{formatCurrency(unitPrice)}</strong>
                    {customizationPrice > 0 && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Base {formatCurrency(basePrice)} + personalização {formatCurrency(customizationPrice)}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold">
                    Total: {formatCurrency(totalPrice)}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm transition-smooth hover:shadow-lg">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">Monte sua personalização</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Todos os detalhes serão salvos no carrinho.</p>
                </div>
                <Button onClick={resetCustomization} type="button" variant="ghost" className="rounded-full btn-hover-lift">
                  <RotateCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" /> Limpar
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold">Texto personalizado</label>
                  <Input
                    value={customText}
                    onChange={(event) => setCustomText(event.target.value)}
                    maxLength={50}
                    placeholder="Ex.: Melhor mãe do mundo"
                    className="h-12 rounded-2xl"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>{customText.trim() ? "+ R$ 15,00 pelo texto" : "Opcional"}</span>
                    <span>{customText.length}/50</span>
                  </div>
                </div>

                {availableColors.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-bold">Cor do detalhe</label>
                    <div className="flex flex-wrap gap-3">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`h-12 w-12 rounded-2xl border-2 shadow-sm transition ${selectedColor === color ? "scale-110 border-accent ring-4 ring-accent/20" : "border-border hover:border-accent"}`}
                          style={{ backgroundColor: color }}
                          aria-label={`Selecionar ${getColorLabel(color)}`}
                          title={getColorLabel(color)}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Selecionada: {getColorLabel(selectedColor)}</p>
                  </div>
                )}

                {availableSizes.length > 0 && (
                  <div>
                    <label className="mb-3 block text-sm font-bold">Tamanho</label>
                    <div className="flex flex-wrap gap-3">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`rounded-2xl border-2 px-6 py-3 text-sm font-black transition ${selectedSize === size ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-accent"}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-3 block text-sm font-bold">Quantidade</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border hover:border-accent" type="button">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-secondary text-lg font-black">{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))} className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border hover:border-accent" type="button">
                      <Plus className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">{stock > 0 ? `${stock} unidades em estoque` : "Fora de estoque"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <Truck className="h-5 w-5 text-accent" /> Frete grátis acima de R$ 199,00
              </div>
              <Button onClick={handleAddToCart} disabled={stock <= 0} className="h-14 w-full rounded-full text-base font-black">
                <ShoppingBag className="mr-2 h-5 w-5" /> Adicionar ao carrinho — {formatCurrency(totalPrice)}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
