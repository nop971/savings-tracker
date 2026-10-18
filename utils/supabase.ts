import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hlckdmpqphqpnophevwd.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhsY2tkbXBxcGhxcG5vcGhldndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMzgyMDEsImV4cCI6MjEwNzkxNDIwMX0.R2Svjw9sB2c3LFxy_p7B4iUbA-9u7U5buBVy_JfTVLo';

// ตรวจว่าใส่ค่า Supabase จริงใน .env แล้ว (ไม่ใช่ค่าว่างหรือค่าตัวอย่าง xxxx)
export const isSupabaseConfigured =
  supabaseUrl.startsWith('https://') &&
  !/^https:\/\/x+\.supabase\.co/.test(supabaseUrl) &&
  supabaseAnonKey.length > 0;

export const supabase = createClient(
  // createClient จะ throw ถ้า URL ว่าง จึงใส่ค่าสำรองไว้ก่อน
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
