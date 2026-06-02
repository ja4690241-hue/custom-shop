import { COOKIE_NAME } from "../shared/const.ts";
import { getSessionCookieOptions } from "./_core/cookies.ts";
import { systemRouter } from "./_core/systemRouter.ts";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc.ts";
import { 
  getCategories, 
  getProducts, 
  getProductById, 
  getProductsByCategory,
  getCartItems,
  getUserOrders,
  getOrderById,
  getOrderItems
} from "./db.ts";
import { z } from "zod";
import { createPixPayment, mercadoPagoPublicKey } from "./mercadopago.ts";
import type { TrpcContext } from "./_core/context.ts";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      (ctx.res as any).clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Categories procedures
  categories: router({
    list: publicProcedure.query(async () => {
      return getCategories();
    }),
  }),

  // Products procedures
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      }))
      .query(async ({ input }) => {
        if (input.categoryId) {
          return getProductsByCategory(input.categoryId);
        }
        return getProducts(input.limit, input.offset);
      }),
    
    featured: publicProcedure.query(async () => {
      const products = await getProducts(4, 0);
      return products;
    }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getProductById(input);
      }),
  }),

  // Cart procedures
  cart: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getCartItems(ctx.user.id);
    }),
  }),

  // Orders procedures
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserOrders(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getOrderById(input);
      }),

    items: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getOrderItems(input);
      }),

    getPublicKey: publicProcedure.query(() => {
      return { publicKey: mercadoPagoPublicKey };
    }),

    createPayment: publicProcedure
      .input(z.object({
        amount: z.number(),
        description: z.string(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        cpf: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          const result = await createPixPayment({
            transaction_amount: input.amount,
            description: input.description,
            payer: {
              email: input.email,
              first_name: input.firstName,
              last_name: input.lastName,
              ...(input.cpf ? {
                identification: {
                  type: 'CPF',
                  number: input.cpf
                }
              } : {})
            }
          });
          return result;
        } catch (err: any) {
          console.error(">>> createPayment Mutation Error:", err);
          return { error: true, message: err.message || "Erro ao processar pagamento" };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
