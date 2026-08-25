-- ============================================================================
-- Migration: 003_storage_and_registrations.sql
-- Description: Supabase Storage configuration and Registration Constraints
-- ============================================================================

-- 1. Create storage buckets for event posters and user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('event-posters', 'event-posters', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Objects RLS Policies for event-posters
CREATE POLICY "event_posters_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-posters');

CREATE POLICY "event_posters_admin_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'event-posters' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "event_posters_owner_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'event-posters' AND
    auth.uid() = owner
  );

CREATE POLICY "event_posters_owner_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'event-posters' AND
    auth.uid() = owner
  );

-- 3. Storage Objects RLS Policies for avatars
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_user_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = owner
  );

CREATE POLICY "avatars_user_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() = owner
  );
