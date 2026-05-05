import type { Metadata } from "next";
import ClustersClient from "./ClustersClient";

export const metadata: Metadata = { title: "Manufacturing Clusters" };

const clusters = [
  { slug: "sialkot", name: "Sialkot", tagline: "World Capital of Surgical Instruments", value: "$800M+", categories: ["Surgical", "Sports", "Leather"], img: "https://images.unsplash.com/photo-1565021005021-9e9ae2af0edd?w=600&q=70" },
  { slug: "faisalabad", name: "Faisalabad", tagline: "Manchester of Pakistan", value: "$3.2B+", categories: ["Textiles", "Knitwear", "Home"], img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70" },
  { slug: "lahore", name: "Lahore", tagline: "Gateway to Pakistani Design", value: "$1.4B+", categories: ["Fashion", "Leather", "Furniture"], img: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=70" },
  { slug: "karachi", name: "Karachi", tagline: "Pakistan's Commercial Capital", value: "$5.1B+", categories: ["Chemicals", "Seafood", "Engineering"], img: "https://images.unsplash.com/photo-1494526585095-c41746359bc6?w=600&q=70" },
  { slug: "gujranwala", name: "Gujranwala", tagline: "City of Steel & Ceramics", value: "$600M+", categories: ["Steel", "Ceramics", "Electrical"], img: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=600&q=70" },
];

export default function ClustersPage() {
  return <ClustersClient clusters={clusters} />;
}
