import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiGrid, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useToolStore } from "../../store/toolStore";
import { CATEGORIES } from "../../utils/constants";
import Icon from "../../utils/iconMap";

const NAV = [
  { label: "Home", icon: FiHome, to: "/" },
  { label: "Dashboard", icon: FiGrid, to: "/dashboard" },
  { label: "Pricing", icon: HiSparkles, to: "/pricing" },
  { label: "Blog", icon: FiAward, to: "/blog" },
];

export default function Sidebar() {
  const { setCategory, activeCategory } = useToolStore();
  const navigate = useNavigate();

  const handleCat = (name) => {
    setCategory(name === activeCategory ? null : name);
    navigate("/");
  };

  return (
    <aside className="w-52 shrink-0 border-r border-gray-100 bg-white py-4 hidden md:block">
      <div className="mb-4">
        {NAV.map((n) => {
          const NavIcon = n.icon;
          return (
            <NavLink key={n.to} to={n.to} end={n.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${isActive ? "text-brand border-r-2 border-brand bg-brand-light font-medium" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}`
              }>
              <NavIcon size={15} />{n.label}
            </NavLink>
          );
        })}
      </div>

      <div className="px-4 mb-2 text-xs font-medium text-gray-400 uppercase tracking-wider">Categories</div>
      {CATEGORIES.map((c) => (
        <button key={c.name} onClick={() => handleCat(c.name)}
          className={`w-full flex items-center gap-2.5 px-4 py-1.5 text-sm transition-colors text-left ${activeCategory === c.name ? "text-brand bg-brand-light border-r-2 border-brand font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
          <Icon name={c.icon} size={14} />{c.name}
        </button>
      ))}
    </aside>
  );
}
