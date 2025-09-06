import React, { useState, useEffect } from 'react';
import SimpleAuthScreen from './components/SimpleAuthScreen';
import SimpleOnboarding from './components/SimpleOnboarding';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutsScreen from './components/screens/WorkoutsScreen';
import ProgressScreen from './components/screens/ProgressScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import { supabase, db } from './lib/supabase';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    checkAuthState();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setShowOnboarding(false);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthState = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadUserProfile(user.id);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await db.getProfile(userId);
      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Profile load error:', error);
        return;
      }
      
      if (data) {
        setProfile(data);
        setShowOnboarding(false);
      } else {
        // No profile found, show onboarding
        setShowOnboarding(true);
      }
    } catch (error) {
      console.error('Profile load error:', error);
    }
  };

  const handleAuthSuccess = (authUser: any, isSignup: boolean) => {
    setUser(authUser);
    if (isSignup) {
      setShowOnboarding(true);
    } else {
      loadUserProfile(authUser.id);
    }
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    if (user) {
      loadUserProfile(user.id);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onOpenGoalModal={() => {}} goals={[]} />;
      case 'workouts':
        return <WorkoutsScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onOpenGoalModal={() => {}} goals={[]} />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!user) {
    return <SimpleAuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show onboarding if user has no profile
  if (showOnboarding) {
    return <SimpleOnboarding user={user} onComplete={handleOnboardingComplete} />;
  }

  // Main app
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentScreen={currentScreen} />
      <Navigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
      
      {/* Main Content */}
      <main className="md:ml-64 pt-4 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}

export default App;