import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: (opts) => createContext(opts as any),
  })
);

// Adicionar um handler para a raiz da API para evitar 404
app.get("/api", (req, res) => {
  res.json({ message: "API is working" });
});

// Rota de saúde para teste
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API is running on Vercel" });
});

export default app;
