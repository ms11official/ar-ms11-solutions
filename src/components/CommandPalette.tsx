import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { 
  Home, 
  Settings, 
  Bell, 
  User, 
  History, 
  Wrench,
  Shield,
  Users,
  FileText,
  BarChart3,
  CreditCard,
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const { isAdmin } = useUserRole(userId);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id);
    });
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigate = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => handleNavigate("/dashboard")}>
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/my-profile")}>
            <User className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/services")}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>Services</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/tools")}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>Tools</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/activity-history")}>
            <History className="mr-2 h-4 w-4" />
            <span>Activity History</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            <span>Notifications</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
          <CommandItem onSelect={() => handleNavigate("/upgrade-plan")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Upgrade Plan</span>
          </CommandItem>
        </CommandGroup>
        
        {isAdmin && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Admin">
              <CommandItem onSelect={() => handleNavigate("/admin")}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Dashboard</span>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigate("/admin/users")}>
                <Users className="mr-2 h-4 w-4" />
                <span>User Management</span>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigate("/admin/logs")}>
                <FileText className="mr-2 h-4 w-4" />
                <span>System Logs</span>
              </CommandItem>
              <CommandItem onSelect={() => handleNavigate("/admin/analytics")}>
                <BarChart3 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
