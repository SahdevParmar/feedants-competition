import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, ShieldLock, User as UserIcon } from "lucide-react";

export default function Header({ onLoginClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-extrabold text-brand tracking-tight">
          Feedants
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                <UserIcon className="w-4 h-4 text-slate-400" />
                <span>Hi, {user.name}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleLogout}
                className="gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              onClick={onLoginClick}
            >
              Login
              <ShieldLock className="h-8 w-8 text-green-500 stroke-[2.5]"/>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}