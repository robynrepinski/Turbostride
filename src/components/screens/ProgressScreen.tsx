import React from 'react';
import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

export default function ProgressScreen() {
  const achievements = [
    { name: 'First Workout', description: 'Complete your first workout', earned: true, date: '2 weeks ago' },
    { name: '7 Day Streak', description: 'Workout for 7 consecutive days', earned: true, date: '1 day ago' },
    { name: 'Cardio King', description: 'Complete 10 cardio workouts', earned: true, date: '3 days ago' },
    { name: '30 Day Challenge', description: 'Workout for 30 consecutive days', earned: false, progress: 23 },
    { name: 'Strength Master', description: 'Complete 20 strength workouts', earned: false, progress: 12 },
    { name: 'Early Bird', description: 'Complete 5 morning workouts', earned: false, progress: 2 },
  ];

  const weeklyData = [
    { day: 'Mon', workouts: 1, duration: 45 },
    { day: 'Tue', workouts: 1, duration: 30 },
    { day: 'Wed', workouts: 0, duration: 0 },
    { day: 'Thu', workouts: 2, duration: 75 },
    { day: 'Fri', workouts: 1, duration: 40 },
    { day: 'Sat', workouts: 1, duration: 60 },
    { day: 'Sun', workouts: 1, duration: 35 },
  ];

  const maxDuration = Math.max(...weeklyData.map(d => d.duration));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Progress</h1>
        <p className="text-gray-600">Track your fitness journey and celebrate achievements</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-green-600 font-semibold">+12%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">23</div>
          <div className="text-sm text-gray-500">Total Workouts</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-green-600 font-semibold">+2</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">7</div>
          <div className="text-sm text-gray-500">Day Streak</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-blue-600 font-semibold">76%</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">18.5</div>
          <div className="text-sm text-gray-500">Hours Total</div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-green-600 font-semibold">New!</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">3</div>
          <div className="text-sm text-gray-500">Achievements</div>
        </div>
      </div>

      {/* Weekly Activity Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week's Activity</h2>
        <div className="flex items-end justify-between h-32 space-x-2">
          {weeklyData.map((day, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '80px' }}>
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-purple-600 rounded-t-lg transition-all duration-500"
                  style={{ height: `${(day.duration / maxDuration) * 100}%` }}
                />
              </div>
              <div className="mt-2 text-xs font-medium text-gray-600">{day.day}</div>
              <div className="text-xs text-gray-400">{day.duration}m</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
        </div>
        <div className="p-6 space-y-4">
          {achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
              achievement.earned ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
            }`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.earned 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gray-300'
              }`}>
                <Award className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-gray-500'}`} />
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${achievement.earned ? 'text-green-800' : 'text-gray-700'}`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm ${achievement.earned ? 'text-green-600' : 'text-gray-500'}`}>
                  {achievement.description}
                </p>
                {!achievement.earned && achievement.progress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/30</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.earned && (
                <div className="text-xs text-green-600 font-medium">
                  {achievement.date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}