-- ============================================================================
-- Migration: 002_college_buzz_core_schema.sql
-- Description: Comprehensive PostgreSQL schema for College Buzz
-- Target: Supabase PostgreSQL (PostgREST, Auth, RLS, Indexes, Constraints)
-- ============================================================================

-- 1. Helper function to maintain updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. Categories Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed core categories if not already present
INSERT INTO categories (name, slug, icon, color)
VALUES 
  ('Workshop', 'workshop', 'Wrench', 'cyan'),
  ('Cultural', 'cultural', 'Sparkles', 'purple'),
  ('Sports', 'sports', 'Trophy', 'emerald'),
  ('Hackathon', 'hackathon', 'Terminal', 'orange'),
  ('Dance', 'dance', 'Music', 'pink'),
  ('Acting', 'acting', 'Film', 'indigo'),
  ('Music', 'music', 'Radio', 'amber'),
  ('Debate', 'debate', 'MessageSquare', 'blue')
ON CONFLICT (slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Colleges Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT UNIQUE,
  city TEXT,
  state TEXT,
  website TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_colleges_updated_at
  BEFORE UPDATE ON colleges
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 4. Profiles Table (extends auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  full_name TEXT,
  college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
  college TEXT,
  contact_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 5. Organizations / Clubs Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  category TEXT,
  logo_url TEXT,
  lead_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_org_per_college UNIQUE(college_id, name)
);

CREATE TRIGGER set_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 6. Events Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'General',
  college_id UUID REFERENCES colleges(id) ON DELETE SET NULL,
  college TEXT,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  date TIMESTAMPTZ NOT NULL,
  time TEXT,
  location TEXT,
  capacity INTEGER DEFAULT 100 CHECK (capacity >= 0),
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0 CHECK (views >= 0),
  is_live BOOLEAN DEFAULT false,
  registration_link TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER set_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 7. Event Registrations Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  attended_at TIMESTAMPTZ,
  registered_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_event_registration UNIQUE(event_id, student_id)
);

CREATE TRIGGER set_registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 8. Saved Events / Bookmarks Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS saved_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_saved_event UNIQUE(student_id, event_id)
);

-- ----------------------------------------------------------------------------
-- 9. Event Images Gallery Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS event_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_cover BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 10. Performance Indexes
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);
CREATE INDEX IF NOT EXISTS idx_events_college_id ON events(college_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_org_id ON events(organization_id);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student_id ON registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

CREATE INDEX IF NOT EXISTS idx_saved_events_student_id ON saved_events(student_id);
CREATE INDEX IF NOT EXISTS idx_saved_events_event_id ON saved_events(event_id);

CREATE INDEX IF NOT EXISTS idx_organizations_college_id ON organizations(college_id);
CREATE INDEX IF NOT EXISTS idx_event_images_event_id ON event_images(event_id);

-- ============================================================================
-- 11. Row Level Security (RLS) Configuration
-- ============================================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_images ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "categories_select_public" ON categories FOR SELECT USING (true);

-- Colleges RLS
CREATE POLICY "colleges_select_public" ON colleges FOR SELECT USING (true);
CREATE POLICY "colleges_insert_admin" ON colleges FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "colleges_update_admin" ON colleges FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Profiles RLS
CREATE POLICY "profiles_select_all" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations RLS
CREATE POLICY "organizations_select_public" ON organizations FOR SELECT USING (true);
CREATE POLICY "organizations_insert_admin" ON organizations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "organizations_update_admin" ON organizations FOR UPDATE USING (
  lead_user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Events RLS
CREATE POLICY "events_select_all" ON events FOR SELECT USING (true);
CREATE POLICY "events_insert_admin" ON events FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "events_update_own" ON events FOR UPDATE USING (organizer_id = auth.uid());
CREATE POLICY "events_delete_own" ON events FOR DELETE USING (organizer_id = auth.uid());

-- Registrations RLS
CREATE POLICY "registrations_select" ON registrations FOR SELECT USING (
  student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM events e WHERE e.id = event_id AND e.organizer_id = auth.uid())
);
CREATE POLICY "registrations_insert_student" ON registrations FOR INSERT WITH CHECK (
  student_id = auth.uid()
);
CREATE POLICY "registrations_update_own" ON registrations FOR UPDATE USING (
  student_id = auth.uid() OR
  EXISTS (SELECT 1 FROM events e WHERE e.id = event_id AND e.organizer_id = auth.uid())
);
CREATE POLICY "registrations_delete_own" ON registrations FOR DELETE USING (
  student_id = auth.uid()
);

-- Saved Events RLS
CREATE POLICY "saved_events_select_own" ON saved_events FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "saved_events_insert_own" ON saved_events FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "saved_events_delete_own" ON saved_events FOR DELETE USING (student_id = auth.uid());

-- Event Images RLS
CREATE POLICY "event_images_select_public" ON event_images FOR SELECT USING (true);
CREATE POLICY "event_images_insert_admin" ON event_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM events e WHERE e.id = event_id AND e.organizer_id = auth.uid())
);
CREATE POLICY "event_images_delete_admin" ON event_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM events e WHERE e.id = event_id AND e.organizer_id = auth.uid())
);
