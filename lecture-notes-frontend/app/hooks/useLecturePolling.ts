import { useEffect, useRef } from 'react';
import { apiFetch } from '../lib/apiClient';
import { Lecture } from '../types/database';

export function useLecturePolling(
  lectureId: string,
  onUpdate: (lecture: Lecture) => void,
  enabled: boolean
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      apiFetch<Lecture>(`/api/lectures/${lectureId}`)
        .then((lecture) => {
          onUpdate(lecture);
          if (lecture.status === 'done' || lecture.status === 'failed') {
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
        })
        .catch((err) => console.error(err));
    }, 4000); // poll every 4 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lectureId, enabled, onUpdate]);
}