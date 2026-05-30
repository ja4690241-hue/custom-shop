import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { 
  getCategories, 
  getProducts, 
  getProductById, 
  getProductsByCategory,
  getCartItems,
  getUserOrders,
  getOrderById,
  getOrderItems
} from "./db";
import { z } from "zod";
import { createPixPayment } from "./mercadopago";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
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

    createPayment: publicProcedure
      .input(z.object({
        amount: z.number(),
        description: z.string(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
      }))
      .mutation(async ({ input }) => {
        return createPixPayment({
          transaction_amount: input.amount,
          description: input.description,
          payer: {
            email: input.email,
            first_name: input.firstName,
            last_name: input.lastName,
          }
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
