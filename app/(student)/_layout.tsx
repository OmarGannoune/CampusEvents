import { Tabs } from 'expo-router';

import { BottomTabBar } from '@/components/student/BottomTabBar';

export default function StudentLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen name="events" />
      <Tabs.Screen name="favorites" />
      <Tabs.Screen name="registrations" />
      <Tabs.Screen name="assistant" />
    </Tabs>
  );
}
