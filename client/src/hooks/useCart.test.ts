import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCart } from "./useCart";

describe("useCart", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should initialize with empty cart", () => {
    const { result } = renderHook(() => useCart());
    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("should add item to cart", () => {
    const { result } = renderHook(() => useCart());

    const newItem = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 1,
      customization: { text: "Test" },
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(newItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(newItem);
    expect(result.current.total).toBe(100);
    expect(result.current.itemCount).toBe(1);
  });

  it("should increment quantity when adding duplicate item", () => {
    const { result } = renderHook(() => useCart());

    const item = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 1,
      customization: { text: "Test" },
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(item);
      result.current.addItem({ ...item, id: "2", quantity: 2 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.total).toBe(300);
  });

  it("should remove item from cart", () => {
    const { result } = renderHook(() => useCart());

    const item = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 1,
      customization: {},
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(item);
      result.current.removeItem("1");
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
  });

  it("should update item quantity", () => {
    const { result } = renderHook(() => useCart());

    const item = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 1,
      customization: {},
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(item);
      result.current.updateQuantity("1", 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.total).toBe(500);
  });

  it("should remove item when quantity is 0", () => {
    const { result } = renderHook(() => useCart());

    const item = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 1,
      customization: {},
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(item);
      result.current.updateQuantity("1", 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("should clear cart", () => {
    const { result } = renderHook(() => useCart());

    const item = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 2,
      customization: {},
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(item);
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("should persist cart to localStorage", () => {
    const { result } = renderHook(() => useCart());

    const item = {
      id: "1",
      productId: 1,
      productName: "Test Product",
      price: 100,
      quantity: 1,
      customization: { text: "Test" },
      image: "test.jpg",
    };

    act(() => {
      result.current.addItem(item);
    });

    const savedCart = JSON.parse(localStorage.getItem("custom_shop_cart") || "[]");
    expect(savedCart).toHaveLength(1);
    expect(savedCart[0]).toEqual(item);
  });
});
