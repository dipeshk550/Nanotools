import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { useAuthStore } from "../../store/authStore";
import { useToolStore } from "../../store/toolStore";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { setSearch } = useToolStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setSearch(e.target.value);
    if (e.target.value) navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
      <Link to="/" className="flex items-center gap-2 font-semibold text-sm shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center text-white text-xs font-bold">N</div>
        NanoTools AI
      </Link>

      <div className="flex-1 max-w-md mx-4 relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search 200+ tools..."
          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand bg-gray-50"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Dashboard
            </Link>
            <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
              Logout
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-mid text-sm font-medium">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              Sign in
            </Link>
            <Link to="/pricing" className="text-sm bg-brand text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <HiSparkles size={13} /> Go Pro
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
