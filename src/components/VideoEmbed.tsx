
import { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { AlertCircle, Video } from 'lucide-react';

interface VideoEmbedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoAdd: (url: string) => void;
}

export const VideoEmbed = ({ open, onOpenChange, onVideoAdd }: VideoEmbedProps) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);
  
  const validateVideoUrl = (url: string): boolean => {
    // Basic validation for YouTube, Vimeo, or direct MP4 URLs
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/)(\d+)$/;
    const mp4Regex = /^https?:\/\/.+\.(mp4|webm|ogg)$/i;
    
    return youtubeRegex.test(url) || vimeoRegex.test(url) || mp4Regex.test(url);
  };
  
  const extractEmbedUrl = (url: string): string => {
    // Convert YouTube/Vimeo links to embed links
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Direct video URL - return as is
    return url;
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setIsValidUrl(url === '' || validateVideoUrl(url));
  };
  
  const handleAddVideo = () => {
    if (!videoUrl) {
      toast.error('Please enter a video URL');
      return;
    }
    
    if (!validateVideoUrl(videoUrl)) {
      toast.error('Please enter a valid YouTube, Vimeo, or direct video URL');
      setIsValidUrl(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const embedUrl = extractEmbedUrl(videoUrl);
      onVideoAdd(embedUrl);
      resetForm();
      toast.success('Video added successfully');
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setVideoUrl('');
    setIsLoading(false);
    setIsValidUrl(true);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel animate-scale-in sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Video</DialogTitle>
          <DialogDescription>
            Enter a YouTube, Vimeo, or direct video URL to add to your whiteboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="video-url" className="flex items-center gap-2">
              Video URL
              {!isValidUrl && (
                <span className="text-destructive text-xs flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Invalid URL format
                </span>
              )}
            </Label>
            <Input
              id="video-url"
              placeholder="https://www.youtube.com/watch?v=example"
              value={videoUrl}
              onChange={handleUrlChange}
              disabled={isLoading}
              className={`transition-all duration-300 focus:ring-2 focus:ring-primary ${
                !isValidUrl ? 'border-destructive' : ''
              }`}
            />
          </div>
          
          <div className="mt-2 overflow-hidden rounded-md border border-dashed flex items-center justify-center">
            <div className="relative aspect-video bg-muted flex flex-col items-center justify-center text-muted-foreground p-4">
              <Video className="h-12 w-12 opacity-20" />
              <p className="mt-2 text-sm text-center">
                {videoUrl && isValidUrl 
                  ? 'Video will be embedded on your whiteboard'
                  : 'Enter a valid video URL to embed'}
              </p>
              <p className="text-xs mt-1 text-center max-w-xs">
                Supported formats: YouTube, Vimeo, or direct MP4/WebM links
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetForm} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddVideo} 
            disabled={!videoUrl || !isValidUrl || isLoading}
            className="transition-all duration-300"
          >
            {isLoading ? 'Adding...' : 'Add to Whiteboard'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
