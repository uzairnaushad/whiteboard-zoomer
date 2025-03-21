
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
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageAdd: (url: string) => void;
}

export const ImageUploader = ({ open, onOpenChange, onImageAdd }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setUploadedImage(null);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };
  
  const handleAddImage = () => {
    setIsLoading(true);
    
    try {
      if (uploadedImage) {
        onImageAdd(uploadedImage);
        resetForm();
        toast.success('Image added successfully');
      } else if (imageUrl) {
        // Simple validation
        if (!imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          toast.error('Please enter a valid image URL');
          setIsLoading(false);
          return;
        }
        
        // Test if the image is accessible
        const img = new Image();
        img.onload = () => {
          onImageAdd(imageUrl);
          resetForm();
          toast.success('Image added successfully');
          setIsLoading(false);
        };
        img.onerror = () => {
          toast.error('Failed to load image from URL');
          setIsLoading(false);
        };
        img.src = imageUrl;
      } else {
        toast.error('Please provide an image URL or upload a file');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error adding image:', error);
      toast.error('Failed to add image');
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setImageUrl('');
    setUploadedImage(null);
    setIsLoading(false);
    onOpenChange(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel animate-scale-in sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Image</DialogTitle>
          <DialogDescription>
            Upload an image or provide a URL to add to your whiteboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={handleUrlChange}
              disabled={!!uploadedImage || isLoading}
              className="transition-all duration-300 focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="text-center text-xs text-muted-foreground">OR</div>
          
          <div className="grid gap-2">
            <Label htmlFor="image-file">Upload Image</Label>
            <div className="flex items-center gap-2">
              <Input
                id="image-file"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={!!imageUrl || isLoading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={!!imageUrl || isLoading}
                className="w-full transition-all duration-300 border-dashed hover:border-primary hover:bg-primary/5 focus:ring-2 focus:ring-primary"
              >
                <Upload className="mr-2 h-4 w-4" />
                Select File
              </Button>
              
              {uploadedImage && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => setUploadedImage(null)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {uploadedImage && (
            <div className="mt-2 overflow-hidden rounded-md border">
              <div className="relative aspect-[4/3] bg-muted">
                <img
                  src={uploadedImage}
                  alt="Uploaded image preview"
                  className="object-contain w-full h-full animate-scale-in"
                />
              </div>
            </div>
          )}
          
          {!uploadedImage && !imageUrl && (
            <div className="mt-2 overflow-hidden rounded-md border border-dashed flex items-center justify-center">
              <div className="relative aspect-[4/3] bg-muted flex flex-col items-center justify-center text-muted-foreground p-4">
                <ImageIcon className="h-12 w-12 opacity-20" />
                <p className="mt-2 text-sm">Your image will appear here</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={resetForm} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddImage} 
            disabled={(!imageUrl && !uploadedImage) || isLoading}
            className="transition-all duration-300"
          >
            {isLoading ? 'Adding...' : 'Add to Whiteboard'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
