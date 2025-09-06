import React from 'react';
import { Clock, Zap, Flame, Play, Eye, ArrowLeft, Users, Star } from 'lucide-react';

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

interface WorkoutOverviewProps {
  workout: WorkoutData;
  onStartWorkout: () => void;
  onBack: () => void;
}

export default function WorkoutOverview({ workout, onStartWorkout, onBack }: WorkoutOverviewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Workouts
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{workout.name}</h1>
              <p className="text-gray-600 mb-4">{workout.description}</p>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < workout.difficulty ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workout.duration}</div>
                <div className="text-sm text-gray-500">minutes</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workout.calories}</div>
                <div className="text-sm text-gray-500">calories</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{workout.exercises.length}</div>
                <div className="text-sm text-gray-500">exercises</div>
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Equipment Needed</h3>
              <div className="flex flex-wrap gap-2">
                {workout.equipment.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Exercise List */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exercise Breakdown</h3>
              <div className="space-y-3">
                {workout.exercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.sets} sets × {exercise.reps ? `${exercise.reps} reps` : `${exercise.duration}s`}
                        {exercise.restTime > 0 && ` • ${exercise.restTime}s rest`}
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Start Workout Card */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
              <p className="text-blue-100 mb-4">
                Get ready for an amazing {workout.duration}-minute workout session!
              </p>
              <button
                onClick={onStartWorkout}
                className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Workout
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Eye className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Preview Exercises</span>
                </button>
                <button className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">Join Community</span>
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 Pro Tips</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Keep water nearby to stay hydrated</li>
                <li>• Focus on proper form over speed</li>
                <li>• Listen to your body and rest when needed</li>
                <li>• Take deep breaths between exercises</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}