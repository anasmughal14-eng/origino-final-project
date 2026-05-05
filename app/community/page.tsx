import CommunityClient from "./CommunityClient";
import { getCommunityPosts } from "@/lib/data-service";

export default async function CommunityPage() {
  return <CommunityClient posts={await getCommunityPosts()} />;
}
