import { useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";

function Login() {
  const [form, setForm] = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await login(form.email, form.password); navigate("/dashboard"); toast.success("Welcome back!"); }
    catch (err) { toast.error(err.response?.data?.message || "Login failed"); }
    setLoading(false);
  };

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000';

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm">
      <h1 className="text-xl font-semibold mb-1">Sign in</h1>
      <p className="text-sm text-gray-500 mb-6">Welcome back to NanoTools AI</p>
      <form onSubmit={submit} className="space-y-3">
        <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
        <input type="password" required placeholder="Password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
        <div className="text-right"><Link to="/auth/forgot" className="text-xs text-brand hover:underline">Forgot password?</Link></div>
        <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <div className="flex items-center gap-3 my-4"><div className="flex-1 h-px bg-gray-100"/><span className="text-xs text-gray-400">or</span><div className="flex-1 h-px bg-gray-100"/></div>
      <div className="grid grid-cols-2 gap-2">
        <a href={`${apiBase}/api/auth/google`} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
          <FcGoogle size={16} /> Google
        </a>
        <a href={`${apiBase}/api/auth/github`} className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
          <AiFillGithub size={16} /> GitHub
        </a>
      </div>
      <p className="text-xs text-center text-gray-500 mt-4">Don't have an account? <Link to="/auth/register" className="text-brand hover:underline">Sign up free</Link></p>
    </motion.div>
  );
}

function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [step, setStep] = useState("form");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, verifyOTP } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { const data = await register(form.name, form.email, form.password); setUserId(data.userId); setStep("otp"); toast.success("OTP sent to your email!"); }
    catch (err) { toast.error(err.response?.data?.message || "Registration failed"); }
    setLoading(false);
  };

  const verify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await verifyOTP(userId, otp); navigate("/dashboard"); toast.success("Welcome to NanoTools!"); }
    catch (err) { toast.error(err.response?.data?.message || "Invalid OTP"); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="w-full max-w-sm">
      {step === "form" ? (
        <>
          <h1 className="text-xl font-semibold mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-6">Join 128K+ users using NanoTools AI</p>
          <form onSubmit={submit} className="space-y-3">
            <input type="text" required placeholder="Full name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
            <input type="email" required placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
            <input type="password" required minLength={6} placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>
          <p className="text-xs text-center text-gray-500 mt-4">Already have an account? <Link to="/auth/login" className="text-brand hover:underline">Sign in</Link></p>
        </>
      ) : (
        <>
          <h1 className="text-xl font-semibold mb-1">Verify your email</h1>
          <p className="text-sm text-gray-500 mb-6">Enter the 6-digit code sent to <strong>{form.email}</strong></p>
          <form onSubmit={verify} className="space-y-3">
            <input type="text" required maxLength={6} placeholder="000000" value={otp} onChange={e => setOtp(e.target.value)} className="w-full px-3 py-3 border border-gray-200 rounded-xl text-2xl font-mono text-center tracking-widest focus:outline-none focus:border-brand" />
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-brand text-white rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-60">
              {loading ? "Verifying..." : "Verify & continue"}
            </button>
          </form>
        </>
      )}
    </motion.div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand to-brand-mid items-center justify-center text-white p-12">
        <div>
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-bold mb-6">N</div>
          <h2 className="text-3xl font-semibold mb-4">200+ tools,<br />one platform</h2>
          <div className="space-y-3">
            {["PDF, Image, Video & Audio processing","AI writing, coding & content tools","No signup needed for most tools","Pro plan: unlimited + API access"].map(f => (
              <div key={f} className="flex items-center gap-2 text-white/80 text-sm"><FiCheck size={14} className="text-accent-light shrink-0" />{f}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="flex items-center gap-2 font-semibold text-sm mb-8">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">N</div>
            NanoTools AI
          </Link>
          <Routes>
            <Route index element={<Login />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
