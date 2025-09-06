import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, User, Activity, Target, Settings, Check, Calendar, Scale, Ruler, Clock, Dumbbell } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { auth, supabase } from '../lib/supabase';

interface OnboardingFlowProps {
  onComplete: () => void;
  currentUser: any;
}

interface OnboardingData {
  // Step 1: Personal Info
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  
  // Step 2: Physical Stats
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  heightFeet?: number;
  heightInches?: number;
  activityLevel: string;
  
  // Step 3: Fitness Goals
  primaryGoal: string;
  timeline: string;
  targetWeight?: number;
  
  // Step 4: Preferences
  workoutFrequency: number;
  sessionDuration: string;
  equipment: string[];
  favoriteActivities: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function OnboardingFlow({ onComplete, currentUser }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  
  // Get current user and profile hook
  const { createProfile } = useProfile(currentUser);
  
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    weight: 70,
    weightUnit: 'kg',
    height: 170,
    heightUnit: 'cm',
    heightFeet: 5,
    heightInches: 8,
    activityLevel: '',
    primaryGoal: '',
    timeline: '',
    targetWeight: undefined,
    workoutFrequency: 3,
    sessionDuration: '',
    equipment: [],
    favoriteActivities: []
  });
  
  const [errors, setErrors] = useState<FormErrors>({});

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('turbostride-onboarding');
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('turbostride-onboarding', JSON.stringify(data));
  }, [data]);

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    switch (step) {
      case 1:
        if (!data.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!data.lastName.trim()) newErrors.lastName = 'Last name is required';
        break;
      case 2:
        if (!data.activityLevel) newErrors.activityLevel = 'Please select your activity level';
        break;
      case 3:
        if (!data.primaryGoal) newErrors.primaryGoal = 'Please select your primary goal';
        if (!data.timeline) newErrors.timeline = 'Please select a timeline';
        break;
      case 4:
        if (!data.sessionDuration) newErrors.sessionDuration = 'Please select session duration';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setSlideDirection('right');
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setSlideDirection('left');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const calculateBMI = (): number => {
    let weightInKg = data.weight;
    let heightInM = data.height / 100;
    
    if (data.weightUnit === 'lbs') {
      weightInKg = data.weight * 0.453592;
    }
    
    if (data.heightUnit === 'ft') {
      const totalInches = (data.heightFeet || 0) * 12 + (data.heightInches || 0);
      heightInM = totalInches * 0.0254;
    }
    
    return weightInKg / (heightInM * heightInM);
  };

  const handleComplete = async () => {
    if (!validateStep(4)) return;
    
    setIsLoading(true);
    
    try {
      // Get the current user from Supabase auth directly
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('❌ [ONBOARDING] No authenticated user found:', userError);
        alert('Authentication error. Please try logging in again.');
        setIsLoading(false);
        return;
      }
      
      // Create user profile in Supabase
      console.log('🎉 [ONBOARDING] Creating user profile for:', user.email);
      
      await createProfile({
        id: user.id,
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        weight: data.weight,
        weight_unit: data.weightUnit,
        height: data.height,
        height_unit: data.heightUnit,
        height_feet: data.heightFeet,
        height_inches: data.heightInches,
        activity_level: data.activityLevel,
        primary_goal: data.primaryGoal,
        target_weight: data.targetWeight,
        timeline: data.timeline,
        workout_frequency: data.workoutFrequency,
        session_duration: data.sessionDuration,
        equipment: data.equipment,
        favorite_activities: data.favoriteActivities
      } as any);
      
      console.log('✅ [ONBOARDING] Profile created successfully!');
      
      setShowSuccess(true);
      
      // Clear saved onboarding data
      localStorage.removeItem('turbostride-onboarding');
      
      // Redirect after success animation
      setTimeout(() => {
        onComplete();
      }, 2500);
      
    } catch (error: any) {
      console.error('❌ [ONBOARDING] Error creating profile:', error);
      alert(`Error creating profile: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Setup Complete! 🎉</h2>
          <p className="text-gray-600 mb-4">Your personalized fitness journey is ready to begin!</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const goals = [
    { id: 'weight-loss', label: 'Weight Loss', emoji: '🎯', description: 'Burn fat and get lean' },
    { id: 'muscle-gain', label: 'Muscle Gain', emoji: '💪', description: 'Build strength and size' },
    { id: 'endurance', label: 'Endurance', emoji: '🏃', description: 'Improve cardiovascular fitness' },
    { id: 'strength', label: 'Strength', emoji: '🏋️', description: 'Get stronger and more powerful' },
    { id: 'general-fitness', label: 'General Fitness', emoji: '⚡', description: 'Overall health and wellness' },
    { id: 'flexibility', label: 'Flexibility', emoji: '🧘', description: 'Improve mobility and flexibility' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
    { value: 'lightly-active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
    { value: 'moderately-active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
    { value: 'very-active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
    { value: 'extremely-active', label: 'Extremely Active', description: 'Very hard exercise, physical job' }
  ];

  const equipment = [
    'Bodyweight', 'Dumbbells', 'Resistance Bands', 'Gym Access', 
    'Kettlebells', 'Pull-up Bar', 'Yoga Mat', 'Cardio Equipment'
  ];

  const activities = [
    'Cardio', 'Strength Training', 'Yoga', 'Sports', 
    'Swimming', 'Running', 'Cycling', 'Dancing'
  ];

  const renderStep = () => {
    const stepClass = `transition-all duration-500 ease-in-out ${
      slideDirection === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
    }`;

    switch (currentStep) {
      case 1:
        return (
          <div className={stepClass}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's get to know you!</h2>
              <p className="text-gray-600">Tell us a bit about yourself to personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={data.firstName}
                    onChange={(e) => updateData('firstName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={data.lastName}
                    onChange={(e) => updateData('lastName', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={data.dateOfBirth}
                    onChange={(e) => updateData('dateOfBirth', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                    <label key={gender} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="gender"
                        value={gender.toLowerCase()}
                        checked={data.gender === gender.toLowerCase()}
                        onChange={(e) => updateData('gender', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={stepClass}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your current fitness</h2>
              <p className="text-gray-600">Help us understand your physical stats and activity level</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={data.weight}
                        onChange={(e) => updateData('weight', parseFloat(e.target.value) || 0)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="70"
                      />
                    </div>
                    <select
                      value={data.weightUnit}
                      onChange={(e) => updateData('weightUnit', e.target.value as 'kg' | 'lbs')}
                      className="px-4 py-3 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  {data.heightUnit === 'cm' ? (
                    <div className="flex">
                      <div className="relative flex-1">
                        <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={data.height}
                          onChange={(e) => updateData('height', parseFloat(e.target.value) || 0)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="170"
                        />
                      </div>
                      <select
                        value={data.heightUnit}
                        onChange={(e) => updateData('heightUnit', e.target.value as 'cm' | 'ft')}
                        className="px-4 py-3 border-l-0 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                      >
                        <option value="cm">cm</option>
                        <option value="ft">ft</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={data.heightFeet}
                        onChange={(e) => updateData('heightFeet', parseFloat(e.target.value) || 0)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="5"
                      />
                      <span className="flex items-center text-gray-500">ft</span>
                      <input
                        type="number"
                        value={data.heightInches}
                        onChange={(e) => updateData('heightInches', parseFloat(e.target.value) || 0)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="8"
                      />
                      <span className="flex items-center text-gray-500">in</span>
                      <button
                        onClick={() => updateData('heightUnit', 'cm')}
                        className="px-3 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        cm
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* BMI Display */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">BMI</span>
                  <span className="text-lg font-bold text-blue-900">{calculateBMI().toFixed(1)}</span>
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  {calculateBMI() < 18.5 ? 'Underweight' : 
                   calculateBMI() < 25 ? 'Normal weight' : 
                   calculateBMI() < 30 ? 'Overweight' : 'Obese'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level *</label>
                <div className="space-y-2">
                  {activityLevels.map((level) => (
                    <label key={level.value} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                      data.activityLevel === level.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}>
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={data.activityLevel === level.value}
                        onChange={(e) => updateData('activityLevel', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{level.label}</div>
                        <div className="text-sm text-gray-500">{level.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.activityLevel && <p className="text-red-500 text-xs mt-1">{errors.activityLevel}</p>}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={stepClass}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your main fitness goal?</h2>
              <p className="text-gray-600">Choose your primary objective to customize your experience</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Primary Goal *</label>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => updateData('primaryGoal', goal.id)}
                      className={`p-4 border rounded-xl text-left transition-all hover:shadow-md ${
                        data.primaryGoal === goal.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{goal.emoji}</div>
                      <div className="font-semibold text-gray-900 mb-1">{goal.label}</div>
                      <div className="text-xs text-gray-500">{goal.description}</div>
                    </button>
                  ))}
                </div>
                {errors.primaryGoal && <p className="text-red-500 text-xs mt-1">{errors.primaryGoal}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline *</label>
                  <select
                    value={data.timeline}
                    onChange={(e) => updateData('timeline', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.timeline ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select timeline</option>
                    <option value="4-weeks">4 weeks</option>
                    <option value="3-months">3 months</option>
                    <option value="6-months">6 months</option>
                    <option value="1-year">1 year</option>
                  </select>
                  {errors.timeline && <p className="text-red-500 text-xs mt-1">{errors.timeline}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (optional)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={data.targetWeight || ''}
                      onChange={(e) => updateData('targetWeight', parseFloat(e.target.value) || undefined)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder={`Target (${data.weightUnit})`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={stepClass}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customize your experience</h2>
              <p className="text-gray-600">Set your preferences for the perfect workout plan</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Workout Frequency: {data.workoutFrequency} days per week
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={data.workoutFrequency}
                  onChange={(e) => updateData('workoutFrequency', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 day</span>
                  <span>7 days</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Session Duration *</label>
                <div className="flex flex-wrap gap-2">
                  {['15min', '30min', '45min', '60min+'].map((duration) => (
                    <button
                      key={duration}
                      onClick={() => updateData('sessionDuration', duration)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        data.sessionDuration === duration
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-1" />
                      {duration}
                    </button>
                  ))}
                </div>
                {errors.sessionDuration && <p className="text-red-500 text-xs mt-1">{errors.sessionDuration}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Equipment Available</label>
                <div className="grid grid-cols-2 gap-2">
                  {equipment.map((item) => (
                    <label key={item} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.equipment.includes(item)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateData('equipment', [...data.equipment, item]);
                          } else {
                            updateData('equipment', data.equipment.filter(eq => eq !== item));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Favorite Activities</label>
                <div className="grid grid-cols-2 gap-2">
                  {activities.map((activity) => (
                    <label key={activity} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.favoriteActivities.includes(activity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateData('favoriteActivities', [...data.favoriteActivities, activity]);
                          } else {
                            updateData('favoriteActivities', data.favoriteActivities.filter(act => act !== activity));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{activity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-white rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of 4</span>
              <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    Complete Setup
                    <Check className="w-5 h-5 ml-1" />
                  </>
                )}
              </button>
            )}
          </div>

          {/* Skip Option */}
          {currentStep > 1 && currentStep < 4 && (
            <div className="text-center mt-4">
              <button
                onClick={nextStep}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip this step
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}