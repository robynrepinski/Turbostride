import React, { useState, useEffect } from 'react';
import { X, Plus, Target, Calendar, Trash2, Edit3, Trophy, Zap, Activity, Scale, Dumbbell, Clock } from 'lucide-react';
import { FitnessGoal } from '../lib/database';

interface GoalManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: FitnessGoal[];
  onSaveGoals: (goals: FitnessGoal[]) => void;
}

export default function GoalManagementModal({ isOpen, onClose, goals, onSaveGoals }: GoalManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'current' | 'add'>('current');
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [localGoals, setLocalGoals] = useState<FitnessGoal[]>(goals);
  const [newGoal, setNewGoal] = useState<Partial<FitnessGoal>>({
    type: 'weight',
    title: '',
    description: '',
    current_value: '',
    target_value: '',
    unit: '',
    timeline: '3-months',
    status: 'active'
  });

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const goalTypes = [
    { 
      id: 'weight', 
      label: 'Weight Goal', 
      icon: Scale, 
      color: 'from-blue-500 to-blue-600',
      template: { title: 'Weight Loss', unit: 'lbs', description: 'Reach your target weight' }
    },
    { 
      id: 'strength', 
      label: 'Strength Goal', 
      icon: Dumbbell, 
      color: 'from-red-500 to-red-600',
      template: { title: 'Strength Training', unit: 'reps', description: 'Build muscle and strength' }
    },
    { 
      id: 'endurance', 
      label: 'Endurance Goal', 
      icon: Activity, 
      color: 'from-green-500 to-green-600',
      template: { title: 'Cardio Endurance', unit: 'minutes', description: 'Improve cardiovascular fitness' }
    },
    { 
      id: 'habit', 
      label: 'Habit Goal', 
      icon: Calendar, 
      color: 'from-purple-500 to-purple-600',
      template: { title: 'Workout Frequency', unit: 'times/week', description: 'Build consistent habits' }
    },
    { 
      id: 'custom', 
      label: 'Custom Goal', 
      icon: Target, 
      color: 'from-orange-500 to-orange-600',
      template: { title: 'Custom Goal', unit: '', description: 'Create your own goal' }
    }
  ];

  const timelineOptions = [
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: 'ongoing', label: 'Ongoing' }
  ];

  const goalTemplates = [
    { type: 'weight', title: 'Lose 10 lbs', current_value: '180', target_value: '170', unit: 'lbs', timeline: '3-months' },
    { type: 'strength', title: 'Do 25 Push-ups', current_value: '10', target_value: '25', unit: 'reps', timeline: '6-months' },
    { type: 'endurance', title: 'Run 5K', current_value: '1', target_value: '3.1', unit: 'miles', timeline: '3-months' },
    { type: 'habit', title: 'Workout 4x/week', current_value: '2', target_value: '4', unit: 'times/week', timeline: 'ongoing' }
  ];

  const updateGoal = (goalId: string, updates: Partial<FitnessGoal>) => {
    setLocalGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setLocalGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  const addNewGoal = () => {
    if (!newGoal.title || !newGoal.target_value) return;

    const goal: FitnessGoal = {
      id: Date.now().toString(),
      user_id: '', // Will be set by the parent component
      type: newGoal.type as FitnessGoal['type'],
      title: newGoal.title,
      description: newGoal.description || '',
      current_value: newGoal.current_value || '0',
      target_value: newGoal.target_value,
      unit: newGoal.unit || '',
      timeline: newGoal.timeline || '3-months',
      status: 'active',
      progress: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setLocalGoals(prev => [...prev, goal]);
    setNewGoal({
      type: 'weight',
      title: '',
      description: '',
      current_value: '',
      target_value: '',
      unit: '',
      timeline: '3-months',
      status: 'active'
    });
    setActiveTab('current');
  };

  const applyTemplate = (template: any) => {
    setNewGoal({
      ...newGoal,
      ...template,
      description: goalTypes.find(t => t.id === template.type)?.template.description || ''
    });
  };

  const handleSave = () => {
    onSaveGoals(localGoals);
    onClose();
  };

  const getGoalIcon = (type: string) => {
    const goalType = goalTypes.find(t => t.id === type);
    return goalType?.icon || Target;
  };

  const getGoalColor = (type: string) => {
    const goalType = goalTypes.find(t => t.id === type);
    return goalType?.color || 'from-gray-500 to-gray-600';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Update Your Fitness Goals</h2>
              <p className="text-blue-100">Take control of your fitness journey</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex mt-6 bg-white/20 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'current'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Current Goals ({localGoals.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'add'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Add New Goal
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'current' ? (
            <div className="space-y-4">
              {localGoals.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Goals Yet</h3>
                  <p className="text-gray-600 mb-4">Start by adding your first fitness goal!</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Add Your First Goal
                  </button>
                </div>
              ) : (
                localGoals.map((goal) => {
                  const Icon = getGoalIcon(goal.type);
                  const isEditing = editingGoal === goal.id;
                  
                  return (
                    <div key={goal.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getGoalColor(goal.type)} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={goal.title}
                                onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                                className="text-lg font-semibold bg-white border border-gray-300 rounded px-2 py-1"
                              />
                            ) : (
                              <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                            )}
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingGoal(isEditing ? null : goal.id)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progress</span>
                          <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${getGoalColor(goal.type)} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Goal Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Current</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={goal.currentValue}
                              onChange={(e) => updateGoal(goal.id, { currentValue: e.target.value })}
                              className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <div className="text-sm font-semibold">{goal.currentValue} {goal.unit}</div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Target</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={goal.targetValue}
                              onChange={(e) => updateGoal(goal.id, { targetValue: e.target.value })}
                              className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <div className="text-sm font-semibold">{goal.targetValue} {goal.unit}</div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Timeline</label>
                          {isEditing ? (
                            <select
                              value={goal.timeline}
                              onChange={(e) => updateGoal(goal.id, { timeline: e.target.value })}
                              className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1"
                            >
                              {timelineOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                              ))}
                            </select>
                          ) : (
                            <div className="text-sm font-semibold">{timelineOptions.find(t => t.value === goal.timeline)?.label}</div>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                          {isEditing ? (
                            <select
                              value={goal.status}
                              onChange={(e) => updateGoal(goal.id, { status: e.target.value as Goal['status'] })}
                              className="w-full text-sm bg-white border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="active">Active</option>
                              <option value="paused">Paused</option>
                              <option value="completed">Completed</option>
                            </select>
                          ) : (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              goal.status === 'active' ? 'bg-green-100 text-green-800' :
                              goal.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Goal Templates */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalTemplates.map((template, index) => {
                    const Icon = getGoalIcon(template.type);
                    return (
                      <button
                        key={index}
                        onClick={() => applyTemplate(template)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getGoalColor(template.type)} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{template.title}</div>
                            <div className="text-sm text-gray-600">
                              {template.current_value} → {template.target_value} {template.unit}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Goal Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Create Custom Goal</h3>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  {/* Goal Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {goalTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setNewGoal({ ...newGoal, type: type.id as Goal['type'] })}
                            className={`p-3 border rounded-lg text-center transition-all ${
                              newGoal.type === type.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                            <div className="text-xs font-medium">{type.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Goal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
                      <input
                        type="text"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Lose 10 pounds"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                      <select
                        value={newGoal.timeline}
                        onChange={(e) => setNewGoal({ ...newGoal, timeline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {timelineOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                      <input
                        type="text"
                        value={newGoal.current_value}
                        onChange={(e) => setNewGoal({ ...newGoal, current_value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 180"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                      <input
                        type="text"
                        value={newGoal.target_value}
                        onChange={(e) => setNewGoal({ ...newGoal, target_value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 170"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                      <input
                        type="text"
                        value={newGoal.unit}
                        onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., lbs, reps, minutes"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                    <textarea
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                      value={goal.target_value}
                      onChange={(e) => updateGoal(goal.id, { target_value: e.target.value })}
                      placeholder="Describe your goal and why it's important to you..."
                    />
                  </div>

                  <button
                    onClick={addNewGoal}
                    disabled={!newGoal.title || !newGoal.target_value}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    <div className="text-sm font-semibold">{goal.target_value} {goal.unit}</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}