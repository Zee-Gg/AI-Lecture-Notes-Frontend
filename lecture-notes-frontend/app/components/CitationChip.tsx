import { ChatCitation } from '../types/database';
import Link from 'next/link';

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function CitationChip({ citation }: { citation: ChatCitation }) {
  return (
    <Link
      href={`/lectures/${citation.lectureId}`}
      className="inline-flex items-center gap-1.5 bg-surface-alt border border-border rounded-full px-3 py-1 text-xs text-text-secondary hover:border-accent hover:text-accent transition-colors"
    >
      <span className="font-medium truncate max-w-[140px]">{citation.lectureTitle}</span>
      <span className="text-text-muted">· {formatTimestamp(citation.startTime)}</span>
    </Link>
  );
}