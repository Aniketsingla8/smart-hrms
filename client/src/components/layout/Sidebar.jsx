import { Home, CalendarCheck, Wallet, Users, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"; // ensure this utility exists or use classnames
import { buttonVariants } from "@/components/ui/button"; // optional for consistent styling

const navItems = [
  { label: "Dashboard", icon: <Home className="w-4 h-4" />, href: "/" },
  { label: "Attendance", icon: <CalendarCheck className="w-4 h-4" />, href: "/attendance" },
  { label: "Payslip", icon: <Wallet className="w-4 h-4" />, href: "/payslip" },
  { label: "Employees", icon: <Users className="w-4 h-4" />, href: "/employees" },
  { label: "Settings", icon: <Settings className="w-4 h-4" />, href: "/settings" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-muted/50 border-r p-6 space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold tracking-tight">Smart HRMS</h1>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.label}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
