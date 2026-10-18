import { supabase, isSupabaseConfigured } from '../utils/supabase';

// กำหนด Type ของ Goal และ export ออกไปใช้งาน
export interface Goal {
  id: string | number;
  title: string;
  target_amount: number;
  current_amount: number;
  category?: string;
  created_at?: string;
}

// ฟังก์ชันดึงข้อมูลเป้าหมายทั้งหมดจาก Supabase
export const fetchGoals = async (): Promise<Goal[]> => {
  if (!isSupabaseConfigured) {
    throw new Error(
      'ยังไม่ได้ตั้งค่า Supabase: ใส่ EXPO_PUBLIC_SUPABASE_URL และ EXPO_PUBLIC_SUPABASE_ANON_KEY ในไฟล์ .env แล้วรัน npx expo start -c'
    );
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching goals:', error);
    throw new Error(error.message);
  }

  return (data ?? []) as Goal[];
};

// ฟังก์ชันสร้างเป้าหมายใหม่
export const createGoal = async (goal: Omit<Goal, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select();

  if (error) {
    console.error('Error creating goal:', error);
    throw error;
  }

  return data;
};

// ฟังก์ชันอัปเดตยอดเงินออม (ฝากเงิน)
export const depositToGoal = async (goalId: string | number, amount: number, currentAmount: number) => {
  const newAmount = currentAmount + amount;

  const { data, error } = await supabase
    .from('goals')
    .update({ current_amount: newAmount })
    .eq('id', goalId)
    .select();

  if (error) {
    console.error('Error depositing to goal:', error);
    throw error;
  }

  return data;
};