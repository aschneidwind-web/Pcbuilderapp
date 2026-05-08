import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { color, font } from '../../theme'

type IconName = React.ComponentProps<typeof Ionicons>['name']

function icon(focused: boolean, base: IconName, filled: IconName) {
  return <Ionicons name={focused ? filled : base} size={24} color={focused ? color.primary : color.textTertiary} />
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: color.bgCard,
          borderTopColor: color.borderSubtle,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.textTertiary,
        tabBarLabelStyle: { fontSize: font.size.xs, marginBottom: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Build',
          tabBarIcon: ({ focused }) => icon(focused, 'construct-outline', 'construct'),
        }}
      />
      <Tabs.Screen
        name="compare"
        options={{
          title: 'Compare',
          tabBarIcon: ({ focused }) => icon(focused, 'bar-chart-outline', 'bar-chart'),
        }}
      />
      <Tabs.Screen
        name="saves"
        options={{
          title: 'Saves',
          tabBarIcon: ({ focused }) => icon(focused, 'bookmark-outline', 'bookmark'),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ focused }) => icon(focused, 'people-outline', 'people'),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => icon(focused, 'person-outline', 'person'),
        }}
      />
    </Tabs>
  )
}
