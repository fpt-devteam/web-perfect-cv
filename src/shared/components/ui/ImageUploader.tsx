import React, { useRef, useState } from 'react';
import axios from 'axios';

interface ImageUploaderProps {
  apiUrl: string;
  initialUrl?: string;
  onUploaded?: (url: string) => void;
  label?: string;
  accept?: string;
  previewClassName?: string;
  buttonClassName?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  apiUrl,
  initialUrl,
  onUploaded,
  label = 'Upload Image',
  accept = 'image/*',
  previewClassName = 'w-24 h-24 rounded overflow-hidden border',
  buttonClassName = 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50',
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      // Ưu tiên lấy url từ avatarUrl, imageUrl, url hoặc response.data
      const url =
        response.data.avatarUrl || response.data.imageUrl || response.data.url || response.data;

      setImageUrl(url);
      onUploaded?.(url);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={previewClassName}>
        {imageUrl ? (
          <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No Image
          </div>
        )}
      </div>
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        className={buttonClassName}
        onClick={() => fileInputRef.current?.click()}
        disabled={loading}
      >
        {loading ? 'Uploading...' : label}
      </button>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
};

export default ImageUploader;
