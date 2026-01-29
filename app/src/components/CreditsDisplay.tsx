import { Coins, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

export default function CreditsDisplay() {
  const { user } = useAuth();

  if (!user) return null;

  const getCreditsColor = (credits: number) => {
    if (credits >= 100) return 'text-success';
    if (credits >= 50) return 'text-cyan';
    if (credits >= 20) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCreditsStatus = (credits: number) => {
    if (credits >= 100) return 'Plenty of credits';
    if (credits >= 50) return 'Good balance';
    if (credits >= 20) return 'Running low';
    return 'Almost out!';
  };

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple to-cyan flex items-center justify-center">
            <Coins className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-white/50">Available Credits</div>
            <div className={`text-lg font-bold ${getCreditsColor(user.credits)}`}>
              {user.credits}
            </div>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Buy More
        </Button>
      </div>

      <div className="text-xs text-white/40">
        {getCreditsStatus(user.credits)}
      </div>

      {/* Credits Usage Info */}
      <div className="mt-3 pt-3 border-t border-white/10 space-y-1 text-xs">
        <div className="flex justify-between text-white/50">
          <span>Product Extract</span>
          <span>10 credits</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>Script Generation</span>
          <span>20 credits</span>
        </div>
        <div className="flex justify-between text-white/50">
          <span>Video Generation</span>
          <span>50 credits</span>
        </div>
      </div>
    </div>
  );
}
