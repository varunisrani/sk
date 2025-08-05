import { useState } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Trash2 } from "lucide-react";

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  memberName?: string;
  className?: string;
}

export const PhotoUpload = ({
  currentPhotoUrl,
  onPhotoChange,
  memberName = "Member",
  className
}: PhotoUploadProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFiles([file]);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFileRemove = () => {
    setSelectedFiles([]);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    try {
      // TODO: Implement actual file upload to Supabase Storage
      // For now, we'll use the preview URL
      const file = selectedFiles[0];
      const formData = new FormData();
      formData.append('file', file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Upload to Supabase Storage
      // 2. Get the public URL
      // 3. Call onPhotoChange with the URL
      
      onPhotoChange(previewUrl);
      setSelectedFiles([]);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    onPhotoChange(null);
    handleFileRemove();
  };

  const displayUrl = previewUrl || currentPhotoUrl;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Member Photo</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current/Preview Photo */}
        <div className="flex justify-center">
          <Avatar className="h-32 w-32">
            <AvatarImage src={displayUrl || undefined} alt={memberName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {getInitials(memberName)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Upload Interface */}
        {!currentPhotoUrl && !previewUrl && (
          <FileUpload
            onFileSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            selectedFiles={selectedFiles}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.gif'] }}
            maxFiles={1}
            maxSize={5 * 1024 * 1024} // 5MB
            placeholder="Drop a photo here or click to browse"
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-2">
          {previewUrl && (
            <>
              <Button 
                onClick={handleUpload} 
                disabled={uploading}
                className="min-w-24"
              >
                {uploading ? 'Uploading...' : 'Save Photo'}
              </Button>
              <Button variant="outline" onClick={handleFileRemove}>
                Cancel
              </Button>
            </>
          )}

          {currentPhotoUrl && !previewUrl && (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  // Trigger file selection
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) {
                      handleFileSelect(Array.from(files));
                    }
                  };
                  input.click();
                }}
              >
                Change Photo
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRemovePhoto}
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Recommended: Square image, at least 200x200px, max 5MB
        </p>
      </CardContent>
    </Card>
  );
};