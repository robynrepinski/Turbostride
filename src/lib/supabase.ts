import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Simple auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (email: string, password: string) => {
    console.log('🔐 [AUTH] Signing up:', email)
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
    
    console.log('✅ [AUTH] Signup successful')
    return data
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    console.log('🔐 [AUTH] Signing in:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('❌ [AUTH] Signin error:', error)
      throw error
    }
    
    console.log('✅ [AUTH] Signin successful')
    return data
  },

  // Sign out
  signOut: async () => {
    console.log('🔐 [AUTH] Signing out')
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ [AUTH] Signout error:', error)
      throw error
    }
    
    console.log('✅ [AUTH] Signout successful')
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ [AUTH] Get session error:', error)
      return null
    }
    
    return session
  },

  // Get current user
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('❌ [AUTH] Get user error:', error)
      return null
    }
    
    return user
  },

  // Listen to auth changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}