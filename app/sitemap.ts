import type { MetadataRoute } from "next";
import { getBlogPosts, getClusters, getCommunityPosts, getExportGuides, getProducts, getSuppliers } from "@/lib/data-service";

const publicRoutes = [
  "",
  "/about",
  "/manufacturers",
  "/buyers",
  "/agents",
  "/marketplace",
  "/clusters",
  "/export-docs",
  "/awards",
  "/compare",
  "/logistics",
  "/landed-cost",
  "/status",
  "/community",
  "/blog",
  "/resources",
  "/marketing-packages",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refund",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [suppliers, products, clusters, guides, posts, blogs] = await Promise.all([
    getSuppliers(),
    getProducts(),
    getClusters(),
    getExportGuides(),
    getCommunityPosts(),
    getBlogPosts(),
  ]);
  const now = new Date();
  const routes = [
    ...publicRoutes,
    ...suppliers.map((supplier) => `/suppliers/${supplier.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
    ...clusters.map((cluster) => `/clusters/${cluster.slug}`),
    ...guides.map((guide) => `/export-docs/${guide.slug}`),
    ...posts.map((post) => `/community/${post.id}`),
    ...blogs.map((post) => `/blog/${post.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : route.startsWith("/suppliers") || route.startsWith("/products") ? 0.8 : 0.6,
  }));
}
