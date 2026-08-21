import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing, typography } from '@/theme/tokens';
export default function Chapters() { const { book } = useLocalSearchParams<{ book: string }>(); return <Screen><AppHeader title={book ?? 'Livro'} subtitle="Escolha um capítulo" back /><View style={styles.grid}>{Array.from({ length: 10 }, (_, index) => index + 1).map(chapter => <Pressable key={chapter} style={styles.chapter} onPress={() => router.push({ pathname: '/bible/[book]/[chapter]', params: { book, chapter } })}><Text style={styles.number}>{chapter}</Text></Pressable>)}</View></Screen>; }
const styles = StyleSheet.create({ grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, chapter: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md }, number: { ...typography.body, color: colors.ink, fontWeight: '600' } });
