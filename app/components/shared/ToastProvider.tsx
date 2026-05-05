"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return <Toaster position="bottom-center" toastOptions={{ style: { background: "#1a1a18", color: "#f7f3ee" } }} />;
}
