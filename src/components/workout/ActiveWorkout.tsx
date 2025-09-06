import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, X, Volume2 } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps?: number;
  duration?: number;
  restTime: number;
  instructions: string;
  tips: string;
}

interface WorkoutData {
  id: string;
  name: string;
  duration: number;
  difficulty: number;
  calories: number;
  equipment: string[];
  exercises: Exercise[];
  description: string;
}

interface ActiveWorkoutProps {
  workout: WorkoutData;
  onComplete: (workoutData: any) => void;
  onExit: () => void;
}

export default function ActiveWorkout({ workout, onComplete, onExit }: ActiveWorkoutProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [workoutStartTime] = useState(Date.now());
  const [completedSets, setCompletedSets] = useState<{[key: string]: number}>({});

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSetsCount = Object.values(completedSets).reduce((sum, count) => sum + count, 0);
  const progress = (completedSetsCount / totalSets) * 100;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (!isPaused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            // Timer finished
            if (isResting) {
              setIsResting(false);
              playBeep();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused, timer, isResting]);

  const playBeep = () => {
    // Simple beep sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const startRestTimer = () => {
    setIsResting(true);
    setTimer(currentExercise.restTime);
    playBeep();
  };

  const completeSet = () => {
    const exerciseId = currentExercise.id;
    const newCompletedSets = { ...completedSets };
    newCompletedSets[exerciseId] = (newCompletedSets[exerciseId] || 0) + 1;
    setCompletedSets(newCompletedSets);

    if (currentSet < currentExercise.sets) {
      // More sets in this exercise
      setCurrentSet(prev => prev + 1);
      if (currentExercise.restTime > 0) {
        startRestTimer();
      }
    } else {
      // Exercise complete, move to next
      nextExercise();
    }
  };

  const nextExercise = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimer(0);
    } else {
      // Workout complete!
      const workoutData = {
        workoutId: workout.id,
        workoutName: workout.name,
        duration: Math.round((Date.now() - workoutStartTime) / 1000 / 60),
        completedExercises: workout.exercises.length,
        completedSets: completedSetsCount + 1,
        estimatedCalories: workout.calories,
        completedAt: new Date().toISOString()
      };
      onComplete(workoutData);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
      setTimer(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivationalMessage = () => {
    const messages = [
      "You've got this! 💪",
      "Keep pushing! 🔥",
      "Almost there! ⚡",
      "Strong work! 🌟",
      "Don't give up! 💯",
      "You're crushing it! 🚀",
      "Feel the burn! 🔥",
      "One more rep! 💪"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-white rounded-full blur-xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button
          onClick={onExit}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="text-sm text-gray-400">{workout.name}</div>
          <div className="text-lg font-semibold">
            Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <Volume2 className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 mb-6">
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{completedSetsCount} of {totalSets} sets</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 flex-1">
        {isResting ? (
          /* Rest Screen */
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
              <div 
                className="absolute inset-0 border-4 border-blue-500 rounded-full transition-all duration-1000"
                style={{
                  transform: `rotate(${((currentExercise.restTime - timer) / currentExercise.restTime) * 360}deg)`,
                  clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)'
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold">{timer}</div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Rest Time</h2>
            <p className="text-gray-400 mb-4">Get ready for your next set</p>
            <p className="text-lg text-blue-400">{getMotivationalMessage()}</p>
            
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">Next up:</div>
              <div className="font-semibold">{currentExercise.name}</div>
              <div className="text-sm text-gray-400">Set {currentSet} of {currentExercise.sets}</div>
            </div>
          </div>
        ) : (
          /* Exercise Screen */
          <div className="text-center py-4">
            {/* Exercise Info */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{currentExercise.name}</h1>
              <div className="text-xl text-blue-400 mb-4">
                Set {currentSet} of {currentExercise.sets}
              </div>
              
              {/* Set/Rep Info */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <div className="text-4xl font-bold mb-2">
                  {currentExercise.reps ? `${currentExercise.reps} reps` : `${currentExercise.duration}s`}
                </div>
                <div className="text-gray-400">
                  {currentExercise.reps ? 'repetitions' : 'hold time'}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gray-800 rounded-xl p-4 mb-6 text-left">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{currentExercise.instructions}</p>
                {currentExercise.tips && (
                  <div className="mt-3 p-3 bg-blue-900/30 rounded-lg">
                    <div className="text-blue-400 text-xs font-semibold mb-1">💡 Pro Tip:</div>
                    <p className="text-blue-300 text-xs">{currentExercise.tips}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timer for timed exercises */}
            {currentExercise.duration && (
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto relative mb-4">
                  <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-2xl font-bold">{timer || currentExercise.duration}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (timer === 0) {
                      setTimer(currentExercise.duration!);
                    }
                    setIsPaused(!isPaused);
                  }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
              </div>
            )}

            {/* Motivational Message */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg">
              <p className="text-lg font-semibold">{getMotivationalMessage()}</p>
            </div>
          </div>
        )}

        {/* Next Exercise Preview */}
        {currentExerciseIndex < workout.exercises.length - 1 && (
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Coming up next:</div>
            <div className="font-semibold">{workout.exercises[currentExerciseIndex + 1].name}</div>
            <div className="text-sm text-gray-400">
              {workout.exercises[currentExerciseIndex + 1].sets} sets × {' '}
              {workout.exercises[currentExerciseIndex + 1].reps 
                ? `${workout.exercises[currentExerciseIndex + 1].reps} reps`
                : `${workout.exercises[currentExerciseIndex + 1].duration}s`
              }
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-gray-800">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={prevExercise}
            disabled={currentExerciseIndex === 0}
            className="p-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
          </button>
          
          <button
            onClick={nextExercise}
            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {!isResting && (
          <button
            onClick={completeSet}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-bold text-lg transition-all"
          >
            {currentSet === currentExercise.sets ? 'Complete Exercise' : 'Set Complete'}
          </button>
        )}
      </div>
    </div>
  );
}