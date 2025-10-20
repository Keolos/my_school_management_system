import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // 👈 important
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// call this once on auth change
supabase.auth.onAuthStateChange(async (_sessionEvent, session) => {
  const user = session?.user;
  if (user) {
    // Create a profiles row if not exists
    void supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
    // optionally set role to new_user by default (db default)
  }
});
