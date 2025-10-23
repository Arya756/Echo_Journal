/*
  # Echo Journal Database Schema

  ## Overview
  Creates the database structure for the Echo Journal 3D showcase website,
  focusing on emotional intelligence content with multiple cover options.

  ## Tables Created
  
  ### 1. journal_covers
  Stores different cover design options for the journal
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Cover design name
  - `color` (text) - Primary color hex code
  - `texture` (text) - Texture type (leather, fabric, paper)
  - `image_url` (text, nullable) - Cover image URL
  - `is_default` (boolean) - Whether this is the default cover
  - `created_at` (timestamptz) - Creation timestamp

  ### 2. journal_pages
  Stores the pages and their content for the journal
  - `id` (uuid, primary key) - Unique identifier
  - `page_number` (integer) - Sequential page number
  - `title` (text) - Page title
  - `description` (text) - Detailed description of the page content
  - `content` (text) - Main content text
  - `category` (text) - Content category (exercises, reflections, prompts)
  - `image_url` (text, nullable) - Page illustration URL
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - RLS enabled on all tables
  - Public read access for showcase content
  - No write access (content managed via admin tools)

  ## Initial Data
  Includes sample covers and pages for the Echo Journal focused on emotional intelligence
*/

-- Create journal_covers table
CREATE TABLE IF NOT EXISTS journal_covers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  color text NOT NULL DEFAULT '#8B4513',
  texture text NOT NULL DEFAULT 'leather',
  image_url text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create journal_pages table
CREATE TABLE IF NOT EXISTS journal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_number integer NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE journal_covers ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_pages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view journal covers"
  ON journal_covers FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can view journal pages"
  ON journal_pages FOR SELECT
  TO anon
  USING (true);

-- Insert sample covers
INSERT INTO journal_covers (title, color, texture, is_default) VALUES
  ('Classic Leather', '#8B4513', 'leather', true),
  ('Midnight Blue', '#1e3a8a', 'fabric', false),
  ('Forest Green', '#065f46', 'leather', false),
  ('Soft Beige', '#d4b89c', 'paper', false),
  ('Deep Burgundy', '#7f1d1d', 'leather', false);

-- Insert sample pages
INSERT INTO journal_pages (page_number, title, description, content, category) VALUES
  (1, 'Welcome to Echo Journal', 'Your journey into emotional intelligence begins here. This introductory page sets the foundation for self-discovery and emotional awareness.', 'Welcome to Echo Journal - a companion for exploring the depths of your emotional landscape. Emotional intelligence is the key to understanding yourself and connecting authentically with others.', 'introduction'),
  
  (2, 'Understanding Your Emotions', 'Learn to identify and name your emotions with clarity. This page provides a comprehensive emotional vocabulary guide.', 'Emotions are signals from within. Learning to recognize and name them is the first step toward emotional mastery. Use this page to explore the full spectrum of human feelings.', 'exercises'),
  
  (3, 'Daily Emotional Check-In', 'A structured space for daily reflection on your emotional state, triggers, and responses.', 'What am I feeling right now? What triggered this emotion? How did I respond? What would I like to do differently? Use these prompts daily to build emotional awareness.', 'prompts'),
  
  (4, 'The Empathy Practice', 'Develop your ability to understand and share the feelings of others through guided exercises.', 'Empathy is the bridge to meaningful connections. Practice seeing situations from another perspective. Reflect on how others might feel and why.', 'exercises'),
  
  (5, 'Managing Difficult Emotions', 'Practical strategies for navigating challenging emotional experiences with grace and resilience.', 'When strong emotions arise, pause and breathe. Name the emotion. Explore its message. Choose your response with intention. This page offers techniques for emotional regulation.', 'reflections'),
  
  (6, 'Gratitude & Positive Emotions', 'Cultivate positive emotional states through daily gratitude practice and appreciation.', 'What brought joy today? Who am I grateful for? What small moments sparked delight? Acknowledging positive emotions amplifies them.', 'prompts'),
  
  (7, 'Emotional Patterns', 'Identify recurring emotional themes and patterns in your life for deeper self-understanding.', 'Over time, patterns emerge. Notice your emotional triggers, your default responses, and your growth areas. This awareness is transformative.', 'reflections'),
  
  (8, 'Setting Emotional Boundaries', 'Learn to protect your emotional well-being through healthy boundary-setting practices.', 'Boundaries are an act of self-respect. What are you willing to accept? What needs to change? How will you communicate your needs? Define your emotional limits here.', 'exercises');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_journal_covers_default ON journal_covers(is_default);
CREATE INDEX IF NOT EXISTS idx_journal_pages_number ON journal_pages(page_number);