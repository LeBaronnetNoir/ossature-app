const SUPABASE_URL = 'https://vtfuzcxkdrnkbonrlxbk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0ZnV6Y3hrZHJua2JvbnJseGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3Njk1ODgsImV4cCI6MjA5NTM0NTU4OH0.tKm-FS6nL_S2GjCOvBsV3ylUjt6O50KvCtdWJe6XAsc';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
};

export async function getCollection(username: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/releases?discogs_user=eq.${username}&order=artist.asc`,
    { headers }
  );
  return res.json();
}

export async function getStats() {
  const res = await fetch(
    'https://vinyl-portfolio-eight.vercel.app/api/discogs?action=stats'
  );
  return res.json();
}

export async function getPriceHistory(releaseId: number) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/price_history_daily?release_id=eq.${releaseId}&order=recorded_at.asc&limit=30`,
    { headers }
  );
  return res.json();
}
