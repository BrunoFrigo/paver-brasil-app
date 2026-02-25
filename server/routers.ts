import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";

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
    login: publicProcedure
      .input(z.object({
        username: z.string(),
        password: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByUsername(input.username);
        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }
        
        const isValidPassword = await db.verifyPassword(input.password, user.password);
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }
        
        return {
          success: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
            name: user.name,
          },
        };
      }),
  }),

  products: router({
    list: publicProcedure.query(() => db.getAllProducts()),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getProductById(input.id)),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.string(),
        description: z.string().optional(),
        color: z.string().optional(),
        dimensions: z.string().optional(),
        price: z.string().optional(),
        unit: z.string().optional(),
        stock: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.createProduct(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.string().optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        dimensions: z.string().optional(),
        price: z.string().optional(),
        unit: z.string().optional(),
        stock: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.deleteProduct(input.id);
      }),
    updateStock: protectedProcedure
      .input(z.object({
        id: z.number(),
        quantity: z.number(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.updateProductStock(input.id, input.quantity);
      }),
  }),

  quotations: router({
    list: protectedProcedure.query(({ ctx }) => {
      if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
      return db.getAllQuotations();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.getQuotationById(input.id);
      }),
    create: publicProcedure
      .input(z.object({
        clientName: z.string(),
        clientEmail: z.string().email(),
        clientPhone: z.string().optional(),
        address: z.string().optional(),
        description: z.string().optional(),
        area: z.string().optional(),
        totalPrice: z.string().optional(),
        deliveryPrice: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createQuotation({
          ...input,
          status: "pending",
        });
        try {
          await notifyOwner({
            title: "Novo Orçamento Recebido",
            content: `Cliente: ${input.clientName}\nEmail: ${input.clientEmail}\nTelefone: ${input.clientPhone}\nArea: ${input.area} m²`,
          });
        } catch (error) {
          console.error("Failed to notify owner:", error);
        }
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "approved", "completed", "rejected"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return db.updateQuotation(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.deleteQuotation(input.id);
      }),
  }),

  gallery: router({
    list: publicProcedure.query(() => db.getAllGalleryWorks()),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getGalleryWorkById(input.id)),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        imageUrl: z.string(),
        location: z.string().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.createGalleryWork(input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        location: z.string().optional(),
        completedAt: z.date().optional(),
      }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const { id, ...data } = input;
        return db.updateGalleryWork(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input, ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        return db.deleteGalleryWork(input.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
