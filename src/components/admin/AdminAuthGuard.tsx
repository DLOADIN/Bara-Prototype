import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AdminAuthGuardProps {
  children: ReactNode;
}

export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const navigate = useNavigate();

  // TODO: Replace with Clerk authentication check
  const isAuthenticated = true; // This will be replaced with Clerk auth check
  const isAdmin = true; // This will be replaced with Clerk role check

  if (!isAuthenticated) {
    // Redirect to login page
    navigate('/');
    return null;
  }

  if (!isAdmin) {
    // Redirect to unauthorized page
    navigate('/');
    return null;
  }

  return <>{children}</>;
}; 