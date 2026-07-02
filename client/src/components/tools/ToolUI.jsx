import { useState } from "react";
import axios from "axios";
import { FiCopy, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── Reusable helpers ──────────────────────────────────────────────────────────
const copy = (text) => { navigator.clipboard.writeText(text); toast.success("Copied!"); };

function ResultBox({ result, mono = false }) {
  if (!result) return null;
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500">Result</span>
        <button onClick={() => copy(typeof result === "object" ? JSON.stringify(result, null, 2) : result)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded-lg hover:bg-white">
          <FiCopy size={11} /> Copy
        </button>
      </div>
      <pre className={`text-sm text-gray-800 whitespace-pre-wrap break-all leading-relaxed ${mono ? "font-mono" : "font-sans"}`}>
        {typeof result === "object" ? JSON.stringify(result, null, 2) : result}
      </pre>
    </div>
  );
}

function RunBtn({ label = "Run", loading, onClick }) {
  return (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-all">
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {label}
    </button>
  );
}

// ── Word Counter ──────────────────────────────────────────────────────────────
export function WordCounter() {
  const [text, setText] = useState("");
  const [data, setData] = useState(null);
  const run = async () => {
    const { data: r } = await axios.post(`${API}/t/word-counter`, { text });
    setData(r.data);
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => { setText(e.target.value); setData(null); }} rows={6}
        placeholder="Paste or type your text here..."
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50" />
      <RunBtn label="Count" onClick={run} />
      {data && (
        <div className="grid grid-cols-3 gap-3">
          {[["Words", data.words], ["Characters", data.chars], ["Chars (no spaces)", data.charsNoSpace],
            ["Sentences", data.sentences], ["Paragraphs", data.paragraphs], ["Reading time", `~${data.readingTime} min`]].map(([l, v]) => (
            <div key={l} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
              <div className="text-xl font-semibold text-brand">{v}</div>
              <div className="text-xs text-gray-500 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Case Converter ────────────────────────────────────────────────────────────
export function CaseConverter() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const modes = ["uppercase","lowercase","titlecase","sentencecase","camelcase","snakecase","kebabcase","alternating"];
  const run = async (mode) => {
    const { data: r } = await axios.post(`${API}/t/case-converter`, { text, mode });
    setResult(r.data.result);
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
        placeholder="Enter your text here..."
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50" />
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m} onClick={() => run(m)}
            className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-brand hover:bg-brand-light hover:text-brand-mid transition-colors capitalize">
            {m.replace("case", " case")}
          </button>
        ))}
      </div>
      {result && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-500">Result</span>
            <button onClick={() => copy(result)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 px-2 py-1 border border-gray-200 rounded-lg hover:bg-white"><FiCopy size={11}/> Copy</button>
          </div>
          <p className="text-sm text-gray-800 leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}

// ── Password Generator ────────────────────────────────────────────────────────
export function PasswordGenerator() {
  const [opts, setOpts] = useState({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true, count: 5 });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    const { data: r } = await axios.post(`${API}/t/password-generator`, opts);
    setData(r.data);
    setLoading(false);
  };
  const toggle = (key) => setOpts(o => ({ ...o, [key]: !o[key] }));
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-600">Length: {opts.length}</label>
          <input type="range" min={4} max={64} value={opts.length} onChange={e => setOpts(o => ({ ...o, length: +e.target.value }))}
            className="w-full mt-1 accent-brand" />
        </div>
        <div className="flex flex-wrap gap-3">
          {[["uppercase","A-Z"],["lowercase","a-z"],["numbers","0-9"],["symbols","!@#"]].map(([k, l]) => (
            <label key={k} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={opts[k]} onChange={() => toggle(k)} className="accent-brand" /> {l}
            </label>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-600">Count:</label>
          <input type="number" min={1} max={20} value={opts.count} onChange={e => setOpts(o => ({ ...o, count: +e.target.value }))}
            className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand" />
        </div>
      </div>
      <div className="flex gap-2">
        <RunBtn label="Generate" loading={loading} onClick={run} />
        {data && <button onClick={run} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><FiRefreshCw size={13}/> Regenerate</button>}
      </div>
      {data && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Strength:</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${data.strength === "Very Strong" || data.strength === "Strong" ? "bg-accent-light text-accent" : "bg-amber-50 text-amber-600"}`}>{data.strength}</span>
          </div>
          <div className="space-y-2">
            {data.passwords.map((p, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
                <code className="flex-1 text-sm font-mono text-gray-800 select-all">{p}</code>
                <button onClick={() => copy(p)} className="text-gray-400 hover:text-gray-700 shrink-0"><FiCopy size={13}/></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Hash Generator ────────────────────────────────────────────────────────────
export function HashGenerator() {
  const [text, setText] = useState("");
  const [algo, setAlgo] = useState("sha256");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const algos = ["md5","sha1","sha256","sha512","sha3-256","sha3-512"];
  const run = async () => {
    setLoading(true);
    try {
      const { data: r } = await axios.post(`${API}/t/hash-generator`, { text, algorithm: algo });
      setData(r.data);
    } catch(e) { toast.error(e.response?.data?.message || "Error"); }
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
        placeholder="Enter text to hash..."
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50" />
      <div className="flex flex-wrap gap-2">
        {algos.map(a => (
          <button key={a} onClick={() => setAlgo(a)}
            className={`px-3 py-1.5 text-xs font-mono border rounded-lg transition-colors ${algo === a ? "border-brand bg-brand-light text-brand-mid" : "border-gray-200 hover:border-brand text-gray-600"}`}>
            {a.toUpperCase()}
          </button>
        ))}
      </div>
      <RunBtn label="Generate Hash" loading={loading} onClick={run} />
      {data && <ResultBox result={data.hash} mono={true} />}
    </div>
  );
}

// ── UUID Generator ────────────────────────────────────────────────────────────
export function UUIDGenerator() {
  const [count, setCount] = useState(5);
  const [data, setData] = useState(null);
  const run = async () => {
    const { data: r } = await axios.post(`${API}/t/uuid-generator`, { count });
    setData(r.data);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600">Count:</label>
        <input type="number" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)}
          className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
      </div>
      <div className="flex gap-2">
        <RunBtn label="Generate UUIDs" onClick={run} />
        {data && <button onClick={run} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><FiRefreshCw size={13}/> Regenerate</button>}
      </div>
      {data && (
        <div className="space-y-2">
          {data.uuids.map((u, i) => (
            <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
              <code className="flex-1 text-sm font-mono text-gray-800 select-all">{u}</code>
              <button onClick={() => copy(u)} className="text-gray-400 hover:text-gray-700"><FiCopy size={13}/></button>
            </div>
          ))}
          <button onClick={() => copy(data.uuids.join("\n"))} className="text-xs text-brand hover:underline">Copy all</button>
        </div>
      )}
    </div>
  );
}

// ── Base64 ────────────────────────────────────────────────────────────────────
export function Base64Tool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("encode");
  const [result, setResult] = useState("");
  const run = async () => {
    const { data: r } = await axios.post(`${API}/t/base64`, { text, mode });
    setResult(r.data.result);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["encode","decode"].map(m => (
          <button key={m} onClick={() => { setMode(m); setResult(""); }}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors capitalize ${mode === m ? "bg-brand text-white border-brand" : "border-gray-200 text-gray-600 hover:border-brand"}`}>
            {m}
          </button>
        ))}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
        placeholder={mode === "encode" ? "Enter text to encode..." : "Enter base64 to decode..."}
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50 font-mono" />
      <RunBtn label={mode === "encode" ? "Encode to Base64" : "Decode from Base64"} onClick={run} />
      {result && <ResultBox result={result} mono={true} />}
    </div>
  );
}

// ── JSON Formatter ────────────────────────────────────────────────────────────
export function JSONFormatter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("format");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true); setError(""); setResult(null);
    try {
      const { data: r } = await axios.post(`${API}/t/json-formatter`, { text, mode });
      setResult(r.data.result);
    } catch(e) { setError(e.response?.data?.message || "Invalid JSON"); }
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[["format","Format / Prettify"],["minify","Minify"]].map(([m,l]) => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm rounded-lg border transition-colors ${mode === m ? "bg-brand text-white border-brand" : "border-gray-200 text-gray-600 hover:border-brand"}`}>{l}</button>
        ))}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
        placeholder={'{"key": "value", "items": [1, 2, 3]}'}
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50 font-mono" />
      <RunBtn label="Format JSON" loading={loading} onClick={run} />
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">{error}</div>}
      {result && <ResultBox result={result} mono={true} />}
    </div>
  );
}

// ── JWT Decoder ───────────────────────────────────────────────────────────────
export function JWTDecoder() {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const run = async () => {
    setError(""); setData(null);
    try {
      const { data: r } = await axios.post(`${API}/t/jwt-decoder`, { token });
      setData(r.data);
    } catch(e) { setError(e.response?.data?.message || "Invalid JWT"); }
  };
  return (
    <div className="space-y-4">
      <textarea value={token} onChange={e => setToken(e.target.value)} rows={4}
        placeholder="Paste your JWT token here..."
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand resize-none bg-gray-50 font-mono" />
      <RunBtn label="Decode JWT" onClick={run} />
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl">{error}</div>}
      {data && (
        <div className="space-y-3">
          {data.expired !== null && (
            <div className={`text-xs px-3 py-2 rounded-lg font-medium ${data.expired ? "bg-red-50 text-red-600 border border-red-200" : "bg-accent-light text-accent border border-accent/20"}`}>
              {data.expired ? "Token is EXPIRED" : `Token is valid · expires in ${Math.floor(data.expiresIn / 60)} minutes`}
            </div>
          )}
          {[["Header", data.header],["Payload", data.payload]].map(([label, val]) => (
            <div key={label}>
              <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
              <pre className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-xs font-mono text-gray-800 overflow-auto">{JSON.stringify(val, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Text Compare ──────────────────────────────────────────────────────────────
export function TextCompare() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    const { data: r } = await axios.post(`${API}/t/text-compare`, { text1, text2 });
    setData(r.data);
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Original text</label>
          <textarea value={text1} onChange={e => setText1(e.target.value)} rows={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Modified text</label>
          <textarea value={text2} onChange={e => setText2(e.target.value)} rows={6}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50" />
        </div>
      </div>
      <RunBtn label="Compare Texts" loading={loading} onClick={run} />
      {data && (
        <div className="space-y-2">
          <div className="flex gap-3 text-xs">
            <span className="bg-accent-light text-accent px-2 py-0.5 rounded-full">+{data.stats.added} added</span>
            <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded-full">−{data.stats.removed} removed</span>
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{data.stats.unchanged} unchanged</span>
            {data.stats.identical && <span className="bg-brand-light text-brand-mid px-2 py-0.5 rounded-full">Identical ✓</span>}
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 font-mono text-xs max-h-64 overflow-auto space-y-0.5">
            {data.diff.map((d, i) => (
              <div key={i} className={`px-2 py-0.5 rounded ${d.type === "added" ? "bg-green-50 text-green-700" : d.type === "removed" ? "bg-red-50 text-red-600 line-through" : "text-gray-600"}`}>
                {d.type === "added" ? "+" : d.type === "removed" ? "−" : " "} {d.text}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── EMI Calculator ────────────────────────────────────────────────────────────
export function EMICalculator() {
  const [form, setForm] = useState({ principal: "", rate: "", tenure: "" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const run = async () => {
    setLoading(true);
    try {
      const { data: r } = await axios.post(`${API}/t/emi-calculator`, form);
      setData(r.data);
    } catch(e) { toast.error(e.response?.data?.message || "Invalid values"); }
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[["principal","Loan Amount (₹)","e.g. 500000"],["rate","Annual Rate (%)","e.g. 8.5"],["tenure","Tenure (months)","e.g. 60"]].map(([k,l,p]) => (
          <div key={k}>
            <label className="text-xs font-medium text-gray-600 block mb-1">{l}</label>
            <input type="number" value={form[k]} onChange={e => setForm(f => ({...f,[k]:e.target.value}))} placeholder={p}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
          </div>
        ))}
      </div>
      <RunBtn label="Calculate EMI" loading={loading} onClick={run} />
      {data && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[["Monthly EMI", `₹${data.emi.toLocaleString()}`, "text-brand"],["Total Payment", `₹${data.totalPayment.toLocaleString()}`, "text-gray-700"],["Total Interest", `₹${data.totalInterest.toLocaleString()}`, "text-red-500"]].map(([l,v,c]) => (
              <div key={l} className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                <div className={`text-lg font-semibold ${c}`}>{v}</div>
                <div className="text-xs text-gray-500 mt-0.5">{l}</div>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Amortization (first 12 months)</p>
            <div className="overflow-auto rounded-xl border border-gray-100">
              <table className="w-full text-xs">
                <thead className="bg-gray-50"><tr>{["Month","EMI","Principal","Interest","Balance"].map(h => <th key={h} className="text-left px-3 py-2 text-gray-500 font-medium">{h}</th>)}</tr></thead>
                <tbody>
                  {data.schedule.map(row => (
                    <tr key={row.month} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="px-3 py-2">{row.month}</td>
                      <td className="px-3 py-2">₹{row.emi.toLocaleString()}</td>
                      <td className="px-3 py-2 text-accent">₹{row.principal.toLocaleString()}</td>
                      <td className="px-3 py-2 text-red-500">₹{row.interest.toLocaleString()}</td>
                      <td className="px-3 py-2">₹{row.balance.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Currency Converter ────────────────────────────────────────────────────────
export function CurrencyConverter() {
  const [form, setForm] = useState({ amount: "", from: "USD", to: "NPR" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const CURRENCIES = ["USD","EUR","GBP","JPY","INR","NPR","AUD","CAD","CHF","CNY","KRW","SGD","AED","BRL","MXN","ZAR","SEK","THB","MYR","HKD","NZD","PHP","IDR","PKR","BDT","EGP"];
  const run = async () => {
    setLoading(true);
    try {
      const { data: r } = await axios.post(`${API}/t/currency-converter`, form);
      setData(r.data);
    } catch(e) { toast.error(e.response?.data?.message || "Error"); }
    setLoading(false);
  };
  const swap = () => setForm(f => ({ ...f, from: f.to, to: f.from }));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 items-end">
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 block mb-1">Amount</label>
          <input type="number" value={form.amount} onChange={e => setForm(f => ({...f, amount: e.target.value}))} placeholder="100"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 block mb-1">From</label>
          <select value={form.from} onChange={e => setForm(f => ({...f, from: e.target.value}))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand bg-white">
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={swap} className="pb-0.5 text-gray-400 hover:text-brand text-lg font-bold">⇄</button>
        <div className="col-span-2">
          <label className="text-xs font-medium text-gray-600 block mb-1">To</label>
          <select value={form.to} onChange={e => setForm(f => ({...f, to: e.target.value}))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand bg-white">
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <RunBtn label="Convert" loading={loading} onClick={run} />
      {data && (
        <div className="bg-brand-light border border-brand/20 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">{data.amount} {data.from} =</p>
          <p className="text-3xl font-semibold text-brand">{data.result.toLocaleString()} <span className="text-lg">{data.to}</span></p>
          <p className="text-xs text-gray-400 mt-2">1 {data.from} = {data.rate} {data.to}</p>
          <p className="text-xs text-gray-400 mt-1">{data.note}</p>
        </div>
      )}
    </div>
  );
}

// ── QR Generator ──────────────────────────────────────────────────────────────
export function QRGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState(300);
  const [data, setData] = useState(null);
  const run = async () => {
    if (!text.trim()) { toast.error("Enter some text or URL"); return; }
    const { data: r } = await axios.post(`${API}/t/qr-generator`, { text, size });
    setData(r.data);
  };
  return (
    <div className="space-y-4">
      <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && run()}
        placeholder="Enter URL, text, phone number, email..."
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-gray-600 shrink-0">Size: {size}px</label>
        <input type="range" min={100} max={600} step={50} value={size} onChange={e => setSize(+e.target.value)}
          className="flex-1 accent-brand" />
      </div>
      <RunBtn label="Generate QR Code" onClick={run} />
      {data && (
        <div className="flex flex-col items-center gap-4">
          <img src={data.url} alt="QR Code" className="border border-gray-200 rounded-xl p-3 bg-white" style={{ width: Math.min(data.size, 320) }} />
          <a href={data.url} download="qrcode.png" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm hover:opacity-90">
            Download QR Code
          </a>
        </div>
      )}
    </div>
  );
}

// ── Lorem Ipsum ───────────────────────────────────────────────────────────────
export function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState(3);
  const [result, setResult] = useState("");
  const run = async () => {
    const { data: r } = await axios.post(`${API}/t/lorem-ipsum`, { paragraphs });
    setResult(r.data.result);
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-gray-600">Paragraphs:</label>
        <input type="number" min={1} max={20} value={paragraphs} onChange={e => setParagraphs(+e.target.value)}
          className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
      </div>
      <div className="flex gap-2">
        <RunBtn label="Generate" onClick={run} />
        {result && <button onClick={run} className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"><FiRefreshCw size={13}/> Regenerate</button>}
      </div>
      {result && <ResultBox result={result} />}
    </div>
  );
}

// ── Slug Generator ────────────────────────────────────────────────────────────
export function SlugGenerator() {
  const [text, setText] = useState("");
  const [sep, setSep] = useState("-");
  const [result, setResult] = useState("");
  const run = async () => {
    const { data: r } = await axios.post(`${API}/t/slug-generator`, { text, separator: sep });
    setResult(r.data.slug);
  };
  return (
    <div className="space-y-4">
      <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && run()}
        placeholder="e.g. Hello World! This is a title."
        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand" />
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-gray-600">Separator:</span>
        {["-","_"].map(s => (
          <button key={s} onClick={() => setSep(s)}
            className={`px-3 py-1.5 border rounded-lg text-sm font-mono ${sep === s ? "bg-brand text-white border-brand" : "border-gray-200 text-gray-600 hover:border-brand"}`}>{s}</button>
        ))}
      </div>
      <RunBtn label="Generate Slug" onClick={run} />
      {result && <ResultBox result={result} mono={true} />}
    </div>
  );
}

// ── GPA Calculator ─────────────────────────────────────────────────────────────
export function GPACalculator() {
  const [courses, setCourses] = useState([
    { name: "", credits: "", grade: "" },
    { name: "", credits: "", grade: "" },
  ]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const GRADES = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-","F"];
  const add = () => setCourses(c => [...c, { name: "", credits: "", grade: "" }]);
  const update = (i, k, v) => setCourses(c => c.map((r, idx) => idx === i ? { ...r, [k]: v } : r));
  const remove = (i) => setCourses(c => c.filter((_, idx) => idx !== i));
  const run = async () => {
    setLoading(true);
    try {
      const { data: r } = await axios.post(`${API}/t/gpa-calculator`, { courses });
      setData(r.data);
    } catch(e) { toast.error(e.response?.data?.message || "Error"); }
    setLoading(false);
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {courses.map((c, i) => (
          <div key={i} className="grid grid-cols-7 gap-2 items-center">
            <input value={c.name} onChange={e => update(i,"name",e.target.value)} placeholder="Course name"
              className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
            <input type="number" value={c.credits} onChange={e => update(i,"credits",e.target.value)} placeholder="Credits"
              className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
            <select value={c.grade} onChange={e => update(i,"grade",e.target.value)}
              className="col-span-1 px-2 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand bg-white">
              <option value="">Grade</option>
              {GRADES.map(g => <option key={g}>{g}</option>)}
            </select>
            <button onClick={() => remove(i)} className="text-gray-300 hover:text-red-400 col-span-1 text-center">✕</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="text-xs text-brand hover:underline">+ Add course</button>
      <RunBtn label="Calculate GPA" loading={loading} onClick={run} />
      {data && (
        <div className="bg-brand-light border border-brand/20 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">Your GPA</p>
          <p className="text-5xl font-bold text-brand">{data.gpa}</p>
          <p className="text-xs text-gray-400 mt-2">Total credits: {data.totalCredits}</p>
        </div>
      )}
    </div>
  );
}
