import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
export function PrimaryButton({ label, onPress, secondary = false, disabled = false }: { label: string; onPress: () => void; secondary?: boolean; disabled?: boolean }) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary && styles.secondary, disabled && styles.disabled, pressed && styles.pressed]}><Text style={[styles.label, secondary && styles.secondaryLabel]}>{label}</Text></Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 54, backgroundColor: colors.black, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl }, secondary: { backgroundColor: colors.surface }, disabled: { opacity: 0.45 }, pressed: { opacity: 0.78 }, label: { ...typography.body, color: colors.white, fontWeight: '600' }, secondaryLabel: { color: colors.ink } });
