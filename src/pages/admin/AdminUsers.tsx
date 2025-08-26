import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/clerk-react';
import { UserLogService, AdminUser, UserLog } from '@/lib/userLogService';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Activity, 
  Shield, 
  Mail, 
  Calendar, 
  Search,
  RefreshCw,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

export const AdminUsers = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [userLogs, setUserLogs] = useState<UserLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [users, logs] = await Promise.all([
        UserLogService.getAdminUsers(),
        UserLogService.getUserLogs(100, 0)
      ]);
      
      setAdminUsers(users);
      setUserLogs(logs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const filteredAdminUsers = adminUsers.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUserLogs = userLogs.filter(log => 
    log.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeVariant = (role: string) => {
    return role === 'super_admin' ? 'destructive' : 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout title={t('admin.pages.users')} subtitle={t('admin.pages.usersSubtitle')}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={t('admin.pages.users')} subtitle={t('admin.pages.usersSubtitle')}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t('admin.users.title')}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('admin.common.refresh')}
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.users.addUser')}
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('admin.users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{t('admin.users.tabs.users')}</span>
              <Badge variant="secondary">{filteredAdminUsers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>{t('admin.users.tabs.logs')}</span>
              <Badge variant="secondary">{filteredUserLogs.length}</Badge>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>{t('admin.users.adminUsers')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.users.table.name')}</TableHead>
                      <TableHead>{t('admin.users.table.email')}</TableHead>
                      <TableHead>{t('admin.users.table.role')}</TableHead>
                      <TableHead>{t('admin.users.table.permissions')}</TableHead>
                      <TableHead>{t('admin.users.table.lastLogin')}</TableHead>
                      <TableHead>{t('admin.users.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAdminUsers.map((adminUser) => (
                      <TableRow key={adminUser.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {adminUser.first_name} {adminUser.last_name}
                            </div>
                            <div className="text-sm text-gray-500">ID: {adminUser.user_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{adminUser.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(adminUser.role)}>
                            {adminUser.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {adminUser.permissions.map((permission) => (
                              <Badge key={permission} variant="outline" className="text-xs">
                                {permission}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {adminUser.last_login ? (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{formatDate(adminUser.last_login)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <span>{t('admin.users.activityLogs')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.users.table.user')}</TableHead>
                      <TableHead>{t('admin.users.table.action')}</TableHead>
                      <TableHead>{t('admin.users.table.resource')}</TableHead>
                      <TableHead>{t('admin.users.table.details')}</TableHead>
                      <TableHead>{t('admin.users.table.timestamp')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUserLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user_email}</div>
                            <div className="text-sm text-gray-500">ID: {log.user_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.resource_type}</div>
                            {log.resource_id && (
                              <div className="text-sm text-gray-500">ID: {log.resource_id}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.details ? (
                            <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          ) : (
                            <span className="text-sm text-gray-500">No details</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{formatDate(log.created_at || '')}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
