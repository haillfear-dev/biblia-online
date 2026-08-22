import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import { colors, radius, spacing, typography } from '@/theme/tokens';
const authRoute = '/auth' as Href;
export default function Notifications() { const enter = () => router.replace(authRoute); return <Screen scroll={false} style={styles.screen}><View><Text style={styles.step}>3 de 3</Text><View style={styles.icon}><Feather name="sunrise" size={32} color={colors.gold} /></View><Text style={styles.title}>Seu versículo diário</Text><Text style={styles.body}>Comece o dia com uma passagem escolhida para você.</Text></View><View style={styles.footer}><PrimaryButton label="Ativar notificações" onPress={enter} /><PrimaryButton label="Agora não" onPress={enter} secondary /></View></Screen>; }
const styles = StyleSheet.create({ screen: { flex: 1, justifyContent: 'space-between', paddingVertical: spacing.huge }, step: { ...typography.caption, color: colors.gold, marginBottom: spacing.xxl }, icon: { width: 64, height: 64, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl }, title: { ...typography.display, color: colors.ink }, body: { ...typography.body, color: colors.muted, marginTop: spacing.lg }, footer: { gap: spacing.md } });
