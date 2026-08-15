import { LectureStatus } from '../types/database';

const STYLES: Record<LectureStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-status-pending-bg', text: 'text-status-pending-text', label: 'Pending' },
  processing: { bg: 'bg-status-processing-bg', text: 'text-status-processing-text', label: 'Processing' },
  done: { bg: 'bg-status-done-bg', text: 'text-status-done-text', label: 'Ready' },
  failed: { bg: 'bg-status-failed-bg', text: 'text-status-failed-text', label: 'Failed' },
};

export default function StatusBadge({ status }: { status: LectureStatus }) {
  const style = STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {status === 'processing' && (
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
      )}
      {style.label}
    </span>
  );
}