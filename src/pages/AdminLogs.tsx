import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "@/components/DashboardLayout";
import { useUserRole } from "@/hooks/useUserRole";
import { Card } from "@/components/ui/card";
import { FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: string;
  timestamp: number;
  level: string;
  msg: string;
  path?: string;
  status?: string;
  error?: string;
  event_message?: string;
}

const AdminLogs = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLogs, setAuthLogs] = useState<LogEntry[]>([]);
  const [dbLogs, setDbLogs] = useState<LogEntry[]>([]);
  const [edgeLogs, setEdgeLogs] = useState<LogEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole(user?.id);

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

  useEffect(() => {
    if (!loading && !roleLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [loading, roleLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchLogs();
    }
  }, [isAdmin]);

  const fetchLogs = async () => {
    setRefreshing(true);
    try {
      // Note: Real-time logs require Supabase analytics tables to be set up
      // For now, displaying placeholder data
      // To enable real logs, you need to configure Supabase log tables
      
      setAuthLogs([{
        id: "1",
        timestamp: Date.now() * 1000,
        level: "info",
        msg: "User login successful",
        path: "/auth/login",
        status: "200"
      }]);

      setDbLogs([{
        id: "1",
        timestamp: Date.now() * 1000,
        level: "info",
        msg: "Database connection established",
        event_message: "Connection to database successful"
      }]);

      setEdgeLogs([{
        id: "1",
        timestamp: Date.now() * 1000,
        level: "info",
        msg: "Edge function executed",
        status: "200"
      }]);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp / 1000).toLocaleString();
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "error":
        return "destructive";
      case "warn":
        return "outline";
      case "info":
        return "default";
      default:
        return "secondary";
    }
  };

  if (loading || roleLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="p-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-black">System Logs</h1>
            </div>
            <p className="text-base text-muted-foreground">
              View and monitor system activity logs
            </p>
          </div>
          <Button onClick={fetchLogs} disabled={refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="auth" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auth">Authentication ({authLogs.length})</TabsTrigger>
              <TabsTrigger value="database">Database ({dbLogs.length})</TabsTrigger>
              <TabsTrigger value="edge">Edge Functions ({edgeLogs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="auth" className="mt-6">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getLevelColor(log.level)}>
                            {log.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {log.msg}
                        </TableCell>
                        <TableCell className="text-xs">{log.path}</TableCell>
                        <TableCell>
                          {log.status && (
                            <Badge variant={log.status === "200" ? "default" : "destructive"}>
                              {log.status}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="database" className="mt-6">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dbLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getLevelColor(log.level)}>
                            {log.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-2xl truncate">
                          {log.event_message || log.msg}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="edge" className="mt-6">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {edgeLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {formatTimestamp(log.timestamp)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getLevelColor(log.level)}>
                            {log.level}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-md truncate">
                          {log.msg}
                        </TableCell>
                        <TableCell>
                          {log.status && (
                            <Badge variant={log.status.startsWith("2") ? "default" : "destructive"}>
                              {log.status}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminLogs;
