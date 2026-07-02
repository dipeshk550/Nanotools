import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import ToolChain from "../components/tools/ToolChain";
import { useState } from "react";
import { HiSparkles } from "react-icons/hi2";
import Icon from "../utils/iconMap";

const TABS = ["Overview","Tool Chaining","History","Bookmarks","Settings"];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("Overview");

  return (
    <div className="max-w-4xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium">Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name?.split(" ")[0]}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${user?.plan === "free" ? "bg-gray-100 text-gray-600" : "bg-brand-light text-brand-mid"}`}>
            {user?.plan !== "free" && <HiSparkles size={11} />}
            {user?.plan === "free" ? "Free plan" : user?.plan}
          </span>
          {user?.plan === "free" && <Link to="/pricing" className="text-xs bg-brand text-white px-3 py-1.5 rounded-lg hover:opacity-90">Upgrade</Link>}
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-gray-100">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${tab===t ? "text-brand border-brand font-medium" : "text-gray-500 border-transparent hover:text-gray-700"}`}>{t}</button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[["AI Credits","" + (user?.aiCredits ?? 5),"HiSparkles",user?.plan==="free"?"Resets daily":"500/month"],["Tools used","12","FiCpu","This week"],["Files processed","47","FiUpload","This month"]].map(([l,v,i,s]) => (
              <div key={l} className="bg-white border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  {i === "HiSparkles" ? <HiSparkles size={16} /> : <Icon name={i} size={16} />}
                  <span className="text-xs">{l}</span>
                </div>
                <div className="text-2xl font-semibold text-brand">{v}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s}</div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="text-xs font-medium text-gray-600 mb-3">Recent tools</h3>
              <div className="space-y-2">
                {[["FiPackage","PDF Compressor","2h ago"],["FiEdit3","AI Content Writer","Yesterday"],["FiMaximize2","Image Resizer","2 days ago"]].map(([i,n,t]) => (
                  <div key={n} className="flex items-center gap-2 text-sm">
                    <Icon name={i} size={14} className="text-gray-400" />
                    <span className="flex-1">{n}</span><span className="text-xs text-gray-400">{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-4">
              <h3 className="text-xs font-medium text-gray-600 mb-3">Bookmarks</h3>
              <div className="space-y-2">
                {[["FiCode","JSON Formatter"],["FiLock","Password Generator"],["FiFileText","AI Summarizer"]].map(([i,n]) => (
                  <div key={n} className="flex items-center gap-2 text-sm">
                    <Icon name={i} size={14} className="text-gray-400" /><span>{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {user?.plan === "free" && (
            <div className="bg-gradient-to-r from-brand-light to-accent-light border border-brand/20 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-brand-mid mb-1">Upgrade to Pro</div>
                <div className="text-xs text-gray-500">Unlimited tools, no ads, 500 AI credits, API access</div>
              </div>
              <Link to="/pricing" className="shrink-0 bg-brand text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">Upgrade — $9/mo</Link>
            </div>
          )}
        </div>
      )}

      {tab === "Tool Chaining" && <ToolChain />}
      {tab === "History" && <div className="text-sm text-gray-400 py-8 text-center">Your tool history will appear here after you run some tools.</div>}
      {tab === "Bookmarks" && <div className="text-sm text-gray-400 py-8 text-center">Bookmark tools to find them here quickly.</div>}
      {tab === "Settings" && (
        <div className="max-w-sm space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Display name</label>
            <input defaultValue={user?.name} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Email</label>
            <input defaultValue={user?.email} disabled className="w-full px-3 py-2 border border-gray-100 rounded-lg text-sm text-gray-400 bg-gray-50" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-2">Theme</label>
            <div className="flex gap-2">
              {["Light","Dark","System"].map(t => <button key={t} className={`px-3 py-1.5 rounded-lg border text-xs ${t==="Light" ? "border-brand bg-brand-light text-brand-mid" : "border-gray-200 text-gray-500"}`}>{t}</button>)}
            </div>
          </div>
          <button className="px-4 py-2 bg-brand text-white rounded-lg text-sm hover:opacity-90">Save changes</button>
        </div>
      )}
    </div>
  );
}
