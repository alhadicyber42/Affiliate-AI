import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, Quote, ChevronLeft, ChevronRight, Users, Video, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: 'Sarah Amalia',
    role: 'Beauty Affiliate Creator',
    avatar: '/avatar-1.png',
    content: 'Affiliator.id completely changed my workflow. I used to spend 4-5 hours on one video. Now I can create 10 videos in the same time. My revenue has tripled in just 2 months!',
    rating: 5,
    stats: { videos: 156, revenue: 'Rp 45M' },
  },
  {
    id: 2,
    name: 'Budi Santoso',
    role: 'Tech Reviewer',
    avatar: '/avatar-2.png',
    content: 'The AI script builder is insanely good. It understands Indonesian slang and creates hooks that actually convert. My CTR went from 1.8% to 4.5% after using this tool.',
    rating: 5,
    stats: { videos: 89, revenue: 'Rp 28M' },
  },
  {
    id: 3,
    name: 'Diana Putri',
    role: 'Fashion Content Creator',
    avatar: '/avatar-3.png',
    content: 'I was skeptical at first, but the video generator blew my mind. The AI avatar looks so natural, and the voice matches perfectly. My followers can\'t tell the difference!',
    rating: 5,
    stats: { videos: 203, revenue: 'Rp 62M' },
  },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: Users },
  { value: '500K+', label: 'Videos Created', icon: Video },
  { value: '4.9', label: 'User Rating', icon: Award },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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
        section.querySelectorAll('.testimonial-card'),
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Stats animation
      gsap.fromTo(
        section.querySelectorAll('.stat-card'),
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: section.querySelector('.stats-container'),
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative py-24 w-full bg-[#05050A]"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 px-6 sm:px-8 lg:px-16 xl:px-24">
        {/* Section Header */}
        <div ref={titleRef} className="text-center max-w-3xl mx-auto mb-16">
          <span className="animate-item inline-block text-purple-400 text-sm font-medium tracking-wider mb-4">
            Testimonials
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            RIBUAN <span className="text-cyan-400">CREATOR</span>
          </h2>
          <h3 className="animate-item text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            SUDAH BERGABUNG
          </h3>
          <p className="animate-item text-lg text-gray-400">
            Bergabung dengan komunitas affiliate creator yang sudah meningkatkan produktivitas mereka
          </p>
        </div>

        {/* Stats */}
        <div className="stats-container flex flex-wrap justify-center gap-6 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="stat-card glass rounded-2xl px-8 py-6 text-center border border-white/10"
            >
              <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card glass rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 hover:-translate-y-2 group border border-white/10"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-purple-400/40 mb-4" />

              {/* Content */}
              <p className="text-gray-300 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
                <div>
                  <div className="text-lg font-bold text-cyan-400">{testimonial.stats.videos}</div>
                  <div className="text-xs text-gray-500">Videos Created</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-400">{testimonial.stats.revenue}</div>
                  <div className="text-xs text-gray-500">Revenue Generated</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="glass rounded-2xl p-6 border border-white/10">
                      <Quote className="w-8 h-8 text-purple-400/40 mb-4" />
                      <p className="text-gray-300 leading-relaxed mb-6">
                        "{testimonial.content}"
                      </p>
                      <div className="flex gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <div className="flex items-center gap-4">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-white">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full glass text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i === activeIndex ? 'bg-purple-500' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full glass text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 mb-6">Trusted by creators from</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['TikTok', 'Shopee', 'Tokopedia', 'Instagram', 'YouTube'].map((platform) => (
              <span key={platform} className="text-xl font-bold text-white/60">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
