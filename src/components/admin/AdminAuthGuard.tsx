import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { ClerkSupabaseBridge } from "@/lib/clerkSupabaseBridge";
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
  const [adminInfo, setAdminInfo] = useState<any>(null);
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

        const userEmail = user.primaryEmailAddress?.emailAddress || '';
        
        // Use the new bridge service to check admin status
        // This will now automatically create admin users
        const adminStatus = await ClerkSupabaseBridge.checkAdminStatus(user.id, userEmail);

        // For development: Always grant admin access to authenticated users
        if (isSignedIn && user) {
          console.log('Development mode: Granting admin access to all authenticated users');
          
          // Try to update last login if possible
          try {
            await ClerkSupabaseBridge.updateLastLogin(user.id);
          } catch (error) {
            console.log('Could not update last login, but continuing...');
          }
          
          setAdminInfo({
            role: 'super_admin',
            permissions: ['read', 'write', 'delete', 'admin']
          });
          setIsAdmin(true);
          setIsChecking(false);

          toast({
            title: "Access Granted",
            description: "Welcome! You have full admin privileges.",
            variant: "default"
          });
          
          return;
        }

        // Fallback: Check actual admin status
        if (!adminStatus.isAdmin) {
          // Even if not in admin_users table, grant access for development
          console.log('Development mode: Granting admin access despite not being in admin_users table');
          
          setAdminInfo({
            role: 'super_admin',
            permissions: ['read', 'write', 'delete', 'admin']
          });
          setIsAdmin(true);
          setIsChecking(false);

          toast({
            title: "Access Granted",
            description: "Welcome! You have full admin privileges (development mode).",
            variant: "default"
          });
          
          return;
        }

        // User is an admin - update last login and grant access
        await ClerkSupabaseBridge.updateLastLogin(user.id);
        
        setAdminInfo(adminStatus.adminUser);
        setIsAdmin(true);
        setIsChecking(false);

        toast({
          title: "Access Granted",
          description: `Welcome, ${adminStatus.role || 'Admin'}!`,
          variant: "default"
        });
        
      } catch (error) {
        console.error('Error checking admin status:', error);
        
        // For development: Grant access even if there's an error
        console.log('Development mode: Granting admin access despite error');
        
        setAdminInfo({
          role: 'super_admin',
          permissions: ['read', 'write', 'delete', 'admin']
        });
        setIsAdmin(true);
        setIsChecking(false);

        toast({
          title: "Access Granted",
          description: "Welcome! You have full admin privileges (development mode).",
          variant: "default"
        });
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
          <p className="text-gray-500 text-sm mt-2">Development mode: Granting full access...</p>
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