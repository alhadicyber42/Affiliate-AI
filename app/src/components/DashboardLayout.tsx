import { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Video, 
  BarChart3, 
  Settings, 
  Sparkles,
  Menu,
  LogOut,
  ChevronRight,
  TrendingUp,
  FlaskConical,
  LayoutTemplate,
  Store
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: 'products', label: 'Products', icon: Package },
  { path: 'scripts', label: 'Scripts', icon: FileText },
  { path: 'videos', label: 'Videos', icon: Video },
  { path: 'trending', label: 'Trending', icon: TrendingUp },
  { path: 'ab-testing', label: 'A/B Testing', icon: FlaskConical },
  { path: 'templates', label: 'Templates', icon: LayoutTemplate },
  { path: 'marketplace', label: 'Marketplace', icon: Store },
  { path: 'analytics', label: 'Analytics', icon: BarChart3 },
  { path: 'settings', label: 'Settings', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function DashboardLayout({ children, currentView, onViewChange }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-void flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-surface border-r border-white/5 z-50 transform transition-transform duration-300 overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <button 
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              Affiliator<span className="text-cyan">.id</span>
            </span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                onViewChange(item.path);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                currentView === item.path
                  ? 'bg-gradient-to-r from-purple/20 to-cyan/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {currentView === item.path && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-white/50">Plan</span>
            <span className="text-xs px-2 py-1 rounded-full bg-purple/20 text-purple capitalize">
              {user?.plan || 'Free'}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-white/50">Credits</span>
            <span className="text-sm font-medium text-cyan">{user?.credits || 0}</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-white/5">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg bg-white/5 text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display font-semibold text-white">
            {navItems.find(item => item.path === currentView)?.label || 'Dashboard'}
          </span>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
