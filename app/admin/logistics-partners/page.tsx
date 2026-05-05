import AdminRegistryTool from "../AdminRegistryTool";
import { loadAdminRegistryRecords } from "../registry-data";

const logisticsRecords = [
  {
    id: "log-karachi-customs-broker",
    name: "Karachi port customs broker",
    category: "Customs clearance",
    status: "active" as const,
    owner: "Logistics Ops",
    summary: "Port Qasim and Karachi Port customs clearance partner for food, chemicals, and general cargo lanes.",
    publicHref: "/logistics",
    metrics: ["Karachi", "Sea freight", "Food/Chemicals"],
  },
  {
    id: "log-sialkot-air-forwarder",
    name: "Sialkot air freight forwarder",
    category: "Air freight",
    status: "review" as const,
    owner: "Logistics Ops",
    summary: "DHL/FedEx export lane pricing needs monthly rate update for surgical instruments and sports goods.",
    publicHref: "/logistics",
    metrics: ["Sialkot", "DHL/FedEx", "Rate update"],
  },
  {
    id: "log-energy-solar-partner",
    name: "Solar equipment partner",
    category: "Energy support",
    status: "active" as const,
    owner: "Seller Success",
    summary: "Energy crisis mitigation partner for factories adding solar backup and green energy verification evidence.",
    publicHref: "/logistics",
    metrics: ["Solar", "Factory support", "Green badge"],
  },
  {
    id: "log-lahore-lcl-forwarder",
    name: "Lahore LCL consolidation partner",
    category: "LCL consolidation",
    status: "active" as const,
    owner: "Logistics Ops",
    summary: "Punjab small-order consolidation lane used by leather, furniture, and engineering exporters shipping mixed cargo.",
    publicHref: "/logistics",
    adminHref: "/admin/orders",
    metrics: ["Lahore", "LCL", "SME cargo"],
  },
  {
    id: "log-faisalabad-textile-forwarder",
    name: "Faisalabad textile freight desk",
    category: "Textile freight",
    status: "active" as const,
    owner: "Logistics Ops",
    summary: "Textile export lane partner for EU retailer shipments, packing lists, container booking, and shipment milestone updates.",
    publicHref: "/logistics",
    adminHref: "/admin/orders",
    metrics: ["Faisalabad", "Textiles", "Milestones"],
  },
  {
    id: "log-inspection-provider-network",
    name: "Inspection provider network",
    category: "Quality control",
    status: "active" as const,
    owner: "Inspection Ops",
    summary: "SGS, Bureau Veritas, Intertek Pakistan, and local PSI provider records connected to buyer inspection booking.",
    publicHref: "/logistics",
    adminHref: "/admin/inspection-providers",
    metrics: ["PSI", "AQL", "Inspection-linked"],
  },
];

export default async function AdminLogisticsPartnersPage() {
  const records = await loadAdminRegistryRecords("logistics-partners", logisticsRecords);

  return (
    <AdminRegistryTool
      eyebrow="Freight network"
      title="Logistics Partners"
      description="Maintain freight forwarders, customs brokers, carrier coverage, city lanes, and energy support partners used by shipment tracking and buyer sourcing flows."
      registryKey="logistics-partners"
      records={records}
      addLabel="Add Partner"
      publishLabel="Publish"
      externalHref="/logistics"
      externalLabel="View Public Directory"
    />
  );
}
