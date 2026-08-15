'use client';
import { useState, FormEvent } from 'react';
import { apiFetch } from '../lib/apiClient';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateCourseModal({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiFetch('/api/courses', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      setName('');
      onCreated();
      onClose();
    } catch (err) {
      setError('Could not create course. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">
          New Course
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <input
            type="text"
            placeholder="e.g. Database Systems"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="w-full border border-[#E5E2DB] rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#E86A33]/40"
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
              disabled={submitting}
              className="flex-1 bg-[#E86A33] hover:bg-[#D65A28] text-white rounded-xl py-2.5 font-medium transition-colors disabled:opacity-60"
            >
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}