/*
  # Create workouts and workout sessions tables

  1. New Tables
    - `workouts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `duration` (integer, minutes)
      - `difficulty` (integer, 1-5)
      - `calories` (integer)
      - `equipment` (text array)
      - `exercises` (jsonb)
      - `category` (text)
      - `created_at` (timestamp)

    - `workout_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `workout_id` (uuid, references workouts)
      - `workout_name` (text)
      - `duration` (integer, actual minutes)
      - `completed_exercises` (integer)
      - `completed_sets` (integer)
      - `estimated_calories` (integer)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies
*/

-- Workouts table (predefined workouts)
CREATE TABLE IF NOT EXISTS workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  duration integer NOT NULL, -- in minutes
  difficulty integer NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  calories integer NOT NULL,
  equipment text[] DEFAULT '{}',
  exercises jsonb DEFAULT '[]',
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Workout sessions table (user's completed workouts)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  workout_id uuid REFERENCES workouts(id),
  workout_name text NOT NULL,
  duration integer NOT NULL, -- actual duration in minutes
  completed_exercises integer DEFAULT 0,
  completed_sets integer DEFAULT 0,
  estimated_calories integer DEFAULT 0,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for workouts (public read)
CREATE POLICY "Anyone can view workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for workout_sessions
CREATE POLICY "Users can view own workout sessions"
  ON workout_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workout sessions"
  ON workout_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workout sessions"
  ON workout_sessions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own workout sessions"
  ON workout_sessions
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert some sample workouts
INSERT INTO workouts (name, description, duration, difficulty, calories, equipment, exercises, category) VALUES
(
  'Push Day Blast',
  'Build upper body strength with this comprehensive push workout targeting chest, shoulders, and triceps.',
  45,
  3,
  250,
  ARRAY['Bodyweight', 'Dumbbells'],
  '[
    {
      "id": "pushups",
      "name": "Push-ups",
      "sets": 3,
      "reps": 12,
      "restTime": 45,
      "instructions": "Start in a plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches the floor, then push back up.",
      "tips": "Keep your core tight and maintain a straight line from head to heels."
    },
    {
      "id": "pike-pushups",
      "name": "Pike Push-ups",
      "sets": 3,
      "reps": 8,
      "restTime": 45,
      "instructions": "Start in downward dog position. Lower your head toward the ground by bending your elbows, then push back up.",
      "tips": "Focus on your shoulders doing the work. Keep your legs as straight as possible."
    },
    {
      "id": "tricep-dips",
      "name": "Tricep Dips",
      "sets": 3,
      "reps": 10,
      "restTime": 45,
      "instructions": "Sit on edge of chair/bench, hands beside hips. Lower body by bending elbows, then push back up.",
      "tips": "Keep your back close to the chair and focus on using your triceps."
    }
  ]'::jsonb,
  'strength'
),
(
  'Cardio Core Burn',
  'High-intensity cardio combined with core strengthening exercises.',
  30,
  2,
  200,
  ARRAY['Bodyweight'],
  '[
    {
      "id": "jumping-jacks",
      "name": "Jumping Jacks",
      "sets": 3,
      "reps": 20,
      "restTime": 30,
      "instructions": "Jump while spreading legs shoulder-width apart and raising arms overhead, then return to starting position.",
      "tips": "Land softly on the balls of your feet and maintain a steady rhythm."
    },
    {
      "id": "mountain-climbers",
      "name": "Mountain Climbers",
      "sets": 3,
      "reps": 20,
      "restTime": 30,
      "instructions": "Start in plank position. Alternate bringing knees to chest in a running motion.",
      "tips": "Keep your core engaged and maintain a steady rhythm."
    },
    {
      "id": "plank",
      "name": "Plank Hold",
      "sets": 3,
      "duration": 30,
      "restTime": 30,
      "instructions": "Hold a plank position with forearms on the ground, body in a straight line.",
      "tips": "Engage your core and breathe steadily. Do not let your hips sag or pike up."
    }
  ]'::jsonb,
  'cardio'
);