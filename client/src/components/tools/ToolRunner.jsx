import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { FiCopy, FiX } from "react-icons/fi";
import api from "../../utils/api";
import toast from "react-hot-toast";

const SYSTEM_PROMPTS = {
  "ai-content-writer": "Write high-quality, engaging content. Be specific and practical. Format nicely.",
  "ai-summarizer": "Summarize the given text concisely. Keep key points. Output only the summary.",
  "ai-grammar-checker": "Fix all grammar and spelling errors. Output only the corrected text.",
  "ai-code-generator": "Generate clean, well-commented code. Include usage examples.",
  "ai-translator": "Translate accurately to the target language. Preserve tone and meaning.",
  "ai-resume-builder": "Build a professional, ATS-friendly resume. Use proper formatting.",
  "ai-email-writer": "Write a professional, concise email. Clear subject and body.",
  "ai-blog-writer": "Write an SEO-optimized blog post. Include headings and engaging content.",
  "ai-seo-optimizer": "Optimize for SEO: improve keywords, readability, and meta content.",
  "ai-cover-letter": "Write a compelling, personalized cover letter. Professional and concise.",
  "ai-hashtag-generator": "Generate 20 relevant, trending hashtags. Mix popular and niche tags.",
  "ai-prompt-generator": "Generate creative, effective AI prompts based on the user's goal.",
};

export default function ToolRunner({ tool }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runTool = async () => {
    if (!input.trim()) { toast.error("Please enter some input first"); return; }
    setLoading(true);
    setOutput("");
    try {
      const { data } = await api.post("/ai/run", {
        toolName: tool.name,
        input,
        category: tool.category,
        systemPrompt: SYSTEM_PROMPTS[tool.slug] || undefined,
      });
      setOutput(data.output);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-gray-600 block mb-2">Your input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          placeholder={`Describe what you want ${tool.name} to do...`}
          className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand resize-none bg-gray-50 leading-relaxed"
        />
      </div>

      <button
        onClick={runTool}
        disabled={loading}
        className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-all"
      >
        {loading ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Running...</>
        ) : (
          <><HiSparkles size={15} /> Run with AI</>
        )}
      </button>

      <AnimatePresence>
        {output && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-gray-600">Output</span>
                <div className="flex gap-2">
                  <button onClick={copyOutput} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded border border-gray-200 hover:bg-white transition-colors">
                    <FiCopy size={12} /> Copy
                  </button>
                  <button onClick={() => setOutput("")} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200 hover:bg-white transition-colors">
                    <FiX size={12} />
                  </button>
                </div>
              </div>
              <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed font-sans">{output}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
