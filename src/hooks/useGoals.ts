import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { goalsService, FitnessGoal } from '../lib/database';

export function useGoals(user: User | null) {
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [GOALS] Loading goals for user:', user.id);
      
      const userGoals = await goalsService.getGoals(user.id);
      setGoals(userGoals);
      
      console.log('✅ [GOALS] Goals loaded:', userGoals.length);
    } catch (err: any) {
      console.error('❌ [GOALS] Error loading goals:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<FitnessGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [GOALS] Creating goal for user:', user.id);
      
      const newGoal = await goalsService.createGoal({
        ...goalData,
        user_id: user.id
      });
      
      setGoals(prev => [newGoal, ...prev]);
      console.log('✅ [GOALS] Goal created successfully');
      return newGoal;
    } catch (err: any) {
      console.error('❌ [GOALS] Error creating goal:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<FitnessGoal>) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [GOALS] Updating goal:', goalId);
      
      const updatedGoal = await goalsService.updateGoal(goalId, updates);
      setGoals(prev => prev.map(goal => goal.id === goalId ? updatedGoal : goal));
      
      console.log('✅ [GOALS] Goal updated successfully');
      return updatedGoal;
    } catch (err: any) {
      console.error('❌ [GOALS] Error updating goal:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [GOALS] Deleting goal:', goalId);
      
      await goalsService.deleteGoal(goalId);
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      console.log('✅ [GOALS] Goal deleted successfully');
    } catch (err: any) {
      console.error('❌ [GOALS] Error deleting goal:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    refetch: loadGoals
  };
}