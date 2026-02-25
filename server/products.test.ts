import { describe, expect, it, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Products Router", () => {
  it("should list products publicly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const products = await caller.products.list();
    expect(Array.isArray(products)).toBe(true);
  });

  it("should not allow non-admin to create product", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.products.create({
        name: "Test Product",
        type: "Paver",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toMatch(/Unauthorized|Please login/);
    }
  });

  it("should allow admin to create product", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.products.create({
      name: "Test Paver",
      type: "Paver",
      color: "Red",
      dimensions: "20x10x8",
      price: "50.00",
    });

    expect(result).toBeDefined();
  });
});

describe("Quotations Router", () => {
  it("should allow public to create quotation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.quotations.create({
      clientName: "John Doe",
      clientEmail: "john@example.com",
      clientPhone: "(49) 99999-9999",
      address: "Rua Test, 123",
      description: "Need pavers for my garden",
      area: "100",
    });

    expect(result).toBeDefined();
  });

  it("should not allow non-admin to list quotations", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.quotations.list();
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toMatch(/Unauthorized|Please login/);
    }
  });

  it("should allow admin to list quotations", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const quotations = await caller.quotations.list();
    expect(Array.isArray(quotations)).toBe(true);
  });

  it("should allow admin to update quotation status", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // First create a quotation as public
    const publicCtx = createPublicContext();
    const publicCaller = appRouter.createCaller(publicCtx);
    const quotation = await publicCaller.quotations.create({
      clientName: "Jane Doe",
      clientEmail: "jane@example.com",
    });

    // Then update it as admin
    const result = await caller.quotations.update({
      id: (quotation as any).insertId || 1,
      status: "approved",
      notes: "Approved for processing",
    });

    expect(result).toBeDefined();
  });
});

describe("Gallery Router", () => {
  it("should list gallery works publicly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const works = await caller.gallery.list();
    expect(Array.isArray(works)).toBe(true);
  });

  it("should not allow non-admin to create gallery work", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.gallery.create({
        title: "Test Work",
        imageUrl: "https://example.com/image.jpg",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toMatch(/Unauthorized|Please login/);
    }
  });

  it("should allow admin to create gallery work", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.gallery.create({
      title: "Beautiful Paver Installation",
      description: "Residential garden paving project",
      imageUrl: "https://example.com/paver.jpg",
      location: "Quilombo, SC",
    });

    expect(result).toBeDefined();
  });
});
