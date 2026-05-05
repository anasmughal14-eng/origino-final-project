import BlogClient from "./BlogClient";
import { getBlogPosts } from "@/lib/data-service";

export default async function BlogPage() {
  return <BlogClient posts={await getBlogPosts()} />;
}
