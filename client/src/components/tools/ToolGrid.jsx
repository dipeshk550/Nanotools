import ToolCard from "./ToolCard";
import { FiSearch } from "react-icons/fi";

export default function ToolGrid({ tools, title }) {
  if (!tools?.length) return (
    <div className="text-center py-16 text-gray-400">
      <FiSearch size={36} className="mx-auto mb-3" />
      <p className="text-sm">No tools found. Try a different search.</p>
    </div>
  );

  return (
    <div>
      {title && <h2 className="text-sm font-medium text-gray-700 mb-3">{title}</h2>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {tools.map((t, i) => <ToolCard key={t.slug} tool={t} index={i} />)}
      </div>
    </div>
  );
}
