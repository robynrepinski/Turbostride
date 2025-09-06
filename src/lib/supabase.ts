import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create Supabase client with realtime disabled for now
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    disabled: true
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'implicit'
  }
})

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    console.log('🔐 [AUTH] Attempting signup for:', email, 'at:', new Date().toISOString())
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    
    if (error) {
      console.error('❌ [AUTH] Signup error:', error)
      throw error
    }
    
    console.log('✅ [AUTH] Signup successful:', data)
    return data
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    console.log('🔐 [AUTH] Attempting signin for:', email, 'at:', new Date().toISOString())
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ [AUTH] Signin error:', error)
      throw error
    }
    
    console.log('✅ [AUTH] Signin successful:', data)
    return data
  },

  // Sign out
  signOut: async () => {
    console.log('🔐 [AUTH] Attempting signout at:', new Date().toISOString())
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ [AUTH] Signout error:', error)
      throw error
    }
    
    console.log('✅ [AUTH] Signout successful')
  },

  // Get current session
  getSession: async () => {
    console.log('🔍 [AUTH] Getting session at:', new Date().toISOString())
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ [AUTH] Get session error:', error)
      return null
    }
    
    if (session) {
      console.log('✅ [AUTH] Active session found:', session.user.email, 'expires:', session.expires_at)
    } else {
      console.log('ℹ️ [AUTH] No active session')
    }
    
    return session
  },

  // Get current user
  getCurrentUser: async () => {
    console.log('🔍 [AUTH] Getting current user at:', new Date().toISOString())
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ [AUTH] Get user error:', error)
      return null
    }
    
    if (user) {
      console.log('✅ [AUTH] Current user:', user.email, 'id:', user.id)
    }
    
    return user
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    console.log('🔍 [AUTH] Setting up auth state change listener')
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 [AUTH] Auth state changed:', event, session?.user?.email || 'No user', 'at:', new Date().toISOString())
      callback(event, session)
    })
  }
}