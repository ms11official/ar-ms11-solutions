import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User as UserIcon,
  Layers,
  Wrench,
  History,
  Settings,
  LogOut,
  Bell,
  Shield,
  Users,
  FileText,
  BarChart3,
  Tags,
  Sparkles,
  Heart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { CommandPalette } from "./CommandPalette";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import logo from "@/assets/logo.png";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);
  useKeyboardShortcuts();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      navigate("/login");
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/profile", icon: UserIcon, label: "My Profile" },
    { path: "/favorites", icon: Heart, label: "My Favorites" },
    { path: "/services", icon: Layers, label: "Services" },
    { path: "/tools", icon: Wrench, label: "Tools" },
    { path: "/ai", icon: Sparkles, label: "AI Tools" },
    { path: "/activity", icon: History, label: "Activity History" },
    { path: "/settings", icon: Settings, label: "Settings" },
  ];

  const adminNavItems = [
    { path: "/admin", icon: Shield, label: "Admin Dashboard" },
    { path: "/admin/users", icon: Users, label: "User Management" },
    { path: "/admin/categories", icon: Tags, label: "Categories" },
    { path: "/admin/ai-upload", icon: Sparkles, label: "AI Tools & Services" },
    { path: "/admin/logs", icon: FileText, label: "System Logs" },
    { path: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/admin/tools-upload", icon: Wrench, label: "Tools Upload" },
    { path: "/admin/services-upload", icon: Layers, label: "Services Upload" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <CommandPalette />
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} border-r border-border bg-card flex flex-col p-4 transition-all duration-300`}>
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="WavexFlow Logo" className="w-8 h-8 object-contain" />
            {!sidebarCollapsed && <h2 className="text-xl font-bold">WavexFlow</h2>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 hover:bg-accent rounded-lg transition-colors"
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        </div>

        <nav className="flex-1 pt-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive(item.path)
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                } ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon className="w-5 h-5" />
                {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            ))}

            {isAdmin && (
              <>
                {!sidebarCollapsed && (
                  <div className="px-3 py-2 mt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin
                    </p>
                  </div>
                )}
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                      isActive(item.path)
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                ))}
              </>
            )}
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground ${sidebarCollapsed ? 'justify-center' : ''}`}
          title={sidebarCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 flex items-center justify-end border-b border-border bg-background/80 backdrop-blur-sm px-10 py-3 z-10">
          <div className="flex items-center gap-4">
            <Link to="/upgrade">
              <Button size="default" className="font-bold bg-accent hover:bg-accent/90">
                Upgrade Plan
              </Button>
            </Link>
            <Link to="/notifications">
              <Button size="icon" variant="outline">
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-base font-medium">{userName}</h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
