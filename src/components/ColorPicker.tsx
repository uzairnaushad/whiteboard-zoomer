
import { useState } from 'react';

interface ColorPickerProps {
  activeColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker = ({ activeColor, onColorChange }: ColorPickerProps) => {
  const [customColor, setCustomColor] = useState('#000000');
  const [showCustom, setShowCustom] = useState(false);
  
  const colors = [
    '#000000', // Black
    '#ffffff', // White
    '#f87171', // Red
    '#fb923c', // Orange
    '#facc15', // Yellow
    '#4ade80', // Green
    '#22d3ee', // Cyan
    '#60a5fa', // Blue
    '#a78bfa', // Purple
    '#f472b6', // Pink
  ];
  
  const handleColorChange = (color: string) => {
    onColorChange(color);
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomColor(e.target.value);
  };

  const handleCustomColorSubmit = () => {
    onColorChange(customColor);
    setShowCustom(false);
  };
  
  return (
    <div className="fixed right-4 top-20 flex flex-col items-center p-2 rounded-lg bg-white bg-opacity-90 backdrop-blur-sm shadow-lg border border-border animate-fade-in">
      <div className="grid grid-cols-2 gap-2 mb-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`color-swatch ${activeColor === color ? 'active' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => handleColorChange(color)}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
      
      {showCustom ? (
        <div className="flex flex-col space-y-2 w-full mt-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-full h-8 cursor-pointer rounded"
          />
          <button
            className="px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90 transition-colors"
            onClick={handleCustomColorSubmit}
          >
            Apply
          </button>
        </div>
      ) : (
        <button
          className="w-full text-xs px-2 py-1 mt-1 text-primary hover:bg-secondary rounded transition-colors"
          onClick={() => setShowCustom(true)}
        >
          Custom Color
        </button>
      )}
    </div>
  );
};
