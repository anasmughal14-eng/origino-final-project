"use client";

import { useState } from "react";
import toast from "react-hot-toast";

type SequenceStatus = "active" | "paused";

type EmailSequence = {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  status: SequenceStatus;
  lastRun: string;
};

const initialSequences: EmailSequence[] = [
  { id: "seq-1", name: "Post-audit drip", trigger: "Audit score below conversion", steps: 4, status: "active", lastRun: "2026-05-04 08:00" },
  { id: "seq-2", name: "Application approved", trigger: "Admin approval", steps: 1, status: "active", lastRun: "2026-05-03 17:20" },
  { id: "seq-3", name: "Document expiry alert", trigger: "30 days before expiry", steps: 2, status: "paused", lastRun: "2026-05-01 09:00" },
  { id: "seq-4", name: "Health score warning", trigger: "Score below 40", steps: 1, status: "active", lastRun: "2026-05-02 06:30" },
];

export default function AdminEmailSequencesPage() {
  const [sequences, setSequences] = useState(initialSequences);
  const [testEmail, setTestEmail] = useState("");

  function toggleStatus(id: string) {
    setSequences((current) =>
      current.map((sequence) =>
        sequence.id === id ? { ...sequence, status: sequence.status === "active" ? "paused" : "active" } : sequence,
      ),
    );
    toast.success("Sequence status updated.");
  }

  function runSequence(id: string) {
    setSequences((current) => current.map((sequence) => (sequence.id === id ? { ...sequence, lastRun: new Date().toLocaleString() } : sequence)));
    toast.success("Sequence processor run completed.");
  }

  function sendTest() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      toast.error("Enter a valid email for the test send.");
      return;
    }
    setTestEmail("");
    toast.success("Test email queued.");
  }

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="section-kicker">Resend automation</span>
          <h1>Email Sequences</h1>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Manage audit drips, onboarding, quote, order, inspection, and health-warning sequences.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            className="input-editorial min-h-11 max-w-xs"
            value={testEmail}
            onChange={(event) => setTestEmail(event.target.value)}
            placeholder="test@example.com"
          />
          <button className="btn-pill btn-pill-outline" type="button" onClick={sendTest}>
            Send Test
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="border p-5">
          <p className="metric-text text-3xl">{sequences.length}</p>
          <p className="mt-2 text-ink-soft">Sequences</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{sequences.filter((sequence) => sequence.status === "active").length}</p>
          <p className="mt-2 text-ink-soft">Active</p>
        </div>
        <div className="border p-5">
          <p className="metric-text text-3xl">{sequences.reduce((sum, sequence) => sum + sequence.steps, 0)}</p>
          <p className="mt-2 text-ink-soft">Total steps</p>
        </div>
      </section>

      <section className="space-y-4">
        {sequences.map((sequence) => (
          <div className="border p-5" key={sequence.id}>
            <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex flex-wrap gap-3">
                  <span className="badge-patch">{sequence.status}</span>
                  <span className="badge-patch">{sequence.steps} steps</span>
                </div>
                <h2 className="mt-3 text-2xl">{sequence.name}</h2>
                <p className="mt-2 text-ink-soft">{sequence.trigger}</p>
                <p className="mt-2 text-sm text-ink-muted">Last run {sequence.lastRun}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="btn-pill btn-pill-outline" type="button" onClick={() => runSequence(sequence.id)}>
                  Run Now
                </button>
                <button className="btn-pill btn-pill-forest" type="button" onClick={() => toggleStatus(sequence.id)}>
                  {sequence.status === "active" ? "Pause" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
