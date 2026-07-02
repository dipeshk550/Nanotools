import { useState } from "react";
import { useToolStore } from "../../store/toolStore";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowDown, FiPlus, FiX, FiPlay, FiCopy } from "react-icons/fi";
import Icon from "../../utils/iconMap";

const AVAILABLE = [
  { name:"AI Summarizer", slug:"ai-summarizer", icon:"FiFileText", isAI:true },
  { name:"AI Grammar Checker", slug:"ai-grammar-checker", icon:"FiCheckCircle", isAI:true },
  { name:"AI Translator", slug:"ai-translator", icon:"FiGlobe", isAI:true },
  { name:"AI SEO Optimizer", slug:"ai-seo-optimizer", icon:"FiTrendingUp", isAI:true },
  { name:"AI Blog Writer", slug:"ai-blog-writer", icon:"FiBookOpen", isAI:true },
  { name:"Word Counter", slug:"word-counter", icon:"FiHash", isAI:false },
  { name:"Case Converter", slug:"case-converter", icon:"FiType", isAI:false },
];

export default function ToolChain() {
  const { chainSteps, addChainStep, removeChainStep, clearChain } = useToolStore();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [showPicker, setShowPicker] = useState(false);

  const runChain = async () => {
    if (!input.trim()) { toast.error("Enter some input first"); return; }
    if (chainSteps.length === 0) { toast.error("Add at least one step"); return; }
    setRunning(true); setOutput(""); setCurrentStep(0);
    let current = input;
    for (let i = 0; i < chainSteps.length; i++) {
      setCurrentStep(i);
      const step = chainSteps[i];
      if (step.isAI) {
        try {
          const { data } = await api.post("/ai/run", { toolName: step.name, input: current, category: "AI" });
          current = data.output;
        } catch { toast.error(`Step ${i+1} failed`); break; }
      } else {
        if (step.slug === "word-counter") {
          const words = current.trim().split(/\s+/).length;
          current = `Words: ${words} | Characters: ${current.length} | Sentences: ${(current.match(/[.!?]+/g)||[]).length}\n\n${current}`;
        } else if (step.slug === "case-converter") {
          current = current.toUpperCase();
        }
      }
      await new Promise(r => setTimeout(r, 300));
    }
    setOutput(current); setRunning(false); setCurrentStep(-1);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-base font-medium mb-1">Tool chaining</h2>
      <p className="text-sm text-gray-500 mb-4">Each tool's output feeds into the next step automatically.</p>

      <div className="space-y-2 mb-3">
        <AnimatePresence>
          {chainSteps.map((step, i) => (
            <motion.div key={step.id} initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-8 }}>
              {i > 0 && <div className="text-gray-300 text-center py-1"><FiArrowDown size={14} className="inline" /></div>}
              <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-colors ${currentStep === i ? "border-brand bg-brand-light" : "border-gray-100 bg-white"}`}>
                <Icon name={step.icon} size={18} className="text-gray-500" />
                <span className="flex-1 font-medium">{step.name}</span>
                {step.isAI && <span className="badge-ai">AI</span>}
                {currentStep === i && running && <span className="w-3 h-3 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />}
                <button onClick={() => removeChainStep(step.id)} className="text-gray-300 hover:text-gray-500">
                  <FiX size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button onClick={() => setShowPicker(!showPicker)} className="w-full flex items-center justify-center gap-1.5 border border-dashed border-gray-200 rounded-xl py-2.5 text-sm text-gray-400 hover:border-brand hover:text-brand transition-colors mb-4">
        <FiPlus size={14} /> Add step
      </button>

      {showPicker && (
        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          {AVAILABLE.map(t => (
            <button key={t.slug} onClick={() => { addChainStep(t); setShowPicker(false); }}
              className="flex items-center gap-2 p-2 bg-white border border-gray-100 rounded-lg text-xs hover:border-brand transition-colors text-left">
              <Icon name={t.icon} size={14} className="text-gray-500" /><span>{t.name}</span>
            </button>
          ))}
        </div>
      )}

      <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder="Paste your input text here..."
        className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50 mb-3" />

      <div className="flex gap-2 mb-4">
        <button onClick={runChain} disabled={running}
          className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60">
          {running ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running...</> : <><FiPlay size={14} /> Run workflow</>}
        </button>
        <button onClick={clearChain} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Clear</button>
      </div>

      {output && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Final output</span>
            <button onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
              <FiCopy size={12} /> Copy
            </button>
          </div>
          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">{output}</pre>
        </div>
      )}
    </div>
  );
}
