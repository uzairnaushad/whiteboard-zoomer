
import { MouseEvent } from 'react';
import { 
  Pencil, 
  Paintbrush, 
  Eraser, 
  MousePointer, 
  Type, 
  Circle, 
  Square, 
  Triangle, 
  Image as ImageIcon, 
  Video, 
  Play
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type { WhiteboardState } from '@/hooks/useWhiteboard';

interface ToolbarProps {
  activeTool: WhiteboardState['activeTool'];
  brushSize: number;
  onToolChange: (tool: WhiteboardState['activeTool']) => void;
  onAddShape: (shape: 'rect' | 'circle' | 'triangle') => void;
  onAddText: () => void;
  onBrushSizeChange: (size: number) => void;
  onImageUpload: () => void;
  onVideoUpload: () => void;
  onAnimationPlay: () => void;
}

export const Toolbar = ({
  activeTool,
  brushSize,
  onToolChange,
  onAddShape,
  onAddText,
  onBrushSizeChange,
  onImageUpload,
  onVideoUpload,
  onAnimationPlay
}: ToolbarProps) => {
  const handleToolClick = (e: MouseEvent<HTMLButtonElement>, tool: WhiteboardState['activeTool']) => {
    e.preventDefault();
    onToolChange(tool);
  };

  const handleShapeClick = (e: MouseEvent<HTMLButtonElement>, shape: 'rect' | 'circle' | 'triangle') => {
    e.preventDefault();
    onAddShape(shape);
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-2 p-2 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border border-border animate-fade-in">
      <button
        className={`tool-button has-tooltip ${activeTool === 'select' ? 'active' : ''}`}
        onClick={(e) => handleToolClick(e, 'select')}
      >
        <MousePointer className="h-5 w-5" />
        <span className="custom-tooltip">Select</span>
      </button>
      
      <button
        className={`tool-button has-tooltip ${activeTool === 'pencil' ? 'active' : ''}`}
        onClick={(e) => handleToolClick(e, 'pencil')}
      >
        <Pencil className="h-5 w-5" />
        <span className="custom-tooltip">Pencil</span>
      </button>
      
      <button
        className={`tool-button has-tooltip ${activeTool === 'brush' ? 'active' : ''}`}
        onClick={(e) => handleToolClick(e, 'brush')}
      >
        <Paintbrush className="h-5 w-5" />
        <span className="custom-tooltip">Brush</span>
      </button>
      
      <button
        className={`tool-button has-tooltip ${activeTool === 'eraser' ? 'active' : ''}`}
        onClick={(e) => handleToolClick(e, 'eraser')}
      >
        <Eraser className="h-5 w-5" />
        <span className="custom-tooltip">Eraser</span>
      </button>
      
      {(activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') && (
        <div className="py-2 px-3 my-1 bg-secondary rounded-md">
          <Slider
            value={[brushSize]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) => onBrushSizeChange(value[0])}
            className="w-5 h-20"
            orientation="vertical"
          />
        </div>
      )}
      
      <Separator className="my-1" />
      
      <button
        className="tool-button has-tooltip"
        onClick={onAddText}
      >
        <Type className="h-5 w-5" />
        <span className="custom-tooltip">Add Text</span>
      </button>
      
      <button
        className="tool-button has-tooltip"
        onClick={(e) => handleShapeClick(e, 'rect')}
      >
        <Square className="h-5 w-5" />
        <span className="custom-tooltip">Add Rectangle</span>
      </button>
      
      <button
        className="tool-button has-tooltip"
        onClick={(e) => handleShapeClick(e, 'circle')}
      >
        <Circle className="h-5 w-5" />
        <span className="custom-tooltip">Add Circle</span>
      </button>
      
      <button
        className="tool-button has-tooltip"
        onClick={(e) => handleShapeClick(e, 'triangle')}
      >
        <Triangle className="h-5 w-5" />
        <span className="custom-tooltip">Add Triangle</span>
      </button>
      
      <Separator className="my-1" />
      
      <button
        className="tool-button has-tooltip"
        onClick={onImageUpload}
      >
        <ImageIcon className="h-5 w-5" />
        <span className="custom-tooltip">Add Image</span>
      </button>
      
      <button
        className="tool-button has-tooltip"
        onClick={onVideoUpload}
      >
        <Video className="h-5 w-5" />
        <span className="custom-tooltip">Add Video</span>
      </button>
      
      <Separator className="my-1" />
      
      <button
        className="tool-button has-tooltip"
        onClick={onAnimationPlay}
      >
        <Play className="h-5 w-5" />
        <span className="custom-tooltip">Play Animation</span>
      </button>
    </div>
  );
};
