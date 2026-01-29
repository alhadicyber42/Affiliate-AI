import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Layers, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const painPoints = [
  {
    icon: Clock,
    value: '3-5',
    unit: 'Jam per Video',
    description: 'Waktu yang dihabiskan untuk membuat satu konten',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  {
    icon: Layers,
    value: '5+',
    unit: 'Tools Berbeda',
    description: 'Berpindah-pindah antara aplikasi',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
  },
  {
    icon: AlertTriangle,
    value: '80%',
    unit: 'Waktu Terbuang',
    description: 'Dihabiskan untuk tugas repetitif',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
  },
];

const tools = [
  { name: 'ChatGPT', image: '/tool-chatgpt.png', position: 'top-0 left-[10%]' },
  { name: 'Canva', image: '/tool-canva.png', position: 'top-[20%] right-[5%]' },
  { name: 'CapCut', image: '/tool-capcut.png', position: 'bottom-[30%] left-[5%]' },
  { name: 'Research', image: '/tool-research.png', position: 'bottom-[10%] right-[15%]' },
  { name: 'Upload', image: '/tool-upload.png', position: 'top-[40%] left-[40%]' },
];

export default function PainPoints() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;
    const toolsContainer = toolsRef.current;

    if (!section || !title || !cards || !toolsContainer) return;

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

      // Cards animation
      const cardElements = cards.querySelectorAll('.pain-card');
      cardElements.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50, rotateY: i % 2 === 0 ? -15 : 15 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Tools floating animation
      const toolElements = toolsContainer.querySelectorAll('.tool-float');
      toolElements.forEach((tool, i) => {
        gsap.fromTo(
          tool,
          { opacity: 0, scale: 0.5 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: toolsContainer,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Continuous floating
        gsap.to(tool, {
          y: `random(-15, 15)`,
          x: `random(-10, 10)`,
          rotation: `random(-5, 5)`,
          duration: `random(3, 5)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pain-points"
      className="relative min-h-screen w-full overflow-hidden bg-[#05050A] py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-red-500/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="animate-item inline-block text-red-400 text-sm font-medium tracking-wider mb-4">
            The Old Way
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-red-400">TOOLS</span>{' '}
            <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              TERBUANG
            </span>
          </h2>
          <p className="animate-item text-gray-400 text-lg max-w-2xl mx-auto">
            Affiliate creators menghabiskan 3-5 jam untuk 1 video dengan berpindah-pindah antara berbagai aplikasi
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Stats Cards */}
          <div ref={cardsRef} className="space-y-6">
            {painPoints.map((point, i) => (
              <div
                key={i}
                className={`pain-card glass rounded-2xl p-6 border ${point.borderColor} hover:scale-[1.02] transition-transform duration-300`}
                style={{ perspective: '1000px' }}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-xl ${point.bgColor} flex items-center justify-center flex-shrink-0`}>
                    <point.icon className={`w-8 h-8 ${point.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl sm:text-5xl font-bold ${point.color}`}>{point.value}</span>
                      <span className="text-gray-400 text-lg">{point.unit}</span>
                    </div>
                    <p className="text-gray-500 mt-1">{point.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Tools */}
          <div ref={toolsRef} className="relative h-[500px] hidden lg:block">
            {tools.map((tool, i) => (
              <div
                key={i}
                className={`tool-float absolute ${tool.position} w-24 h-24 sm:w-32 sm:h-32`}
              >
                <div className="glass rounded-2xl p-3 border border-white/10 shadow-xl hover:scale-110 transition-transform cursor-pointer">
                  <img
                    src={tool.image}
                    alt={tool.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}

            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
              <path
                d="M 80 50 Q 200 150 350 100"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
              <path
                d="M 350 100 Q 450 200 400 350"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
              <path
                d="M 400 350 Q 250 400 100 300"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
