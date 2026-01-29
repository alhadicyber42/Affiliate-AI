import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scan, Sparkles, TrendingUp, Star, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const analysisSteps = [
  { icon: Scan, text: 'Scanning product...', delay: 0 },
  { icon: Sparkles, text: 'Analyzing reviews...', delay: 800 },
  { icon: TrendingUp, text: 'Checking competitors...', delay: 1600 },
  { icon: Check, text: 'Analysis complete!', delay: 2400 },
];

const productData = {
  name: 'Wireless Earbuds Pro',
  price: 'Rp 299.000',
  commission: '15%',
  rating: 4.8,
  reviews: 2341,
  sales: '10K+',
};

export default function ProductIntel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;

    if (!section || !title || !content) return;

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
        content.querySelectorAll('.content-block'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Auto-start scanning animation when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !scanning && !showResult) {
            startScanAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (scannerRef.current) {
      observer.observe(scannerRef.current);
    }

    return () => observer.disconnect();
  }, [scanning, showResult]);

  const startScanAnimation = () => {
    setScanning(true);
    setScanStep(0);
    setShowResult(false);

    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setScanStep(index);
      }, step.delay);
    });

    setTimeout(() => {
      setScanning(false);
      setShowResult(true);
    }, 3200);
  };

  return (
    <section
      ref={sectionRef}
      id="product-intel"
      className="relative min-h-screen w-full overflow-hidden bg-[#05050A] py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="animate-item inline-block text-purple-400 text-sm font-medium tracking-wider mb-4">
            Module 1
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-cyan-400">OTOMATIS</span>
          </h2>
          <p className="animate-item text-gray-400 text-lg max-w-2xl mx-auto">
            Cukup paste link Shopee, Tokopedia, atau TikTok Shop. AI kami akan menganalisis produk, 
            review, dan kompetitor dalam hitungan detik.
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Product Scanner Demo */}
          <div ref={scannerRef} className="content-block relative">
            <div className="glass rounded-3xl p-6 border border-white/10 overflow-hidden">
              {/* Scanner Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Scan className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">AI Analysis</h4>
                    <p className="text-gray-500 text-sm">Product Scanner</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-gray-400 text-sm">{scanning ? 'SCANNING...' : 'Ready'}</span>
                </div>
              </div>

              {/* Product Image Placeholder */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl mb-6 overflow-hidden">
                <img
                  src="/product-scanner.jpg"
                  alt="Product Scanner"
                  className="w-full h-full object-cover opacity-80"
                />
                
                {/* Scanning Overlay */}
                {scanning && (
                  <>
                    <div className="absolute inset-0 bg-purple-500/10" />
                    <div
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"
                      style={{ boxShadow: '0 0 20px rgba(0, 194, 255, 0.5)' }}
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="glass rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          {analysisSteps[scanStep] && (
                            <>
                              {(() => {
                                const IconComponent = analysisSteps[scanStep].icon;
                                return <IconComponent className="w-5 h-5 text-cyan-400 animate-spin" />;
                              })()}
                              <span className="text-white text-sm">{analysisSteps[scanStep].text}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Result Overlay */}
                {showResult && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="glass rounded-xl p-4 text-center">
                      <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Auto-extract enabled</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Analysis Result */}
              {showResult && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Product</span>
                    <span className="text-white font-medium">{productData.name}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white font-medium">{productData.price}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-400">Commission</span>
                    <span className="text-green-400 font-medium">{productData.commission}</span>
                  </div>
                  <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white">{productData.rating}</span>
                    </div>
                    <span className="text-gray-500">({productData.reviews} reviews)</span>
                    <span className="text-gray-500 ml-auto">{productData.sales} sold</span>
                  </div>
                </div>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl" />
          </div>

          {/* Right: Features */}
          <div className="content-block space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Analisis Produk <span className="text-purple-400">Cerdas</span>
            </h3>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Auto-Extract Data',
                  description: 'Ekstrak informasi produk otomatis dari link marketplace',
                  icon: Scan,
                },
                {
                  title: 'Review Analysis',
                  description: 'Analisis sentimen dari ribuan review produk',
                  icon: Sparkles,
                },
                {
                  title: 'Competitor Research',
                  description: 'Bandinngkan dengan produk kompetitor',
                  icon: TrendingUp,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
