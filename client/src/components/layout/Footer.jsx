import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10 px-6 mt-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-semibold text-sm mb-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">N</div>
            NanoTools AI
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">200+ free online tools powered by AI. No signup required.</p>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">Tools</div>
          {["AI Tools","PDF Tools","Image Tools","Developer Tools"].map(l => (
            <div key={l} className="text-xs text-gray-500 mb-1.5 hover:text-gray-700 cursor-pointer">{l}</div>
          ))}
        </div>
        <div>
          <div className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">Company</div>
          {[["Pricing","/pricing"],["Blog","/blog"],["About","#"],["API","#"]].map(([l,h]) => (
            <Link key={l} to={h} className="block text-xs text-gray-500 mb-1.5 hover:text-gray-700">{l}</Link>
          ))}
        </div>
        <div>
          <div className="text-xs font-medium text-gray-700 mb-3 uppercase tracking-wider">Newsletter</div>
          <p className="text-xs text-gray-500 mb-2">New tools & AI updates weekly.</p>
          <div className="flex gap-1">
            <input type="email" placeholder="your@email.com" className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-brand" />
            <button className="px-3 py-1.5 bg-brand text-white text-xs rounded-lg hover:opacity-90 flex items-center justify-center">
              <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>© 2026 NanoTools AI. All rights reserved.</span>
        <div className="flex gap-4">
          <span className="hover:text-gray-600 cursor-pointer">Privacy</span>
          <span className="hover:text-gray-600 cursor-pointer">Terms</span>
          <span className="hover:text-gray-600 cursor-pointer">Contact</span>
        </div>
      </div>
    </footer>
  );
}
