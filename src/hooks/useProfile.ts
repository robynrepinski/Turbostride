import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { profileService, UserProfile } from '../lib/database';

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [PROFILE] Loading profile for user:', user.id);
      
      const userProfile = await profileService.getProfile(user.id);
      setProfile(userProfile);
      
      console.log('✅ [PROFILE] Profile loaded:', userProfile ? 'exists' : 'not found');
    } catch (err: any) {
      console.error('❌ [PROFILE] Error loading profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [PROFILE] Creating profile for user:', user.id);
      
      const newProfile = await profileService.createProfile({
        ...profileData,
        id: user.id
      } as any);
      
      setProfile(newProfile);
      console.log('✅ [PROFILE] Profile created successfully');
      return newProfile;
    } catch (err: any) {
      console.error('❌ [PROFILE] Error creating profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 [PROFILE] Updating profile for user:', user.id);
      
      const updatedProfile = await profileService.updateProfile(user.id, updates);
      setProfile(updatedProfile);
      
      console.log('✅ [PROFILE] Profile updated successfully');
      return updatedProfile;
    } catch (err: any) {
      console.error('❌ [PROFILE] Error updating profile:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    createProfile,
    updateProfile,
    refetch: loadProfile
  };
}