import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { getAllProducts, getProductById, createProduct, subscribeToNewsletter, getProductReviews, createReview, getProductsByCategory, getProductVariants, createOrder, getOrdersByUserId, getOrderById, getOrderItemsByOrderId, getAllOrders, updateOrderStatus, getOrderByNumber } from "./db";
import { syncOrderToSheety } from "./sheety";
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
    variants: publicProcedure.input(z.object({ productId: z.number() })).query(async ({ input }) => {
      return await getProductVariants(input.productId);
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

  // Order endpoints
  orders: router({
    create: protectedProcedure
      .input(z.object({
        totalPrice: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          productName: z.string(),
          size: z.string(),
          price: z.string(),
          quantity: z.number().default(1),
        })),
        shippingAddress: z.string().optional(),
        shippingCity: z.string().optional(),
        shippingPostalCode: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const itemsData = input.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
        }));
        const orderId = await createOrder(
          {
            userId: ctx.user!.id,
            orderNumber,
            totalPrice: input.totalPrice as any,
            status: 'pending',
            shippingAddress: input.shippingAddress,
            shippingCity: input.shippingCity,
            shippingPostalCode: input.shippingPostalCode,
            customerEmail: ctx.user!.email || '',
            customerName: ctx.user!.name || '',
          },
          itemsData as any
        );
        
        // Sync order to Sheety Google Sheet
        await syncOrderToSheety({
          customerName: ctx.user!.name || 'Unknown',
          customerNumber: ctx.user!.email || '',
          totalPrice: input.totalPrice,
          orderNumber,
          date: new Date().toISOString().split('T')[0],
        });
        
        return { orderId, orderNumber };
      }),
    
    getMyOrders: protectedProcedure.query(async ({ ctx }) => {
      const userOrders = await getOrdersByUserId(ctx.user!.id);
      const ordersWithItems = await Promise.all(
        userOrders.map(async (order) => ({
          ...order,
          items: await getOrderItemsByOrderId(order.id),
        }))
      );
      return ordersWithItems;
    }),
    
    getById: protectedProcedure
      .input(z.object({ orderId: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await getOrderById(input.orderId);
        if (!order || order.userId !== ctx.user!.id) {
          throw new Error('Order not found or unauthorized');
        }
        const items = await getOrderItemsByOrderId(order.id);
        return { ...order, items };
      }),
    
    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const order = await getOrderByNumber(input.orderNumber);
        if (!order) {
          throw new Error('Order not found');
        }
        const items = await getOrderItemsByOrderId(order.id);
        return { ...order, items };
      }),
    
    getAllOrders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error('Only admins can view all orders');
      }
      const allOrders = await getAllOrders();
      const ordersWithItems = await Promise.all(
        allOrders.map(async (order) => ({
          ...order,
          items: await getOrderItemsByOrderId(order.id),
        }))
      );
      return ordersWithItems;
    }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        orderId: z.number(),
        status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error('Only admins can update order status');
        }
        return await updateOrderStatus(input.orderId, input.status);
      }),
  }),
});

export type AppRouter = typeof appRouter;
