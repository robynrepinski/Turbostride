import React from 'react';
import { Calendar, Flame, Target, Clock, Settings } from 'lucide-react';
import { FitnessGoal } from '../../lib/database';

interface HomeScreenProps {
  onOpenGoalModal: () => void;
  goals: FitnessGoal[];
  profile: any;
}

export default function HomeScreen({ onOpenGoalModal, goals, profile }: HomeScreenProps) {
  const stats = [
    { label: 'Current Streak', value: '7', unit: 'days', icon: Flame, color: 'from-orange-400 to-red-500' },
    { label: 'Total Workouts', value: '23', unit: 'completed', icon: Target, color: 'from-green-400 to-emerald-500' },
    { label: 'This Week', value: '4', unit: 'sessions', icon: Calendar, color: 'from-blue-400 to-blue-600' },
    { label: 'Total Time', value: '18.5', unit: 'hours', icon: Clock, color: 'from-purple-400 to-purple-600' },
  ];

  const recentWorkouts = [
    { name: 'Push Day Blast', duration: '45 min', difficulty: 'Intermediate', completed: '2 days ago' },
    { name: 'Cardio Core Burn', duration: '30 min', difficulty: 'Beginner', completed: '4 days ago' },
    { name: 'Leg Day Thunder', duration: '50 min', difficulty: 'Advanced', completed: '6 days ago' },
  ];

  const activeGoals = goals.filter(goal => goal.status === 'active');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {profile?.first_name || 'there'}! 👋
        </h1>
        <p className="text-blue-100 mb-4">Ready to crush your fitness goals today?</p>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('startWorkout'))}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Start Workout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.unit}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Goals Section */}
      {activeGoals.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Your Goals</h2>
              <button
                onClick={onOpenGoalModal}
                className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Manage Goals</span>
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {activeGoals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-500">
                      {goal.current_value} → {goal.target_value} {goal.unit}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      {goal.timeline.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {activeGoals.length > 3 && (
              <button
                onClick={onOpenGoalModal}
                className="w-full text-center py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                View all {activeGoals.length} goals
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add Goals CTA (if no goals) */}
      {activeGoals.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="text-center">
            <Target className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Set Your Fitness Goals</h3>
            <p className="text-gray-600 mb-4">
              Define your targets and track your progress to stay motivated on your fitness journey.
            </p>
            <button
              onClick={onOpenGoalModal}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Set Your First Goal
            </button>
          </div>
        </div>
      )}

      {/* Recent Workouts */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
        </div>
        <div className="p-6 space-y-4">
          {recentWorkouts.map((workout, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <div>
                <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-gray-500">{workout.duration}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {workout.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-400">{workout.completed}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all">
          Browse Workouts
        </button>
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all">
          View Progress
        </button>
      </div>
    </div>
  );
}