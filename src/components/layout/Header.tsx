
import { Bell, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function Header() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Get user info from localStorage
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Get initials for avatar
  const getInitials = () => {
    if (!user) return "US";
    
    const email = user.email || "";
    if (email.includes("@")) {
      return email.split("@")[0].substring(0, 2).toUpperCase();
    }
    return "US";
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system",
    });
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-hwf-dark md:hidden">
          HWF Donations
        </h1>
        <div className="flex-1 md:ml-64"></div>
        <div className="flex items-center space-x-3">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 bg-hwf-purple-light text-hwf-purple-dark">
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {user?.role === 'superadmin' ? t('auth.administrator') : t('auth.volunteer')}
              </DropdownMenuLabel>
              <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
                {user?.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>
                 <Settings className="mr-2 h-4 w-4" />
               <span>{t('auth.settings')}</span>
              </DropdownMenuItem>*/}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('auth.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
