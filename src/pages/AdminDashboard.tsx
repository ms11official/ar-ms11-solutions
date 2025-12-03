import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  Activity,
  Wrench,
  Layers,
  Upload,
  TrendingUp,
  Clock,
  FileText,
  Bell,
  ChevronRight,
  Server,
  Zap,
  Globe,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [toolsCount, setToolsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      const [toolsRes, servicesRes] = await Promise.all([
        supabase.from('tools').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }),
      ]);
      setToolsCount(toolsRes.count || 0);
      setServicesCount(servicesRes.count || 0);
    };
    if (!loading && !roleLoading && isAdmin) fetchCounts();
  }, [loading, roleLoading, isAdmin]);

  if (loading || roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <DashboardLayout>
      <div className="p-6 lg:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{greeting}, Admin</p>
                <h1 className="text-2xl lg:text-3xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Tools</p>
                <p className="text-3xl font-bold">{toolsCount}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Active
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Wrench className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Services</p>
                <p className="text-3xl font-bold">{servicesCount}</p>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" /> Active
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Layers className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Users</p>
                <p className="text-3xl font-bold">--</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Activity className="w-3 h-3 mr-1" /> Live
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">System Health</p>
                <p className="text-3xl font-bold">98%</p>
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <Zap className="w-3 h-3 mr-1" /> Optimal
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Server className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Cards */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/admin/tools-upload">
                <Card className="p-5 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Wrench className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Tools Upload</h3>
                      <p className="text-sm text-muted-foreground">Manage & upload tools</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link to="/admin/services-upload">
                <Card className="p-5 hover:border-green-500/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Layers className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Services Upload</h3>
                      <p className="text-sm text-muted-foreground">Manage & upload services</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link to="/admin/users">
                <Card className="p-5 hover:border-purple-500/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">User Management</h3>
                      <p className="text-sm text-muted-foreground">View & manage users</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link to="/admin/analytics">
                <Card className="p-5 hover:border-orange-500/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Analytics</h3>
                      <p className="text-sm text-muted-foreground">View system analytics</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link to="/admin/logs">
                <Card className="p-5 hover:border-cyan-500/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">System Logs</h3>
                      <p className="text-sm text-muted-foreground">View activity logs</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                  </div>
                </Card>
              </Link>

              <Link to="/settings">
                <Card className="p-5 hover:border-rose-500/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="w-6 h-6 text-rose-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Settings</h3>
                      <p className="text-sm text-muted-foreground">System configuration</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-rose-500 transition-colors" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">System Status</h2>
            <Card className="p-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm">API Server</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm">Database</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm">Storage</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm">Auth Service</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm">CDN</span>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Uptime</span>
                  <span className="text-sm font-medium">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-medium">45ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Requests/min</span>
                  <span className="text-sm font-medium">1.2k</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <Link to="/admin/logs">
                <Button variant="ghost" size="sm">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { action: "New tool uploaded", time: "2 min ago", status: "success" },
                { action: "Service updated", time: "15 min ago", status: "success" },
                { action: "User role changed", time: "1 hour ago", status: "info" },
                { action: "System backup completed", time: "3 hours ago", status: "success" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="text-sm">{item.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;