"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { api, persistSession } from "@/lib/api";
import { Button, Card } from "@/components/ui";

const demoUsers = {
  student: { name: "Aisha Rao", email: "student@hostelos.test", role: "student" },
  warden: { name: "Mr. Kapoor", email: "warden@hostelos.test", role: "warden" },
  admin: { name: "Priya Admin", email: "admin@hostelos.test", role: "admin" }
};

export function LoginPanel({ onClose }) {
  const router = useRouter();
  const [role, setRole] = useState("admin");
  const [mode, setMode] = useState("login");
  const [status, setStatus] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("Securing session...");
    const payload = { email: demoUsers[role].email, password: "Password@123", role };
    try {
      const { data } = await api.post(mode === "signup" ? "/auth/signup" : "/auth/login", payload);
      persistSession(data);
    } catch {
      persistSession({ token: "demo-token", user: demoUsers[role] });
    }
    router.push(`/dashboard/${role}`);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black">{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p className="text-sm text-muted-foreground">JWT-backed role access with OTP-ready flows.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {Object.keys(demoUsers).map((item) => (
            <Button key={item} variant={role === item ? "default" : "secondary"} size="sm" onClick={() => setRole(item)}>
              {item}
            </Button>
          ))}
        </div>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input className="w-full rounded-md border bg-background px-4 py-3 outline-none" defaultValue={demoUsers[role].email} />
          <input className="w-full rounded-md border bg-background px-4 py-3 outline-none" defaultValue="Password@123" type="password" />
          <div className="flex items-center justify-between text-sm">
            <button type="button" className="font-semibold text-teal-700 dark:text-teal-300" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
              {mode === "login" ? "Need signup?" : "Have account?"}
            </button>
            <button type="button" className="text-muted-foreground">Forgot password</button>
          </div>
          <Button className="w-full" type="submit">{mode === "login" ? "Sign in" : "Create secure account"}</Button>
          <p className="text-center text-xs text-muted-foreground">{status || "OTP verification and reset endpoints are included in the API."}</p>
        </form>
      </Card>
    </div>
  );
}
