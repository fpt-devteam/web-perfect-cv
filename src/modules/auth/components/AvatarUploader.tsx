import React, { useRef, useState } from 'react';
import { updateAvatar } from '../services/user.service';

interface AvatarUploaderProps {
  initialAvatarUrl?: string;
  onUploaded?: (url: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ initialAvatarUrl, onUploaded }) => {
  const [preview, setPreview] = useState<string | undefined>(initialAvatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      // Clean up previous preview URL to avoid memory leaks
      setPreview(prev => {
        if (prev && prev !== initialAvatarUrl) URL.revokeObjectURL(prev);
        return URL.createObjectURL(selected);
      });
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const user = await updateAvatar(file);
      if (onUploaded) onUploaded(user.avatarUrl ?? '');
      // Reset file input and preview after successful upload
      setFile(null);
      if (preview && preview !== initialAvatarUrl) URL.revokeObjectURL(preview);
      setPreview(user.avatarUrl);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-card)] shadow bg-[var(--color-muted)]">
        {preview ? (
          <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--color-muted-foreground)]">
            No Avatar
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="px-4 py-2 rounded font-semibold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:brightness-110 disabled:opacity-50 transition"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        Choose Image
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded font-semibold bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)] border border-[var(--color-border)] disabled:opacity-50 transition"
        onClick={handleUpload}
        disabled={!file || loading}
      >
        {loading ? 'Loading...' : 'Upload Avatar'}
      </button>
      {error && <div className="text-[var(--destructive)] text-sm mt-1">{error}</div>}
    </div>
  );
};

export default AvatarUploader;
