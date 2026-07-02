import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
        <FiAlertTriangle size={28} />
      </div>
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-gray-500 text-sm mb-6">This page doesn't exist or was moved.</p>
      <Link to="/" className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90">Back to home</Link>
    </div>
  );
}
