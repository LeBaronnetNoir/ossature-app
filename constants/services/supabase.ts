import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vtfuzcxkdrnkbonrlxbk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZnV6Y3hrZHJua2JvbnJseGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Njk1ODgsImV4cCI6MjA5NTM0NTU4OH0.tKm-FS6nL_S2GjCOvBsV3ylUjt6O50KvCtdWJe6XAsc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function getCollection(username: string) {
  const { data, error } = await supabase
    .from('releases')
    .select('*')
    .eq('discogs_user', username)
    .order('artist', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getStats() {
  const res = await fetch('https://vinyl-portfolio-eight.vercel.app/api/discogs?action=stats');
  return res.json();
}

export async function getPriceHistory(releaseId: number) {
  const { data, error } = await supabase
    .from('price_history_daily')
    .select('price, recorded_at')
    .eq('release_id', releaseId)
    .order('recorded_at', { ascending: true })
    .limit(30);
  if (error) throw error;
  return data;
}
