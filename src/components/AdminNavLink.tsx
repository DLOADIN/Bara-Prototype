import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const AdminNavLink = () => {
  return (
    <Link
      to="/admin"
      className="inline-flex items-center space-x-2 px-3 py-2 text-sm font-roboto font-medium text-gray-700 hover:text-white hover:bg-[#B284BE] rounded-md transition-colors duration-200"
    >
      <Shield className="w-4 h-4" />
      <span>Admin</span>
    </Link>
  );
};