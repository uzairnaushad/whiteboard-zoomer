
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Undo, Redo, Download, Trash2, Info } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NavbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export const Navbar = ({ onUndo, onRedo, onClear, onDownload }: NavbarProps) => {
  const [infoOpen, setInfoOpen] = useState(false);
  
  return (
    <div className="h-16 px-4 border-b border-border flex items-center justify-between animate-fade-in">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-medium transition-all duration-300 hover:tracking-wider">
          WhiteCanvas
        </h1>
        <span className="bg-black text-white px-2 py-0.5 text-xs rounded-full">Beta</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onUndo}
          className="transition-all duration-200 hover:bg-muted"
        >
          <Undo className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRedo}
          className="transition-all duration-200 hover:bg-muted"
        >
          <Redo className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onDownload}
          className="transition-all duration-200 hover:bg-muted"
        >
          <Download className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="transition-all duration-200 hover:bg-muted"
            >
              <Trash2 className="h-5 w-5 text-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onClear}>
              Clear canvas
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="transition-all duration-200 hover:bg-muted"
            >
              <Info className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel">
            <DialogHeader>
              <DialogTitle className="text-xl">About WhiteCanvas</DialogTitle>
              <DialogDescription>
                A beautiful whiteboard animator for creating engaging presentations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                WhiteCanvas allows you to create stunning whiteboard animations for your presentations.
                Draw, add images, embed videos, and animate your content with ease.
              </p>
              <p>
                Use the toolbar on the left to access drawing tools, shapes, and multimedia options.
                The controls at the top let you undo/redo actions and download your work.
              </p>
              <p className="text-sm text-muted-foreground">
                Version 1.0.0 | Made with ♥
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
