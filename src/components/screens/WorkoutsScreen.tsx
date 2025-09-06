import React from 'react';
import { Clock, Zap, Users, Star } from 'lucide-react';

export default function WorkoutsScreen() {
  const workoutCategories = [
    { name: 'Strength', count: 12, color: 'from-red-400 to-red-600' },
    { name: 'Cardio', count: 8, color: 'from-blue-400 to-blue-600' },
    { name: 'HIIT', count: 6, color: 'from-orange-400 to-orange-600' },
    { name: 'Yoga', count: 4, color: 'from-green-400 to-green-600' },
  ];

  const featuredWorkouts = [
    {
      name: 'Push Day Blast',
      duration: '45 min',
      difficulty: 'Intermediate',
      rating: 4.8,
      participants: 1234,
      description: 'Build upper body strength with this comprehensive push workout',
      image: 'bg-gradient-to-br from-red-400 to-pink-500'
    },
    {
      name: 'Cardio Core Burn',
      duration: '30 min',
      difficulty: 'Beginner',
      rating: 4.9,
      participants: 2156,
      description: 'High-intensity cardio combined with core strengthening',
      image: 'bg-gradient-to-br from-blue-400 to-cyan-500'
    },
    {
      name: 'Leg Day Thunder',
      duration: '50 min',
      difficulty: 'Advanced',
      rating: 4.7,
      participants: 987,
      description: 'Intense lower body workout for serious gains',
      image: 'bg-gradient-to-br from-purple-400 to-indigo-500'
    },
    {
      name: 'Morning Flow',
      duration: '25 min',
      difficulty: 'Beginner',
      rating: 4.6,
      participants: 3421,
      description: 'Gentle yoga flow to start your day right',
      image: 'bg-gradient-to-br from-green-400 to-teal-500'
    },
    {
      name: 'HIIT Inferno',
      duration: '20 min',
      difficulty: 'Advanced',
      rating: 4.8,
      participants: 1876,
      description: 'Maximum intensity interval training',
      image: 'bg-gradient-to-br from-orange-400 to-red-500'
    },
    {
      name: 'Full Body Fusion',
      duration: '40 min',
      difficulty: 'Intermediate',
      rating: 4.7,
      participants: 1543,
      description: 'Complete workout targeting all muscle groups',
      image: 'bg-gradient-to-br from-indigo-400 to-purple-500'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Workouts</h1>
        <p className="text-gray-600">Choose from our collection of expert-designed workouts</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {workoutCategories.map((category, index) => (
          <button
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500">{category.count} workouts</p>
          </button>
        ))}
      </div>

      {/* Featured Workouts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorkouts.map((workout, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
              <div className={`h-32 ${workout.image} relative`}>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs font-semibold">{workout.rating}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {workout.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{workout.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{workout.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{workout.participants.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    workout.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    workout.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {workout.difficulty}
                  </span>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-700 transition-all">
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}