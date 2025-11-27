import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  User as UserIcon,
  Layers,
  Wrench,
  History,
  Settings,
  LogOut,
  Bell,
  BarChart3,
  Megaphone,
  Mail,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    // Listen for auth changes
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col p-4">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-6 h-6">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">AR-MS11</h2>
        </div>

        <nav className="flex-1 pt-4">
          <div className="flex flex-col gap-2">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2 text-primary"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm font-medium">My Profile</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Layers className="w-5 h-5" />
              <span className="text-sm font-medium">Services</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Wrench className="w-5 h-5" />
              <span className="text-sm font-medium">Tools</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <History className="w-5 h-5" />
              <span className="text-sm font-medium">Activity History</span>
            </Link>
            <Link
              to="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 flex items-center justify-end border-b border-border bg-background/80 backdrop-blur-sm px-10 py-3">
          <div className="flex items-center gap-4">
            <Button size="default" className="font-bold">
              Upgrade Plan
            </Button>
            <Button size="icon" variant="outline">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col text-left">
                <h1 className="text-base font-medium">{userName}</h1>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-10">
          {/* Page Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2">Welcome back, {userName}!</h1>
            <p className="text-base text-muted-foreground">
              Here's a summary of your account activity.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card border border-border">
              <p className="text-base font-medium">Active Services</p>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm font-medium text-green-600">+1 this month</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card border border-border">
              <p className="text-base font-medium">Tools Used</p>
              <p className="text-3xl font-bold">5</p>
              <p className="text-sm font-medium text-green-600">+2 this month</p>
            </div>
            <div className="flex flex-col gap-2 rounded-xl p-6 bg-card border border-border">
              <p className="text-base font-medium">Recent Activities</p>
              <p className="text-3xl font-bold">12</p>
              <p className="text-sm font-medium text-green-600">+5 this week</p>
            </div>
          </div>

          {/* Subscription and Quick Access */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Current Subscription */}
            <div className="xl:col-span-2">
              <h2 className="text-2xl font-bold mb-4">Current Subscription</h2>
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Badge className="mb-2">Pro Plan</Badge>
                    <p className="text-sm text-muted-foreground">
                      Renews on: 24 Aug, 2024
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/mo</span></p>
                    <Button variant="link" className="p-0 h-auto text-primary">
                      Manage Subscription
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tool Usage</span>
                    <span className="font-medium">1500 / 2000 used</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>

              {/* Recent Activity */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Recent Activity</h2>
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr className="text-left">
                        <th className="p-4 font-medium text-sm">ACTIVITY</th>
                        <th className="p-4 font-medium text-sm">DATE</th>
                        <th className="p-4 font-medium text-sm">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-4 text-sm">Logged in from new device</td>
                        <td className="p-4 text-sm text-muted-foreground">2 hours ago</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Success
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 text-sm">Updated profile information</td>
                        <td className="p-4 text-sm text-muted-foreground">1 day ago</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Success
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 text-sm">Service "SEO Booster" added</td>
                        <td className="p-4 text-sm text-muted-foreground">3 days ago</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Success
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-4 text-sm">Payment failed for invoice #1234</td>
                        <td className="p-4 text-sm text-muted-foreground">4 days ago</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Failed
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick Access Tools */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Quick Access Tools</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Keyword Analyzer</p>
                    <p className="text-xs text-muted-foreground">Analyze keyword performance.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Ad Campaign Builder</p>
                    <p className="text-xs text-muted-foreground">Create new ad campaigns.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Email Automations</p>
                    <p className="text-xs text-muted-foreground">Manage email sequences.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:bg-accent cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Explore All Tools</p>
                    <p className="text-xs text-muted-foreground">View your full toolset.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
