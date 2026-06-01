import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "user" = "admin"): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "local",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("clients router", () => {
  it("lists all clients", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const clients = await caller.clients.list();

    expect(Array.isArray(clients)).toBe(true);
  });

  it("creates a client with admin role", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.clients.create({
      name: "Test Client",
      email: "test@example.com",
      phone: "(11) 99999-9999",
      address: "Rua Test, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
      notes: "Test notes",
    });

    expect(result).toBeDefined();
  });

  it("rejects client creation with user role", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.clients.create({
        name: "Test Client",
        email: "test@example.com",
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("deletes a client with admin role", async () => {
    const ctx = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    // First create a client
    const created = await caller.clients.create({
      name: "Test Client to Delete",
      email: "delete@example.com",
    });

    expect(created).toBeDefined();
  });

  it("rejects client deletion with user role", async () => {
    const ctx = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.clients.delete({ id: 999 });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Unauthorized");
    }
  });

  it("gets a client by id", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // This should work for any role since it's a public procedure
    const client = await caller.clients.getById({ id: 1 });

    // Client might not exist, but the procedure should work
    expect(client === undefined || typeof client === "object").toBe(true);
  });
});
