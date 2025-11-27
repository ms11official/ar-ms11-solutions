import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogIn,
  UserCog,
  Plus,
  CreditCard,
  Mail,
  Settings,
  Download,
  Search,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const activityData = [
  {
    id: 1,
    type: "login",
    description: "Logged in from new device",
    timestamp: "2 hours ago",
    status: "success",
    icon: LogIn,
    details: "Chrome on Windows",
  },
  {
    id: 2,
    type: "profile",
    description: "Updated profile information",
    timestamp: "1 day ago",
    status: "success",
    icon: UserCog,
    details: "Changed display name",
  },
  {
    id: 3,
    type: "service",
    description: 'Service "SEO Booster" added',
    timestamp: "3 days ago",
    status: "success",
    icon: Plus,
    details: "Pro plan service activated",
  },
  {
    id: 4,
    type: "payment",
    description: "Payment failed for invoice #1234",
    timestamp: "4 days ago",
    status: "failed",
    icon: CreditCard,
    details: "Insufficient funds",
  },
  {
    id: 5,
    type: "email",
    description: "Email campaign sent",
    timestamp: "5 days ago",
    status: "success",
    icon: Mail,
    details: "Campaign: Summer Sale 2024",
  },
  {
    id: 6,
    type: "settings",
    description: "Changed account settings",
    timestamp: "1 week ago",
    status: "success",
    icon: Settings,
    details: "Updated notification preferences",
  },
  {
    id: 7,
    type: "login",
    description: "Logged in from mobile device",
    timestamp: "1 week ago",
    status: "success",
    icon: LogIn,
    details: "Safari on iOS",
  },
  {
    id: 8,
    type: "service",
    description: 'Service "Email Marketing Pro" renewed',
    timestamp: "2 weeks ago",
    status: "success",
    icon: Plus,
    details: "Monthly subscription renewed",
  },
  {
    id: 9,
    type: "payment",
    description: "Payment successful for invoice #1235",
    timestamp: "2 weeks ago",
    status: "success",
    icon: CreditCard,
    details: "$49.00 processed",
  },
  {
    id: 10,
    type: "profile",
    description: "Password changed",
    timestamp: "3 weeks ago",
    status: "success",
    icon: UserCog,
    details: "Security update completed",
  },
];

const ActivityHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredActivities = activityData.filter((activity) => {
    const matchesSearch =
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || activity.type === filterType;
    const matchesStatus = filterStatus === "all" || activity.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Activity History</h1>
          <p className="text-base text-muted-foreground">
            Track all your account activities and events
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{activityData.length}</p>
                <p className="text-sm text-muted-foreground">Total Activities</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {activityData.filter((a) => a.status === "success").length}
                </p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {activityData.filter((a) => a.status === "failed").length}
                </p>
                <p className="text-sm text-muted-foreground">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Activity Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="profile">Profile</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium">{activity.description}</p>
                      <Badge
                        variant={
                          activity.status === "success" ? "secondary" : "destructive"
                        }
                        className={
                          activity.status === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : ""
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {filteredActivities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No activities found matching your filters
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActivityHistory;
