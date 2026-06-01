import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Try to get user from authorization header (for local login)
    const authHeader = opts.req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const userJson = typeof atob === 'function' ? atob(authHeader.slice(7)) : Buffer.from(authHeader.slice(7), 'base64').toString('utf-8');
        const parsedUser = JSON.parse(userJson);
        // Map the parsed user to the User type
        user = {
          id: parsedUser.id || 1,
          openId: parsedUser.username || 'local-user',
          username: parsedUser.username,
          name: parsedUser.name || parsedUser.username,
          email: parsedUser.email || null,
          role: parsedUser.role || 'admin',
          loginMethod: 'local',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
          password: null,
        } as User;
      } catch (e) {
        // Failed to parse user from header
        user = null;
      }
    } else {
      // Authentication is optional for public procedures.
      user = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
