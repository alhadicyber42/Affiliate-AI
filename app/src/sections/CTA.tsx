import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface CTAProps {
  onOpenAuth: () => void;
}

export default function CTA({ onOpenAuth }: CTAProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.querySelectorAll('.animate-item'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
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
      id="cta"
      className="relative py-24 w-full bg-[#05050A]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 blur-[120px]" />
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-6 sm:px-8 lg:px-16 xl:px-24">
        <div
          ref={contentRef}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <div className="animate-item inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">Mulai Sekarang</span>
          </div>

          {/* Headline */}
          <h2 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            SIAP BUAT{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              KONTENMU?
            </span>
          </h2>

          {/* Description */}
          <p className="animate-item text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Gabung dengan 10,000+ creator yang sudah meningkatkan produktivitas konten affiliate mereka
          </p>

          {/* CTA Buttons */}
          <div className="animate-item flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-10 py-7 text-lg group"
            >
              COBA GRATIS SEKARANG
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="animate-item flex flex-wrap justify-center gap-6 mt-10">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>14 hari free trial</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Tidak perlu kartu kredit</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Bisa dibatalkan kapan saja</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  );
}
