import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/admin/ui/command";
import { Search } from "lucide-react";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const navigationItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Patients", path: "/admin/patients" },
  { name: "Doctors", path: "/admin/doctors" },
  { name: "Appointments", path: "/admin/appointments" },
  { name: "Medical Records", path: "/admin/records" },
  { name: "Pharmacy", path: "/admin/pharmacy" },
  { name: "Reports", path: "/admin/reports" },
  { name: "Schedule", path: "/admin/schedule" },
  { name: "Messages", path: "/admin/messages" },
  { name: "Notifications", path: "/admin/notifications" },
  { name: "Settings", path: "/admin/settings" },
  { name: "Profile", path: "/admin/profile" },
];

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();

  const handleSelect = React.useCallback((path: string) => {
    navigate(path);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search across the application..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => handleSelect(item.path)}
              className="cursor-pointer"
            >
              <Search className="mr-2 h-4 w-4" />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
