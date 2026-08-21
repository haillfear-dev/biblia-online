import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, spacing, typography } from '@/theme/tokens';
export default function Welcome() { return <Screen scroll={false} style={styles.screen}><View style={styles.mark}><Feather name="book-open" size={32} color={colors.ink} /></View><View><Text style={styles.title}>Uma palavra para cada dia.</Text><Text style={styles.body}>Leia, estude e leve a Palavra com você.</Text></View><View style={styles.footer}><PrimaryButton label="Começar" onPress={() => router.push('/onboarding/communication')} /><Text onPress={() => router.push('/onboarding/communication')} style={styles.account}>Já tenho uma conta</Text></View></Screen>; }
const styles = StyleSheet.create({ screen: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.huge }, mark: { alignSelf: 'flex-start', padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: 18 }, title: { ...typography.display, color: colors.ink, maxWidth: 360 }, body: { ...typography.body, color: colors.muted, marginTop: spacing.lg }, footer: { gap: spacing.lg }, account: { ...typography.caption, color: colors.muted, textAlign: 'center', padding: spacing.sm } });
