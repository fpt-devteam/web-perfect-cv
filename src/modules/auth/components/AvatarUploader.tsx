import React, { useRef, useState } from 'react';
import { Camera, Upload, User, AlertCircle, CheckCircle } from 'lucide-react';
import { updateAvatar } from '../services/user.service';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';

interface AvatarUploaderProps {
  initialAvatarUrl?: string;
  onUploaded?: (url: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ initialAvatarUrl, onUploaded }) => {
  const [preview, setPreview] = useState<string | undefined>(initialAvatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      // Validate file size (max 5MB)
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!selected.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setFile(selected);
      // Clean up previous preview URL to avoid memory leaks
      setPreview(prev => {
        if (prev && prev !== initialAvatarUrl) URL.revokeObjectURL(prev);
        return URL.createObjectURL(selected);
      });
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const user = await updateAvatar(file);
      if (onUploaded) onUploaded(user.avatarUrl ?? '');

      // Reset file input and preview after successful upload
      setFile(null);
      if (preview && preview !== initialAvatarUrl) URL.revokeObjectURL(preview);
      setPreview(user.avatarUrl);
      if (inputRef.current) inputRef.current.value = '';
      setSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Display */}
      <div className="relative group">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={preview} alt="Profile avatar" className="object-cover" />
          <AvatarFallback className="bg-primary/10 text-primary text-xl">
            <User className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>

        {/* Overlay on hover */}
        <div
          className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
          onClick={() => inputRef.current?.click()}
        >
          <Camera className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* File Input */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Choose profile picture"
      />

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full"
        >
          <Camera className="h-4 w-4 mr-2" />
          Choose Photo
        </Button>

        {file && (
          <Button type="button" onClick={handleUpload} disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive" className="w-full max-w-[300px]">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="w-full max-w-[300px] border-green-300 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-700" />
          <AlertDescription className="text-sm text-green-900 font-medium">
            Avatar updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* File Info */}
      {file && !loading && (
        <div className="text-xs text-muted-foreground text-center">
          Selected: {file.name}
          <br />
          Size: {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground text-center max-w-[250px]">
        Recommended: Square image, at least 200x200px, max 5MB
      </p>
    </div>
  );
};

export default AvatarUploader;
