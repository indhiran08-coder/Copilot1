// ============================================================
// supabase.js — Supabase Client
// ============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Auth Helpers ──────────────────────────────────────────
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ── Profile Helpers ───────────────────────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() });
  return { data, error };
}

// ── Session Helpers ───────────────────────────────────────
export async function saveCurriculumSession(userId, curriculum, completedDays = []) {
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      role_name: curriculum.role,
      experience: curriculum.experience,
      focus: curriculum.focus,
      goal: curriculum.goal,
      curriculum,
      completed_days: completedDays,
    })
    .select()
    .single();
  return { data, error };
}

export async function getUserSessions(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function updateSessionProgress(sessionId, completedDays) {
  const { data, error } = await supabase
    .from('sessions')
    .update({ completed_days: completedDays, updated_at: new Date().toISOString() })
    .eq('id', sessionId);
  return { data, error };
}

export async function deleteSession(sessionId) {
  const { error } = await supabase.from('sessions').delete().eq('id', sessionId);
  return { error };
}
