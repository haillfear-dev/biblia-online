import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppHeader } from '@/components/AppHeader';
import { BibleBookItem } from '@/components/BibleBookItem';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { bibleBooks } from '@/constants/bible';
import { colors, radius, spacing, typography } from '@/theme/tokens';
export default function Bible() { const open = (book: string) => router.push({ pathname: '/bible/[book]', params: { book } }); return <Screen><AppHeader title="Bíblia" action="Ler na íntegra" /><View style={styles.search}><Feather name="search" size={19} color={colors.muted} /><TextInput placeholder="Buscar livro, capítulo ou versículo" placeholderTextColor={colors.muted} style={styles.input} /></View><SectionHeader title="Antigo Testamento" />{bibleBooks.old.map(book => <BibleBookItem key={book} name={book} onPress={() => open(book)} />)}<SectionHeader title="Novo Testamento" />{bibleBooks.new.map(book => <BibleBookItem key={book} name={book} onPress={() => open(book)} />)}</Screen>; }
const styles = StyleSheet.create({ search: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, paddingHorizontal: spacing.lg }, input: { ...typography.body, flex: 1, color: colors.ink } });
