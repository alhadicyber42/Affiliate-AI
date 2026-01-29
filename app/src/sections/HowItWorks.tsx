import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link2, FileText, Video, Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    icon: Link2,
    title: 'Extract Product',
    description: 'Paste any product link from Shopee, Tokopedia, or TikTok Shop. Our AI automatically extracts all the data you need.',
    color: 'from-orange-500 to-red-500',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Generate Script',
    description: 'Choose your framework (AIDA, PAS, BAB) and let AI create a compelling script tailored for your platform.',
    color: 'from-purple to-cyan',
  },
  {
    number: '03',
    icon: Video,
    title: 'Create Video',
    description: 'Turn your script into a professional video with AI avatars, stock footage, or your own content.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Publish & Earn',
    description: 'Upload to TikTok, Instagram, or YouTube and start earning from your affiliate links.',
    color: 'from-blue-500 to-indigo-500',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stepsContainer = stepsRef.current;
    if (!section || !stepsContainer) return;

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

      // Steps animation
      const stepElements = stepsContainer.querySelectorAll('.step-item');
      stepElements.forEach((step, i) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            delay: i * 0.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Connector line animation
      gsap.fromTo(
        '.connector-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stepsContainer,
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
      id="how-it-works"
      className="relative py-24 w-full bg-void overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan/5 blur-3xl" />

      <div className="relative z-10 px-6 sm:px-8 lg:px-16 xl:px-24">
        {/* Section Header */}
        <div className="section-header text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan/30 mb-6">
            <Rocket className="w-4 h-4 text-cyan" />
            <span className="text-sm text-white/80">Simple Process</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            How It
            <span className="text-gradient"> Works</span>
          </h2>

          <p className="text-lg text-white/60">
            Create viral affiliate content in 4 simple steps. 
            From product research to published video in under 15 minutes.
          </p>
        </div>

        {/* Steps */}
        <div ref={stepsRef} className="relative max-w-4xl mx-auto">
          {/* Connector Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-purple via-cyan to-purple hidden md:block">
            <div className="connector-line absolute inset-0 bg-gradient-to-b from-purple via-cyan to-purple origin-top" />
          </div>

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step-item relative flex flex-col md:flex-row items-start gap-8 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step Number & Icon */}
                <div className={`flex-shrink-0 flex flex-col items-center ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'} md:w-1/2`}>
                  <div className="relative">
                    {/* Number badge */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg z-10 relative`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-surface border border-white/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'} md:w-1/2`}>
                  <h3 className="font-display text-2xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="text-white/60 mb-6">
            Ready to transform your content creation workflow?
          </p>
          <Button
            size="lg"
            onClick={() => {
              const pricingSection = document.querySelector('#pricing');
              pricingSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white font-semibold px-8 py-6 text-base group"
          >
            Start Creating Free
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
