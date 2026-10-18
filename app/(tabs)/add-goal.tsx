import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../utils/supabase';

export default function AddGoalScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  // สถานะสำหรับเปิด/ปิด โหมดมืด (true = โหมดมืด, false = โหมดสว่าง)
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleCreateGoal = async () => {
    if (!title || !targetAmount) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกชื่อเป้าหมายและจำนวนเงินเป้าหมาย');
      return;
    }

    if (isNaN(Number(targetAmount)) || Number(targetAmount) <= 0) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกจำนวนเงินเป้าหมายให้ถูกต้อง');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('goals').insert([
        {
          title,
          target_amount: Number(targetAmount),
          current_amount: 0,
          category: category || 'ทั่วไป',
        },
      ]);

      if (error) throw error;

      Alert.alert('สำเร็จ', 'สร้างเป้าหมายการออมเรียบร้อยแล้ว!', [
        { text: 'ตกลง', onPress: () => router.push('/(tabs)') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, themeStyles.text]}>สร้างเป้าหมายใหม่</Text>
        
        {/* ปุ่มสลับโหมด มืด / สว่าง */}
        <TouchableOpacity 
          style={styles.themeToggleBtn}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Text style={styles.themeToggleText}>
            {isDarkMode ? '☀️ โหมดสว่าง' : '🌙 โหมดมืด'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.label, themeStyles.subText]}>ชื่อเป้าหมาย *</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="เช่น ซื้อคอมพิวเตอร์ใหม่, เที่ยวญี่ปุ่น"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, themeStyles.subText]}>จำนวนเงินเป้าหมาย (บาท) *</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="เช่น 50000"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        keyboardType="numeric"
        value={targetAmount}
        onChangeText={setTargetAmount}
      />

      <Text style={[styles.label, themeStyles.subText]}>หมวดหมู่</Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        placeholder="เช่น อุปกรณ์ไอที, ท่องเที่ยว, เงินสำรอง"
        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleCreateGoal}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'กำลังสร้าง...' : 'สร้างเป้าหมาย'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  themeToggleBtn: { backgroundColor: '#e0e0e0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  themeToggleText: { fontSize: 12, fontWeight: 'bold', color: '#333' },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#99c2ff' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  text: { color: '#333' },
  subText: { color: '#333' },
  input: { backgroundColor: '#fff', borderColor: '#ddd', color: '#333' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  text: { color: '#fff' },
  subText: { color: '#bbb' },
  input: { backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff' },
});