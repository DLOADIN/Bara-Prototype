import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { UserLogService } from '@/lib/userLogService';

export const useAuthLogging = () => {
  const { isSignedIn, user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      // Log successful sign in
      const userEmail = user.primaryEmailAddress?.emailAddress || '';
      UserLogService.logAuthEvent(user.id, userEmail, 'sign_in');
    }
  }, [isLoaded, isSignedIn, user]);

  return { isSignedIn, user, isLoaded };
};
