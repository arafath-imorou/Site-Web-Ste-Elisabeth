import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nndwbwxgayaodavkuukz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_U3ZdA7FvUu7KRGBitI0iqg_xLk2D95Z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
