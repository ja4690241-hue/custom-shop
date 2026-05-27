import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/contexts/ProductsContext";

export default function AdminProductForm() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/produtos/:id/editar");
  const { addProduct, updateProduct, getProduct } = useProducts();
  const isEditing = !!params?.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Canecas",
    colors: "",
    sizes: "",
    stock: "",
    imageUrl: "",
    active: true,
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Carregar dados do produto se estiver editando
  useEffect(() => {
    if (isEditing && params?.id) {
      const product = getProduct(params.id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          colors: product.colors.join(", "),
          sizes: product.sizes.join(", "),
          stock: product.stock.toString(),
          imageUrl: product.imageUrl,
          active: product.active,
        });
        setImagePreview(product.imageUrl);
      }
    }
  }, [isEditing, params?.id, getProduct]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData((prev) => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (!formData.name.trim()) {
        toast.error("Nome do produto é obrigatório");
        return;
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        toast.error("Preço deve ser maior que zero");
        return;
      }
      if (!formData.stock || parseInt(formData.stock) < 0) {
        toast.error("Estoque não pode ser negativo");
        return;
      }
      if (!formData.imageUrl) {
        toast.error("Imagem do produto é obrigatória");
        return;
      }

      const colors = formData.colors
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c);
      const sizes = formData.sizes
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      if (isEditing && params?.id) {
        // Atualizar produto
        updateProduct(params.id, {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          colors: colors.length > 0 ? colors : ["#000000"],
          sizes: sizes.length > 0 ? sizes : ["Único"],
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl,
          active: formData.active,
        });
        toast.success("Produto atualizado com sucesso!");
      } else {
        // Criar novo produto
        addProduct({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          colors: colors.length > 0 ? colors : ["#000000"],
          sizes: sizes.length > 0 ? sizes : ["Único"],
          stock: parseInt(formData.stock),
          imageUrl: formData.imageUrl,
          active: formData.active,
        });
        toast.success("Produto criado com sucesso!");
      }

      // Redirecionar após sucesso
      setTimeout(() => {
        navigate("/admin/produtos");
      }, 1000);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/admin/produtos")}
            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-foreground">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h1>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Informações Básicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="name"
                placeholder="Nome do Produto"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Canecas">Canecas</option>
                <option value="Camisetas">Camisetas</option>
                <option value="Kits">Kits</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Descrição do Produto"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full mt-4 px-4 py-2 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </section>

          {/* Preço e Estoque */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Preço e Estoque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Preço (R$)
                </label>
                <Input
                  name="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Quantidade em Estoque
                </label>
                <Input
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
          </section>

          {/* Opções de Personalização */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Opções de Personalização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Cores (separadas por vírgula)
                </label>
                <Input
                  name="colors"
                  placeholder="Ex: #000000, #FFFFFF, #FF0000"
                  value={formData.colors}
                  onChange={handleChange}
                />
                <p className="text-xs text-foreground/50 mt-1">
                  Use códigos hexadecimais de cores
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-2 block">
                  Tamanhos (separados por vírgula)
                </label>
                <Input
                  name="sizes"
                  placeholder="Ex: P, M, G, GG"
                  value={formData.sizes}
                  onChange={handleChange}
                />
                <p className="text-xs text-foreground/50 mt-1">
                  Deixe em branco para "Único"
                </p>
              </div>
            </div>
          </section>

          {/* Imagem do Produto */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Imagem do Produto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Upload de Imagem
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-foreground/40 mx-auto mb-2" />
                    <p className="text-foreground/60 text-sm">
                      Clique para fazer upload ou arraste a imagem
                    </p>
                  </label>
                </div>
              </div>
              {imagePreview && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Prévia
                  </p>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Status */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="w-5 h-5 rounded border-border cursor-pointer"
              />
              <span className="text-foreground font-medium">
                Produto ativo (visível no catálogo)
              </span>
            </label>
          </section>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-accent text-accent-foreground py-3 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading
                ? "Salvando..."
                : isEditing
                  ? "Atualizar Produto"
                  : "Criar Produto"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/admin/produtos")}
              variant="outline"
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
