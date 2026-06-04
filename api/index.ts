import express, { Request, Response, NextFunction } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext: () => ({ user: null }), // Isolar autenticação para evitar erros no Vercel
    onError({ error, path }) {
      console.error(`>>> tRPC Error on ${path}:`, error);
    },
  })
);

// Fallback para erros não tratados para evitar que o Vercel retorne HTML
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(">>> Global Error:", err);
  res.status(500).json({ error: true, message: "Erro interno no servidor" });
});

export default app;
