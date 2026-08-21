import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { mockVerses } from '@/constants/bible';
import { colors, spacing, typography } from '@/theme/tokens';
export default function Reader() { const { book, chapter } = useLocalSearchParams<{ book: string; chapter: string }>(); return <Screen><AppHeader title={`${book} ${chapter}`} subtitle="Leitura demonstrativa" back /><View style={styles.reader}>{mockVerses.map(verse => <Text key={verse.number} style={styles.verse}><Text style={styles.number}>{verse.number} </Text>{verse.text}</Text>)}</View><Text style={styles.note}>Conteúdo ilustrativo. A biblioteca bíblica completa será adicionada futuramente.</Text></Screen>; }
const styles = StyleSheet.create({ reader: { gap: spacing.lg }, verse: { fontSize: 19, lineHeight: 31, color: colors.ink }, number: { ...typography.caption, color: colors.gold }, note: { ...typography.caption, color: colors.muted, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border, paddingTop: spacing.lg, marginTop: spacing.xxl } });
