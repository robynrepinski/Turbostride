import React, { useState, useEffect } from 'react';
import { Trophy, Share2, Calendar, Flame, Clock, Target, Star } from 'lucide-react';

interface WorkoutCompleteProps {
  workoutData: {
    workoutId: string;
    workoutName: string;
    duration: number;
    completedExercises: number;
    completedSets: number;
    estimatedCalories: number;
    completedAt: string;
  };
  onReturnToDashboard: () => void;
}

export default function WorkoutComplete({ workoutData, onReturnToDashboard }: WorkoutCompleteProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const achievements = [
    { label: 'Workout Completed', icon: Trophy, achieved: true },
    { label: 'Personal Best', icon: Star, achieved: workoutData.duration <= 25 },
    { label: 'Consistency Streak', icon: Target, achieved: true },
  ];

  const nextWorkouts = [
    { name: 'Lower Body Strength', duration: 35, difficulty: 3 },
    { name: 'Cardio Blast', duration: 20, difficulty: 2 },
    { name: 'Core & Flexibility', duration: 25, difficulty: 2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-bounce opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Workout Complete! 🎉</h1>
            <p className="text-gray-600">Amazing work! You crushed that workout session.</p>
          </div>

          {/* Workout Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{workoutData.workoutName}</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workoutData.duration}</div>
                <div className="text-sm text-gray-600">minutes</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workoutData.estimatedCalories}</div>
                <div className="text-sm text-gray-600">calories</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workoutData.completedExercises}</div>
                <div className="text-sm text-gray-600">exercises</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workoutData.completedSets}</div>
                <div className="text-sm text-gray-600">sets</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements Unlocked</h3>
            <div className="space-y-2">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg transition-all ${
                      achievement.achieved
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${achievement.achieved ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className="font-medium">{achievement.label}</span>
                    {achievement.achieved && (
                      <span className="ml-auto text-green-600 font-bold">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How was your workout?</h3>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-full transition-all ${
                    star <= rating
                      ? 'text-yellow-400 hover:text-yellow-500'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Any thoughts about this workout? (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Next Workouts */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Next Workouts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {nextWorkouts.map((workout, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                  <h4 className="font-semibold text-gray-900 mb-1">{workout.name}</h4>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{workout.duration} min</span>
                    <div className="flex items-center">
                      {[...Array(workout.difficulty)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
              <button className="flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Next
              </button>
            </div>
            
            <button
              onClick={onReturnToDashboard}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-bold text-lg transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}