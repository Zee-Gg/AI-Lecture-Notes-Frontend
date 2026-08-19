'use client';

type Props = {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  deleting: boolean;
};

export default function ConfirmDeleteModal({ open, title, message, onCancel, onConfirm, deleting }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-xl font-semibold text-text-primary mb-2">{title}</h2>
        <p className="text-text-secondary text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 border border-border text-text-secondary rounded-xl py-2.5 font-medium hover:bg-surface-alt transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 bg-status-failed-text hover:opacity-90 text-white rounded-xl py-2.5 font-medium transition-colors disabled:opacity-60"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}