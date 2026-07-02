import { useState } from "react";
import { FiUsers, FiTrendingUp, FiTrendingDown, FiDollarSign, FiSettings } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const TABS = ["Overview","Users","Tools","Revenue","Logs"];

const USERS = [
  { name:"Arjun Sharma", email:"arjun@example.com", plan:"pro", status:"Active", joined:"Jun 28" },
  { name:"Maria Chen", email:"maria@example.com", plan:"free", status:"Active", joined:"Jun 27" },
  { name:"James Okafor", email:"james@example.com", plan:"pro", status:"Trial", joined:"Jun 26" },
  { name:"Priya Nair", email:"priya@example.com", plan:"free", status:"Active", joined:"Jun 25" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("Overview");

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-medium">Admin Dashboard</h1>
        <span className="text-xs bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-full font-medium">Admin only</span>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-100">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${tab===t ? "text-brand border-brand font-medium" : "text-gray-500 border-transparent hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[["128,440","Total users",FiUsers,"+14%","text-brand"],["9,812","Pro subscribers",HiSparkles,"+8.7%","text-accent"],["$88,308","MRR",FiDollarSign,"+11.3%","text-amber-600"],["840K","Tool runs today",FiTrendingUp,"-2.1%","text-gray-700"]].map(([v,l,Ic,d,c]) => (
              <div key={l} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500"><Ic size={13} />{l}</div>
                <div className={`text-2xl font-semibold ${c}`}>{v}</div>
                <div className={`text-xs mt-1 flex items-center gap-1 ${d.startsWith("+") ? "text-accent" : "text-red-500"}`}>
                  {d.startsWith("+") ? <FiTrendingUp size={11}/> : <FiTrendingDown size={11}/>} {d}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="text-xs font-medium text-gray-600 mb-3">Top tools by usage</h3>
              {[["AI Content Writer",92],["Background Remover",78],["PDF to Word",65],["JSON Formatter",54],["Password Generator",43]].map(([n,p]) => (
                <div key={n} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-500 w-28 truncate">{n}</span>
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-brand rounded-full" style={{width:`${p}%`}}/></div>
                  <span className="text-xs text-gray-400 w-6 text-right">{p}%</span>
                </div>
              ))}
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="text-xs font-medium text-gray-600 mb-3">System logs</h3>
              {[["API rate limit upgraded","2 min ago","text-accent"],["New tool: AI Script Generator","18 min ago","text-brand"],["Stripe webhook retry","1h ago","text-amber-500"],["Cloudinary quota 82%","3h ago","text-red-500"],["1,200 new signups","6h ago","text-accent"]].map(([m,t,c]) => (
                <div key={m} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${c.replace("text-","bg-")}`}></span>
                  <div className="flex-1"><div className="text-xs text-gray-700">{m}</div><div className="text-xs text-gray-400">{t}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "Users" && (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>
              {["Name","Email","Plan","Status","Joined","Actions"].map(h => <th key={h} className="text-xs font-medium text-gray-500 text-left px-4 py-3">{h}</th>)}
            </tr></thead>
            <tbody>
              {USERS.map(u => (
                <tr key={u.email} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{u.email}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.plan==="pro" ? "bg-brand-light text-brand-mid" : "bg-gray-100 text-gray-500"}`}>{u.plan}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${u.status==="Active" ? "bg-accent-light text-accent" : "bg-amber-50 text-amber-600"}`}>{u.status}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{u.joined}</td>
                  <td className="px-4 py-3"><button className="text-xs text-brand hover:underline">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Tools" && <div className="text-sm text-gray-400 py-8 text-center flex flex-col items-center gap-2"><FiSettings size={28}/> Tool management — add, edit, or disable tools from here.</div>}
      {tab === "Revenue" && <div className="text-sm text-gray-400 py-8 text-center flex flex-col items-center gap-2"><FiDollarSign size={28}/> Revenue analytics, Stripe payments, and subscription breakdown.</div>}
      {tab === "Logs" && <div className="text-sm text-gray-400 py-8 text-center">Winston logs, error tracking, and audit trail.</div>}
    </div>
  );
}
