import { supabase } from './supabase';

export interface UserLog {
  user_id: string;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
}

export class UserLogService {
  /**
   * Log a user action to the database
   */
  static async logAction(logData: UserLog): Promise<boolean> {
    try {
      console.log('Attempting to log user action:', logData);
      
      const { data, error } = await supabase
        .from('user_logs')
        .insert({
          user_id: logData.user_id,
          user_email: logData.user_email,
          action: logData.action,
          resource_type: logData.resource_type,
          resource_id: logData.resource_id,
          details: logData.details,
          ip_address: logData.ip_address,
          user_agent: logData.user_agent || navigator.userAgent,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to log user action:', error);
        
        // Handle specific error codes
        if (error.code === '42501') {
          console.error('RLS Policy Violation: The user_logs table has restrictive RLS policies');
          console.error('This usually means the RLS policies need to be updated to allow authenticated users');
        } else if (error.code === '401') {
          console.error('Unauthorized: The user is not properly authenticated');
        } else if (error.code === '406') {
          console.error('Not Acceptable: There might be a content negotiation issue');
        }
        
        return false;
      }

      console.log('Successfully logged user action:', data);
      return true;
    } catch (error) {
      console.error('Error logging user action:', error);
      return false;
    }
  }

  /**
   * Log user authentication events
   */
  static async logAuthEvent(userId: string, userEmail: string, action: 'sign_in' | 'sign_up' | 'sign_out'): Promise<boolean> {
    return await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action: action,
      resource_type: 'authentication',
      details: {
        timestamp: new Date().toISOString(),
        event: action,
        platform: 'web',
        source: 'clerk'
      }
    });
  }

  /**
   * Log admin actions
   */
  static async logAdminAction(userId: string, userEmail: string, action: string, resourceType: string, resourceId?: string, details?: any): Promise<boolean> {
    return await this.logAction({
      user_id: userId,
      user_email: userEmail,
      action: action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: {
        ...details,
        timestamp: new Date().toISOString(),
        admin_action: true,
        source: 'clerk'
      }
    });
  }

  /**
   * Get user logs for a specific user
   */
  static async getUserLogs(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch user logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching user logs:', error);
      return [];
    }
  }

  /**
   * Get all admin logs (for admin users)
   */
  static async getAdminLogs(limit: number = 100): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch admin logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }
  }

  /**
   * Get recent activity logs
   */
  static async getRecentLogs(limit: number = 20): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Failed to fetch recent logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching recent logs:', error);
      return [];
    }
  }
}
