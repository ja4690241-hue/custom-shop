import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

async function seed() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...");

    // Inserir categorias
    await connection.execute(
      "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?), (?, ?, ?)",
      [
        "Canecas",
        "canecas",
        "Canecas personalizadas de alta qualidade",
        "Camisetas",
        "camisetas",
        "Camisetas personalizadas premium",
      ]
    );

    console.log("✅ Categorias inseridas");

    // Inserir produtos
    await connection.execute(
      `INSERT INTO products (categoryId, name, description, price, imageUrl, imageKey, availableColors, availableSizes, stock, active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        // Caneca
        1,
        "Caneca Elegante Premium",
        "Caneca de porcelana branca de alta qualidade, perfeita para café ou chá. Acabamento refinado com borda dourada.",
        "45.90",
        "https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=500&h=500&fit=crop",
        "caneca-elegante-premium",
        JSON.stringify(["#000000", "#FFFFFF", "#D4AF37", "#C0C0C0"]),
        JSON.stringify(["Único"]),
        50,
        1,
        // Camiseta
        2,
        "Camiseta Premium Personalizada",
        "Camiseta 100% algodão premium, confortável e durável. Perfeita para personalização com seu design exclusivo.",
        "79.90",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        "camiseta-premium-personalizada",
        JSON.stringify(["#000000", "#FFFFFF", "#FF6B6B", "#4ECDC4", "#FFE66D"]),
        JSON.stringify(["P", "M", "G", "GG"]),
        100,
        1,
      ]
    );

    console.log("✅ Produtos inseridos");
    console.log("🎉 Seed concluído com sucesso!");
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error.message);
    await connection.end();
    process.exit(1);
  }
}

seed();
