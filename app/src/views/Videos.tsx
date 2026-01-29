import { useState, useEffect } from 'react';
import { Video, Search, Trash2, Download, Play, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScripts } from '@/hooks/useScripts';
import { videoApi } from '@/services/mockApi';
import type { Video as VideoType } from '@/types';
import { toast } from 'sonner';

const videoStyles = [
  { id: 'faceless', label: 'Faceless', desc: 'Stock footage + AI voice' },
  { id: 'avatar', label: 'AI Avatar', desc: 'Digital presenter' },
  { id: 'real', label: 'Real Footage', desc: 'Your own content' },
];

export default function Videos() {
  const { scripts } = useScripts();
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    const data = videoApi.getVideos();
    setVideos(data);
  }, []);
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Generator form state
  const [selectedScript, setSelectedScript] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('faceless');

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!selectedScript) {
      toast.error('Please select a script');
      return;
    }

    setIsGenerating(true);
    try {
      const video = await videoApi.generateVideo(selectedScript, selectedStyle);
      setVideos([...videos, video]);
      toast.success('Video generated successfully!');
      setShowGenerator(false);
    } catch (error) {
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    videoApi.deleteVideo(id);
    setVideos(videos.filter(v => v.id !== id));
    toast.success('Video deleted');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'generating':
        return <Loader2 className="w-4 h-4 text-cyan animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-white/40" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Videos
          </h1>
          <p className="text-white/60 mt-1">
            Manage your generated videos
          </p>
        </div>
        <Button
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
        >
          <Video className="w-4 h-4 mr-2" />
          {showGenerator ? 'Cancel' : 'Generate Video'}
        </Button>
      </div>

      {/* Video Generator */}
      {showGenerator && (
        <div className="glass rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-white mb-4">
            Generate New Video
          </h3>

          <div className="mb-6">
            <label className="block text-sm text-white/70 mb-2">Select Script</label>
            <select
              value={selectedScript}
              onChange={(e) => setSelectedScript(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple/50"
            >
              <option value="" className="bg-surface">Select a script...</option>
              {scripts.map((s) => (
                <option key={s.id} value={s.id} className="bg-surface">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-white/70 mb-2">Video Style</label>
            <div className="grid sm:grid-cols-3 gap-3">
              {videoStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${selectedStyle === style.id
                      ? 'border-purple bg-purple/10'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className="font-medium text-white mb-1">{style.label}</div>
                  <div className="text-xs text-white/50">{style.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedScript}
            className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating... (ETA: 3-5 min)
              </>
            ) : (
              <>
                <Video className="w-4 h-4 mr-2" />
                Generate Video
              </>
            )}
          </Button>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50"
        />
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 glass rounded-xl">
          <Video className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No videos yet</h3>
          <p className="text-white/50 mb-4">Generate your first video from a script</p>
          <Button
            onClick={() => setShowGenerator(true)}
            className="bg-gradient-to-r from-purple to-cyan hover:opacity-90 text-white"
          >
            <Video className="w-4 h-4 mr-2" />
            Generate Video
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className="glass rounded-xl overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden bg-surface">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Video className="w-12 h-12 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/60 text-xs text-white">
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-white line-clamp-1">{video.title}</h3>
                  {getStatusIcon(video.status)}
                </div>

                <div className="flex items-center gap-2 text-sm text-white/50 mb-4">
                  <span className="capitalize">{video.style}</span>
                  <span>•</span>
                  <span>{video.resolution}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(video.id)}
                    className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
