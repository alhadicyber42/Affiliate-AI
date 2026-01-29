import { TrendingUp, Eye, MousePointer, DollarSign, FileText, Video, Package, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useAnalytics } from '@/hooks/useAnalytics';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export default function Dashboard({ onViewChange }: DashboardProps) {
  const { user } = useAuth();
  const { analytics, isLoading } = useAnalytics();

  const stats = [
    { 
      label: 'Total Views', 
      value: analytics?.totalViews.toLocaleString() || '0', 
      icon: Eye, 
      color: 'text-cyan',
      trend: '+23%'
    },
    { 
      label: 'CTR', 
      value: `${analytics?.totalCTR || 0}%`, 
      icon: MousePointer, 
      color: 'text-purple',
      trend: '+1.2%'
    },
    { 
      label: 'Conversions', 
      value: analytics?.totalConversions || 0, 
      icon: TrendingUp, 
      color: 'text-success',
      trend: '+15%'
    },
    { 
      label: 'Revenue', 
      value: `Rp ${((analytics?.totalRevenue || 0) / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'text-yellow-400',
      trend: '+28%'
    },
  ];

  const quickActions = [
    { 
      label: 'Extract Product', 
      desc: 'Import from marketplace',
      icon: Package,
      view: 'products',
      color: 'from-orange-500 to-red-500'
    },
    { 
      label: 'Create Script', 
      desc: 'Generate AI script',
      icon: FileText,
      view: 'scripts',
      color: 'from-purple to-cyan'
    },
    { 
      label: 'Generate Video', 
      desc: 'Create video content',
      icon: Video,
      view: 'videos',
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Creator'}!
          </h1>
          <p className="text-white/60 mt-1">
            Here's what's happening with your content today.
          </p>
        </div>
        <Button 
          onClick={() => onViewChange('products')}
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass rounded-xl p-5 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-xs text-success">{stat.trend}</span>
              <span className="text-xs text-white/40">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onViewChange(action.view)}
              className="group glass rounded-xl p-5 hover:bg-white/5 transition-all hover:-translate-y-1 text-left"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">{action.label}</h3>
              <p className="text-sm text-white/50 mb-3">{action.desc}</p>
              <div className="flex items-center text-sm text-cyan group-hover:gap-2 transition-all">
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[
            { action: 'Script generated', item: 'Serum Vitamin C - AIDA', time: '2 hours ago', icon: FileText },
            { action: 'Product extracted', item: 'Hijab Polos Premium', time: '5 hours ago', icon: Package },
            { action: 'Video created', item: 'Phone Case Review', time: '1 day ago', icon: Video },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                <activity.icon className="w-5 h-5 text-cyan" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{activity.action}</p>
                <p className="text-sm text-white/50">{activity.item}</p>
              </div>
              <span className="text-xs text-white/40">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA */}
      {user?.plan === 'free' && (
        <div className="glass rounded-xl p-6 bg-gradient-to-r from-purple/10 to-cyan/10 border border-purple/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-white mb-1">
                Upgrade to Pro
              </h3>
              <p className="text-white/60">
                Get unlimited videos, AI avatars, and priority support.
              </p>
            </div>
            <Button 
              onClick={() => onViewChange('settings')}
              className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white whitespace-nowrap"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
