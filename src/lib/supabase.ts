import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    console.log('🔐 Attempting signup for:', email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    
    if (error) {
      console.error('❌ Signup error:', error)
      throw error
    }
    
    console.log('✅ Signup successful:', data)
    return data
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    console.log('🔐 Attempting signin for:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ Signin error:', error)
      throw error
    }
    
    console.log('✅ Signin successful:', data)
    return data
  },

  // Sign out
  signOut: async () => {
    console.log('🔐 Attempting signout')
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Signout error:', error)
      throw error
    }
    
    console.log('✅ Signout successful')
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Get session error:', error)
      return null
    }
    
    if (session) {
      console.log('✅ Active session found:', session.user.email)
    } else {
      console.log('ℹ️ No active session')
    }
    
    return session
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ Get user error:', error)
      return null
    }
    
    if (user) {
      console.log('✅ Current user:', user.email)
    }
    
    return user
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user')
      callback(event, session)
    })
  }
}