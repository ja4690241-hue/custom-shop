import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductForm() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/admin/produtos/:id/editar");
  const isEditing = !!params?.id;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    colors: "",
    sizes: "",
    stock: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement product creation/update with S3 upload
    toast.success(isEditing ? "Produto atualizado!" : "Produto criado!");
    navigate("/admin/produtos");
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
                className="px-4 py-2 rounded border border-border bg-background text-foreground"
              >
                <option value="">Selecione uma categoria</option>
                <option value="canecas">Canecas</option>
                <option value="camisetas">Camisetas</option>
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Descrição do Produto"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full mt-4 px-4 py-2 rounded border border-border bg-background text-foreground"
            />
          </section>

          {/* Preço e Estoque */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Preço e Estoque
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="price"
                type="number"
                placeholder="Preço (R$)"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                required
              />
              <Input
                name="stock"
                type="number"
                placeholder="Quantidade em Estoque"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>
          </section>

          {/* Opções de Personalização */}
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Opções de Personalização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="colors"
                placeholder="Cores (separadas por vírgula)"
                value={formData.colors}
                onChange={handleChange}
                example="#000000, #FFFFFF, #FF0000"
              />
              <Input
                name="sizes"
                placeholder="Tamanhos (separados por vírgula)"
                value={formData.sizes}
                onChange={handleChange}
                example="P, M, G, GG"
              />
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
                  <label htmlFor="image-upload" className="cursor-pointer">
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

          {/* Buttons */}
          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-accent text-accent-foreground py-3 font-semibold hover:opacity-90 transition-opacity"
            >
              {isEditing ? "Atualizar Produto" : "Criar Produto"}
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/admin/produtos")}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
