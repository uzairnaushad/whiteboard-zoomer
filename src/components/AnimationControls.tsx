
import { useState } from 'react';
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
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, PlayCircle, PauseCircle, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AnimationControlsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlay: () => void;
}

export const AnimationControls = ({ open, onOpenChange, onPlay }: AnimationControlsProps) => {
  const [duration, setDuration] = useState(5);
  const [easing, setEasing] = useState('ease-out');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const easingOptions = [
    { value: 'linear', label: 'Linear' },
    { value: 'ease', label: 'Ease' },
    { value: 'ease-in', label: 'Ease In' },
    { value: 'ease-out', label: 'Ease Out' },
    { value: 'ease-in-out', label: 'Ease In Out' },
  ];
  
  const handlePlayClick = () => {
    setIsPlaying(true);
    // Simulate animation playing
    toast.success('Animation started');
    onPlay();
    
    // Simulate animation completion after the duration
    setTimeout(() => {
      setIsPlaying(false);
      toast.success('Animation completed');
    }, duration * 1000);
  };
  
  const handleStopClick = () => {
    setIsPlaying(false);
    toast.info('Animation stopped');
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel animate-scale-in sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Animation Controls</DialogTitle>
          <DialogDescription>
            Configure and play animations for your whiteboard presentation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="animation-duration">
              Duration (seconds): {duration}s
            </Label>
            <Slider
              id="animation-duration"
              value={[duration]}
              min={1}
              max={10}
              step={0.5}
              onValueChange={(value) => setDuration(value[0])}
              disabled={isPlaying}
              className="cursor-pointer"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="animation-easing">Easing</Label>
            <Select
              value={easing}
              onValueChange={setEasing}
              disabled={isPlaying}
            >
              <SelectTrigger id="animation-easing" className="transition-all duration-300">
                <SelectValue placeholder="Select easing" />
              </SelectTrigger>
              <SelectContent>
                {easingOptions.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="cursor-pointer transition-colors hover:bg-muted"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 flex justify-center">
            {!isPlaying ? (
              <Button
                size="lg"
                onClick={handlePlayClick}
                className="px-6 py-6 transition-all duration-300 hover:scale-105"
              >
                <PlayCircle className="h-6 w-6 mr-2" />
                Play Animation
              </Button>
            ) : (
              <Button
                size="lg"
                variant="destructive"
                onClick={handleStopClick}
                className="px-6 py-6 transition-all duration-300 hover:scale-105"
              >
                <StopCircle className="h-6 w-6 mr-2" />
                Stop Animation
              </Button>
            )}
          </div>
          
          <div className="text-xs text-muted-foreground text-center mt-2">
            <p>Animation will reveal your whiteboard elements in sequence.</p>
            <p>Current settings: {duration}s duration with {easing} easing.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPlaying}>
            Close
          </Button>
          <Button 
            variant="default" 
            onClick={() => {
              toast.success('Animation settings saved');
              onOpenChange(false);
            }}
            disabled={isPlaying}
            className="group transition-all duration-300"
          >
            <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110" />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
