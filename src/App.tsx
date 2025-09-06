import React, { useState } from 'react';
import { useEffect } from 'react';
import { Zap } from 'lucide-react';
import { auth } from './lib/supabase';
import { useProfile } from './hooks/useProfile';
import { useGoals } from './hooks/useGoals';
import { workoutService } from './lib/database';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
import DebugPanel from './components/DebugPanel';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HomeScreen from './components/screens/HomeScreen';
import WorkoutsScreen from './components/screens/WorkoutsScreen';
import ProgressScreen from './components/screens/ProgressScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import WorkoutOverview from './components/workout/WorkoutOverview';
import ActiveWorkout from './components/workout/ActiveWorkout';
import WorkoutComplete from './components/workout/WorkoutComplete';
import GoalManagementModal from './components/GoalManagementModal';

// Mock workout data
const mockWorkouts = {
  'push-day-blast': {
    id: 'push-day-blast',
    name: 'Push Day Blast',
    duration: 30,
    difficulty: 3,
    calories: 250,
    equipment: ['Bodyweight', 'Dumbbells'],
    description: 'Build upper body strength with this comprehensive push workout targeting chest, shoulders, and triceps.',
    exercises: [
      {
        id: 'pushups',
        name: 'Push-ups',
        sets: 3,
        reps: 12,
        restTime: 45,
        instructions: 'Start in a plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches the floor, then push back up.',
        tips: 'Keep your core tight and maintain a straight line from head to heels.'
      },
      {
        id: 'pike-pushups',
        name: 'Pike Push-ups',
        sets: 3,
        reps: 8,
        restTime: 45,
        instructions: 'Start in downward dog position. Lower your head toward the ground by bending your elbows, then push back up.',
        tips: 'Focus on your shoulders doing the work. Keep your legs as straight as possible.'
      },
      {
        id: 'tricep-dips',
        name: 'Tricep Dips',
        sets: 3,
        reps: 10,
        restTime: 45,
        instructions: 'Sit on edge of chair/bench, hands beside hips. Lower body by bending elbows, then push back up.',
        tips: 'Keep your back close to the chair and focus on using your triceps.'
      },
      {
        id: 'plank',
        name: 'Plank Hold',
        sets: 3,
        duration: 30,
        restTime: 30,
        instructions: 'Hold a plank position with forearms on the ground, body in a straight line.',
        tips: 'Engage your core and breathe steadily. Don\'t let your hips sag or pike up.'
      },
      {
        id: 'mountain-climbers',
        name: 'Mountain Climbers',
        sets: 3,
        reps: 20,
        restTime: 45,
        instructions: 'Start in plank position. Alternate bringing knees to chest in a running motion.',
        tips: 'Keep your core engaged and maintain a steady rhythm.'
      },
      {
        id: 'burpees',
        name: 'Burpees',
        sets: 3,
        reps: 8,
        restTime: 60,
        instructions: 'Squat down, jump back to plank, do a push-up, jump feet to hands, then jump up with arms overhead.',
        tips: 'Take your time with form. It\'s better to do fewer with good technique.'
      }
    ]
  }
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [debugStep, setDebugStep] = useState('Initializing app...');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [workoutFlow, setWorkoutFlow] = useState<'none' | 'overview' | 'active' | 'complete'>('none');
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [workoutData, setWorkoutData] = useState<any>(null);

  // Hooks for data management
  const { profile, loading: profileLoading, createProfile } = useProfile(currentUser);
  const { goals, loading: goalsLoading, createGoal, updateGoal, deleteGoal } = useGoals(currentUser);
  
  const [showGoalModal, setShowGoalModal] = useState(false);

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = async () => {
      setDebugStep('Checking for existing session...');
      console.log('🔍 [DEBUG] Starting session check at:', new Date().toISOString());
      
      try {
        setDebugStep('Calling auth.getSession()...');
        const session = await auth.getSession();
        console.log('🔍 [DEBUG] Session result:', session);
        
        if (session?.user) {
          console.log('✅ [DEBUG] Found existing session for:', session.user.email);
          setDebugStep('Session found, getting user details...');
          setCurrentUser(session.user);
          setIsAuthenticated(true);
        } else {
          console.log('ℹ️ [DEBUG] No existing session found');
          setDebugStep('No session found, ready for auth');
        }
      } catch (error) {
        console.error('❌ [DEBUG] Session check error:', error);
        setDebugStep(`Session check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setDebugStep('Session check complete');
        console.log('🔍 [DEBUG] Session check completed at:', new Date().toISOString());
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    setDebugStep('Setting up auth state listener...');
    console.log('🔍 [DEBUG] Setting up auth state change listener');
    
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      console.log('🔄 [DEBUG] Auth state changed:', { event, user: session?.user?.email, timestamp: new Date().toISOString() });
      setDebugStep(`Auth state changed: ${event}`);
      
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        console.log('🔐 [DEBUG] User signed in:', session.user.email);
        setCurrentUser(session.user);
        setIsAuthenticated(true);
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT') {
        console.log('🔐 [DEBUG] User signed out');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        // Reset app state on logout
        setCurrentScreen('home');
        setShowOnboarding(false);
        setWorkoutFlow('none');
      } else if (event === 'USER_UPDATED' && session?.user) {
        console.log('🔐 [DEBUG] User updated:', session.user.email);
        setCurrentUser(session.user);
        setIsAuthenticated(true);
      }
    });

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Check if user needs onboarding after profile loads
  useEffect(() => {
    if (currentUser && !profileLoading) {
      if (!profile && isAuthenticated && !showOnboarding) {
        console.log('🔍 [APP] No profile found, showing onboarding');
        setShowOnboarding(true);
      }
    }
  }, [currentUser, profile, profileLoading, isAuthenticated, showOnboarding]);

  useEffect(() => {
    const handleStartWorkout = () => {
      setSelectedWorkout(mockWorkouts['push-day-blast']);
      setWorkoutFlow('overview');
    };

    window.addEventListener('startWorkout', handleStartWorkout);
    return () => window.removeEventListener('startWorkout', handleStartWorkout);
  }, []);

  const handleAuthSuccess = (isSignup = false) => {
    console.log('🎉 [DEBUG] Auth success callback triggered, isSignup:', isSignup);
    setDebugStep('Authentication successful');
    setIsNewUser(isSignup);
    
    // Wait a moment for auth state to update, then check session
    setTimeout(async () => {
      try {
        const session = await auth.getSession();
        if (session?.user) {
          console.log('✅ [DEBUG] Session confirmed after auth success:', session.user.email);
          setCurrentUser(session.user);
          setIsAuthenticated(true);
        } else {
          console.error('❌ [DEBUG] No session found after auth success');
        }
      } catch (error) {
        console.error('❌ [DEBUG] Error checking session after auth:', error);
      }
    }, 500);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setCurrentScreen('home');
  };

  const handleStartActiveWorkout = () => {
    setWorkoutFlow('active');
  };

  const handleWorkoutComplete = (data: any) => {
    console.log('🎉 Workout Complete! Data:', data);
    setWorkoutData(data);
    setWorkoutFlow('complete');
  };

  const handleExitWorkout = () => {
    setWorkoutFlow('none');
    setSelectedWorkout(null);
    setWorkoutData(null);
  };

  const handleReturnToDashboard = () => {
    setWorkoutFlow('none');
    setSelectedWorkout(null);
    setWorkoutData(null);
    setCurrentScreen('home');
  };

  const handleSaveGoals = async (updatedGoals: any[]) => {
    try {
      console.log('🎯 [APP] Saving goals:', updatedGoals);
      
      // This is a simplified version - in a real app you'd want to handle
      // creates, updates, and deletes separately for better performance
      for (const goal of updatedGoals) {
        if (!goal.user_id) {
          // New goal
          await createGoal({
            type: goal.type,
            title: goal.title,
            description: goal.description,
            current_value: goal.current_value,
            target_value: goal.target_value,
            unit: goal.unit,
            timeline: goal.timeline,
            status: goal.status,
            progress: goal.progress
          });
        }
      }
      
      console.log('✅ [APP] Goals saved successfully!');
    } catch (error) {
      console.error('❌ [APP] Error saving goals:', error);
      alert('Error saving goals. Please try again.');
    }
  };

  const handleLogout = async () => {
    console.log('🔐 [DEBUG] Logout initiated');
    setDebugStep('Logging out...');
    try {
      await auth.signOut();
      console.log('✅ [DEBUG] Logout successful');
      setDebugStep('Logout complete');
    } catch (error) {
      console.error('❌ [DEBUG] Logout error:', error);
      setDebugStep(`Logout failed: ${error}`);
    }
  };

  const handleSkipAuth = () => {
    console.log('⚠️ [DEBUG] Skipping auth for development');
    setIsAuthenticated(true);
    setIsLoading(false);
    setCurrentScreen('home');
    setShowDebug(false);
  };

  const handleClearData = () => {
    console.log('🗑️ [DEBUG] Clearing all data and reloading');
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Turbostride</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-gray-600">Loading...</span>
          </div>
          
          {/* Debug Info */}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg max-w-md">
            <div className="text-sm text-gray-700 mb-2">
              <strong>Current Step:</strong> {debugStep}
            </div>
            <div className="text-xs text-gray-500 mb-3">
              <strong>Auth State:</strong> {isAuthenticated ? 'Authenticated' : 'Not Authenticated'} | 
              <strong> User:</strong> {currentUser?.email || 'None'}
            </div>
            <button
              onClick={() => setShowDebug(true)}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
            >
              🔍 Open Debug Panel
            </button>
          </div>
          
          {/* Debug Panel */}
          {showDebug && (
            <DebugPanel
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              currentUser={currentUser}
              onSkipAuth={handleSkipAuth}
              onClearData={handleClearData}
            />
          )}
        </div>
      </div>
    );
  }

  // Show debug panel if not authenticated and debug is enabled
  if (!isAuthenticated && showDebug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <DebugPanel
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          currentUser={currentUser}
          onSkipAuth={handleSkipAuth}
          onClearData={handleClearData}
        />
      </div>
    );
  }

  // Add debug button to auth screen
  if (!isAuthenticated) {
    return (
      <div className="relative">
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
        <button
          onClick={() => setShowDebug(true)}
          className="fixed bottom-4 right-4 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        >
          <span className="text-sm font-bold">🔍</span>
        </button>
        
        {showDebug && (
          <DebugPanel
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            currentUser={currentUser}
            onSkipAuth={handleSkipAuth}
            onClearData={handleClearData}
          />
        )}
      </div>
    );
  }

  // Show onboarding for new users
  if (showOnboarding || (isAuthenticated && !profile && !profileLoading)) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} currentUser={currentUser} />;
  }

  // Show workout flow
  if (workoutFlow === 'overview' && selectedWorkout) {
    return (
      <WorkoutOverview
        workout={selectedWorkout}
        onStartWorkout={handleStartActiveWorkout}
        onBack={handleExitWorkout}
      />
    );
  }

  if (workoutFlow === 'active' && selectedWorkout) {
    return <ActiveWorkout workout={selectedWorkout} onComplete={handleWorkoutComplete} onExit={handleExitWorkout} />;
  }

  if (workoutFlow === 'complete' && workoutData) {
    return <WorkoutComplete workoutData={workoutData} onReturnToDashboard={handleReturnToDashboard} />;
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onOpenGoalModal={() => setShowGoalModal(true)} goals={goals} profile={profile} />;
      case 'workouts':
        return <WorkoutsScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Debug Button */}
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-40"
      >
        <span className="text-xs font-bold">🔍</span>
      </button>
      
      <Header currentScreen={currentScreen} onLogout={handleLogout} />
      <Navigation currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
      
      {/* Main Content */}
      <main className="md:ml-64 pt-4 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderScreen()}
        </div>
      </main>

      {/* Goal Management Modal */}
      <GoalManagementModal
        isOpen={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        goals={goals}
        onSaveGoals={handleSaveGoals}
      />
      
      {/* Debug Panel */}
      {showDebug && (
        <DebugPanel
          isAuthenticated={isAuthenticated}
          isLoading={isLoading}
          currentUser={currentUser}
          onSkipAuth={handleSkipAuth}
          onClearData={handleClearData}
        />
      )}
    </div>
  );
}

export default App;