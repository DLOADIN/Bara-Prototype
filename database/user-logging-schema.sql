-- User Logging and Admin Management Schema
-- This file creates tables for tracking user activities and managing admin users

-- Create user_logs table for tracking all user activities
CREATE TABLE IF NOT EXISTS public.user_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for managing admin access
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    permissions TEXT[] DEFAULT ARRAY['read', 'write']::TEXT[],
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_logs_user_id ON public.user_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_logs_action ON public.user_logs(action);
CREATE INDEX IF NOT EXISTS idx_user_logs_resource_type ON public.user_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_user_logs_created_at ON public.user_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users(role);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_admin_users_updated_at();

-- Insert sample admin user (replace with your actual admin user)
INSERT INTO public.admin_users (user_id, email, first_name, last_name, role, permissions)
VALUES (
    'admin_user_1',
    'admin@example.com',
    'Admin',
    'User',
    'super_admin',
    ARRAY['read', 'write', 'delete', 'admin']
) ON CONFLICT (user_id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_logs
CREATE POLICY "Users can view their own logs" ON public.user_logs
    FOR SELECT USING (user_id = current_user);

CREATE POLICY "Admins can view all logs" ON public.user_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = current_user AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Users can insert their own logs" ON public.user_logs
    FOR INSERT WITH CHECK (user_id = current_user);

-- Create RLS policies for admin_users
CREATE POLICY "Admins can view admin users" ON public.admin_users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = current_user AND role IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Super admins can manage admin users" ON public.admin_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE user_id = current_user AND role = 'super_admin'
        )
    );

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.user_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admin_users TO authenticated;

-- Create a function to log user actions (can be called from application)
CREATE OR REPLACE FUNCTION log_user_action(
    p_user_id VARCHAR(255),
    p_user_email VARCHAR(255),
    p_action VARCHAR(100),
    p_resource_type VARCHAR(100),
    p_resource_id VARCHAR(255) DEFAULT NULL,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.user_logs (
        user_id, user_email, action, resource_type, resource_id, 
        details, ip_address, user_agent
    ) VALUES (
        p_user_id, p_user_email, p_action, p_resource_type, p_resource_id,
        p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION log_user_action(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR, JSONB, INET, TEXT) TO authenticated;
