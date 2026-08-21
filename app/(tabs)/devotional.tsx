import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { InfoCard } from '@/components/InfoCard';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing, typography } from '@/theme/tokens';
export default function Devotional() { return <Screen><AppHeader title="Devocional" /><View style={styles.hero}><Feather name="sun" size={27} color={colors.gold} /><Text style={styles.heroText}>Reserve alguns minutos para a Palavra.</Text></View><InfoCard title="Devocionais em breve" text="Estamos preparando planos de leitura e estudos para acompanhar você todos os dias." /></Screen>; }
const styles = StyleSheet.create({ hero: { minHeight: 190, backgroundColor: colors.black, borderRadius: radius.lg, padding: spacing.xl, justifyContent: 'space-between', marginBottom: spacing.xl }, heroText: { ...typography.title, color: colors.white, maxWidth: 320 } });
