import { useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign,
  BarChart3,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Analytics() {
  const { analytics, isLoading } = useAnalytics();
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { 
      label: 'Total Views', 
      value: analytics?.totalViews.toLocaleString() || '0', 
      icon: Eye, 
      color: 'text-cyan',
      bgColor: 'bg-cyan/20',
      trend: '+23%'
    },
    { 
      label: 'Click-Through Rate', 
      value: `${analytics?.totalCTR || 0}%`, 
      icon: MousePointer, 
      color: 'text-purple',
      bgColor: 'bg-purple/20',
      trend: '+1.2%'
    },
    { 
      label: 'Conversions', 
      value: analytics?.totalConversions.toLocaleString() || '0', 
      icon: TrendingUp, 
      color: 'text-success',
      bgColor: 'bg-success/20',
      trend: '+15%'
    },
    { 
      label: 'Revenue', 
      value: `Rp ${((analytics?.totalRevenue || 0) / 1000000).toFixed(1)}M`, 
      icon: DollarSign, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20',
      trend: '+28%'
    },
  ];

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  // Mock chart data
  const chartData = [
    { day: 'Mon', views: 1200, ctr: 3.2 },
    { day: 'Tue', views: 1800, ctr: 3.5 },
    { day: 'Wed', views: 2400, ctr: 4.1 },
    { day: 'Thu', views: 1600, ctr: 3.8 },
    { day: 'Fri', views: 3200, ctr: 4.5 },
    { day: 'Sat', views: 4100, ctr: 4.8 },
    { day: 'Sun', views: 3800, ctr: 4.3 },
  ];

  const topPerforming = [
    { name: 'Serum Vitamin C Review', views: '45.2K', ctr: '4.2%', revenue: 'Rp 12.4M' },
    { name: 'Hijab Styling Tutorial', views: '38.7K', ctr: '3.9%', revenue: 'Rp 9.8M' },
    { name: 'Phone Case Drop Test', views: '32.1K', ctr: '3.1%', revenue: 'Rp 7.2M' },
    { name: 'Skincare Routine 2026', views: '28.5K', ctr: '2.8%', revenue: 'Rp 6.1M' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Analytics
          </h1>
          <p className="text-white/60 mt-1">
            Track your content performance
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple/50"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value} className="bg-surface">
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/50">{stat.label}</p>
                <p className="text-2xl font-display font-bold text-white mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <span className="text-xs text-success">{stat.trend}</span>
              <span className="text-xs text-white/40">vs previous period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Views Chart */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-white">Views Overview</h3>
            <BarChart3 className="w-5 h-5 text-white/40" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-purple to-cyan rounded-t-lg"
                  style={{ height: `${(data.views / 5000) * 100}%` }}
                />
                <span className="text-xs text-white/40">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTR Chart */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-white">CTR Trend</h3>
            <TrendingUp className="w-5 h-5 text-white/40" />
          </div>
          <div className="h-48 flex items-end gap-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-cyan to-success rounded-t-lg"
                  style={{ height: `${(data.ctr / 5) * 100}%` }}
                />
                <span className="text-xs text-white/40">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-display font-semibold text-white mb-4">
          Top Performing Content
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-white/50 border-b border-white/10">
                <th className="pb-3 font-medium">Content</th>
                <th className="pb-3 font-medium">Views</th>
                <th className="pb-3 font-medium">CTR</th>
                <th className="pb-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topPerforming.map((item, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <span className="text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-white/70">{item.views}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded bg-success/20 text-success text-sm">
                      {item.ctr}
                    </span>
                  </td>
                  <td className="py-4 text-white font-medium">{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Content Breakdown */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-purple" />
            </div>
            <div>
              <p className="text-sm text-white/50">Total Scripts</p>
              <p className="text-xl font-bold text-white">{analytics?.scriptsCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan/20 flex items-center justify-center">
              <Eye className="w-5 h-5 text-cyan" />
            </div>
            <div>
              <p className="text-sm text-white/50">Total Videos</p>
              <p className="text-xl font-bold text-white">{analytics?.videosCount || 0}</p>
            </div>
          </div>
        </div>
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-white/50">Products</p>
              <p className="text-xl font-bold text-white">{analytics?.productsCount || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
