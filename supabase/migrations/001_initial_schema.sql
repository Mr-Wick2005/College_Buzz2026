-- profiles: one row per auth.users entry
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  full_name TEXT,
  college TEXT,
  contact_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- events: created by college admins
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'General',
  date TIMESTAMPTZ NOT NULL,
  time TEXT,
  location TEXT,
  capacity INTEGER DEFAULT 100,
  image_url TEXT,
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  college TEXT,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- registrations: student sign-ups for events
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  registered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- profiles policies
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- events policies: public read, admins write their own
CREATE POLICY "events_select_all" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert_admin" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "events_update_own" ON events FOR UPDATE USING (organizer_id = auth.uid());
CREATE POLICY "events_delete_own" ON events FOR DELETE USING (organizer_id = auth.uid());

-- registrations policies
CREATE POLICY "registrations_select" ON registrations FOR SELECT USING (
  student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM events e WHERE e.id = event_id AND e.organizer_id = auth.uid())
);
CREATE POLICY "registrations_insert_student" ON registrations FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "registrations_update_own" ON registrations FOR UPDATE USING (student_id = auth.uid());
CREATE POLICY "registrations_delete_own" ON registrations FOR DELETE USING (student_id = auth.uid());
