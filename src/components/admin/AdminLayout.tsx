import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  Bell, 
  Search, 
  User,
  LogOut,
  Settings
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AdminLayout = ({ children, title, subtitle }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      // Sign out from Clerk (this will clear the session)
      await signOut();
      
      // Clear any local storage or session data
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.clear();
      
      // Clear any cookies if they exist
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      // Redirect to homepage
      navigate('/');
      
      // Force a page reload to clear any remaining state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, try to sign out and redirect
      try {
        await signOut();
      } catch (signOutError) {
        console.error('Sign out error:', signOutError);
      }
      navigate('/');
      window.location.reload();
    }
  };

  const getPageTitle = () => {
    if (title) return title;
    
    const path = location.pathname;
    if (path === "/admin") return "Dashboard";
    if (path === "/admin/cities") return "Cities Management";
    if (path === "/admin/countries") return "Countries Management";
    if (path === "/admin/businesses") return "Businesses Management";
    if (path === "/admin/reviews") return "Reviews Management";
    if (path === "/admin/users") return "Users Management";
    if (path === "/admin/analytics") return "Analytics";
    if (path === "/admin/reports") return "Reports";
    if (path === "/admin/security") return "Security";
    if (path === "/admin/settings") return "Settings";
    return "Admin Panel";
  };

  const getPageSubtitle = () => {
    if (subtitle) return subtitle;
    return "Manage your Bara application";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="bg-white shadow-md"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-comfortaa font-bold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-600 font-roboto mt-1">
                {getPageSubtitle()}
              </p>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yp-blue focus:border-transparent font-roboto"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>

              {/* User menu */}
              <div className="relative group">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-yp-blue to-yp-green rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block font-roboto">Admin User</span>
                </Button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 font-roboto">
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-100 font-roboto">
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </button>
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 font-roboto"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}; 