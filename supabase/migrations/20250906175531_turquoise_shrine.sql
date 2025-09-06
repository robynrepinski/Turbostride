/*
  # Update user profiles schema to match onboarding flow

  1. Schema Updates
    - Add missing fields from onboarding flow
    - Update existing fields to match expected data types
    - Ensure all onboarding data can be stored properly

  2. New Fields Added
    - All fields from the onboarding flow are now supported
    - Proper data types and constraints
    - Default values where appropriate

  3. Security
    - Maintain existing RLS policies
    - No changes to security model
*/

-- Add missing columns to user_profiles table
DO $$
BEGIN
  -- Check and add columns that might be missing
  
  -- Add date_of_birth if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'date_of_birth'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN date_of_birth date;
  END IF;

  -- Add gender if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'gender'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN gender text;
  END IF;

  -- Add activity_level if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'activity_level'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN activity_level text;
  END IF;

  -- Add primary_goal if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'primary_goal'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN primary_goal text;
  END IF;

  -- Add target_weight if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'target_weight'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN target_weight numeric;
  END IF;

  -- Add timeline if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'timeline'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN timeline text;
  END IF;

  -- Add workout_frequency if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'workout_frequency'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN workout_frequency integer DEFAULT 3;
  END IF;

  -- Add session_duration if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'session_duration'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN session_duration text;
  END IF;

  -- Add equipment if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'equipment'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN equipment text[] DEFAULT '{}';
  END IF;

  -- Add favorite_activities if it doesn't exist (it should exist)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profiles' AND column_name = 'favorite_activities'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN favorite_activities text[] DEFAULT '{}';
  END IF;

END $$;

-- Update constraints and defaults to match onboarding expectations
ALTER TABLE user_profiles 
  ALTER COLUMN workout_frequency SET DEFAULT 3,
  ALTER COLUMN equipment SET DEFAULT '{}',
  ALTER COLUMN favorite_activities SET DEFAULT '{}',
  ALTER COLUMN weight_unit SET DEFAULT 'kg',
  ALTER COLUMN height_unit SET DEFAULT 'cm';

-- Add check constraints for data validation
DO $$
BEGIN
  -- Add constraint for activity_level if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_activity_level_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_activity_level_check 
    CHECK (activity_level IN ('sedentary', 'lightly-active', 'moderately-active', 'very-active', 'extremely-active'));
  END IF;

  -- Add constraint for primary_goal if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_primary_goal_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_primary_goal_check 
    CHECK (primary_goal IN ('weight-loss', 'muscle-gain', 'endurance', 'strength', 'general-fitness', 'flexibility'));
  END IF;

  -- Add constraint for timeline if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_timeline_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_timeline_check 
    CHECK (timeline IN ('4-weeks', '3-months', '6-months', '1-year'));
  END IF;

  -- Add constraint for session_duration if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_session_duration_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_session_duration_check 
    CHECK (session_duration IN ('15min', '30min', '45min', '60min+'));
  END IF;

  -- Add constraint for workout_frequency if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_workout_frequency_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_workout_frequency_check 
    CHECK (workout_frequency >= 1 AND workout_frequency <= 7);
  END IF;

  -- Add constraint for weight_unit if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_weight_unit_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_weight_unit_check 
    CHECK (weight_unit IN ('kg', 'lbs'));
  END IF;

  -- Add constraint for height_unit if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'user_profiles' AND constraint_name = 'user_profiles_height_unit_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_height_unit_check 
    CHECK (height_unit IN ('cm', 'ft'));
  END IF;

END $$;