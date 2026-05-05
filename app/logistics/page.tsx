"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const partners = [
  {
    name: "Karachi Port Customs Broker",
    city: "Karachi",
    type: "Customs clearance",
    coverage: "Port Qasim, Karachi Port, food, chemicals, general cargo",
    status: "active",
  },
  {
    name: "Sialkot Air Freight Desk",
    city: "Sialkot",
    type: "Air freight",
    coverage: "DHL/FedEx lanes for surgical instruments and sports goods",
    status: "rate review",
  },
  {
    name: "Faisalabad Textile Freight Desk",
    city: "Faisalabad",
    type: "Textile freight",
    coverage: "EU retailer shipments, container booking, packing-list checks",
    status: "active",
  },
  {
    name: "Lahore LCL Consolidation Partner",
    city: "Lahore",
    type: "LCL consolidation",
    coverage: "Leather, furniture, engineering, mixed SME cargo",
    status: "active",
  },
  {
    name: "Inspection Provider Network",
    city: "All clusters",
    type: "Quality control",
    coverage: "PSI, DUPRO, container loading, AQL report coordination",
    status: "active",
  },
];

export default function LogisticsPage() {
  const [city, setCity] = useState("all");
  const [type, setType] = useState("all");

  const cities = ["all", ...Array.from(new Set(partners.map((partner) => partner.city)))];
  const types = ["all", ...Array.from(new Set(partners.map((partner) => partner.type)))];
  const visiblePartners = useMemo(
    () => partners.filter((partner) => (city === "all" || partner.city === city) && (type === "all" || partner.type === type)),
    [city, type],
  );

  function requestIntro(name: string) {
    toast.success(`${name} intro request saved. Supabase will route this to logistics ops after connection.`);
  }

  return (
    <div className="container-editorial space-y-10 pb-16 pt-28">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Logistics network</span>
          <h1>Logistics Partners</h1>
          <p className="mt-3 max-w-3xl text-ink-soft">
            Freight forwarders, customs brokers, inspection providers, and energy support partners connected to shipment tracking, inspection booking, and seller readiness flows.
          </p>
        </div>
        <div className="text-right">
          <p className="metric-text text-3xl">{partners.length}</p>
          <p className="small-caps text-ink-muted">partner records</p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <select className="input-editorial min-h-11" value={city} onChange={(event) => setCity(event.target.value)}>
          {cities.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All cities" : item}
            </option>
          ))}
        </select>
        <select className="input-editorial min-h-11" value={type} onChange={(event) => setType(event.target.value)}>
          {types.map((item) => (
            <option key={item} value={item}>
              {item === "all" ? "All services" : item}
            </option>
          ))}
        </select>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {visiblePartners.map((partner) => (
          <article className="border p-5" key={partner.name}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="badge-patch">{partner.type}</span>
                <h2 className="mt-3 text-2xl">{partner.name}</h2>
                <p className="mt-2 text-ink-soft">{partner.city}</p>
              </div>
              <span className="badge-patch">{partner.status}</span>
            </div>
            <p className="mt-4 text-ink-soft">{partner.coverage}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="btn-pill btn-pill-forest" type="button" onClick={() => requestIntro(partner.name)}>
                Request Intro
              </button>
              <button className="btn-pill btn-pill-outline" type="button" onClick={() => toast.success("Shipment quote placeholder saved.")}>
                Quote Freight
              </button>
            </div>
          </article>
        ))}
      </section>

      {visiblePartners.length === 0 ? <div className="border border-dashed p-6 text-ink-muted">No logistics partners match these filters.</div> : null}
    </div>
  );
}
