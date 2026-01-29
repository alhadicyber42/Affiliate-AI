import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Link2, 
  FileText, 
  Video, 
  BarChart3,
  Sparkles,
  Zap,
  TrendingUp,
  Check
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Link2,
    title: 'Product Intelligence',
    description: 'Auto-extract product data from Shopee, Tokopedia, TikTok Shop & Lazada. Get prices, reviews, and AI-powered insights in seconds.',
    color: 'from-orange-500 to-red-500',
    benefits: ['Instant scraping', 'USP Analysis', 'Viral Score prediction', 'Real-time data'],
  },
  {
    icon: FileText,
    title: 'AI Script Builder',
    description: 'Generate sales scripts using proven frameworks like AIDA, PAS, BAB & PASTOR. Drag, drop, and edit modules with AI that understands Indonesian.',
    color: 'from-purple to-cyan',
    benefits: ['Proven frameworks', 'Modular editing', 'Smart regenerate', 'Platform optimized'],
  },
  {
    icon: Video,
    title: 'Video Generator',
    description: 'Turn scripts into videos instantly. Choose faceless stock footage, AI avatar, or use your own footage with auto-caption and voiceover.',
    color: 'from-green-500 to-emerald-500',
    benefits: ['Faceless videos', 'AI Avatars', 'Auto captions', 'Multiple styles'],
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance in real-time. Monitor views, CTR, conversions, and revenue all in one place with actionable insights.',
    color: 'from-blue-500 to-indigo-500',
    benefits: ['Real-time stats', 'Performance tracking', 'Revenue insights', 'Growth metrics'],
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const cards = cardsRef.current;
    if (!section || !cards) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        section.querySelector('.section-header'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards stagger animation
      const cardElements = cards.querySelectorAll('.feature-card');
      cardElements.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 w-full bg-void"
    >
      {/* Background elements */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple/5 blur-3xl" />

      <div className="relative z-10 px-6 sm:px-8 lg:px-16 xl:px-24">
        {/* Section Header */}
        <div className="section-header text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple" />
            <span className="text-sm text-white/80">Powerful Features</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Everything You Need to
            <span className="text-gradient block mt-2">Create Viral Content</span>
          </h2>

          <p className="text-lg text-white/60">
            From product research to video generation, our all-in-one platform 
            streamlines your entire affiliate content workflow.
          </p>
        </div>

        {/* Features Grid */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 gap-6 lg:gap-8"
        >
          {features.map((feature, i) => (
            <div
              key={i}
              className="feature-card group relative glass rounded-2xl p-8 hover:bg-white/5 transition-all duration-500 hover:-translate-y-2 border border-white/5 hover:border-purple/30"
            >
              {/* Glow effect on hover */}
              <div className={`absolute -inset-px rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
              
              <div className="relative">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-white/60 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  {feature.benefits.map((benefit, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm text-white/70">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 glass rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '10K+', label: 'Active Creators', icon: Zap },
              { value: '3.5M+', label: 'Videos Created', icon: Video },
              { value: '80%', label: 'Time Saved', icon: TrendingUp },
              { value: '4.9', label: 'User Rating', icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="w-6 h-6 text-cyan" />
                </div>
                <div className="text-3xl font-display font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
