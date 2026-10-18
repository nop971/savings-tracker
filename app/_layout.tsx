import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* ซ่อน Header ของกลุ่มหน้า Tabs ทั้งหมด */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* หน้า Modal (ถ้ามี) */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}