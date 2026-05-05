import CompetitiveIntelligenceClient from "./CompetitiveIntelligenceClient";

const intelligenceRecords = [
  {
    id: "ci-surgical-germany",
    category: "Surgical & Medical Instruments",
    market: "Germany",
    averagePrice: "$12.40",
    range: "$9.80 - $16.20",
    moq: "500 sets",
    leadTime: "24 days",
    sampleSize: 18,
    status: "active",
  },
  {
    id: "ci-textiles-france",
    category: "Textiles & Apparel",
    market: "France",
    averagePrice: "$8.10",
    range: "$6.40 - $11.90",
    moq: "1,200 pieces",
    leadTime: "36 days",
    sampleSize: 14,
    status: "active",
  },
  {
    id: "ci-cutlery-poland",
    category: "Engineering & Light Manufacturing",
    market: "Poland",
    averagePrice: "$5.70",
    range: "$4.20 - $7.80",
    moq: "800 units",
    leadTime: "42 days",
    sampleSize: 9,
    status: "review",
  },
];

export default function AdminCompetitiveIntelligencePage() {
  return <CompetitiveIntelligenceClient records={intelligenceRecords} />;
}
