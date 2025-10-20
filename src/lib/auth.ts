// src/lib/auth.ts
import { supabase } from './supabaseClient';

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles(name)')
    .eq('id', user.id)
    .single();
  if (error) {
    console.error('profile fetch error', error);
    return null;
  }
  return { user, profile: data };
}
