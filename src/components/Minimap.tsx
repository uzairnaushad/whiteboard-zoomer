
import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface MinimapProps {
  canvas: fabric.Canvas | null;
}

export const Minimap = ({ canvas }: MinimapProps) => {
  const minimapRef = useRef<HTMLCanvasElement>(null);
  const minimapCanvasRef = useRef<fabric.StaticCanvas | null>(null);
  
  useEffect(() => {
    if (!minimapRef.current || !canvas) return;
    
    // Create minimap canvas
    const minimapCanvas = new fabric.StaticCanvas(minimapRef.current);
    minimapCanvasRef.current = minimapCanvas;
    
    minimapCanvas.setWidth(150);
    minimapCanvas.setHeight(100);
    
    // Update minimap when main canvas changes
    const updateMinimap = () => {
      if (!canvas || !minimapCanvas) return;
      
      minimapCanvas.clear();
      
      // Create a scaled-down version of main canvas
      const mainCanvasJSON = canvas.toJSON();
      const scaleFactor = Math.min(
        minimapCanvas.width! / canvas.width!,
        minimapCanvas.height! / canvas.height!
      ) * 0.9;
      
      // Add background
      minimapCanvas.setBackgroundColor('#ffffff', () => {
        // Load objects from main canvas
        fabric.util.enlivenObjects(mainCanvasJSON.objects, (objects) => {
          objects.forEach(obj => {
            obj.scale(scaleFactor);
            minimapCanvas.add(obj);
          });
          
          minimapCanvas.renderAll();
        }, 'fabric');
      });
    };
    
    // Update minimap on any canvas change
    canvas.on('object:added', updateMinimap);
    canvas.on('object:removed', updateMinimap);
    canvas.on('object:modified', updateMinimap);
    
    // Initial update
    updateMinimap();
    
    return () => {
      canvas.off('object:added', updateMinimap);
      canvas.off('object:removed', updateMinimap);
      canvas.off('object:modified', updateMinimap);
      minimapCanvas.dispose();
    };
  }, [canvas]);
  
  return (
    <div className="fixed right-4 bottom-4 p-2 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border border-border animate-fade-in">
      <h3 className="text-xs font-medium mb-1 text-center">Canvas Overview</h3>
      <canvas 
        ref={minimapRef} 
        width={150} 
        height={100}
        className="border border-border rounded"
      />
    </div>
  );
};
