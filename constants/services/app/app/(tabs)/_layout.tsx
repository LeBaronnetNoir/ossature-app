import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Text } from 'react-native';

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    'Board': '📊', 'Crate': '📀', 'Scan': '📷', 'Pulse': '🔥', 'You': '👤'
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.4 }}>
      {icons[label] || '●'}
    </Text>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopColor: Colors.border2,
          borderTopWidth: 0.5,
          height: 80,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.muted2,
        tabBarLabelStyle: {
          fontSize: 10,
          letterSpacing: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'BOARD',
          tabBarIcon: ({ focused }) => <TabIcon label="Board" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'CRATE',
          tabBarIcon: ({ focused }) => <TabIcon label="Crate" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'SCAN',
          tabBarIcon: ({ focused }) => <TabIcon label="Scan" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="heatmap"
        options={{
          title: 'PULSE',
          tabBarIcon: ({ focused }) => <TabIcon label="Pulse" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'YOU',
          tabBarIcon: ({ focused }) => <TabIcon label="You" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
