import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FileText, Sparkles, GripVertical, Copy, Check, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const frameworks = [
  { id: 'aida', name: 'AIDA', description: 'Attention, Interest, Desire, Action', color: 'from-purple-500 to-pink-500' },
  { id: 'pas', name: 'PAS', description: 'Problem, Agitate, Solution', color: 'from-cyan-500 to-blue-500' },
  { id: 'bab', name: 'BAB', description: 'Before, After, Bridge', color: 'from-green-500 to-emerald-500' },
  { id: 'viral', name: 'Viral TikTok', description: 'Hook, Story, CTA', color: 'from-orange-500 to-red-500' },
];

const scriptModules = [
  { id: 'hook', name: 'Hook', content: 'Stop scrolling! Ini dia rahasia...' },
  { id: 'story', name: 'Story', content: 'Baru minggu lalu, aku nemuin produk ini...' },
  { id: 'benefit', name: 'Benefit', content: 'Yang bikin beda, produk ini punya...' },
  { id: 'cta', name: 'CTA', content: 'Link di bio, jangan sampai kehabisan!' },
];

export default function ScriptBuilder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedFramework, setSelectedFramework] = useState('aida');
  const [modules, setModules] = useState(scriptModules);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newModules = [...modules];
    const draggedItem = newModules[draggedIndex];
    newModules.splice(draggedIndex, 1);
    newModules.splice(index, 0, draggedItem);
    setModules(newModules);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const copyScript = () => {
    const fullScript = modules.map(m => m.content).join('\n\n');
    navigator.clipboard.writeText(fullScript);
    setCopied(true);
    toast.success('Script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const generateScript = () => {
    toast.success('Generating new script with AI...');
    // Simulate AI generation
    setTimeout(() => {
      toast.success('Script generated!');
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="script-builder"
      className="relative min-h-screen w-full overflow-hidden bg-[#05050A] py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="animate-item inline-block text-cyan-400 text-sm font-medium tracking-wider mb-4">
            Module 2
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-purple-400">DRAG & DROP</span>
          </h2>
          <p className="animate-item text-gray-400 text-lg max-w-2xl mx-auto">
            Pilih framework AIDA, PAS, BAB, atau Viral TikTok. Geser modul, edit teks, 
            dan dapatkan script siap rekam dalam hitungan menit.
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12">
          {/* Left: Framework Selection & Preview */}
          <div className="content-block space-y-6">
            {/* Framework Selector */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                AI-Powered Framework
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {frameworks.map((fw) => (
                  <button
                    key={fw.id}
                    onClick={() => setSelectedFramework(fw.id)}
                    className={`p-3 rounded-xl border transition-all ${
                      selectedFramework === fw.id
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className={`text-lg font-bold bg-gradient-to-r ${fw.color} bg-clip-text text-transparent`}>
                      {fw.name}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">{fw.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Script Preview */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Script Preview
                </h4>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyScript}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    onClick={generateScript}
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white"
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    Generate
                  </Button>
                </div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {modules.map((module, i) => (
                  <div
                    key={module.id}
                    draggable
                    onDragStart={() => handleDragStart(i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragEnd={handleDragEnd}
                    className={`p-3 rounded-lg bg-white/5 border border-white/10 cursor-move hover:bg-white/10 transition-colors ${
                      draggedIndex === i ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-cyan-400 text-xs font-medium">{module.name}</span>
                        <p className="text-white text-sm mt-1">{module.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Features */}
          <div className="content-block space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Script <span className="text-cyan-400">Flow AI</span>
            </h3>
            
            <div className="space-y-4">
              {[
                {
                  title: 'Framework Templates',
                  description: 'Pilih dari berbagai framework copywriting yang terbukti efektif',
                  icon: FileText,
                },
                {
                  title: 'Drag & Drop Modules',
                  description: 'Atur urutan modul script sesuai kebutuhan kontenmu',
                  icon: GripVertical,
                },
                {
                  title: 'AI Enhancement',
                  description: 'Tingkatkan kualitas script dengan satu klik menggunakan AI',
                  icon: Sparkles,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline Preview */}
            <div className="glass rounded-2xl p-6 border border-white/10 mt-6">
              <h4 className="text-white font-medium mb-4">Module Timeline</h4>
              <div className="flex items-center gap-2">
                {modules.map((module, i) => (
                  <div key={module.id} className="flex items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{module.name.slice(0, 3)}</span>
                    </div>
                    {i < modules.length - 1 && (
                      <div className="w-4 h-0.5 bg-gradient-to-r from-purple-500/50 to-cyan-500/50" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>0:00</span>
                <span>0:30</span>
                <span>1:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
