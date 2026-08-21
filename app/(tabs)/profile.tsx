import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { InfoCard } from '@/components/InfoCard';
import { ProgressCard } from '@/components/ProgressCard';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, radius, spacing, typography } from '@/theme/tokens';
const metrics = [['Dias de leitura', '0'], ['Versículos lidos', '0'], ['Favoritos', '0'], ['Devocionais', '0']];
const shortcuts = ['Favoritos', 'Versículos grifados', 'Anotações', 'Histórico de leitura'];
export default function Profile() { return <Screen><AppHeader title="Perfil" /><View style={styles.identity}><View style={styles.avatar}><Feather name="user" size={32} color={colors.muted} /></View><Text style={styles.name}>Visitante</Text></View><ProgressCard /><View style={styles.metrics}>{metrics.map(([label, value]) => <View key={label} style={styles.metric}><Text style={styles.value}>{value}</Text><Text style={styles.label}>{label}</Text></View>)}</View><SectionHeader title="Sua biblioteca" /><View>{shortcuts.map(item => <View key={item} style={styles.shortcut}><Text style={styles.shortcutText}>{item}</Text><Feather name="chevron-right" size={19} color={colors.muted} /></View>)}</View><SectionHeader title="Ranking" /><InfoCard title="Em breve" text="Acompanhe seu progresso junto à comunidade em uma próxima etapa." /></Screen>; }
const styles = StyleSheet.create({ identity: { alignItems: 'center', marginBottom: spacing.xl }, avatar: { width: 76, height: 76, borderRadius: radius.pill, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }, name: { ...typography.heading, color: colors.ink, marginTop: spacing.md }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl }, metric: { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg }, value: { ...typography.title, color: colors.ink }, label: { ...typography.caption, color: colors.muted, marginTop: spacing.xs }, shortcut: { minHeight: 54, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }, shortcutText: { ...typography.body, flex: 1, color: colors.ink } });
