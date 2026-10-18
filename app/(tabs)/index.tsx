import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../utils/supabase';

export default function IndexScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ฟังก์ชันดึงข้อมูลเป้าหมายจาก Supabase
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันลบเป้าหมายการออม
  const handleDeleteGoal = (id: number, title: string) => {
    Alert.alert(
      'ยืนยันการลบ',
      `คุณต้องการลบเป้าหมาย "${title}" ใช่หรือไม่?`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ลบข้อมูล', 
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', id);

              if (error) throw error;

              Alert.alert('สำเร็จ', 'ลบเป้าหมายเรียบร้อยแล้ว');
              fetchGoals(); // โหลดข้อมูลใหม่หลังจากลบสำเร็จ
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [])
  );

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, themeStyles.text]}>เป้าหมายการออม</Text>
        
        {/* ปุ่มสลับโหมด มืด / สว่าง (แบบขอบสี) */}
        <TouchableOpacity 
          style={styles.themeToggleBtn}
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Text style={[styles.themeToggleText, themeStyles.text]}>
            {isDarkMode ? '☀️ โหมดสว่าง' : '🌙 โหมดมืด'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const progress = item.target_amount > 0 
            ? Math.min((item.current_amount / item.target_amount) * 100, 100) 
            : 0;

          return (
            <View style={[styles.card, themeStyles.card]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, themeStyles.text]}>{item.title}</Text>
                <Text style={styles.cardCategory}>{item.category || 'ทั่วไป'}</Text>
              </View>
              <Text style={[styles.cardAmount, themeStyles.subText]}>
                ฿{item.current_amount.toLocaleString()} / ฿{item.target_amount.toLocaleString()}
              </Text>
              
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>

              {/* ปุ่มการทำงาน (ฝากเงิน + ลบ) แบบขอบสี */}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={styles.depositBtn}
                  onPress={() => router.push({ pathname: '/deposit', params: { id: item.id } })}
                >
                  <Text style={styles.depositBtnText}>+ ฝากเงิน</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.deleteBtn}
                  onPress={() => handleDeleteGoal(item.id, item.title)}
                >
                  <Text style={styles.deleteBtnText}>ลบ</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  themeToggleBtn: { borderWidth: 1, borderColor: '#aaa', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  themeToggleText: { fontSize: 12, fontWeight: 'bold' },
  card: { borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: 'bold' },
  cardCategory: { fontSize: 14, color: '#666', backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  cardAmount: { fontSize: 16, marginBottom: 8 },
  progressBarBg: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  progressBarFill: { height: '100%', backgroundColor: '#007AFF' },
  progressText: { fontSize: 12, color: '#888', textAlign: 'right', marginBottom: 8 },
  
  // สไตล์แถวปุ่มกด
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  
  // ปุ่ม "+ ฝากเงิน" แบบขอบสีฟ้า
  depositBtn: { 
    flex: 1, 
    borderWidth: 1.5, 
    borderColor: '#007AFF', 
    backgroundColor: 'transparent', 
    padding: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  depositBtnText: { color: '#007AFF', fontWeight: 'bold', fontSize: 14 },
  
  // ปุ่ม "ลบ" แบบขอบสีแดง
  deleteBtn: { 
    borderWidth: 1.5, 
    borderColor: '#FF3B30', 
    backgroundColor: 'transparent', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  deleteBtnText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 14 },
});

const lightStyles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  text: { color: '#333' },
  subText: { color: '#444' },
  card: { backgroundColor: '#fff' },
});

const darkStyles = StyleSheet.create({
  container: { backgroundColor: '#121212' },
  text: { color: '#fff' },
  subText: { color: '#bbb' },
  card: { backgroundColor: '#1e1e1e' },
});