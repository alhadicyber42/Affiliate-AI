import { useState } from 'react';
import { User, Bell, Shield, CreditCard, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    updates: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      updateUser({ name, email });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const toggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
          Settings
        </h1>
        <p className="text-white/60 mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple/20 to-cyan/20 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-6">
                Profile Information
              </h3>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple to-cyan flex items-center justify-center text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-white/40 mt-2">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/70 mb-2">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-6">
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive emails about your account activity' },
                  { key: 'marketing', label: 'Marketing Emails', desc: 'Receive updates about new features and promotions' },
                  { key: 'updates', label: 'Product Updates', desc: 'Get notified when we release new features' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5"
                  >
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-white/50">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(item.key)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-gradient-to-r from-purple to-cyan'
                          : 'bg-white/20'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-6">
                Security Settings
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-white mb-2">Change Password</h4>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
                    />
                  </div>
                  <Button className="mt-4 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white">
                    Update Password
                  </Button>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h4 className="font-medium text-white mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-white/50 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="glass rounded-xl p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-6">
                Billing Information
              </h3>
              
              <div className="space-y-6">
                {/* Current Plan */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple/20 to-cyan/20 border border-purple/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/70">Current Plan</p>
                      <p className="text-xl font-bold text-white capitalize">{user?.plan || 'Free'}</p>
                    </div>
                    <Button className="bg-white text-purple hover:bg-white/90">
                      Upgrade
                    </Button>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-medium text-white mb-3">Payment Method</h4>
                  <div className="p-4 rounded-xl bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 rounded bg-white/20" />
                      <span className="text-white">•••• 4242</span>
                    </div>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                      Change
                    </Button>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h4 className="font-medium text-white mb-3">Billing History</h4>
                  <div className="space-y-2">
                    {[
                      { date: 'Jan 15, 2026', amount: 'Rp 299,000', status: 'Paid' },
                      { date: 'Dec 15, 2025', amount: 'Rp 299,000', status: 'Paid' },
                    ].map((invoice, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                      >
                        <span className="text-white/70">{invoice.date}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-white">{invoice.amount}</span>
                          <span className="px-2 py-1 rounded bg-success/20 text-success text-xs">
                            {invoice.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
