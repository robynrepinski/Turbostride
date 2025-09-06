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
    detectSessionInUrl: false // Disable email confirmation URL detection
  }
})

// Simple auth helper functions
export const auth = {
  // Sign up with email and password - immediately sign in
  signUp: async (email: string, password: string) => {
    console.log('🔐 [AUTH] Signing up and logging in:', email)
    
    // Sign up without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined // No email confirmation needed
      }
    })
    
    if (error) {
      console.error('❌ [AUTH] Signup error:', error)
      throw error
    }
    
    console.log('✅ [AUTH] Signup successful, user logged in')
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

  // Get current user
  getCurrentUser: async () => {
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