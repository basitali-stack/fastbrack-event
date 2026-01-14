-- Sports Event Management - Database Schema
-- Run this in Supabase SQL Editor to create the events table

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sport_type TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  description TEXT,
  venues TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster user queries
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);

-- Create index for date sorting
CREATE INDEX IF NOT EXISTS events_date_time_idx ON events(date_time);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own events
CREATE POLICY "Users can view own events" ON events
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can only insert their own events  
CREATE POLICY "Users can insert own events" ON events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own events
CREATE POLICY "Users can update own events" ON events
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can only delete their own events
CREATE POLICY "Users can delete own events" ON events
  FOR DELETE
  USING (auth.uid() = user_id);
