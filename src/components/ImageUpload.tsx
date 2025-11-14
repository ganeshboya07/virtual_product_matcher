import { useState } from 'react';
import { Upload, Link as LinkIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, disabled }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setError('');
      onImageSelect(result);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError('Please enter an image URL');
      return;
    }

    try {
      new URL(imageUrl);
      setError('');
      onImageSelect(imageUrl);
      setImageUrl('');
    } catch {
      setError('Please enter a valid URL');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={disabled}
            className="hidden"
          />
          <div className={`flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <Upload size={20} />
            <span>Upload Image</span>
          </div>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={disabled}
          className={`px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <LinkIcon size={20} />
        </button>
      </div>

      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            disabled={disabled}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={disabled}
            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Load Image
          </button>
        </form>
      )}

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
