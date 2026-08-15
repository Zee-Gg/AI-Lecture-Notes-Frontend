'use client';
import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';

type Props = {
  courseId: string;
  open: boolean;
  onClose: () => void;
  onUploaded: () => void;
};

const MAX_SIZE_MB = 200;

export default function UploadLectureModal({ courseId, open, onClose, onUploaded }: Props) {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setError('');
    setFile(selected);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an audio file.');
      return;
    }
    setError('');
    setUploading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const formData = new FormData();
      formData.append('audio', file);
      formData.append('title', title);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/lectures/course/${courseId}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${session?.access_token}` },
          body: formData,
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Upload failed');
      }

      setTitle('');
      setFile(null);
      onUploaded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">Upload Lecture</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="e.g. Week 5 - Normalization"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-[#E5E2DB] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E86A33]/40"
            required
          />
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full text-sm text-[#6B6B6B] file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-[#FCEEE3] file:text-[#E86A33] file:font-medium"
            required
          />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-[#E5E2DB] text-[#6B6B6B] rounded-xl py-2.5 font-medium hover:bg-[#FAF9F6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-[#E86A33] hover:bg-[#D65A28] text-white rounded-xl py-2.5 font-medium transition-colors disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}