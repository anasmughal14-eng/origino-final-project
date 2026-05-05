"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";

type DocRow = {
  name: string;
  status: "Verified" | "Pending verification" | "Expired" | "Not uploaded";
  fileName?: string;
  progress: number;
};

const initialDocs: DocRow[] = [
  { name: "NTN Certificate", status: "Verified", fileName: "ntn-crescent.pdf", progress: 100 },
  { name: "Company Registration", status: "Pending verification", progress: 55 },
  { name: "ISO Certificate", status: "Expired", fileName: "iso-13485-2024.pdf", progress: 100 },
  { name: "CE Certificate", status: "Not uploaded", progress: 0 },
];

export default function SellerDocumentsPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState("");

  function chooseFile(docName: string) {
    setSelectedDoc(docName);
    inputRef.current?.click();
  }

  function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file || !selectedDoc) return;
    setDocs((list) => list.map((doc) => doc.name === selectedDoc ? { ...doc, fileName: file.name, status: "Pending verification", progress: 75 } : doc));
    toast.success("Upload started");
  }

  return (
    <div>
      <h1 className="text-4xl">Document Vault</h1>
      <input ref={inputRef} type="file" className="hidden" onChange={(event) => upload(event.target.files)} />
      <div className="mt-6 space-y-3">
        {docs.map((doc) => (
          <div className="border p-4" key={doc.name}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{doc.name}</p>
                <p className="text-sm text-[#5a5a54]">{doc.status}{doc.fileName ? ` · ${doc.fileName}` : ""}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => chooseFile(doc.name)}>{doc.status === "Expired" ? "Re-upload" : "Upload"}</button>
                <button className="btn-pill btn-pill-outline min-h-[44px]" onClick={() => doc.fileName ? toast.success(`Opening ${doc.fileName}`) : toast.error("No document uploaded yet")}>View</button>
              </div>
            </div>
            {doc.progress > 0 && <div className="mt-4 h-2 bg-[#ede7dc]"><div className="h-2 bg-[#2d4a3e]" style={{ width: `${doc.progress}%` }} /></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
