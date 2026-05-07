import { createSupabaseAnonClient, createSupabaseServiceClient } from "@/lib/supabase";
import type {
  Application,
  Award,
  BlogPost,
  BuyerCompany,
  CommunityPost,
  EscrowTransaction,
  MarketingServiceOrder,
  Order,
  Product,
  Quote,
  Supplier,
  PageSection,
} from "@/types/database";
import {
  mockApplications,
  mockAdminTasks,
  mockAwards,
  mockBlogPosts,
  mockBuyerCompanies,
  mockClusters,
  mockCommunityPosts,
  mockEscrowTransactions,
  mockExportGuides,
  mockInquiries,
  mockMarketingServiceOrders,
  mockOrders,
  mockPageSections,
  mockProducts,
  mockQuotes,
  mockSuppliers,
  type Cluster,
  type ExportGuide,
} from "@/lib/mock-data";
import type { AdminTask, Inquiry } from "@/types/database";

export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

export type SupplierFilters = {
  search?: string;
  category?: string;
  city?: string;
  tier?: Supplier["verification_tier"] | "all";
  moqMax?: number;
  certifications?: string[];
};

function includes(value: string | null, query: string) {
  return value?.toLowerCase().includes(query.toLowerCase()) ?? false;
}

function supabase() {
  return createSupabaseAnonClient();
}

function adminSupabase() {
  return createSupabaseServiceClient();
}

export async function getSuppliers(filters: SupplierFilters = {}): Promise<Supplier[]> {
  if (USE_MOCK_DATA) {
    return mockSuppliers.filter((supplier) => {
      if (filters.search) {
        const q = filters.search;
        const matches =
          includes(supplier.company_name, q) ||
          includes(supplier.description, q) ||
          includes(supplier.category, q) ||
          supplier.sub_categories.some((item) => includes(item, q));
        if (!matches) return false;
      }
      if (filters.category && filters.category !== "all" && supplier.category !== filters.category) return false;
      if (filters.city && filters.city !== "all" && supplier.city.toLowerCase() !== filters.city.toLowerCase()) return false;
      if (filters.tier && filters.tier !== "all" && supplier.verification_tier !== filters.tier) return false;
      if (filters.moqMax && (supplier.moq_usd ?? 0) > filters.moqMax) return false;
      if (filters.certifications?.length) {
        const supplierCerts = supplier.certifications.map((cert) => cert.toLowerCase());
        if (!filters.certifications.every((cert) => supplierCerts.some((item) => item.includes(cert.toLowerCase())))) return false;
      }
      return supplier.is_active;
    });
  }
  const { data, error } = await supabase().from("suppliers").select("*").eq("is_active", true);
  if (error) throw error;
  return data;
}

export async function getSupplierBySlug(slug: string): Promise<Supplier | null> {
  if (USE_MOCK_DATA) return mockSuppliers.find((supplier) => supplier.slug === slug) ?? null;
  const { data, error } = await supabase().from("suppliers").select("*").eq("slug", slug).eq("is_active", true).single();
  if (error) return null;
  return data;
}

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK_DATA) return mockProducts.filter((product) => product.is_active);
  const { data, error } = await supabase().from("products").select("*").eq("is_active", true);
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (USE_MOCK_DATA) return mockProducts.find((product) => product.slug === slug) ?? null;
  const { data, error } = await supabase().from("products").select("*").eq("slug", slug).eq("is_active", true).single();
  if (error) return null;
  return data;
}

export async function getOrders(): Promise<Order[]> {
  if (USE_MOCK_DATA) return mockOrders;
  const { data, error } = await supabase().from("orders").select("*");
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const orders = await getOrders();
  return orders.find((order) => order.id === id) ?? null;
}

export async function getQuotes(): Promise<Quote[]> {
  if (USE_MOCK_DATA) return mockQuotes;
  const { data, error } = await supabase().from("quotes").select("*");
  if (error) throw error;
  return data;
}

