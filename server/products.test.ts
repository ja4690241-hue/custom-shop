import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Products Router", () => {
  const caller = appRouter.createCaller({
    user: null,
    req: {} as any,
    res: {} as any,
  });

  it("should list products", async () => {
    const products = await caller.products.list({ limit: 20, offset: 0 });
    expect(Array.isArray(products)).toBe(true);
  });

  it("should get featured products", async () => {
    const featured = await caller.products.featured();
    expect(Array.isArray(featured)).toBe(true);
  });

  it("should list categories", async () => {
    const categories = await caller.categories.list();
    expect(Array.isArray(categories)).toBe(true);
  });
});

describe("Auth Router", () => {
  const caller = appRouter.createCaller({
    user: null,
    req: {} as any,
    res: {} as any,
  });

  it("should return null for unauthenticated user", async () => {
    const user = await caller.auth.me();
    expect(user).toBeNull();
  });
});
