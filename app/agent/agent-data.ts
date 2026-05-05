export type AgentClient = {
  id: string;
  company: string;
  contact: string;
  country: string;
  categories: string;
  status: "linked" | "pending";
  intentScore: number;
};

export type AgentInquiry = {
  id: string;
  clientId: string;
  supplier: string;
  subject: string;
  status: "open" | "replied" | "quoted";
  submittedBy: string;
};

export type AgentRfq = {
  id: string;
  clientId: string;
  title: string;
  category: string;
  status: "open" | "matched" | "closed";
  matches: number;
};

export type AgentQuote = {
  id: string;
  clientId: string;
  supplier: string;
  amountUsd: number;
  status: "pending" | "countered" | "accepted" | "rejected";
};

export type AgentOrder = {
  id: string;
  clientId: string;
  supplier: string;
  amountUsd: number;
  status: "confirmed" | "in_production" | "shipped";
  commissionUsd: number;
};

export const agentClients: AgentClient[] = [
  { id: "client-1", company: "Hansa Medical Imports GmbH", contact: "Marta Klein", country: "Germany", categories: "Surgical instruments", status: "linked", intentScore: 88 },
  { id: "client-2", company: "Nord Textile House", contact: "Sarah Collins", country: "United Kingdom", categories: "Home textiles", status: "pending", intentScore: 64 },
  { id: "client-3", company: "Marina Trading LLC", contact: "Omar Haddad", country: "UAE", categories: "Hospitality supplies", status: "linked", intentScore: 76 },
];

export const agentInquiries: AgentInquiry[] = [
  { id: "ainq-1", clientId: "client-1", supplier: "Crescent Surgical Works", subject: "CE forceps program", status: "replied", submittedBy: "Agent on behalf of Hansa Medical Imports GmbH" },
  { id: "ainq-2", clientId: "client-3", supplier: "Nishat Weaves Faisalabad", subject: "Hotel towel tender", status: "open", submittedBy: "Agent on behalf of Marina Trading LLC" },
];

export const agentRfqs: AgentRfq[] = [
  { id: "arfq-1", clientId: "client-1", title: "Stainless steel dental instruments", category: "Surgical & Medical Instruments", status: "matched", matches: 4 },
  { id: "arfq-2", clientId: "client-3", title: "White terry towel sets", category: "Textiles & Apparel", status: "open", matches: 2 },
];

export const agentQuotes: AgentQuote[] = [
  { id: "aq-1", clientId: "client-1", supplier: "Crescent Surgical Works", amountUsd: 6800, status: "pending" },
  { id: "aq-2", clientId: "client-3", supplier: "Nishat Weaves Faisalabad", amountUsd: 12500, status: "countered" },
];

export const agentOrders: AgentOrder[] = [
  { id: "aord-1", clientId: "client-1", supplier: "Crescent Surgical Works", amountUsd: 18400, status: "confirmed", commissionUsd: 920 },
  { id: "aord-2", clientId: "client-3", supplier: "Nishat Weaves Faisalabad", amountUsd: 27200, status: "in_production", commissionUsd: 1360 },
];
