import { useState, useEffect } from 'react';
import {
  FlaskConical,
  Plus,
  Play,
  BarChart3,
  Check,
  X,
  Copy,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScripts } from '@/hooks/useScripts';
import { abTestApi } from '@/services/mockApi';
import type { ABTest } from '@/types';

export default function ABTesting() {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const data = await abTestApi.getTests();
        setTests(data);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const { scripts } = useScripts();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-cyan-500/20 text-cyan-400';
      case 'completed': return 'bg-success/20 text-success';
      case 'draft': return 'bg-white/10 text-white/60';
      default: return 'bg-white/10 text-white/60';
    }
  };

  const calculateConfidence = (variantA: any, variantB: any) => {
    // Simplified confidence calculation
    const diff = variantB.ctr - variantA.ctr;
    if (diff > 1) return 'High';
    if (diff > 0.5) return 'Medium';
    return 'Low';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-purple border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            A/B Testing
          </h1>
          <p className="text-white/60 mt-1">
            Test different script variations to find what converts best
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Test
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Tests', value: '2', icon: FlaskConical, color: 'text-cyan' },
          { label: 'Total Views', value: '48.2K', icon: Users, color: 'text-purple' },
          { label: 'Avg CTR', value: '3.4%', icon: TrendingUp, color: 'text-success' },
          { label: 'Tests Won', value: '12', icon: Check, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-sm text-white/50">{stat.label}</span>
            </div>
            <span className="text-xl font-bold text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {tests.map((test) => (
          <div
            key={test.id}
            className="glass rounded-xl overflow-hidden"
          >
            {/* Test Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple/20 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-purple" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{test.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/50">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(test.status)}`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                    <span>•</span>
                    <span>{test.variants.length} variants</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Started {test.startDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTest(test)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Results
                </Button>
                {test.status === 'running' && (
                  <Button
                    size="sm"
                    className="bg-success hover:bg-success/90 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    End Test
                  </Button>
                )}
              </div>
            </div>

            {/* Variants */}
            <div className="p-4">
              <div className="grid md:grid-cols-2 gap-4">
                {test.variants.map((variant, i) => (
                  <div
                    key={variant.id}
                    className={`p-4 rounded-xl border ${test.winner === variant.id
                      ? 'border-success bg-success/10'
                      : 'border-white/10 bg-white/5'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple/20 text-purple flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-white font-medium">{variant.name}</span>
                      </div>
                      {test.winner === variant.id && (
                        <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                          Winner
                        </span>
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      "{variant.script}"
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-white">{variant.views.toLocaleString()}</div>
                        <div className="text-xs text-white/40">Views</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-cyan">{variant.ctr}%</div>
                        <div className="text-xs text-white/40">CTR</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-success">{variant.conversions}</div>
                        <div className="text-xs text-white/40">Sales</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-2xl glass rounded-2xl p-6 animate-in fade-in zoom-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-white">Create A/B Test</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-2">Test Name</label>
                <input
                  type="text"
                  placeholder="e.g., Hook Variation Test"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Select Script</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50">
                  <option className="bg-surface">Choose a script...</option>
                  {scripts.map((s) => (
                    <option key={s.id} value={s.id} className="bg-surface">{s.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-2">Test Duration</label>
                <select className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50">
                  <option className="bg-surface">3 days</option>
                  <option className="bg-surface">7 days</option>
                  <option className="bg-surface">14 days</option>
                  <option className="bg-surface">30 days</option>
                </select>
              </div>

              <div className="pt-4">
                <Button className="w-full bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white">
                  <Play className="w-4 h-4 mr-2" />
                  Start Test
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {selectedTest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTest(null)}
          />
          <div className="relative w-full max-w-3xl glass rounded-2xl p-6 animate-in fade-in zoom-in max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-white">{selectedTest.name}</h3>
                <p className="text-white/50 text-sm">Test Results</p>
              </div>
              <button
                onClick={() => setSelectedTest(null)}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Chart */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-4">Performance Comparison</h4>
              <div className="space-y-4">
                {selectedTest.variants.map((variant) => (
                  <div key={variant.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white text-sm">{variant.name}</span>
                      <span className="text-cyan text-sm">{variant.ctr}% CTR</span>
                    </div>
                    <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${selectedTest.winner === variant.id
                          ? 'bg-success'
                          : 'bg-purple'
                          }`}
                        style={{ width: `${(variant.ctr / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{selectedTest.totalViews.toLocaleString()}</div>
                <div className="text-xs text-white/40">Total Views</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan">
                  {(selectedTest.variants.reduce((acc, v) => acc + v.ctr, 0) / selectedTest.variants.length).toFixed(1)}%
                </div>
                <div className="text-xs text-white/40">Avg CTR</div>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-success">
                  {selectedTest.variants.reduce((acc, v) => acc + v.conversions, 0)}
                </div>
                <div className="text-xs text-white/40">Total Conversions</div>
              </div>
            </div>

            {/* Confidence Level */}
            {selectedTest.variants.length === 2 && (
              <div className="glass rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-white">Statistical Confidence</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${calculateConfidence(selectedTest.variants[0], selectedTest.variants[1]) === 'High'
                    ? 'bg-success/20 text-success'
                    : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                    {calculateConfidence(selectedTest.variants[0], selectedTest.variants[1])} Confidence
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {selectedTest.winner && (
                <Button className="flex-1 bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white">
                  <Copy className="w-4 h-4 mr-2" />
                  Use Winner
                </Button>
              )}
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => setSelectedTest(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
