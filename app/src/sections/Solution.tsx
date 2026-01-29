import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, LayoutDashboard, Infinity } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '4', label: 'Core Modules', icon: Layers },
  { value: '1', label: 'Dashboard', icon: LayoutDashboard },
  { value: '∞', label: 'Possibilities', icon: Infinity },
];

export default function Solution() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    const statsContainer = statsRef.current;

    if (!section || !title || !content || !statsContainer) return;

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

      // Content animation
      gsap.fromTo(
        content.querySelectorAll('.content-item'),
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stats animation
      const statElements = statsContainer.querySelectorAll('.stat-item');
      statElements.forEach((stat, i) => {
        gsap.fromTo(
          stat,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            delay: i * 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: statsContainer,
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
      id="solution"
      className="relative min-h-screen w-full overflow-hidden bg-[#05050A] py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="animate-item inline-block text-cyan-400 text-sm font-medium tracking-wider mb-4">
            The Solution
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              SEMUA SOLUSI
            </span>
          </h2>
          <p className="animate-item text-gray-400 text-lg max-w-2xl mx-auto">
            Semua yang kamu butuhkan untuk membuat konten affiliate viral dalam satu platform terintegrasi
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="content-item">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Satu Platform,{' '}
                <span className="text-cyan-400">Semua Fitur</span>
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Tidak perlu lagi beralih antara berbagai aplikasi. Affiliator.id menyatukan 
                research produk, pembuatan script, generate video, dan analytics dalam satu dashboard.
              </p>
            </div>

            <div className="content-item space-y-4">
              {[
                'Product Intelligence - Analisis produk otomatis',
                'AI Script Builder - Script viral dalam menit',
                'Video Generator - Buat video tanpa ribet',
                'Content Library - Kelola semua kontenmu',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="content-item">
              <Button
                size="lg"
                onClick={() => {
                  const element = document.querySelector('#product-intel');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-8 py-6 group"
              >
                Learn more
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Right Stats */}
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="stat-item glass rounded-2xl p-6 text-center border border-white/10 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-purple-400" />
                </div>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
