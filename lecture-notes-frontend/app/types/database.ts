export type Course = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type LectureStatus = 'pending' | 'processing' | 'done' | 'failed';

export type Lecture = {
  id: string;
  course_id: string;
  title: string;
  audio_url: string | null;
  transcript_text: string | null;
  status: LectureStatus;
  created_at: string;
};

export type Notes = {
  id: string;
  lecture_id: string;
  concepts: string[];
  definitions: { term: string; definition: string }[];
  formulas: string[];
  emphasized_points: string[];
};

export type Chunk = {
  id: string;
  lecture_id: string;
  course_id: string;
  content: string;
  embedding: number[];
  start_time: number;
  end_time: number;
};

export type ChatCitation = {
  lectureId: string;
  lectureTitle: string;
  startTime: number;
  endTime: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: ChatCitation[];
};