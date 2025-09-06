import React, { useState } from 'react';
import { useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import OnboardingFlow from './components/OnboardingFlow';
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

// Goal interface
interface Goal {
  id: string;
  type: 'weight' | 'strength' | 'endurance' | 'habit' | 'custom';
  title: string;
  description: string;
  currentValue: number | string;
  targetValue: number | string;
  unit: string;
  timeline: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  createdAt: string;
}

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
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [workoutFlow, setWorkoutFlow] = useState<'none' | 'overview' | 'active' | 'complete'>('none');
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);
  const [workoutData, setWorkoutData] = useState<any>(null);

  // Goal management state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      type: 'weight',
      title: 'Lose 15 pounds',
      description: 'Get to my target weight for summer',
      currentValue: 180,
      targetValue: 165,
      unit: 'lbs',
      timeline: '6-months',
      status: 'active',
      progress: 33,
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      type: 'strength',
      title: 'Do 25 Push-ups',
      description: 'Build upper body strength',
      currentValue: 12,
      targetValue: 25,
      unit: 'reps',
      timeline: '3-months',
      status: 'active',
      progress: 48,
      createdAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '3',
      type: 'habit',
      title: 'Workout 4x per week',
      description: 'Build consistent exercise habits',
      currentValue: 3,
      targetValue: 4,
      unit: 'times/week',
      timeline: 'ongoing',
      status: 'active',
      progress: 75,
      createdAt: '2024-01-01T00:00:00Z'
    }
  ]);

  useEffect(() => {
    const handleStartWorkout = () => {
      setSelectedWorkout(mockWorkouts['push-day-blast']);
      setWorkoutFlow('overview');
    };

    window.addEventListener('startWorkout', handleStartWorkout);
    return () => window.removeEventListener('startWorkout', handleStartWorkout);
  }, []);

  const handleAuthSuccess = (isSignup = false) => {
    setIsAuthenticated(true);
    setIsNewUser(isSignup);
    
    if (isSignup) {
      setShowOnboarding(true);
    } else {
      setCurrentScreen('home');
    }
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

  const handleSaveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    console.log('🎯 Goals Updated:', updatedGoals);
    
    // Show success toast (mock)
    console.log('✅ Goals updated successfully!');
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
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
        return <HomeScreen onOpenGoalModal={() => setShowGoalModal(true)} goals={goals} />;
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
      <Header currentScreen={currentScreen} />
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
    </div>
  );
}

export default App;