import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles, Zap, Crown, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    description: 'Perfect for beginners',
    monthlyPrice: 99000,
    yearlyPrice: 799000,
    features: [
      '10 videos per month',
      'Basic AI script builder',
      'Faceless video style',
      'Shopee & Tokopedia import',
      'Basic analytics',
    ],
    notIncluded: [
      'AI Avatar',
      'Priority support',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Sparkles,
    description: 'For serious creators',
    monthlyPrice: 299000,
    yearlyPrice: 2499000,
    features: [
      'Unlimited videos',
      'Advanced AI script builder',
      'All video styles',
      'All marketplace imports',
      'Advanced analytics',
      'AI Avatar generator',
      'Priority support',
    ],
    notIncluded: [
      'Team collaboration',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    icon: Crown,
    description: 'For teams & agencies',
    monthlyPrice: 799000,
    yearlyPrice: 6999000,
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'White-label option',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    popular: false,
  },
];

interface PricingProps {
  onOpenAuth: () => void;
}

export default function Pricing({ onOpenAuth }: PricingProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        title.querySelectorAll('.animate-item'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        section.querySelectorAll('.pricing-card'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="relative py-24 w-full bg-[#05050A]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 px-6 sm:px-8 lg:px-16 xl:px-24">
        {/* Section Header */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-12">
          <span className="animate-item inline-block text-cyan-400 text-sm font-medium tracking-wider mb-4">
            Pricing
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            PILIH <span className="text-purple-400">PAKET</span>
          </h2>
          <h3 className="animate-item text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            YANG SESUAI
          </h3>
          <p className="animate-item text-lg text-gray-400 mb-8">
            Mulai gratis dan upgrade kapan saja. Semua paket include fitur dasar untuk membuat konten affiliate berkualitas.
          </p>

          {/* Billing Toggle */}
          <div className="animate-item flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-500'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-500'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                Save 30%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`pricing-card relative rounded-2xl p-6 lg:p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/20 border-2 border-transparent'
                  : 'glass border border-white/10'
              }`}
            >
              {/* Popular gradient border */}
              {plan.popular && (
                <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 animate-gradient -z-10" />
              )}

              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-500 to-cyan-500'
                    : 'bg-white/10'
                }`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-2xl text-gray-400">Rp</span>
                  <span className="text-3xl lg:text-4xl font-bold text-white">
                    {new Intl.NumberFormat('id-ID').format(isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice)}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">/bulan</span>
                {isYearly && (
                  <div className="text-sm text-gray-500 mt-1">
                    Dibayar tahunan (Rp {new Intl.NumberFormat('id-ID').format(plan.yearlyPrice)})
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
                {plan.notIncluded.map((feature, i) => (
                  <div key={`not-${i}`} className="flex items-start gap-3 opacity-40">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-gray-500">—</span>
                    </div>
                    <span className="text-sm text-gray-500">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button
                onClick={onOpenAuth}
                className={`w-full py-6 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <CreditCard className="w-4 h-4" />
            <span>14 hari free trial</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Check className="w-4 h-4" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Check className="w-4 h-4" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-8">
          <p className="text-gray-500">
            Semua harga dalam Rupiah (IDR). Bisa dibatalkan kapan saja.
          </p>
        </div>
      </div>
    </section>
  );
}
