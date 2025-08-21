import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Building2, 
  MapPin, 
  Globe, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Plus,
  AlertCircle
} from "lucide-react";
import { db } from "@/lib/supabase";

interface DashboardStats {
  totalUsers: number;
  totalBusinesses: number;
  totalCities: number;
  totalCountries: number;
  totalReviews: number;
  recentGrowth: number;
}

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBusinesses: 0,
    totalCities: 0,
    totalCountries: 0,
    totalReviews: 0,
    recentGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // Fetch counts from different tables
        const [usersResult, businessesResult, citiesResult, countriesResult, reviewsResult] = await Promise.all([
          db.users().select('*', { count: 'exact', head: true }),
          db.businesses().select('*', { count: 'exact', head: true }),
          db.cities().select('*', { count: 'exact', head: true }),
          db.countries().select('*', { count: 'exact', head: true }),
          db.reviews().select('*', { count: 'exact', head: true })
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalBusinesses: businessesResult.count || 0,
          totalCities: citiesResult.count || 0,
          totalCountries: countriesResult.count || 0,
          totalReviews: reviewsResult.count || 0,
          recentGrowth: 12.5 // Mock growth percentage
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "bg-blue-500",
      change: "+12%",
      changeType: "positive" as const
    },
    {
      title: "Total Businesses",
      value: stats.totalBusinesses.toLocaleString(),
      icon: Building2,
      color: "bg-green-500",
      change: "+8%",
      changeType: "positive" as const
    },
    {
      title: "Total Cities",
      value: stats.totalCities.toLocaleString(),
      icon: MapPin,
      color: "bg-purple-500",
      change: "+5%",
      changeType: "positive" as const
    },
    {
      title: "Total Countries",
      value: stats.totalCountries.toLocaleString(),
      icon: Globe,
      color: "bg-orange-500",
      change: "+2%",
      changeType: "positive" as const
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews.toLocaleString(),
      icon: MessageSquare,
      color: "bg-pink-500",
      change: "+15%",
      changeType: "positive" as const
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New business registered",
      business: "Kigali Coffee House",
      city: "Kigali, Rwanda",
      time: "2 hours ago",
      type: "business"
    },
    {
      id: 2,
      action: "New review submitted",
      business: "Nairobi Tech Solutions",
      city: "Nairobi, Kenya",
      time: "4 hours ago",
      type: "review"
    },
    {
      id: 3,
      action: "New city added",
      business: "Kampala",
      city: "Uganda",
      time: "1 day ago",
      type: "city"
    },
    {
      id: 4,
      action: "User account created",
      business: "john.doe@email.com",
      city: "Lagos, Nigeria",
      time: "1 day ago",
      type: "user"
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard" subtitle="Overview and analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yp-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard" subtitle="Overview and analytics">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-roboto font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-1.5 sm:p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-comfortaa font-bold text-yp-dark">
                {stat.value}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                )}
                <span className={`text-xs sm:text-sm font-roboto ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription className="font-roboto text-sm">
              Latest actions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="w-2 h-2 bg-yp-blue rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-roboto font-medium text-gray-900 truncate">
                      {activity.action}
                    </p>
                    <p className="text-sm font-roboto text-gray-600 truncate">
                      {activity.business} • {activity.city}
                    </p>
                    <p className="text-xs font-roboto text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs flex-shrink-0">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-comfortaa text-base sm:text-lg">Quick Actions</CardTitle>
            <CardDescription className="font-roboto text-sm">
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto p-2 sm:p-3 md:p-4 flex-col space-y-2">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-roboto text-xs sm:text-sm">Add Business</span>
              </Button>
              <Button variant="outline" className="h-auto p-2 sm:p-3 md:p-4 flex-col space-y-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-roboto text-xs sm:text-sm">Add City</span>
              </Button>
              <Button variant="outline" className="h-auto p-2 sm:p-3 md:p-4 flex-col space-y-2">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-roboto text-xs sm:text-sm">Add Country</span>
              </Button>
              <Button variant="outline" className="h-auto p-2 sm:p-3 md:p-4 flex-col space-y-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-roboto text-xs sm:text-sm">View Reviews</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-comfortaa">System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-green-800">Database</p>
                <p className="font-roboto text-sm text-green-600">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-blue-800">Storage</p>
                <p className="font-roboto text-sm text-blue-600">85% capacity used</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-roboto font-medium text-yellow-800">Performance</p>
                <p className="font-roboto text-sm text-yellow-600">Response time: 120ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}; 