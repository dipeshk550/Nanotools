import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { FiUsers, FiX, FiArrowRight } from "react-icons/fi";
import { useToolStore } from "../store/toolStore";
import { TOOLS, CATEGORIES } from "../utils/constants";
import ToolGrid from "../components/tools/ToolGrid";
import AIAssistant from "../components/ai/AIAssistant";
import Icon from "../utils/iconMap";

const TRENDING = [
  { name:"AI Content Writer", slug:"ai-content-writer", icon:"FiEdit3", users:"48K/day" },
  { name:"Background Remover", slug:"background-remover", icon:"FiScissors", users:"32K/day" },
  { name:"PDF to Word", slug:"pdf-to-word", icon:"FiFileText", users:"28K/day" },
  { name:"AI Resume Builder", slug:"ai-resume-builder", icon:"FiFileText", users:"21K/day" },
  { name:"Password Generator", slug:"password-generator", icon:"FiLock", users:"18K/day" },
];

export default function HomePage() {
  const { activeCategory, searchQuery, filteredTools, setCategory } = useToolStore();

  useState(() => { useToolStore.getState().setTools(TOOLS); }, []);

  const displayed = searchQuery || activeCategory ? filteredTools() : null;

  return (
    <div>
      {!searchQuery && !activeCategory && (
        <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 px-6 py-12 text-center">
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>
            <span className="inline-flex items-center gap-1.5 bg-brand-light text-brand-mid text-xs font-medium px-3 py-1 rounded-full mb-4">
              <HiSparkles size={13} /> AI-powered productivity suite
            </span>
            <h1 className="text-4xl font-semibold tracking-tight mb-3">
              Every tool you need,<br /><span className="text-brand">supercharged with AI</span>
            </h1>
            <p className="text-gray-500 text-base max-w-md mx-auto mb-6 leading-relaxed">
              200+ free online tools for PDF, images, video, SEO, writing, and more — no signup required.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.slice(0,8).map(c => (
                <button key={c.name} onClick={() => setCategory(c.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-brand hover:text-brand transition-colors">
                  <Icon name={c.icon} size={13} /> {c.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      <div className="px-6 py-6 space-y-8">
        {(searchQuery || activeCategory) && (
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-medium text-gray-700">
              {activeCategory ? `${activeCategory} tools` : `Results for "${searchQuery}"`}
            </h2>
            <button onClick={() => { setCategory(null); useToolStore.getState().setSearch(""); }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 px-2 py-0.5 rounded border border-gray-200">
              <FiX size={11} /> Clear
            </button>
          </div>
        )}

        {displayed ? (
          <ToolGrid tools={displayed} />
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[["200+","Tools available","text-brand"],["1.2M","Users this month","text-accent"],["840K","Files processed today","text-amber-600"]].map(([v,l,c]) => (
                <div key={l} className="bg-white border border-gray-100 rounded-xl p-4">
                  <div className={`text-2xl font-semibold ${c}`}>{v}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{l}</div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-brand-light to-accent-light border border-brand/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shrink-0">
                <HiSparkles size={22} className="text-brand-mid" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-brand-mid mb-1">Meet your AI assistant</h3>
                <p className="text-xs text-gray-500 leading-relaxed">Not sure which tool to use? Describe your task and AI will recommend the right tools and chain them together.</p>
              </div>
              <button onClick={() => document.querySelector('[data-ai-btn]')?.click()}
                className="shrink-0 bg-brand-mid text-white text-xs font-medium px-4 py-2 rounded-lg hover:opacity-90">
                Try it free
              </button>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-3">Trending now</h2>
              <div className="space-y-2">
                {TRENDING.map((t,i) => (
                  <Link key={t.slug} to={`/tools/${t.slug}`}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:border-brand transition-colors">
                    <span className="text-xs font-medium text-gray-300 w-4">{i+1}</span>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
                      <Icon name={t.icon} size={15} />
                    </div>
                    <span className="flex-1 text-sm font-medium">{t.name}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><FiUsers size={11} /> {t.users}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-700 mb-3">Browse categories</h2>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.name} onClick={() => setCategory(c.name)}
                    className="flex flex-col items-center gap-1.5 p-3 bg-white border border-gray-100 rounded-xl hover:border-brand hover:bg-brand-light/30 transition-colors">
                    <Icon name={c.icon} size={20} className="text-gray-600" />
                    <span className="text-xs text-gray-600">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-700">Popular tools</h2>
                <button onClick={() => { useToolStore.getState().setSearch(" "); }} className="text-xs text-brand hover:underline flex items-center gap-1">
                  See all <FiArrowRight size={11} />
                </button>
              </div>
              <ToolGrid tools={TOOLS.slice(0, 20)} />
            </div>
          </>
        )}
      </div>

      <AIAssistant />
    </div>
  );
}
