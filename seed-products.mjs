import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] || "localhost",
  user: process.env.DATABASE_URL?.split("://")[1]?.split(":")[0] || "root",
  password: process.env.DATABASE_URL?.split(":")[2]?.split("@")[0] || "",
  database: process.env.DATABASE_URL?.split("/").pop() || "custom_shop",
});

const categories = [
  { name: "Bonés", slug: "bones", description: "Bonés personalizados de alta qualidade" },
  { name: "Camisetas", slug: "camisetas", description: "Camisetas confortáveis e duráveis" },
  { name: "Moletons", slug: "moletons", description: "Moletons quentes e aconchegantes" },
  { name: "Canecas", slug: "canecas", description: "Canecas perfeitas para presentear" },
  { name: "Acessórios", slug: "acessorios", description: "Diversos acessórios personalizáveis" },
];

const products = [
  // Bonés
  { categoryId: 1, name: "Boné Premium Classic", description: "Boné de alta qualidade com aba ajustável", price: "49.90", stock: 50, colors: '["Preto", "Branco", "Azul", "Vermelho"]', sizes: '["Único"]' },
  { categoryId: 1, name: "Boné Trucker", description: "Boné trucker com tela frontal", price: "54.90", stock: 40, colors: '["Preto", "Cinza", "Azul"]', sizes: '["Único"]' },
  { categoryId: 1, name: "Boné Dad Hat", description: "Estilo retrô com logo bordado", price: "59.90", stock: 35, colors: '["Bege", "Preto", "Marrom"]', sizes: '["Único"]' },
  
  // Camisetas
  { categoryId: 2, name: "Camiseta Basic", description: "Camiseta básica 100% algodão", price: "39.90", stock: 100, colors: '["Branco", "Preto", "Cinza", "Azul"]', sizes: '["P", "M", "G", "GG"]' },
  { categoryId: 2, name: "Camiseta Premium", description: "Camiseta premium com acabamento especial", price: "59.90", stock: 80, colors: '["Preto", "Branco", "Marinho"]', sizes: '["P", "M", "G", "GG"]' },
  { categoryId: 2, name: "Camiseta Oversized", description: "Camiseta oversized moderna", price: "64.90", stock: 60, colors: '["Preto", "Branco", "Bege"]', sizes: '["P", "M", "G", "GG", "XG"]' },
  
  // Moletons
  { categoryId: 3, name: "Moletom Básico", description: "Moletom confortável para o dia a dia", price: "89.90", stock: 45, colors: '["Preto", "Cinza", "Azul"]', sizes: '["P", "M", "G", "GG"]' },
  { categoryId: 3, name: "Moletom Premium", description: "Moletom premium com capuz", price: "129.90", stock: 35, colors: '["Preto", "Branco", "Cinza"]', sizes: '["P", "M", "G", "GG"]' },
  { categoryId: 3, name: "Moletom Zip", description: "Moletom com zíper frontal", price: "119.90", stock: 40, colors: '["Preto", "Azul", "Cinza"]', sizes: '["P", "M", "G", "GG"]' },
  
  // Canecas
  { categoryId: 4, name: "Caneca Branca", description: "Caneca branca 300ml", price: "24.90", stock: 150, colors: '["Branco"]', sizes: '["300ml"]' },
  { categoryId: 4, name: "Caneca Preta", description: "Caneca preta 300ml", price: "24.90", stock: 150, colors: '["Preto"]', sizes: '["300ml"]' },
  { categoryId: 4, name: "Caneca Térmica", description: "Caneca térmica 500ml", price: "49.90", stock: 80, colors: '["Preto", "Branco", "Azul"]', sizes: '["500ml"]' },
  
  // Acessórios
  { categoryId: 5, name: "Mochila Personalizada", description: "Mochila com bolsos internos", price: "99.90", stock: 30, colors: '["Preto", "Azul", "Cinza"]', sizes: '["Único"]' },
  { categoryId: 5, name: "Bolsa Tote", description: "Bolsa tote reutilizável", price: "34.90", stock: 60, colors: '["Branco", "Preto", "Bege"]', sizes: '["Único"]' },
  { categoryId: 5, name: "Chinelo Personalizado", description: "Chinelo confortável e durável", price: "44.90", stock: 50, colors: '["Preto", "Branco", "Azul"]', sizes: '["P", "M", "G"]' },
];

try {
  console.log("Limpando dados antigos...");
  await connection.execute("DELETE FROM products WHERE 1=1");
  await connection.execute("DELETE FROM categories WHERE 1=1");
  
  console.log("Inserindo categorias...");
  for (const cat of categories) {
    await connection.execute(
      "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
      [cat.name, cat.slug, cat.description]
    );
  }
  
  console.log("Inserindo produtos...");
  for (const prod of products) {
    await connection.execute(
      "INSERT INTO products (categoryId, name, description, price, stock, availableColors, availableSizes, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        prod.categoryId,
        prod.name,
        prod.description,
        prod.price,
        prod.stock,
        prod.colors,
        prod.sizes,
        "https://via.placeholder.com/400x400?text=" + encodeURIComponent(prod.name),
      ]
    );
  }
  
  console.log("✅ Banco de dados populado com sucesso!");
  console.log(`- ${categories.length} categorias adicionadas`);
  console.log(`- ${products.length} produtos adicionados`);
  
  await connection.end();
} catch (error) {
  console.error("❌ Erro ao popular banco de dados:", error);
  process.exit(1);
}
