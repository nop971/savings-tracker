import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { depositToGoal, fetchGoals, Goal } from '../services/goalService';

export default function DepositScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const goalId = params.id ? Number(params.id) : null;
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goalId) {
      loadGoalDetail();
    }
  }, [goalId]);

  const loadGoalDetail = async () => {
    try {
      const goals = await fetchGoals();
      const found = goals.find((g: Goal) => Number(g.id) === goalId);
      if (found) setGoal(found);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleConfirmDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกจำนวนเงินที่ถูกต้อง');
      return;
    }

    if (!goal) {
      Alert.alert('แจ้งเตือน', 'ไม่พบข้อมูลเป้าหมายการออม');
      return;
    }

    try {
      setLoading(true);
      await depositToGoal(goal.id, Number(amount), goal.current_amount);
      Alert.alert('สำเร็จ', `ฝากเงินจำนวน ฿${Number(amount).toLocaleString()} เรียบร้อยแล้ว!`, [
        { text: 'ตกลง', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ฝากเงินเข้าเป้าหมาย</Text>
      
      {goal ? (
        <View style={styles.card}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalAmount}>
            ยอดปัจจุบัน: ฿{goal.current_amount.toLocaleString()} / ฿{goal.target_amount.toLocaleString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.subText}>กำลังโหลดข้อมูลเป้าหมาย...</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="ระบุจำนวนเงินที่ต้องการฝาก (บาท)"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleConfirmDeposit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'กำลังบันทึก...' : 'ยืนยันการฝากเงิน'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20, elevation: 2 },
  goalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  goalAmount: { fontSize: 16, color: '#666' },
  subText: { textAlign: 'center', color: '#888', marginBottom: 20 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#99c2ff' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});