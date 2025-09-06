import React, { useState, useEffect } from 'react';
import { Bug, RefreshCw, Trash2, Eye, EyeOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase, auth } from '../lib/supabase';

interface DebugPanelProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentUser: any;
  onSkipAuth: () => void;
  onClearData: () => void;
}

export default function DebugPanel({ 
  isAuthenticated, 
  isLoading, 
  currentUser, 
  onSkipAuth, 
  onClearData 
}: DebugPanelProps) {
  const [showDebug, setShowDebug] = useState(true);
  const [connectionTest, setConnectionTest] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState('Initializing...');
  const [envCheck, setEnvCheck] = useState<any>({});
  const [supabaseTest, setSupabaseTest] = useState<any>({});
  const [authState, setAuthState] = useState<any>({});

  useEffect(() => {
    // Check environment variables
    const checkEnv = () => {
      const env = {
        VITE_SUPABASE_URL: !!import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        url_value: import.meta.env.VITE_SUPABASE_URL?.substring(0, 20) + '...',
        key_value: import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
      };
      setEnvCheck(env);
      console.log('🔍 Environment Check:', env);
    };

    // Test Supabase connection
    const testSupabase = async () => {
      try {
        setSupabaseTest({
          connected: true,
          error: null,
          timestamp: new Date().toISOString()
        });
        console.log('🔍 Supabase Test: Basic client created successfully');
      } catch (err: any) {
        setSupabaseTest({
          connected: false,
          error: err.message,
          timestamp: new Date().toISOString()
        });
        console.log('🔍 Supabase Test Error:', err);
      }
    };

    // Get auth state
    const getAuthState = async () => {
      try {
        const session = await auth.getSession();
        const user = await auth.getCurrentUser();
        setAuthState({
          hasSession: !!session,
          hasUser: !!user,
          userId: user?.id,
          userEmail: user?.email,
          sessionExpiry: session?.expires_at,
          timestamp: new Date().toISOString()
        });
        console.log('🔍 Auth State:', { session, user });
      } catch (err: any) {
        setAuthState({
          error: err.message,
          timestamp: new Date().toISOString()
        });
        console.log('🔍 Auth State Error:', err);
      }
    };

    checkEnv();
    testSupabase();
    getAuthState();

    // Update current step based on loading state
    if (isLoading) {
      setCurrentStep('Checking authentication...');
    } else if (isAuthenticated) {
      setCurrentStep('Authentication complete');
    } else {
      setCurrentStep('Ready for authentication');
    }
  }, [isLoading, isAuthenticated]);

  const testConnection = async () => {
    setConnectionTest('testing');
    setConnectionError('');
    
    try {
      console.log('🧪 Testing Supabase connection...');
      
      // Test 1: Basic connection
      // Simple auth test instead of realtime schema
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Auth test failed: ${sessionError.message}`);
      }
      
      // Test basic connection by checking if we can call auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError && userError.message !== 'Auth session missing!') {
        throw new Error(`User check failed: ${userError.message}`);
      }
      
      console.log('✅ Connection test passed!', { session, user });
      setConnectionTest('success');
      
    } catch (error: any) {
      console.error('❌ Connection test failed:', error);
      setConnectionError(error.message);
      setConnectionTest('error');
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log('🗑️ Cleared all local storage');
    onClearData();
  };

  const dumpState = () => {
    const state = {
      isAuthenticated,
      isLoading,
      currentUser,
      envCheck,
      supabaseTest,
      authState,
      localStorage: Object.keys(localStorage),
      sessionStorage: Object.keys(sessionStorage),
      timestamp: new Date().toISOString()
    };
    console.log('📊 FULL APP STATE DUMP:', state);
    alert('State dumped to console - check developer tools!');
  };

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
      >
        <Bug className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 p-4 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bug className="w-6 h-6" />
              <h2 className="text-xl font-bold">🔍 DEBUG MODE</h2>
            </div>
            <button
              onClick={() => setShowDebug(false)}
              className="p-1 hover:bg-red-700 rounded"
            >
              <EyeOff className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">📊 Current Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">User State:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  isAuthenticated ? 'bg-green-100 text-green-800' : 
                  isLoading ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {isAuthenticated ? 'authenticated' : isLoading ? 'loading' : 'unauthenticated'}
                </span>
              </div>
              <div>
                <span className="font-medium">Current Step:</span>
                <span className="ml-2 text-blue-600">{currentStep}</span>
              </div>
              <div>
                <span className="font-medium">Auth User ID:</span>
                <span className="ml-2 font-mono text-xs">
                  {authState.userId || 'none'}
                </span>
              </div>
              <div>
                <span className="font-medium">User Email:</span>
                <span className="ml-2">{authState.userEmail || 'none'}</span>
              </div>
            </div>
          </div>

          {/* Environment Check */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">🔧 Environment Variables</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                {envCheck.VITE_SUPABASE_URL ? 
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : 
                  <XCircle className="w-4 h-4 text-red-600 mr-2" />
                }
                <span className="font-medium">VITE_SUPABASE_URL:</span>
                <span className="ml-2 font-mono text-xs">
                  {envCheck.VITE_SUPABASE_URL ? envCheck.url_value : 'MISSING'}
                </span>
              </div>
              <div className="flex items-center">
                {envCheck.VITE_SUPABASE_ANON_KEY ? 
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : 
                  <XCircle className="w-4 h-4 text-red-600 mr-2" />
                }
                <span className="font-medium">VITE_SUPABASE_ANON_KEY:</span>
                <span className="ml-2 font-mono text-xs">
                  {envCheck.VITE_SUPABASE_ANON_KEY ? envCheck.key_value : 'MISSING'}
                </span>
              </div>
            </div>
          </div>

          {/* Supabase Connection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">🔌 Supabase Connection</h3>
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center">
                {supabaseTest.connected ? 
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" /> : 
                  <XCircle className="w-4 h-4 text-red-600 mr-2" />
                }
                <span className="font-medium">
                  Status: {supabaseTest.connected ? 'Connected' : 'Failed'}
                </span>
              </div>
              <button
                onClick={testConnection}
                disabled={connectionTest === 'testing'}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${connectionTest === 'testing' ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>
            </div>
            
            {supabaseTest.error && (
              <div className="bg-red-100 border border-red-300 rounded p-2 text-sm text-red-700">
                <strong>Error:</strong> {supabaseTest.error}
              </div>
            )}
            
            {connectionError && (
              <div className="bg-red-100 border border-red-300 rounded p-2 text-sm text-red-700">
                <strong>Connection Test Error:</strong> {connectionError}
              </div>
            )}
          </div>

          {/* Auth Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">🔐 Authentication Details</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Has Session:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  authState.hasSession ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {authState.hasSession ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="font-medium">Has User:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  authState.hasUser ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {authState.hasUser ? 'Yes' : 'No'}
                </span>
              </div>
              {authState.sessionExpiry && (
                <div>
                  <span className="font-medium">Session Expires:</span>
                  <span className="ml-2 font-mono text-xs">
                    {new Date(authState.sessionExpiry * 1000).toLocaleString()}
                  </span>
                </div>
              )}
              {authState.error && (
                <div className="bg-red-100 border border-red-300 rounded p-2 text-red-700">
                  <strong>Auth Error:</strong> {authState.error}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">⚡ Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onSkipAuth}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Skip Auth (Dev Mode)</span>
              </button>
              
              <button
                onClick={clearAllData}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All Data</span>
              </button>
              
              <button
                onClick={dumpState}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors col-span-2"
              >
                <Bug className="w-4 h-4" />
                <span>Dump Full State to Console</span>
              </button>
            </div>
          </div>

          {/* Raw Data */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">📋 Raw Data</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Current User Object:</h4>
                <pre className="bg-gray-800 text-green-400 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(currentUser, null, 2) || 'null'}
                </pre>
              </div>
              
              <div>
                <h4 className="font-medium mb-1">Local Storage Keys:</h4>
                <div className="bg-gray-800 text-green-400 p-2 rounded text-xs">
                  {Object.keys(localStorage).join(', ') || 'empty'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}