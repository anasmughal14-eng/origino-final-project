import { mockEscrowTransactions, mockInquiries, type Inquiry } from "@/lib/mock-data";
import { mockOrders, mockQuotes } from "@/lib/mock-data";
import type { EscrowTransaction, Order, Quote } from "@/types/database";
import fs from "node:fs";
import path from "node:path";

type RuntimeStore = {
  inquiries: Inquiry[];
  quotes: Quote[];
  orders: Order[];
  escrows: EscrowTransaction[];
};

type GlobalWithRuntime = typeof globalThis & {
  __originoRuntimeStore?: RuntimeStore;
};

const runtimeStorePath = path.join(process.cwd(), ".origino-runtime-store.json");

function emptyStore(): RuntimeStore {
  return {
    inquiries: [],
    quotes: [],
    orders: [],
    escrows: [],
  };
}

function readDiskStore(): RuntimeStore {
  try {
    if (!fs.existsSync(runtimeStorePath)) return emptyStore();
    const parsed = JSON.parse(fs.readFileSync(runtimeStorePath, "utf8")) as Partial<RuntimeStore>;
    return {
      inquiries: Array.isArray(parsed.inquiries) ? parsed.inquiries : [],
      quotes: Array.isArray(parsed.quotes) ? parsed.quotes : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      escrows: Array.isArray(parsed.escrows) ? parsed.escrows : [],
    };
  } catch {
    return emptyStore();
  }
}

function persistStore(runtime: RuntimeStore) {
  try {
    fs.writeFileSync(runtimeStorePath, JSON.stringify(runtime, null, 2));
  } catch {
    // Runtime persistence is a development-only mock layer; API handlers still return in-memory results if disk fails.
  }
}

function store() {
  const globalStore = globalThis as GlobalWithRuntime;
  const diskStore = readDiskStore();
  if (!globalStore.__originoRuntimeStore) {
    globalStore.__originoRuntimeStore = diskStore;
  } else {
    globalStore.__originoRuntimeStore = {
      inquiries: mergeById([...globalStore.__originoRuntimeStore.inquiries, ...diskStore.inquiries]),
      quotes: mergeById([...globalStore.__originoRuntimeStore.quotes, ...diskStore.quotes]),
      orders: mergeById([...globalStore.__originoRuntimeStore.orders, ...diskStore.orders]),
      escrows: mergeById([...globalStore.__originoRuntimeStore.escrows, ...diskStore.escrows]),
    };
  }
  return globalStore.__originoRuntimeStore;
}

function mergeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export function listRuntimeInquiries() {
  return mergeById([...store().inquiries, ...mockInquiries]);
}

export function addRuntimeInquiry(inquiry: Inquiry) {
  const runtime = store();
  runtime.inquiries = mergeById([inquiry, ...runtime.inquiries]);
  persistStore(runtime);
  return inquiry;
}

export function updateRuntimeInquiry(inquiry: Inquiry) {
  const runtime = store();
  runtime.inquiries = mergeById([inquiry, ...runtime.inquiries.filter((item) => item.id !== inquiry.id)]);
  persistStore(runtime);
  return inquiry;
}

export function listRuntimeQuotes() {
  return mergeById([...store().quotes, ...mockQuotes]);
}

export function addRuntimeQuote(quote: Quote) {
  const runtime = store();
  runtime.quotes = mergeById([quote, ...runtime.quotes]);
  persistStore(runtime);
  return quote;
}

export function updateRuntimeQuote(quoteId: string, update: Partial<Quote>) {
  const runtime = store();
  const source = listRuntimeQuotes().find((quote) => quote.id === quoteId);
  if (!source) return null;
  const updated = { ...source, ...update, updated_at: new Date().toISOString() };
  runtime.quotes = mergeById([updated, ...runtime.quotes.filter((quote) => quote.id !== quoteId)]);
  persistStore(runtime);
  return listRuntimeQuotes().find((quote) => quote.id === quoteId) ?? null;
}

export function listRuntimeOrders() {
  return mergeById([...store().orders, ...mockOrders]);
}

export function addRuntimeOrder(order: Order) {
  const runtime = store();
  runtime.orders = mergeById([order, ...runtime.orders]);
  persistStore(runtime);
  return order;
}

export function updateRuntimeOrder(orderId: string, update: Partial<Order>) {
  const runtime = store();
  const source = listRuntimeOrders().find((order) => order.id === orderId);
  if (!source) return null;
  const updated = { ...source, ...update, updated_at: new Date().toISOString() };
  runtime.orders = mergeById([updated, ...runtime.orders.filter((order) => order.id !== orderId)]);
  persistStore(runtime);
  return listRuntimeOrders().find((order) => order.id === orderId) ?? null;
}

export function listRuntimeEscrows() {
  return mergeById([...store().escrows, ...mockEscrowTransactions]);
}

export function addRuntimeEscrow(transaction: EscrowTransaction) {
  const runtime = store();
  runtime.escrows = mergeById([transaction, ...runtime.escrows]);
  persistStore(runtime);
  return transaction;
}

export function updateRuntimeEscrow(transactionId: string, update: Partial<EscrowTransaction>) {
  const runtime = store();
  const source = listRuntimeEscrows().find((transaction) => transaction.id === transactionId);
  if (!source) return null;
  const updated = { ...source, ...update };
  runtime.escrows = mergeById([updated, ...runtime.escrows.filter((transaction) => transaction.id !== transactionId)]);
  persistStore(runtime);
  return listRuntimeEscrows().find((transaction) => transaction.id === transactionId) ?? null;
}
