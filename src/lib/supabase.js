import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase credentials are available
const hasSupabaseCredentials = supabaseUrl && supabaseAnonKey

// Create a mock Supabase client if credentials are missing
const createMockClient = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Supabase not configured. Please set up your Supabase credentials.' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured. Please set up your Supabase credentials.' } }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
    insert: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }),
    update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
    delete: () => ({ eq: () => ({ select: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }) })
  })
})

// Create Supabase client for frontend
export const supabase = hasSupabaseCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : createMockClient()

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasSupabaseCredentials

// Create Supabase client for server-side operations (with service role key)
export const createServerClient = () => {
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Auth helper functions
export const auth = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions with RLS
export const db = {
  // Users table operations
  users: {
    // Get user profile (with RLS)
    async getProfile(userId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    // Update user profile (with RLS)
    async updateProfile(userId, updates) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      return { data, error }
    },

    // Get all users (admin only - with RLS)
    async getAllUsers() {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, created_at, last_login, is_active')
        .order('created_at', { ascending: false })
      return { data, error }
    }
  },

  // Estate planning documents
  documents: {
    // Get user's documents (with RLS)
    async getUserDocuments(userId) {
      const { data, error } = await supabase
        .from('estate_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    // Create new document (with RLS)
    async createDocument(documentData) {
      const { data, error } = await supabase
        .from('estate_documents')
        .insert(documentData)
        .select()
        .single()
      return { data, error }
    },

    // Update document (with RLS)
    async updateDocument(documentId, updates) {
      const { data, error } = await supabase
        .from('estate_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()
      return { data, error }
    },

    // Delete document (with RLS)
    async deleteDocument(documentId) {
      const { data, error } = await supabase
        .from('estate_documents')
        .delete()
        .eq('id', documentId)
        .select()
      return { data, error }
    }
  },

  // Email list management
  emailList: {
    // Add email to list
    async addEmail(email, name, source = 'website') {
      const { data, error } = await supabase
        .from('email_list')
        .insert({
          email,
          name,
          source,
          subscribed: true
        })
        .select()
        .single()
      return { data, error }
    },

    // Get all email subscribers (admin only)
    async getAllSubscribers() {
      const { data, error } = await supabase
        .from('email_list')
        .select('*')
        .eq('subscribed', true)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    // Unsubscribe email
    async unsubscribeEmail(email) {
      const { data, error } = await supabase
        .from('email_list')
        .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
        .eq('email', email)
        .select()
      return { data, error }
    }
  },

  // Blog posts
  blog: {
    // Get all published blog posts
    async getPublishedPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    // Get single blog post
    async getPost(slug) {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single()
      return { data, error }
    },

    // Create blog post (admin only)
    async createPost(postData) {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert(postData)
        .select()
        .single()
      return { data, error }
    },

    // Update blog post (admin only)
    async updatePost(postId, updates) {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', postId)
        .select()
        .single()
      return { data, error }
    }
  }
}

export default supabase
