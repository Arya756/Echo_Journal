import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface JournalCover {
  id: string;
  title: string;
  color: string;
  texture: string;
  image_url: string | null;
  is_default: boolean;
  created_at: string;
}

export interface JournalPage {
  id: string;
  page_number: number;
  title: string;
  description: string;
  content: string;
  category: string;
  image_url: string | null;
  created_at: string;
}
