import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useCartContext } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/produtos/:id");
  const productId = params?.id ? parseInt(params.id) : undefined;

  const { addItem } = useCartContext();
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { data: product, isLoading } = trpc.products.getById.useQuery(productId || 0, {
    enabled: !!productId,
  });

  const availableColors = product?.availableColors ? JSON.parse(product.availableColors) : [];
  const availableSizes = product?.availableSizes ? JSON.parse(product.availableSizes) : [];

  const handleAddToCart = () => {
    if (!product) return;

    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Selecione a cor");
      return;
    }

    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Selecione o tamanho");
      return;
    }

    addItem({
      id: nanoid(),
      productId: product.id,
      productName: product.name,
      price: parseFloat(product.price as any),
      quantity,
      customization: {
        text: customText || undefined,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      },
      image: product.imageUrl,
    });

    toast.success("Produto adicionado ao carrinho!");
    setQuantity(1);
    setCustomText("");
    setSelectedColor("");
    setSelectedSize("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          <Skeleton className="w-32 h-8 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-24" />
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/60 text-lg mb-4">Produto não encontrado</p>
          <Button onClick={() => navigate("/produtos")}>Voltar aos Produtos</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/produtos")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar aos Produtos
          </button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-foreground mb-4">{product.name}</h1>
              <p className="text-foreground/60 text-lg mb-6">{product.description}</p>
              <p className="text-4xl font-bold text-accent">
                R$ {parseFloat(product.price as any).toFixed(2)}
              </p>
            </div>

            {/* Customization Options */}
            <div className="space-y-6 bg-card border border-border rounded-lg p-6">
              <h3 className="text-2xl font-bold text-foreground">Personalização</h3>

              {/* Custom Text */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Texto Personalizado (opcional)
                </label>
                <Input
                  type="text"
                  placeholder="Digite seu texto aqui"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  maxLength={50}
                  className="w-full"
                />
                <p className="text-xs text-foreground/50 mt-1">{customText.length}/50 caracteres</p>
              </div>

              {/* Color Selection */}
              {availableColors.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Cor
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableColors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? "border-accent scale-110"
                            : "border-border hover:border-accent/50"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Tamanho
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-6 py-2 rounded border-2 font-semibold transition-all ${
                          selectedSize === size
                            ? "bg-accent text-accent-foreground border-accent"
                            : "border-border text-foreground hover:border-accent"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Quantidade
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-border hover:border-accent transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold text-foreground w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded border border-border hover:border-accent transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              className="w-full bg-accent text-accent-foreground py-6 text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-6 h-6 mr-2" />
              Adicionar ao Carrinho
            </Button>

            {/* Stock Info */}
            <div className="text-sm text-foreground/60">
              {product.stock > 0 ? (
                <p>✓ {product.stock} unidades em estoque</p>
              ) : (
                <p className="text-red-500">✗ Produto fora de estoque</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
