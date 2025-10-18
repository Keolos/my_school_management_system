/*
  # School Management System Database Schema

  ## Overview
  Complete database schema for a School Management System with role-based access control.

  ## New Tables

  ### 1. profiles
  Extended user profile information linked to auth.users
  - `id` (uuid, primary key) - Links to auth.users.id
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - User role: 'student' or 'teacher'
  - `avatar_url` (text, optional) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. courses
  Academic courses/subjects offered
  - `id` (uuid, primary key)
  - `code` (text) - Course code (e.g., "CS101")
  - `name` (text) - Course name
  - `description` (text) - Course description
  - `teacher_id` (uuid) - Foreign key to profiles (teacher)
  - `credits` (integer) - Course credit hours
  - `created_at` (timestamptz)

  ### 3. enrollments
  Student-course relationships
  - `id` (uuid, primary key)
  - `student_id` (uuid) - Foreign key to profiles (student)
  - `course_id` (uuid) - Foreign key to courses
  - `enrolled_at` (timestamptz)
  - `status` (text) - 'active', 'completed', 'dropped'

  ### 4. attendance
  Student attendance records
  - `id` (uuid, primary key)
  - `student_id` (uuid) - Foreign key to profiles
  - `course_id` (uuid) - Foreign key to courses
  - `date` (date) - Attendance date
  - `status` (text) - 'present', 'absent', 'late', 'excused'
  - `notes` (text, optional) - Additional notes
  - `marked_by` (uuid) - Teacher who marked attendance
  - `created_at` (timestamptz)

  ### 5. grades
  Student grades and assessments
  - `id` (uuid, primary key)
  - `student_id` (uuid) - Foreign key to profiles
  - `course_id` (uuid) - Foreign key to courses
  - `assessment_type` (text) - 'assignment', 'quiz', 'midterm', 'final', 'project'
  - `assessment_name` (text) - Name of assessment
  - `score` (numeric) - Score achieved
  - `max_score` (numeric) - Maximum possible score
  - `percentage` (numeric) - Calculated percentage
  - `feedback` (text, optional) - Teacher feedback
  - `graded_by` (uuid) - Teacher who graded
  - `graded_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 6. timetable
  Class schedule entries
  - `id` (uuid, primary key)
  - `course_id` (uuid) - Foreign key to courses
  - `day_of_week` (integer) - 0=Sunday, 6=Saturday
  - `start_time` (time) - Class start time
  - `end_time` (time) - Class end time
  - `room` (text) - Room number/location
  - `created_at` (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Students can view their own data only
  - Teachers can view and manage their courses and enrolled students
  - Policies enforce role-based access control

  ## Notes
  - All tables use UUIDs for primary keys
  - Timestamps track creation and updates
  - Foreign key constraints ensure data integrity
  - Cascading deletes maintain referential integrity where appropriate
*/

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'teacher')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  teacher_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  credits integer DEFAULT 3,
  created_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(student_id, course_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
  notes text DEFAULT '',
  marked_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, course_id, date)
);

-- Create grades table
CREATE TABLE IF NOT EXISTS grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  assessment_type text NOT NULL CHECK (assessment_type IN ('assignment', 'quiz', 'midterm', 'final', 'project')),
  assessment_name text NOT NULL,
  score numeric NOT NULL,
  max_score numeric NOT NULL,
  percentage numeric GENERATED ALWAYS AS ((score / max_score) * 100) STORED,
  feedback text DEFAULT '',
  graded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  graded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create timetable table
CREATE TABLE IF NOT EXISTS timetable (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  room text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, day_of_week, start_time)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_courses_teacher_id ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course_id ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_course_id ON grades(course_id);
CREATE INDEX IF NOT EXISTS idx_timetable_course_id ON timetable(course_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Teachers can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
  );

-- RLS Policies for courses
CREATE POLICY "Students can view courses they're enrolled in"
  ON courses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = courses.id 
      AND enrollments.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can manage their courses"
  ON courses FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

-- RLS Policies for enrollments
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view enrollments for their courses"
  ON enrollments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can manage enrollments for their courses"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update enrollments for their courses"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete enrollments for their courses"
  ON enrollments FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- RLS Policies for attendance
CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view attendance for their courses"
  ON attendance FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = attendance.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can mark attendance for their courses"
  ON attendance FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = attendance.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update attendance for their courses"
  ON attendance FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = attendance.course_id 
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = attendance.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete attendance for their courses"
  ON attendance FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = attendance.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- RLS Policies for grades
CREATE POLICY "Students can view own grades"
  ON grades FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view grades for their courses"
  ON grades FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = grades.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can add grades for their courses"
  ON grades FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = grades.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can update grades for their courses"
  ON grades FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = grades.course_id 
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = grades.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can delete grades for their courses"
  ON grades FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = grades.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- RLS Policies for timetable
CREATE POLICY "Students can view timetable for enrolled courses"
  ON timetable FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.course_id = timetable.course_id 
      AND enrollments.student_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can manage timetable for their courses"
  ON timetable FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = timetable.course_id 
      AND courses.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = timetable.course_id 
      AND courses.teacher_id = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS on_profile_updated ON profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();