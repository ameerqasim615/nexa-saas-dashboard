"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Layers3, LockKeyhole, Mail } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@nexa-demo.com");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Sign in failed.");
      router.push("/"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Something went wrong."); }
    finally { setLoading(false); }
  }
  return <section className="login-card">
    <div className="brand-mark"><Layers3 size={22} /></div>
    <p className="eyebrow">WELCOME BACK</p><h1>Sign in to Nexa</h1><p className="muted">Manage your workspace from one simple place.</p>
    <form onSubmit={submit} className="login-form">
      <label>Email address</label><div className="field-wrap"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
      <label>Password</label><div className="field-wrap"><LockKeyhole size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8}/></div>
      {error && <p className="form-error">{error}</p>}
      <button className="primary-btn full-btn" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowRight size={17}/></button>
    </form>
    <div className="demo-hint"><strong>Demo credentials</strong><span>admin@nexa-demo.com</span><span>ChangeMe123!</span><small>Change these credentials before deploying publicly.</small></div>
  </section>;
}
