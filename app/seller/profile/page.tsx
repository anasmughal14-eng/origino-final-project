"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SellerProfilePage() {
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  return <div><h1 className="text-4xl">Supplier Profile</h1><div className="mt-6 grid gap-4 md:grid-cols-2"><input className="input-editorial" defaultValue="Crescent Surgical Works" onChange={() => setDirty(true)} /><input className="input-editorial" defaultValue="Sialkot" onChange={() => setDirty(true)} /><textarea className="input-editorial md:col-span-2" defaultValue="Sialkot manufacturer of reusable surgical and dental instruments." onChange={() => setDirty(true)} /></div><button className="btn-pill btn-pill-forest mt-5 min-h-[44px]" onClick={() => { setDirty(false); toast.success("Profile saved"); }}>Save</button>{dirty && <p className="mt-3 text-sm text-[#c0623a]">You have unsaved changes.</p>}</div>;
}
