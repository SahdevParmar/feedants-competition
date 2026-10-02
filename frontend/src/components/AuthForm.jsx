import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

export default function AuthForm({ onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form);
      }
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex mb-4 bg-slate-100 rounded-lg p-1">
        {["login", "signup"].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setError(""); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${
              mode === m ? "bg-white text-brand shadow-sm" : "text-slate-500"
            }`}
          >
            {m === "login" ? "Login" : "Sign Up"}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-xs rounded-md p-2 mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <>
            <input
              type="text" placeholder="Full name" value={form.name}
              onChange={update("name")} required minLength={3}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="text" placeholder="Username" value={form.username}
              onChange={update("username")} required minLength={3}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </>
        )}
        <input
          type="email" placeholder="Email" value={form.email}
          onChange={update("email")} required
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="password" placeholder="Password" value={form.password}
          onChange={update("password")} required minLength={6}
          className="w-full border rounded-lg px-3 py-2 text-sm"
        />
        <Button
          type="submit" disabled={loading}
          className='w-full'
        >
          {loading ? "Please wait…" : mode === "login" ? "Login" : "Create account"}
          <ArrowUpRight className="h-8 w-8 text-green-500 stroke-[2.5]"/>
        </Button>
      </form>
    </>
  );
}