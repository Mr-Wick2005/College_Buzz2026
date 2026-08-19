import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

export const supabaseUrl = `https://${projectId}.supabase.co`;

// Singleton — reuse existing client across HMR reloads to avoid
// "Multiple GoTrueClient instances" warnings in development.
const _key = '__campus_buzz_supabase__';
if (!window[_key]) {
  window[_key] = createClient(supabaseUrl, publicAnonKey);
}
export const supabase = window[_key];

export const EDGE_FUNCTION_URL = `https://${projectId}.supabase.co/functions/v1/make-server-028b7c87`;

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function signUpStudent({ email, password, name }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name || email.split('@')[0], role: 'student' } },
  });
  if (error) throw error;

  // If Supabase auto-confirmed (email confirmation disabled), upsert profile now
  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: 'student',
        full_name: name || email.split('@')[0],
      });
    } catch (_) { /* table may not exist yet — non-fatal */ }
  }

  // Returns { user, session } — session is non-null when email confirmation is OFF
  return data;
}

export async function signUpAdmin({ email, password, adminName, collegeName, contactNumber }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: adminName || email.split('@')[0], role: 'admin' } },
  });
  if (error) throw error;

  if (data.user) {
    try {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: 'admin',
        full_name: adminName || email.split('@')[0],
        college: collegeName || null,
        contact_number: contactNumber || null,
      });
    } catch (_) { /* non-fatal */ }
  }

  return data;
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;

  // Upsert profile on every login so it stays in sync with auth.users
  if (data.user) {
    try {
      const meta = data.user.user_metadata || {};
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role: meta.role || 'student',
        full_name: meta.full_name || email.split('@')[0],
        college: meta.college || null,
      }, { onConflict: 'id', ignoreDuplicates: false });
    } catch (_) { /* non-fatal */ }
  }

  return data;
}

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({ type: 'signup', email });
  if (error) throw error;
}

export async function signOut() {
  await supabase.auth.signOut();
  ['token', 'user_email', 'user_name', 'user_role', 'college_name'].forEach(k =>
    localStorage.removeItem(k)
  );
}

export async function getCurrentProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    return data;
  } catch (_) {
    return null;
  }
}

// ── Events helpers ───────────────────────────────────────────────────────────

export async function getEvents() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, profiles(full_name, college)')
      .order('date');
    if (error) throw error;
    return data || [];
  } catch (_) {
    // Table doesn't exist yet — return seed data so the UI isn't blank
    return SEED_EVENTS.map((e, i) => ({ ...e, id: `seed_${i}` }));
  }
}

export async function getMyEvents() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*, registrations(count)')
      .eq('organizer_id', user.id)
      .order('date');
    if (error) throw error;
    return data || [];
  } catch (_) {
    return [];
  }
}

export async function createEvent(eventData) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const profile = await getCurrentProfile();
  const { data, error } = await supabase.from('events').insert({
    ...eventData,
    organizer_id: user.id,
    college: profile?.college || eventData.college,
  }).select().single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(eventId) {
  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) throw error;
}

// ── Registrations helpers ────────────────────────────────────────────────────

export async function getMyRegistrations() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, events(*)')
      .eq('student_id', user.id)
      .order('registered_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (_) {
    return [];
  }
}

export async function registerForEvent(eventId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const qrCode = `BUZZ-${eventId.slice(0, 8).toUpperCase()}-${user.id.slice(0, 6).toUpperCase()}`;
  const { data, error } = await supabase.from('registrations').insert({
    event_id: eventId,
    student_id: user.id,
    qr_code: qrCode,
  }).select().single();

  if (error) throw error;
  return data;
}

export async function cancelRegistration(registrationId) {
  const { error } = await supabase.from('registrations').delete().eq('id', registrationId);
  if (error) throw error;
}

export async function getEventRegistrations(eventId) {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*, profiles(full_name, college)')
      .eq('event_id', eventId)
      .order('registered_at');
    if (error) throw error;
    return data || [];
  } catch (_) {
    return [];
  }
}

// ── Seed data ────────────────────────────────────────────────────────────────

export const SEED_EVENTS = [
  {
    title: "Tech Innovation Summit 2025",
    category: "Workshop",
    date: "2025-03-15T10:00:00Z",
    time: "10:00 AM",
    location: "MIT Auditorium",
    image_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
    capacity: 500,
    college: "MIT Institute",
    description: "Explore AI, Quantum Computing, and Next-Gen Web Technologies with industry leaders.",
    tags: ["AI", "Tech", "Workshop"],
    is_live: false,
  },
  {
    title: "Annual Cultural Fest - Euphoria",
    category: "Cultural",
    date: "2025-03-20T18:00:00Z",
    time: "06:00 PM",
    location: "Main Campus Grounds",
    image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop",
    capacity: 1200,
    college: "Stanford University",
    description: "A night of music, art, lights, and mesmerizing stage performances across 5 arenas.",
    tags: ["Music", "Art", "Cultural"],
    is_live: true,
  },
  {
    title: "National Sports Championship",
    category: "Sports",
    date: "2025-03-25T09:00:00Z",
    time: "09:00 AM",
    location: "Central Sports Complex",
    image_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
    capacity: 800,
    college: "Harvard Campus",
    description: "Track & Field, Basketball, Soccer, and Esports tournaments with cash prizes.",
    tags: ["Sports", "Championship"],
    is_live: false,
  },
  {
    title: "CodeStorm Hackathon 2025",
    category: "Hackathon",
    date: "2025-03-30T08:00:00Z",
    time: "08:00 AM",
    location: "Computer Science Center",
    image_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop",
    capacity: 300,
    college: "UC Berkeley",
    description: "36-hour non-stop hackathon building real-world AI and Open Source solutions.",
    tags: ["Coding", "AI", "Hackathon"],
    is_live: false,
  },
];

export async function seedEventsIfEmpty() {
  try {
    const { count } = await supabase.from('events').select('id', { count: 'exact', head: true });
    if (count === 0) {
      await supabase.from('events').insert(SEED_EVENTS);
    }
  } catch (_) { /* non-fatal */ }
}
