import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Menu, X, FileText, Briefcase, Users, TrendingUp, BookOpen, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
      navigate('/');
    }
  };

  const menuItems = [
    { icon: TrendingUp, label: 'Dashboard', href: '/dashboard' },
    { icon: FileText, label: 'Cover Letters', href: '/dashboard/cover-letters' },
    { icon: Briefcase, label: 'Job Applications', href: '/dashboard/applications' },
    { icon: Users, label: 'Networking', href: '/dashboard/networking' },
    { icon: BookOpen, label: 'Skills', href: '/dashboard/skills' },
    { icon: Heart, label: 'Motivation', href: '/dashboard/motivation' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-primary">CareerAI</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center px-6 py-3 text-muted-foreground hover:text-primary hover:bg-accent/50 transition-colors"
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 bg-accent/30 rounded-lg">
            <p className="text-sm font-medium truncate">{user?.email}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="mt-2 w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Welcome back!</span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;