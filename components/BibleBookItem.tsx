import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, typography } from '@/theme/tokens';
export function BibleBookItem({ name, onPress }: { name: string; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.row}><Text style={styles.name}>{name}</Text><Feather name="chevron-right" size={19} color={colors.muted} /></Pressable>; }
const styles = StyleSheet.create({ row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, name: { ...typography.body, color: colors.ink, flex: 1 } });
