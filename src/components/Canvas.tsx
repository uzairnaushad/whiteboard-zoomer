
import { useRef, useEffect } from 'react';
import { useWhiteboard } from '@/hooks/useWhiteboard';
import { Navbar } from '@/components/Navbar';
import { Toolbar } from '@/components/Toolbar';
import { ColorPicker } from '@/components/ColorPicker';
import { ImageUploader } from '@/components/ImageUploader';
import { VideoEmbed } from '@/components/VideoEmbed';
import { AnimationControls } from '@/components/AnimationControls';
import { toast } from 'sonner';
import { useState } from 'react';

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    whiteboard,
    initialiseCanvas,
    setActiveTool,
    setActiveColor,
    setBrushSize,
    addShape,
    addText,
    addImage,
    addVideo,
    clearCanvas,
    undo,
    redo,
    download,
  } = useWhiteboard();
  
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [animationDialogOpen, setAnimationDialogOpen] = useState(false);
  
  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = initialiseCanvas(canvasRef.current);
      toast.success('Canvas ready! Start creating your presentation.');
      return cleanup;
    }
  }, []);
  
  const handleImageUpload = () => {
    setImageDialogOpen(true);
  };
  
  const handleVideoUpload = () => {
    setVideoDialogOpen(true);
  };
  
  const handleAnimationPlay = () => {
    setAnimationDialogOpen(true);
  };
  
  const handleClearCanvas = () => {
    if (confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      clearCanvas();
      toast.success('Canvas cleared');
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar
        onUndo={undo}
        onRedo={redo}
        onClear={handleClearCanvas}
        onDownload={download}
      />
      
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 p-8">
          <div className="w-full h-full relative">
            <div className="canvas-container w-full h-full">
              <canvas
                ref={canvasRef}
                className="touch-none w-full h-full"
              />
            </div>
          </div>
        </div>
        
        <ColorPicker
          activeColor={whiteboard.activeColor}
          onColorChange={setActiveColor}
        />
        
        <Toolbar
          activeTool={whiteboard.activeTool}
          brushSize={whiteboard.brushSize}
          onToolChange={setActiveTool}
          onAddShape={addShape}
          onAddText={addText}
          onBrushSizeChange={setBrushSize}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
          onAnimationPlay={handleAnimationPlay}
        />
        
        <ImageUploader
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          onImageAdd={addImage}
        />
        
        <VideoEmbed
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
          onVideoAdd={addVideo}
        />
        
        <AnimationControls
          open={animationDialogOpen}
          onOpenChange={setAnimationDialogOpen}
          onPlay={() => {
            // Animation logic would go here
            toast.success('Animation started');
          }}
        />
      </div>
    </div>
  );
};
