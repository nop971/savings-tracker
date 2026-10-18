import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: any; // เปลี่ยนจาก string เป็น any หรือ ColorValue เพื่อรองรับทุกประเภท
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'เป้าหมายการออม',
          tabBarIcon: ({ color }) => <TabBarIcon name="bullseye" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-goal"
        options={{
          title: 'เพิ่มเป้าหมาย',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}