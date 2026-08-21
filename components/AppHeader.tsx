import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, typography } from '@/theme/tokens';

export function AppHeader({ title, subtitle, back = false, action }: { title: string; subtitle?: string; back?: boolean; action?: string }) {
  return <View style={styles.wrap}><View style={styles.row}>{back && <Pressable accessibilityLabel="Voltar" onPress={() => router.back()} style={styles.back}><Feather name="arrow-left" size={22} color={colors.ink} /></Pressable>}<Text style={styles.title}>{title}</Text>{action && <Text style={styles.action}>{action}</Text>}</View>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}
const styles = StyleSheet.create({ wrap: { marginBottom: spacing.xl }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, back: { paddingVertical: spacing.sm }, title: { ...typography.title, color: colors.ink, flex: 1 }, action: { ...typography.caption, color: colors.gold }, subtitle: { ...typography.body, color: colors.muted, marginTop: spacing.sm } });
