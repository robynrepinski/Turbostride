import { supabase } from './supabase';

// Types
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  gender?: string;
  weight?: number;
  weight_unit: string;
  height?: number;
  height_unit: string;
  height_feet?: number;
  height_inches?: number;
  activity_level?: string;
  primary_goal?: string;
  target_weight?: number;
  timeline?: string;
  workout_frequency: number;
  session_duration?: string;
  equipment: string[];
  favorite_activities: string[];
  created_at: string;
  updated_at: string;
}

export interface FitnessGoal {
  id: string;
  user_id: string;
  type: 'weight' | 'strength' | 'endurance' | 'habit' | 'custom';
  title: string;
  description: string;
  current_value: string;
  target_value: string;
  unit: string;
  timeline: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_id?: string;
  workout_name: string;
  duration: number;
  completed_exercises: number;
  completed_sets: number;
  estimated_calories: number;
  completed_at: string;
  created_at: string;
}

// User Profile Functions
export const profileService = {
  // Get user profile
  async getProfile(userId: string): Promise<UserProfile | null> {
    console.log('🔍 [DB] Getting profile for user:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        console.log('ℹ️ [DB] No profile found for user:', userId);
        return null;
      }
      console.error('❌ [DB] Error getting profile:', error);
      throw error;
    }

    console.log('✅ [DB] Profile retrieved:', data);
    return data;
  },

  // Create user profile
  async createProfile(profile: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> {
    console.log('🔍 [DB] Creating profile:', profile);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating profile:', error);
      throw error;
    }

    console.log('✅ [DB] Profile created:', data);
    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    console.log('🔍 [DB] Updating profile for user:', userId, 'with:', updates);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error updating profile:', error);
      throw error;
    }

    console.log('✅ [DB] Profile updated:', data);
    return data;
  }
};

// Fitness Goals Functions
export const goalsService = {
  // Get user's goals
  async getGoals(userId: string): Promise<FitnessGoal[]> {
    console.log('🔍 [DB] Getting goals for user:', userId);
    
    const { data, error } = await supabase
      .from('fitness_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting goals:', error);
      throw error;
    }

    console.log('✅ [DB] Goals retrieved:', data);
    return data || [];
  },

  // Create goal
  async createGoal(goal: Omit<FitnessGoal, 'id' | 'created_at' | 'updated_at'>): Promise<FitnessGoal> {
    console.log('🔍 [DB] Creating goal:', goal);
    
    const { data, error } = await supabase
      .from('fitness_goals')
      .insert([goal])
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error creating goal:', error);
      throw error;
    }

    console.log('✅ [DB] Goal created:', data);
    return data;
  },

  // Update goal
  async updateGoal(goalId: string, updates: Partial<FitnessGoal>): Promise<FitnessGoal> {
    console.log('🔍 [DB] Updating goal:', goalId, 'with:', updates);
    
    const { data, error } = await supabase
      .from('fitness_goals')
      .update(updates)
      .eq('id', goalId)
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error updating goal:', error);
      throw error;
    }

    console.log('✅ [DB] Goal updated:', data);
    return data;
  },

  // Delete goal
  async deleteGoal(goalId: string): Promise<void> {
    console.log('🔍 [DB] Deleting goal:', goalId);
    
    const { error } = await supabase
      .from('fitness_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('❌ [DB] Error deleting goal:', error);
      throw error;
    }

    console.log('✅ [DB] Goal deleted:', goalId);
  }
};

// Workout Functions
export const workoutService = {
  // Get all workouts
  async getWorkouts(): Promise<any[]> {
    console.log('🔍 [DB] Getting all workouts');
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ [DB] Error getting workouts:', error);
      throw error;
    }

    console.log('✅ [DB] Workouts retrieved:', data?.length || 0);
    return data || [];
  },

  // Get workout by ID
  async getWorkout(workoutId: string): Promise<any | null> {
    console.log('🔍 [DB] Getting workout:', workoutId);
    
    const { data, error } = await supabase
      .from('workouts')
      .select('*')
      .eq('id', workoutId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('ℹ️ [DB] Workout not found:', workoutId);
        return null;
      }
      console.error('❌ [DB] Error getting workout:', error);
      throw error;
    }

    console.log('✅ [DB] Workout retrieved:', data);
    return data;
  },

  // Save workout session
  async saveWorkoutSession(session: Omit<WorkoutSession, 'id' | 'created_at'>): Promise<WorkoutSession> {
    console.log('🔍 [DB] Saving workout session:', session);
    
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert([session])
      .select()
      .single();

    if (error) {
      console.error('❌ [DB] Error saving workout session:', error);
      throw error;
    }

    console.log('✅ [DB] Workout session saved:', data);
    return data;
  },

  // Get user's workout sessions
  async getUserWorkoutSessions(userId: string, limit = 10): Promise<WorkoutSession[]> {
    console.log('🔍 [DB] Getting workout sessions for user:', userId);
    
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('❌ [DB] Error getting workout sessions:', error);
      throw error;
    }

    console.log('✅ [DB] Workout sessions retrieved:', data?.length || 0);
    return data || [];
  }
};