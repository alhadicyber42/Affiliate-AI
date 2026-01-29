import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onOpenAuth: () => void;
}

export default function Hero({ onOpenAuth }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const subhead = subheadRef.current;
    const cta = ctaRef.current;
    const dashboard = dashboardRef.current;
    const glow = glowRef.current;
    const particles = particlesRef.current;

    if (!section || !headline || !subhead || !cta || !dashboard || !glow || !particles) return;

    const ctx = gsap.context(() => {
      // Initial load animation timeline
      const loadTl = gsap.timeline({ delay: 0.3 });

      // Glow pulse animation
      gsap.to(glow, {
        scale: 1.2,
        opacity: 0.15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Headline word animation
      const words = headline.querySelectorAll('.word');
      loadTl.fromTo(
        words,
        { autoAlpha: 0, y: 100, rotateX: -90 },
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'expo.out',
        }
      );

      // Subhead fade in
      // Subhead fade in
      loadTl.fromTo(
        subhead,
        { autoAlpha: 0, y: 30, filter: 'blur(10px)' },
        { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
        '-=0.5'
      );

      // CTA buttons
      // CTA buttons
      loadTl.fromTo(
        cta.children,
        { autoAlpha: 0, y: 30, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        '-=0.4'
      );

      // Dashboard 3D animation
      loadTl.fromTo(
        dashboard,
        { opacity: 0, y: 150, scale: 0.8, rotateX: 20 },
        { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.2, ease: 'expo.out' },
        '-=0.8'
      );

      // Dashboard floating animation
      gsap.to(dashboard, {
        y: -25,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Dashboard subtle rotation
      gsap.to(dashboard, {
        rotateY: 5,
        rotateX: -3,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Particle animations
      const particleElements = particles.querySelectorAll('.particle');
      particleElements.forEach((p, i) => {
        gsap.to(p, {
          y: `random(-80, 80)`,
          x: `random(-80, 80)`,
          duration: `random(4, 8)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.15,
        });
        gsap.to(p, {
          opacity: `random(0.3, 0.8)`,
          scale: `random(0.5, 1.5)`,
          duration: `random(2, 4)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      });

      // Scroll-triggered exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.8,
        },
      });

      scrollTl
        .to(headline, { y: -80, duration: 0.25 }, 0.5)
        .to(subhead, { y: -50, duration: 0.25 }, 0.52)
        .to(cta, { y: -30, duration: 0.25 }, 0.54)
        .to(dashboard, { scale: 1.4, y: -200, opacity: 0.2, rotateX: -15, duration: 0.4 }, 0.5)
        .to(glow, { scale: 2, opacity: 0.3, duration: 0.4 }, 0.5);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#05050A] z-10"
    >
      {/* Background Glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-purple-600/20 via-purple-600/5 to-transparent blur-[100px]" />
      </div>

      {/* Ambient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" />
        <div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-purple-500/10 blur-[100px] animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(127, 86, 217, 0.15) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(127, 86, 217, 0.15) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)',
        }}
      />

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="particle absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: i % 3 === 0 ? '#00C2FF' : i % 3 === 1 ? '#7F56D9' : '#A78BFA',
              boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-8 hover:bg-purple-500/20 transition-colors cursor-default">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-sm text-purple-300 font-medium">All-in-One Affiliate Content Platform</span>
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="mb-6" style={{ perspective: '1000px' }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            <span className="word inline-block">BUAT</span>{' '}
            <span className="word inline-block">KONTEN</span>
            <br />
            <span className="word inline-block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AFFILIATE
            </span>
          </h1>
        </div>

        {/* Subheadline */}
        <div ref={subheadRef}>
          <p className="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-3">
            DARI 5 JAM JADI{' '}
            <span className="text-cyan-400 font-bold" style={{ textShadow: '0 0 20px rgba(0, 194, 255, 0.5)' }}>
              5 MENIT
            </span>
          </p>
          <p className="text-gray-500 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Platform AI yang mengubah link produk jadi video viral siap upload - otomatis, cepat, dan profesional.
          </p>
        </div>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            size="lg"
            onClick={onOpenAuth}
            className="magnetic bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold px-8 py-6 text-lg group relative overflow-hidden"
          >
            <span className="relative z-10">COBA GRATIS SEKARANG</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10 ml-2" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const demoSection = document.querySelector('#solution');
              demoSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 px-6 py-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
            <span>Lihat Demo</span>
          </Button>
        </div>

        {/* Dashboard Image */}
        <div className="relative" style={{ perspective: '1500px' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-transparent z-10 pointer-events-none" />
          <div
            ref={dashboardRef}
            className="relative transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-0 bg-purple-500/20 blur-[60px] rounded-full scale-75" />
            <img
              src="/dashboard-iso.png"
              alt="Affiliator AI Dashboard"
              className="w-full max-w-4xl mx-auto drop-shadow-2xl relative z-10"
            />
            {/* Floating badges */}
            <div
              className="absolute -left-8 top-1/4 glass p-3 animate-bounce"
              style={{ animationDuration: '3s' }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div
              className="absolute -right-8 top-1/3 glass p-3 animate-bounce"
              style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-16">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500K+', label: 'Videos Created' },
            { value: '80%', label: 'Time Saved' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white font-mono mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05050A] to-transparent z-20" />
    </section>
  );
}
