"use client";

import type { EscrowTransaction, Order, Product, Quote } from "@/types/database";
import type { Inquiry } from "@/lib/mock-data";

const QUOTE_KEY = "origino_seller_quote_overrides";
const CREATED_QUOTE_KEY = "origino_seller_created_quotes";
const ORDER_KEY = "origino_seller_orders";
const ORDER_OVERRIDE_KEY = "origino_seller_order_overrides";
const ESCROW_KEY = "origino_trade_escrows";
const ESCROW_OVERRIDE_KEY = "origino_trade_escrow_overrides";
const PRODUCT_KEY = "origino_seller_products";
const INQUIRY_KEY = "origino_seller_inquiries";
const BUYER_INQUIRY_KEY = "origino_buyer_inquiries";
const TRADE_INQUIRY_KEY = "origino_trade_inquiries";
const USE_MOCK_STORE = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

type QuoteOverride = Partial<Pick<Quote, "status" | "final_price_usd" | "lead_time_offered" | "notes">>;
type OrderOverride = Partial<Pick<Order, "status" | "escrow_status" | "notes" | "updated_at">>;
type EscrowOverride = Partial<Pick<EscrowTransaction, "status" | "released_at" | "dispute_reason">>;

function readRecord<T>(key: string): Record<string, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as Record<string, T> : {};
  } catch {
    return {};
  }
}

function writeRecord<T>(key: string, value: Record<string, T>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("origino:seller-mock-store"));
  window.dispatchEvent(new Event("origino:trade-store"));
}

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T[] : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("origino:seller-mock-store"));
  window.dispatchEvent(new Event("origino:trade-store"));
}

function mergeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function applyQuoteOverrides(quotes: Quote[]) {
  const overrides = readRecord<QuoteOverride>(QUOTE_KEY);
  const createdQuotes = readCreatedQuotes();
  const merged = [...createdQuotes, ...quotes.filter((quote) => !createdQuotes.some((created) => created.id === quote.id))];
  return merged.map((quote) => ({ ...quote, ...overrides[quote.id] }));
}

export function saveQuoteOverride(quoteId: string, update: QuoteOverride) {
  const overrides = readRecord<QuoteOverride>(QUOTE_KEY);
  writeRecord(QUOTE_KEY, { ...overrides, [quoteId]: { ...overrides[quoteId], ...update } });
}

export function readCreatedQuotes(): Quote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CREATED_QUOTE_KEY);
    return raw ? JSON.parse(raw) as Quote[] : [];
  } catch {
    return [];
  }
}

export function saveCreatedQuote(quote: Quote) {
  const quotes = readCreatedQuotes();
  if (quotes.some((item) => item.id === quote.id)) return;
  window.localStorage.setItem(CREATED_QUOTE_KEY, JSON.stringify([quote, ...quotes]));
  window.dispatchEvent(new Event("origino:seller-mock-store"));
}

export function readCreatedOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDER_KEY);
    return raw ? JSON.parse(raw) as Order[] : [];
  } catch {
    return [];
  }
}

export function saveCreatedOrder(order: Order) {
  const orders = readCreatedOrders();
  if (orders.some((item) => item.id === order.id)) return;
  writeArray(ORDER_KEY, [order, ...orders]);
}

export function applyOrderOverrides(orders: Order[]) {
  const overrides = readRecord<OrderOverride>(ORDER_OVERRIDE_KEY);
  const createdOrders = readCreatedOrders();
  const merged = [...createdOrders, ...orders.filter((order) => !createdOrders.some((created) => created.id === order.id))];
  return merged.map((order) => ({ ...order, ...overrides[order.id] }));
}

export function saveOrderOverride(orderId: string, update: OrderOverride) {
  const overrides = readRecord<OrderOverride>(ORDER_OVERRIDE_KEY);
  writeRecord(ORDER_OVERRIDE_KEY, { ...overrides, [orderId]: { ...overrides[orderId], ...update } });
}

export function readCreatedEscrows(): EscrowTransaction[] {
  return readArray<EscrowTransaction>(ESCROW_KEY);
}

export function saveCreatedEscrow(transaction: EscrowTransaction) {
  const transactions = readCreatedEscrows();
  if (transactions.some((item) => item.id === transaction.id)) return;
  writeArray(ESCROW_KEY, [transaction, ...transactions]);
}

export function applyEscrowOverrides(transactions: EscrowTransaction[]) {
  const overrides = readRecord<EscrowOverride>(ESCROW_OVERRIDE_KEY);
  const createdTransactions = readCreatedEscrows();
  const merged = [...createdTransactions, ...transactions.filter((transaction) => !createdTransactions.some((created) => created.id === transaction.id))];
  return merged.map((transaction) => ({ ...transaction, ...overrides[transaction.id] }));
}

export function saveEscrowOverride(transactionId: string, update: EscrowOverride) {
  const overrides = readRecord<EscrowOverride>(ESCROW_OVERRIDE_KEY);
  writeRecord(ESCROW_OVERRIDE_KEY, { ...overrides, [transactionId]: { ...overrides[transactionId], ...update } });
}

export function readSellerProducts(initialProducts: Product[]) {
  if (typeof window === "undefined") return initialProducts;
  if (!USE_MOCK_STORE) return initialProducts;
  try {
    const raw = window.localStorage.getItem(PRODUCT_KEY);
    return raw ? JSON.parse(raw) as Product[] : initialProducts;
  } catch {
    return initialProducts;
  }
}

export function saveSellerProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  if (!USE_MOCK_STORE) return;
  window.localStorage.setItem(PRODUCT_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("origino:seller-mock-store"));
}

export function readSellerInquiries(initialInquiries: Inquiry[]) {
  if (typeof window === "undefined") return initialInquiries;
  return mergeById([
    ...readArray<Inquiry>(TRADE_INQUIRY_KEY),
    ...readArray<Inquiry>(INQUIRY_KEY),
    ...readArray<Inquiry>(BUYER_INQUIRY_KEY),
    ...initialInquiries,
  ]);
}

export function saveSellerInquiries(inquiries: Inquiry[]) {
  if (typeof window === "undefined") return;
  const merged = mergeById(inquiries);
  writeArray(TRADE_INQUIRY_KEY, merged);
  window.localStorage.setItem(INQUIRY_KEY, JSON.stringify(merged));
  window.localStorage.setItem(BUYER_INQUIRY_KEY, JSON.stringify(merged));
}

export function readBuyerInquiries(initialInquiries: Inquiry[]) {
  return readSellerInquiries(initialInquiries);
}

export function saveBuyerInquiries(inquiries: Inquiry[]) {
  saveSellerInquiries(inquiries);
}

export function saveSharedInquiry(inquiry: Inquiry) {
  const inquiries = readSellerInquiries([]);
  saveSellerInquiries([inquiry, ...inquiries.filter((item) => item.id !== inquiry.id)]);
}
