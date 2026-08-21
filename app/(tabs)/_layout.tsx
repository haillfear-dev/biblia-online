import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { colors, sizes, typography } from '@/theme/tokens';
const icons = { index: 'home', bible: 'book-open', devotional: 'sun', profile: 'user' } as const;
export default function TabLayout() { return <Tabs screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.ink, tabBarInactiveTintColor: colors.muted, tabBarStyle: { height: sizes.tabBar, borderTopColor: colors.border, backgroundColor: colors.white }, tabBarLabelStyle: { ...typography.caption, fontSize: 11, paddingBottom: 5 }, tabBarIcon: ({ color, size }) => <Feather name={icons[route.name as keyof typeof icons]} color={color} size={size} /> })}><Tabs.Screen name="index" options={{ title: 'Início' }} /><Tabs.Screen name="bible" options={{ title: 'Bíblia' }} /><Tabs.Screen name="devotional" options={{ title: 'Devocional' }} /><Tabs.Screen name="profile" options={{ title: 'Perfil' }} /></Tabs>; }