export async function getInquiries(): Promise<Inquiry[]> {
  if (USE_MOCK_DATA) {
    return mockInquiries.map((inquiry) => ({
      ...inquiry,
      updated_at: inquiry.created_at,
    }));
  }
  const { data, error } = await supabase().from("inquiries").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getCommunityPosts(): Promise<CommunityPost[]> {
  if (USE_MOCK_DATA) return mockCommunityPosts;
  const { data, error } = await supabase().from("community_posts").select("*");
  if (error) throw error;
  return data.length > 0 ? data : mockCommunityPosts;
}

export async function getCommunityPostById(id: string): Promise<CommunityPost | null> {
  const posts = await getCommunityPosts();
  return posts.find((post) => post.id === id) ?? mockCommunityPosts.find((post) => post.id === id) ?? null;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (USE_MOCK_DATA) return mockBlogPosts.filter((post) => post.published);
  const { data, error } = await supabase().from("blog_posts").select("*").eq("published", true);
  if (error) throw error;
  return data.length > 0 ? data : mockBlogPosts.filter((post) => post.published);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? mockBlogPosts.find((post) => post.slug === slug && post.published) ?? null;
}

export async function getAwards(): Promise<Award[]> {
  if (USE_MOCK_DATA) return mockAwards;
  const { data, error } = await supabase().from("awards").select("*");
  if (error) throw error;
  return data;
}

export async function getClusters(): Promise<Cluster[]> {
  if (!USE_MOCK_DATA) {
    // Cluster content is seeded as site_config/page_sections in production.
    return mockClusters;
  }
  return mockClusters;
}

export async function getClusterBySlug(slug: string): Promise<Cluster | null> {
  return mockClusters.find((cluster) => cluster.slug === slug) ?? null;
}

export async function getExportGuides(): Promise<ExportGuide[]> {
  if (!USE_MOCK_DATA) {
    // Export guide SQL table is documented in CONNECT.md; mock data remains the fallback until generated types include it.
    return mockExportGuides;
  }
  return mockExportGuides;
}

export async function getExportGuideBySlug(slug: string): Promise<ExportGuide | null> {
  return mockExportGuides.find((guide) => guide.slug === slug) ?? null;
}

export async function getApplications(): Promise<Application[]> {
  if (USE_MOCK_DATA) return mockApplications;
  const { data, error } = await adminSupabase().from("applications").select("*");
  if (error) throw error;
  return data;
}

export async function getApplicationById(id: string): Promise<Application | null> {
  const applications = await getApplications();
  return applications.find((application) => application.id === id) ?? null;
}

export async function getEscrowTransactions(): Promise<EscrowTransaction[]> {
  if (USE_MOCK_DATA) return mockEscrowTransactions;
  const { data, error } = await adminSupabase().from("escrow_transactions").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getMarketingServiceOrders(): Promise<MarketingServiceOrder[]> {
  if (USE_MOCK_DATA) return mockMarketingServiceOrders;
  const { data, error } = await adminSupabase().from("marketing_service_orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAdminTasks(): Promise<AdminTask[]> {
  if (USE_MOCK_DATA) {
    return mockAdminTasks.map((task) => ({
      ...task,
      updated_at: task.created_at,
    }));
  }
  const { data, error } = await adminSupabase().from("admin_tasks").select("*").order("due_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getBuyerCompany(): Promise<BuyerCompany | null> {
  if (!USE_MOCK_DATA) {
    const { data, error } = await supabase().from("buyer_companies").select("*").limit(1).maybeSingle();
    if (error) return null;
    return data;
  }
  return mockBuyerCompanies[0] ?? null;
}

export async function getAdminMetrics() {
  if (!USE_MOCK_DATA) {
    const db = adminSupabase();
    const [
      suppliers,
      products,
      orders,
      quotes,
      applications,
      inquiries,
      revenueRows,
    ] = await Promise.all([
      db.from("suppliers").select("id", { count: "exact", head: true }),
      db.from("products").select("id", { count: "exact", head: true }),
      db.from("orders").select("id", { count: "exact", head: true }),
      db.from("quotes").select("id", { count: "exact", head: true }),
      db.from("applications").select("id", { count: "exact", head: true }).neq("status", "approved"),
      db.from("inquiries").select("id", { count: "exact", head: true }),
      db.from("orders").select("total_usd"),
    ]);
    const error = suppliers.error ?? products.error ?? orders.error ?? quotes.error ?? applications.error ?? inquiries.error ?? revenueRows.error;
    if (error) throw error;
    return {
      suppliers: suppliers.count ?? 0,
      products: products.count ?? 0,
      orders: orders.count ?? 0,
      quotes: quotes.count ?? 0,
      applications: applications.count ?? 0,
      inquiries: inquiries.count ?? 0,
      revenue: revenueRows.data?.reduce((total, order) => total + (order.total_usd ?? 0), 0) ?? 0,
    };
  }
  return {
    suppliers: mockSuppliers.length,
    products: mockProducts.length,
    orders: mockOrders.length,
    quotes: mockQuotes.length,
    applications: mockApplications.filter((item) => item.status !== "approved").length,
    inquiries: mockInquiries.length,
    revenue: mockOrders.reduce((total, order) => total + order.total_usd, 0),
  };
}

export async function getPageSections(page: string): Promise<PageSection[]> {
  if (USE_MOCK_DATA) {
    return mockPageSections
      .filter((section) => section.page === page && section.is_active)
      .sort((a, b) => a.order - b.order);
  }
  const { data, error } = await supabase()
    .from("page_sections")
    .select("*")
    .eq("page", page)
    .eq("is_active", true)
    .order("order", { ascending: true });
  if (error) throw error;
  return data;
}

function countValue(result: { count: number | null; error: unknown }) {
  if (result.error) throw result.error;
  return result.count ?? 0;
}

export type MarketplaceStats = {
  applicationsReceived: number;
  liveManufacturers: number;
  auditScored: number;
  underReview: number;
};

export async function getMarketplaceStats(): Promise<MarketplaceStats> {
  if (USE_MOCK_DATA) {
    return {
      applicationsReceived: 0,
      liveManufacturers: 0,
      auditScored: 0,
      underReview: 0,
    };
  }

  const db = adminSupabase();
  const [applications, liveManufacturers, auditScored, underReview] = await Promise.all([
    db.from("applications").select("id", { count: "exact", head: true }),
    db.from("suppliers").select("id", { count: "exact", head: true }).eq("is_active", true),
    db.from("applications").select("id", { count: "exact", head: true }).not("audit_score", "is", null),
    db.from("applications").select("id", { count: "exact", head: true }).in("status", ["approved", "visiting"] as any),
  ]);

  return {
    applicationsReceived: countValue(applications),
    liveManufacturers: countValue(liveManufacturers),
    auditScored: countValue(auditScored),
    underReview: countValue(underReview),
  };
}
