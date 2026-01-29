import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Video, User, UserX, Mic, Settings, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const avatars = [
  { id: 'avatar1', name: 'Sarah', image: '/ai-avatar.png', style: 'Professional' },
  { id: 'avatar2', name: 'Mike', image: '/ai-avatar.png', style: 'Casual' },
  { id: 'avatar3', name: 'Lisa', image: '/ai-avatar.png', style: 'Energetic' },
];

const voiceSettings = [
  { label: 'Speed', value: '1.0x', options: ['0.5x', '0.8x', '1.0x', '1.2x', '1.5x'] },
  { label: 'Energy', value: 'High', options: ['Low', 'Medium', 'High'] },
  { label: 'Pitch', value: 'Normal', options: ['Low', 'Normal', 'High'] },
];

export default function VideoGenerator() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [videoType, setVideoType] = useState<'avatar' | 'faceless'>('avatar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const generateVideo = () => {
    setIsGenerating(true);
    setIsComplete(false);
    setProgress(0);

    // Simulate video generation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setIsComplete(true);
          toast.success('Video generated successfully!');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <section
      ref={sectionRef}
      id="video-generator"
      className="relative min-h-screen w-full overflow-hidden bg-[#05050A] py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="animate-item inline-block text-pink-400 text-sm font-medium tracking-wider mb-4">
            Module 3
          </span>
          <h2 className="animate-item text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-cyan-400">TANPA RIBET</span>
          </h2>
          <p className="animate-item text-gray-400 text-lg max-w-2xl mx-auto">
            Pilih avatar AI atau buat video faceless. Generate voiceover natural dan visual profesional dalam satu klik.
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-2 gap-12">
          {/* Left: Video Generator Interface */}
          <div className="content-block space-y-6">
            {/* Video Type Selection */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h4 className="text-white font-medium mb-4">Pilih Avatar</h4>
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setVideoType('avatar')}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    videoType === 'avatar'
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <User className="w-6 h-6 text-purple-400" />
                  <span className="text-white text-sm">AI Avatar</span>
                </button>
                <button
                  onClick={() => setVideoType('faceless')}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    videoType === 'faceless'
                      ? 'border-cyan-500/50 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <UserX className="w-6 h-6 text-cyan-400" />
                  <span className="text-white text-sm">Faceless</span>
                </button>
              </div>

              {/* Avatar Selection */}
              {videoType === 'avatar' && (
                <div className="grid grid-cols-3 gap-3">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`p-3 rounded-xl border transition-all ${
                        selectedAvatar === avatar.id
                          ? 'border-purple-500/50 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                      />
                      <div className="text-white text-sm font-medium">{avatar.name}</div>
                      <div className="text-gray-500 text-xs">{avatar.style}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Settings */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h4 className="text-white font-medium mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-cyan-400" />
                Voice Settings
              </h4>
              <div className="space-y-4">
                {voiceSettings.map((setting, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{setting.label}</span>
                    <div className="flex gap-2">
                      {setting.options.map((opt) => (
                        <button
                          key={opt}
                          className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                            opt === setting.value
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-white/5 text-gray-500 hover:bg-white/10'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Video Preview & Generate */}
          <div className="content-block space-y-6">
            {/* Video Preview */}
            <div className="glass rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Video className="w-5 h-5 text-pink-400" />
                  Preview
                </h4>
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 text-sm">1080p | 9:16</span>
                </div>
              </div>

              {/* Video Preview Area */}
              <div className="relative aspect-[9/16] max-h-80 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden mb-4">
                <img
                  src="/video-generator.jpg"
                  alt="Video Preview"
                  className="w-full h-full object-cover"
                />

                {/* Generating Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                    <p className="text-white font-medium mb-2">AI RENDERING</p>
                    <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-100"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-gray-400 text-sm mt-2">{progress}% - Ready in 2m</p>
                  </div>
                )}

                {/* Complete Overlay */}
                {isComplete && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-white font-medium">Video Ready!</p>
                  </div>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-lg">
                  <span className="text-white text-sm">0:42</span>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                size="lg"
                onClick={generateVideo}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white font-semibold py-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating video...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3">
              {[
                'AI-powered lip sync untuk avatar',
                '100+ template visual profesional',
                'Export HD dalam format apapun',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
