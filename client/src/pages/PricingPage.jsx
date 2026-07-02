import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiX, FiChevronDown } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import api from "../utils/api";
import toast from "react-hot-toast";

const PLANS = [
  { id:"free", name:"Free", desc:"For occasional use", monthlyPrice:0, annualPrice:0,
    features:[["50 tool runs / day",true],["5 AI credits / day",true],["All 200+ tools",true],["File uploads",false],["Tool chaining",false],["No ads",false],["API access",false]] },
  { id:"pro", name:"Pro", desc:"For power users & creators", monthlyPrice:9, annualPrice:6, popular:true,
    features:[["Unlimited tool runs",true],["500 AI credits / month",true],["File uploads up to 50 MB",true],["Tool chaining workflows",true],["No ads",true],["Priority processing",true],["API access",false]] },
  { id:"team", name:"Team", desc:"For teams and businesses", monthlyPrice:29, annualPrice:20,
    features:[["Everything in Pro",true],["5 seats included",true],["2,000 AI credits / month",true],["API access",true],["Admin dashboard",true],["Workspace & history",true],["Dedicated support",true]] },
];

const FAQS = [
  ["Can I use all 200+ tools on the free plan?","Yes — every tool is available free. The limit is 50 runs/day and 5 AI credits. Upgrade for unlimited access."],
  ["What are AI credits?","AI credits power LLM-based tools (content writing, grammar check, code generation, etc.). Each AI tool run costs 1 credit. Non-AI tools are always free."],
  ["Can I cancel anytime?","Yes, cancel any time from your account settings. You keep Pro access until the end of your billing period."],
  ["Is there a free trial for Pro?","New users get a 7-day Pro trial — no credit card required."],
  ["Student or nonprofit discounts?","50% off Pro for verified students, teachers, and nonprofits. Contact support to apply."],
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(null);
  const { isAuthenticated } = useAuthStore();

  const handleUpgrade = async (planId) => {
    if (!isAuthenticated) { toast.error("Sign in first"); return; }
    if (planId === "free") return;
    setLoading(planId);
    try {
      const { data } = await api.post("/payments/create-checkout", { plan: planId, interval: billing === "annual" ? "year" : "month" });
      window.location.href = data.url;
    } catch (err) {
      toast.error("Could not start checkout. Try again.");
    }
    setLoading(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <motion.h1 initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} className="text-3xl font-semibold mb-3">Plans for every use</motion.h1>
        <p className="text-gray-500 text-sm mb-6">Start free, upgrade when you need more power. No hidden fees.</p>
        <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
          {["monthly","annual"].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all ${billing===b ? "bg-white font-medium shadow-sm" : "text-gray-500"}`}>
              {b.charAt(0).toUpperCase()+b.slice(1)}
              {b === "annual" && <span className="ml-1.5 text-xs bg-accent-light text-accent px-1.5 py-0.5 rounded-full">Save 30%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {PLANS.map((plan, i) => {
          const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
          return (
            <motion.div key={plan.id} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-2xl p-6 relative ${plan.popular ? "border-2 border-brand shadow-md" : "border border-gray-100"}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-medium px-3 py-1 rounded-full">Most popular</div>}
              <div className="mb-4">
                <div className="text-sm font-medium mb-1">{plan.name}</div>
                <div className="text-xs text-gray-500 mb-3">{plan.desc}</div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-semibold">${price}</span>
                  <span className="text-gray-400 text-sm mb-1">/mo</span>
                </div>
                {billing === "annual" && price > 0 && <div className="text-xs text-accent mt-1">Billed ${price*12}/year</div>}
              </div>
              <button onClick={() => handleUpgrade(plan.id)} disabled={loading === plan.id}
                className={`w-full py-2.5 rounded-xl text-sm font-medium mb-4 transition-all ${plan.popular ? "bg-brand text-white hover:opacity-90" : "border border-gray-200 text-gray-700 hover:bg-gray-50"} disabled:opacity-60`}>
                {loading === plan.id ? "Loading..." : plan.id === "free" ? "Start free" : plan.id === "team" ? "Contact sales" : "Upgrade to Pro"}
              </button>
              <div className="space-y-2.5">
                {plan.features.map(([feat, yes]) => (
                  <div key={feat} className="flex items-center gap-2 text-xs">
                    {yes ? <FiCheck size={13} className="text-accent shrink-0" /> : <FiX size={13} className="text-gray-300 shrink-0" />}
                    <span className={yes ? "text-gray-700" : "text-gray-400"}>{feat}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-xl mx-auto">
        <h2 className="text-base font-medium text-center mb-6">Common questions</h2>
        <div className="space-y-1">
          {FAQS.map(([q, a], i) => (
            <div key={i} className="border-b border-gray-100">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex justify-between items-center py-4 text-sm font-medium text-left">
                {q}<FiChevronDown size={15} className={`text-gray-400 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && <p className="text-xs text-gray-500 leading-relaxed pb-4">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
