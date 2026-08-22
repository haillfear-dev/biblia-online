import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { ChapterReader } from '@/components/ChapterReader';
import { Screen } from '@/components/Screen';
import { bibleRepository } from '@/repositories/BibleRepository';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function Reader() {
  const params = useLocalSearchParams<{ book: string; chapter: string; verse?: string }>();
  const chapter = Number(params.chapter);
  const book = bibleRepository.getBook(params.book);
  if (!book || !Number.isInteger(chapter) || chapter < 1 || chapter > (book?.chapterCount ?? 0)) {
    return <Screen><AppHeader title="Conteúdo indisponível" back /><Text style={styles.invalid}>Não foi possível abrir este capítulo.</Text></Screen>;
  }
  const previous = bibleRepository.getPreviousChapter(book.id, chapter);
  const next = bibleRepository.getNextChapter(book.id, chapter);
  const navigate = (location: { bookId: string; chapter: number }) => router.replace({ pathname: '/bible/[book]/[chapter]', params: { book: location.bookId, chapter: String(location.chapter) } });
  return <Screen><AppHeader title={`${book.name} ${chapter}`} subtitle="João Ferreira de Almeida 1911" back /><ChapterReader book={book} chapter={chapter} focusVerseId={params.verse} /><View style={styles.navigation}><Pressable disabled={!previous} onPress={() => previous && navigate(previous)} style={[styles.navButton, !previous && styles.disabled]}><Text style={styles.navText}>← Anterior</Text></Pressable><Pressable disabled={!next} onPress={() => next && navigate(next)} style={[styles.navButton, !next && styles.disabled]}><Text style={styles.navText}>Próximo →</Text></Pressable></View></Screen>;
}

const styles = StyleSheet.create({ invalid: { ...typography.body, color: colors.muted }, navigation: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, marginTop: spacing.xxl }, navButton: { minHeight: 48, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md }, navText: { ...typography.body, color: colors.ink, fontWeight: '600' }, disabled: { opacity: 0.35 } });
