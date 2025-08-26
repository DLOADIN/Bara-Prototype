import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { supabase } from "@/lib/supabase";
import { UserLogService } from "@/lib/userLogService";
import { useToast } from "@/components/ui/use-toast";

interface AdminAuthGuardProps {
  children: ReactNode;
}

export const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isLoaded) return;
      
      if (!isSignedIn) {
        // User is not signed in, redirect to sign-in
        navigate('/sign-in');
        return;
      }

      try {
        // Get Clerk JWT token
        const token = await getToken();
        
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Unable to verify authentication token",
            variant: "destructive"
          });
          navigate('/sign-in');
          return;
        }

        // Check if user exists in admin_users table
        const { data: adminUser, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error || !adminUser) {
          // User is not an admin
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        // Log the admin login
        await UserLogService.logAdminAction(
          user.id, 
          user.primaryEmailAddress?.emailAddress || '', 
          'login', 
          'admin_panel'
        );

        setIsAdmin(true);
        setIsChecking(false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Error",
          description: "Failed to verify admin access",
          variant: "destructive"
        });
        navigate('/sign-in');
      }
    };

    checkAdminStatus();
  }, [isLoaded, isSignedIn, user, navigate, getToken, toast]);

  // Show loading while checking authentication
  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // If not admin, don't render children
  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}; 