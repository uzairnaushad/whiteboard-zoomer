
import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export interface WhiteboardState {
  canvas: fabric.Canvas | null;
  activeTool: 'pencil' | 'brush' | 'eraser' | 'select' | 'text' | 'shape' | 'line' | 'image' | 'video' | 'pan';
  activeColor: string;
  brushSize: number;
  history: fabric.Object[][];
  historyIndex: number;
  isDrawing: boolean;
  shapes: ('rect' | 'circle' | 'triangle')[];
  selectedShapeIndex: number;
  showGrid: boolean;
}

export const useWhiteboard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [whiteboard, setWhiteboard] = useState<WhiteboardState>({
    canvas: null,
    activeTool: 'select',
    activeColor: '#000000',
    brushSize: 5,
    history: [],
    historyIndex: -1,
    isDrawing: false,
    shapes: ['rect', 'circle', 'triangle'],
    selectedShapeIndex: 0,
    showGrid: false,
  });

  const addToHistory = (canvas: fabric.Canvas) => {
    const json = canvas.toJSON();
    const newHistory = [...whiteboard.history.slice(0, whiteboard.historyIndex + 1), json];
    setWhiteboard(prev => ({
      ...prev,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    }));
  };

  const undo = () => {
    if (whiteboard.historyIndex > 0 && whiteboard.canvas) {
      const newIndex = whiteboard.historyIndex - 1;
      const historyItem = whiteboard.history[newIndex];
      whiteboard.canvas.loadFromJSON(historyItem, () => {
        whiteboard.canvas?.renderAll();
        setWhiteboard(prev => ({ ...prev, historyIndex: newIndex }));
      });
    }
  };

  const redo = () => {
    if (whiteboard.historyIndex < whiteboard.history.length - 1 && whiteboard.canvas) {
      const newIndex = whiteboard.historyIndex + 1;
      const historyItem = whiteboard.history[newIndex];
      whiteboard.canvas.loadFromJSON(historyItem, () => {
        whiteboard.canvas?.renderAll();
        setWhiteboard(prev => ({ ...prev, historyIndex: newIndex }));
      });
    }
  };

  const clearCanvas = () => {
    if (whiteboard.canvas) {
      whiteboard.canvas.clear();
      whiteboard.canvas.setBackgroundColor('#ffffff', () => {
        whiteboard.canvas?.renderAll();
        addToHistory(whiteboard.canvas as fabric.Canvas);
      });
    }
  };

  const setActiveTool = (tool: WhiteboardState['activeTool']) => {
    if (whiteboard.canvas) {
      whiteboard.canvas.isDrawingMode = tool === 'pencil' || tool === 'brush';
      whiteboard.canvas.selection = tool === 'select';
      
      // Set the drawing brush properties
      if (tool === 'pencil') {
        whiteboard.canvas.freeDrawingBrush = new fabric.PencilBrush(whiteboard.canvas);
        whiteboard.canvas.freeDrawingBrush.color = whiteboard.activeColor;
        whiteboard.canvas.freeDrawingBrush.width = whiteboard.brushSize;
      } else if (tool === 'brush') {
        whiteboard.canvas.freeDrawingBrush = new fabric.PencilBrush(whiteboard.canvas);
        whiteboard.canvas.freeDrawingBrush.color = whiteboard.activeColor;
        whiteboard.canvas.freeDrawingBrush.width = whiteboard.brushSize * 2;
      } else if (tool === 'eraser') {
        whiteboard.canvas.freeDrawingBrush = new fabric.EraserBrush(whiteboard.canvas);
        whiteboard.canvas.freeDrawingBrush.width = whiteboard.brushSize * 2;
        whiteboard.canvas.isDrawingMode = true;
      }

      setWhiteboard(prev => ({ ...prev, activeTool: tool }));
    }
  };

  const setActiveColor = (color: string) => {
    if (whiteboard.canvas && whiteboard.canvas.freeDrawingBrush) {
      whiteboard.canvas.freeDrawingBrush.color = color;
      setWhiteboard(prev => ({ ...prev, activeColor: color }));
    }
  };

  const setBrushSize = (size: number) => {
    if (whiteboard.canvas && whiteboard.canvas.freeDrawingBrush) {
      const adjustedSize = whiteboard.activeTool === 'brush' ? size * 2 : size;
      whiteboard.canvas.freeDrawingBrush.width = adjustedSize;
      setWhiteboard(prev => ({ ...prev, brushSize: size }));
    }
  };

  const addShape = (type: 'rect' | 'circle' | 'triangle') => {
    if (!whiteboard.canvas) return;

    let shape: fabric.Object;
    const centerX = whiteboard.canvas.getWidth() / 2;
    const centerY = whiteboard.canvas.getHeight() / 2;

    if (type === 'rect') {
      shape = new fabric.Rect({
        left: centerX - 50,
        top: centerY - 50,
        width: 100,
        height: 100,
        fill: whiteboard.activeColor,
        cornerSize: 8,
        transparentCorners: false,
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: centerX - 50,
        top: centerY - 50,
        radius: 50,
        fill: whiteboard.activeColor,
        cornerSize: 8,
        transparentCorners: false,
      });
    } else {
      // Triangle
      shape = new fabric.Triangle({
        left: centerX - 50,
        top: centerY - 50,
        width: 100,
        height: 100,
        fill: whiteboard.activeColor,
        cornerSize: 8,
        transparentCorners: false,
      });
    }

    whiteboard.canvas.add(shape);
    whiteboard.canvas.setActiveObject(shape);
    whiteboard.canvas.renderAll();
    addToHistory(whiteboard.canvas);
  };

  const addLine = () => {
    if (!whiteboard.canvas) return;
    
    const centerX = whiteboard.canvas.getWidth() / 2;
    const centerY = whiteboard.canvas.getHeight() / 2;
    
    const line = new fabric.Line(
      [centerX - 50, centerY, centerX + 50, centerY],
      {
        stroke: whiteboard.activeColor,
        strokeWidth: 3,
        cornerSize: 8,
        transparentCorners: false,
      }
    );
    
    whiteboard.canvas.add(line);
    whiteboard.canvas.setActiveObject(line);
    whiteboard.canvas.renderAll();
    addToHistory(whiteboard.canvas);
  };

  const addText = () => {
    if (!whiteboard.canvas) return;

    const text = new fabric.Textbox('Click to edit text', {
      left: whiteboard.canvas.getWidth() / 2 - 100,
      top: whiteboard.canvas.getHeight() / 2 - 12,
      fontFamily: 'Inter',
      fill: whiteboard.activeColor,
      width: 200,
      fontSize: 24,
      textAlign: 'center',
      cornerSize: 8,
      transparentCorners: false,
    });

    whiteboard.canvas.add(text);
    whiteboard.canvas.setActiveObject(text);
    whiteboard.canvas.renderAll();
    addToHistory(whiteboard.canvas);
  };

  const addImage = (url: string) => {
    if (!whiteboard.canvas) return;

    fabric.Image.fromURL(url, (image) => {
      // Scale the image to fit within the canvas
      const maxWidth = whiteboard.canvas!.getWidth() * 0.8;
      const maxHeight = whiteboard.canvas!.getHeight() * 0.8;
      const scale = Math.min(maxWidth / image.width!, maxHeight / image.height!);
      
      image.scale(scale);
      image.set({
        left: (whiteboard.canvas!.getWidth() - image.width! * scale) / 2,
        top: (whiteboard.canvas!.getHeight() - image.height! * scale) / 2,
        cornerSize: 8,
        transparentCorners: false,
      });

      whiteboard.canvas!.add(image);
      whiteboard.canvas!.setActiveObject(image);
      whiteboard.canvas!.renderAll();
      addToHistory(whiteboard.canvas!);
    }, { crossOrigin: 'anonymous' });
  };

  const addVideo = (url: string) => {
    if (!whiteboard.canvas) return;

    // Create a video element
    const videoEl = document.createElement('video');
    videoEl.width = 640;
    videoEl.height = 360;
    videoEl.muted = true;
    videoEl.crossOrigin = 'anonymous';
    videoEl.src = url;
    videoEl.autoplay = false;
    
    // Create fabric video object
    const video = new fabric.Image(videoEl, {
      left: 100,
      top: 100,
      width: 320,
      height: 180,
      cornerSize: 8,
      transparentCorners: false,
    });

    whiteboard.canvas.add(video);
    whiteboard.canvas.renderAll();
    addToHistory(whiteboard.canvas);

    // Return the video element for controlling playback
    return videoEl;
  };

  const download = () => {
    if (!whiteboard.canvas) return;
    
    const dataURL = whiteboard.canvas.toDataURL({
      format: 'png',
      quality: 1,
    });

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleGrid = () => {
    setWhiteboard(prev => ({
      ...prev,
      showGrid: !prev.showGrid
    }));
  };

  const initialiseCanvas = (canvasElement: HTMLCanvasElement) => {
    // Store canvas element reference
    canvasRef.current = canvasElement;
    
    // Create Fabric canvas instance
    const canvas = new fabric.Canvas(canvasElement, {
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      stopContextMenu: true,
      fireRightClick: true,
    });

    // Resize canvas to fit container
    const resizeCanvas = () => {
      const container = canvasElement.parentElement;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    };

    // Set up event listeners
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Store canvas instance in state
    fabricCanvasRef.current = canvas;
    setWhiteboard(prev => ({ ...prev, canvas }));

    // Add first history snapshot
    addToHistory(canvas);

    // Set up event handlers for the canvas
    canvas.on('object:added', () => {
      if (!whiteboard.isDrawing) {
        addToHistory(canvas);
      }
    });

    canvas.on('object:modified', () => {
      addToHistory(canvas);
    });

    canvas.on('mouse:down', () => {
      setWhiteboard(prev => ({ ...prev, isDrawing: true }));
    });

    canvas.on('mouse:up', () => {
      if (whiteboard.isDrawing) {
        addToHistory(canvas);
        setWhiteboard(prev => ({ ...prev, isDrawing: false }));
      }
    });

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', resizeCanvas);
    };
  };

  return {
    whiteboard,
    initialiseCanvas,
    setActiveTool,
    setActiveColor,
    setBrushSize,
    addShape,
    addText,
    addLine,
    addImage,
    addVideo,
    clearCanvas,
    undo,
    redo,
    download,
    toggleGrid,
  };
};
