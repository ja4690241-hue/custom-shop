import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Save } from "lucide-react";
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

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        colors: colors.length > 0 ? colors : ["#FFFFFF"],
        sizes: sizes.length > 0 ? sizes : ["Único"],
        stock: parseInt(formData.stock),
        imageUrl: formData.imageUrl,
        active: formData.active,
      };

      if (isEditing && params?.id) {
        updateProduct(params.id, productData);
        toast.success("Produto atualizado com sucesso!");
      } else {
        addProduct(productData);
        toast.success("Produto criado com sucesso!");
      }

      navigate("/admin/produtos");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/admin/produtos")}
            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-2 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h1>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-6">Informações Gerais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Nome do Produto</label>
                    <Input
                      name="name"
                      placeholder="Ex: Caneca Personalizada"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Descrição</label>
                    <textarea
                      name="description"
                      placeholder="Descreva o produto..."
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-6">Preço e Inventário</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Preço (R$)</label>
                    <Input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Estoque</label>
                    <Input
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-6">Personalização</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Cores (Hex, ex: #FF0000)</label>
                    <Input
                      name="colors"
                      placeholder="#000000, #FFFFFF"
                      value={formData.colors}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tamanhos (ex: P, M, G)</label>
                    <Input
                      name="sizes"
                      placeholder="P, M, G, Único"
                      value={formData.sizes}
                      onChange={handleChange}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-6">Mídia</h2>
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center group relative">
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <label htmlFor="image-upload" className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-xl font-bold text-sm">Trocar Foto</label>
                        </div>
                      </>
                    ) : (
                      <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-slate-300" />
                        <span className="text-xs font-bold text-slate-400 uppercase">Upload</span>
                      </label>
                    )}
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>
                  <Input
                    name="imageUrl"
                    placeholder="Ou cole a URL da imagem"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </section>

              <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-black text-slate-900 mb-6">Organização</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Categoria</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Canecas">Canecas</option>
                      <option value="Camisetas">Camisetas</option>
                      <option value="Kits">Kits</option>
                      <option value="Acessórios">Acessórios</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-bold text-slate-700">Produto Ativo</span>
                  </label>
                </div>
              </section>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-lg shadow-lg shadow-blue-500/20"
                >
                  <Save className="w-5 h-5 mr-2" />
                  {loading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/admin/produtos")}
                  variant="ghost"
                  className="w-full h-12 rounded-2xl font-bold text-slate-500"
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
