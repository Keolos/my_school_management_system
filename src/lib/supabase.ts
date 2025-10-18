import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
};

export type Course = {
  id: string;
  code: string;
  name: string;
  description: string;
  teacher_id: string;
  credits: number;
  created_at: string;
};

export type Enrollment = {
  id: string;
  student_id: string;
  course_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'dropped';
};

export type Attendance = {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string;
  marked_by: string;
  created_at: string;
};

export type Grade = {
  id: string;
  student_id: string;
  course_id: string;
  assessment_type: 'assignment' | 'quiz' | 'midterm' | 'final' | 'project';
  assessment_name: string;
  score: number;
  max_score: number;
  percentage: number;
  feedback: string;
  graded_by: string;
  graded_at: string;
  created_at: string;
};

export type Timetable = {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  created_at: string;
};
