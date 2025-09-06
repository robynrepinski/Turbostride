/*
  # Create fitness goals table

  1. New Tables
    - `fitness_goals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references user_profiles)
      - `type` (text: weight, strength, endurance, habit, custom)
      - `title` (text)
      - `description` (text)
      - `current_value` (text)
      - `target_value` (text)
      - `unit` (text)
      - `timeline` (text)
      - `status` (text: active, paused, completed)
      - `progress` (numeric, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `fitness_goals` table
    - Add policies for users to manage their own goals
*/

CREATE TABLE IF NOT EXISTS fitness_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('weight', 'strength', 'endurance', 'habit', 'custom')),
  title text NOT NULL,
  description text DEFAULT '',
  current_value text NOT NULL,
  target_value text NOT NULL,
  unit text DEFAULT '',
  timeline text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE fitness_goals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own goals"
  ON fitness_goals
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own goals"
  ON fitness_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own goals"
  ON fitness_goals
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own goals"
  ON fitness_goals
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger to automatically update updated_at
CREATE TRIGGER update_fitness_goals_updated_at
  BEFORE UPDATE ON fitness_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();