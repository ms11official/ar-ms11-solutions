import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCheck,
  Trash2,
  Mail,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const notificationsData = [
  {
    id: 1,
    type: "success",
    title: "Payment Successful",
    message: "Your payment of $49.00 has been processed successfully",
    timestamp: "2 minutes ago",
    read: false,
    icon: CreditCard,
  },
  {
    id: 2,
    type: "info",
    title: "New Feature Available",
    message: "Check out our new Email Automation tool",
    timestamp: "1 hour ago",
    read: false,
    icon: Bell,
  },
  {
    id: 3,
    type: "warning",
    title: "Subscription Expiring Soon",
    message: "Your Pro plan will expire in 7 days",
    timestamp: "3 hours ago",
    read: true,
    icon: AlertCircle,
  },
  {
    id: 4,
    type: "success",
    title: "Campaign Performance",
    message: "Your email campaign achieved 35% open rate",
    timestamp: "5 hours ago",
    read: true,
    icon: TrendingUp,
  },
  {
    id: 5,
    type: "info",
    title: "Weekly Report Ready",
    message: "Your weekly analytics report is available to download",
    timestamp: "1 day ago",
    read: true,
    icon: Mail,
  },
  {
    id: 6,
    type: "warning",
    title: "High Usage Alert",
    message: "You've used 85% of your monthly tool quota",
    timestamp: "2 days ago",
    read: true,
    icon: AlertCircle,
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
    toast({
      title: "Success",
      description: "All notifications marked as read",
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast({
      title: "Deleted",
      description: "Notification removed",
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "Cleared",
      description: "All notifications have been cleared",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Notifications</h1>
              <p className="text-base text-muted-foreground">
                Stay updated with your account activities
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={markAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {notifications.filter((n) => n.read).length}
                </p>
                <p className="text-sm text-muted-foreground">Read</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    No notifications yet
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={
                    !notification.read ? "border-primary/50 bg-primary/5" : ""
                  }
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(
                          notification.type
                        )}`}
                      >
                        <notification.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <Badge
                                variant="secondary"
                                className="bg-primary text-primary-foreground"
                              >
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </p>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            {notifications.filter((n) => !n.read).length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <CheckCheck className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg text-muted-foreground">
                    All caught up! No unread notifications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications
                .filter((n) => !n.read)
                .map((notification) => (
                  <Card key={notification.id} className="border-primary/50 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeColor(
                            notification.type
                          )}`}
                        >
                          <notification.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {notification.title}
                              </p>
                              <Badge
                                variant="secondary"
                                className="bg-primary text-primary-foreground"
                              >
                                New
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </p>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
