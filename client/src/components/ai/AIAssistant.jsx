import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { FiX, FiSend } from "react-icons/fi";
import api from "../../utils/api";
import { TOOLS } from "../../utils/constants";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Tell me what you need to do — I'll recommend the right tools and help you get started." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const toolList = TOOLS.map(t => `${t.name} (${t.category}): ${t.description}`).join("\n");
      const { data } = await api.post("/ai/run", {
        toolName: "AI Assistant",
        input: `Available tools:\n${toolList}\n\nUser task: ${input}`,
        category: "AI",
        systemPrompt: "You are NanoTools AI assistant. Recommend 1-3 tools from the list for the user's task. Be friendly, concise (under 80 words), and suggest the tool name exactly as listed.",
      });
      setMessages(prev => [...prev, { role: "assistant", content: data.output }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting. Try again!" }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button data-ai-btn onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-brand text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-40">
        <HiSparkles size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity:0, y:16, scale:.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:16, scale:.95 }}
            className="fixed bottom-20 right-6 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-brand-light">
              <div className="flex items-center gap-2">
                <HiSparkles size={16} className="text-brand-mid" />
                <span className="text-sm font-medium text-brand-mid">AI Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={16} />
              </button>
            </div>

            <div className="h-64 overflow-y-auto p-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && <HiSparkles size={14} className="text-brand-mid shrink-0 mt-1" />}
                  <div className={`text-xs leading-relaxed px-3 py-2 rounded-xl max-w-[85%] ${m.role === "user" ? "bg-brand text-white" : "bg-gray-100 text-gray-800"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <HiSparkles size={14} className="text-brand-mid shrink-0 mt-1" />
                  <div className="text-xs text-gray-400 bg-gray-100 px-3 py-2 rounded-xl">Thinking...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="flex gap-2 p-3 border-t border-gray-100">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
                placeholder="What do you need help with?"
                className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand" />
              <button onClick={send} className="px-3 py-2 bg-brand text-white rounded-lg hover:opacity-90">
                <FiSend size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
