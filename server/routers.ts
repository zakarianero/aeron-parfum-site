import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductById, createProduct, subscribeToNewsletter, getProductReviews, createReview, getProductsByCategory } from "./db";
import { InsertProduct, InsertReview } from "../drizzle/schema";

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

  // Product endpoints
  products: router({
    list: publicProcedure.query(async () => {
      return await getAllProducts();
    }),
    byCategory: publicProcedure.input(z.object({ category: z.enum(['womens', 'mens', 'unisex']) })).query(async ({ input }) => {
      return await getProductsByCategory(input.category);
    }),
    get: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await getProductById(input.id);
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string(),
        volume: z.string(),
        imageUrl: z.string().optional(),
        notes: z.string().optional(),
        category: z.enum(['womens', 'mens', 'unisex']).default('womens'),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Only admins can create products');
        }
        const product: InsertProduct = {
          name: input.name,
          description: input.description,
          price: input.price as any,
          volume: input.volume,
          imageUrl: input.imageUrl,
          notes: input.notes,
          category: input.category,
        };
        return await createProduct(product);
      }),
  }),

  // Newsletter endpoints
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await subscribeToNewsletter(input.email, input.name);
      }),
  }),

  // Review endpoints
  reviews: router({
    getByProduct: publicProcedure
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return await getProductReviews(input.productId);
      }),
    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const review: InsertReview = {
          productId: input.productId,
          userId: ctx.user!.id,
          rating: input.rating,
          title: input.title,
          content: input.content,
          isApproved: false,
        };
        return await createReview(review);
      }),
  }),
});

export type AppRouter = typeof appRouter;
