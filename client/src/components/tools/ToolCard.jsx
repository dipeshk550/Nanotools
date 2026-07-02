import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../../utils/iconMap";
import { HiSparkles } from "react-icons/hi2";

const BADGE_MAP = { ai: "badge-ai", new: "badge-new", hot: "badge-hot" };

export default function ToolCard({ tool, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link to={`/tools/${tool.slug}`}
        className="block group bg-white border border-gray-100 rounded-xl p-4 hover:border-brand hover:shadow-sm transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-brand-light group-hover:text-brand-mid transition-colors">
            <Icon name={tool.icon} size={18} />
          </div>
          {tool.badge && (
            <span className={BADGE_MAP[tool.badge] || ""}>
              {tool.badge === "ai" ? (
                <span className="inline-flex items-center gap-0.5"><HiSparkles size={11} /> AI</span>
              ) : tool.badge === "new" ? "New" : "Hot"}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">{tool.name}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{tool.description}</p>
      </Link>
    </motion.div>
  );
}
