import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/AppHeader';
import { ChapterReader } from '@/components/ChapterReader';
import { bibleRepository } from '@/repositories/BibleRepository';
import { colors, radius, sizes, spacing, typography } from '@/theme/tokens';

export default function Chapters() {
  const { book: bookId } = useLocalSearchParams<{ book: string }>();
  const book = bibleRepository.getBook(bookId);
  const [chapter, setChapter] = useState(1);
  const [selectorOpen, setSelectorOpen] = useState(false);
  if (!book) return <SafeAreaView style={styles.safe}><AppHeader title="Livro indisponível" back /><Text style={styles.message}>Não encontramos esse livro.</Text></SafeAreaView>;
  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}><ScrollView contentContainerStyle={styles.content}><AppHeader title={book.name} back /><Pressable accessibilityRole="button" accessibilityLabel={`Capítulo ${chapter}. Escolher capítulo`} onPress={() => setSelectorOpen(true)} style={styles.selector}><Text style={styles.selectorText}>Capítulo {chapter}</Text><Feather name="chevron-down" size={18} color={colors.ink} /></Pressable><ChapterReader book={book} chapter={chapter} /></ScrollView><Modal visible={selectorOpen} transparent animationType="slide" onRequestClose={() => setSelectorOpen(false)}><Pressable style={styles.overlay} onPress={() => setSelectorOpen(false)}><Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}><View style={styles.handle} /><Text style={styles.sheetTitle}>{book.name}</Text><Text style={styles.sheetSubtitle}>Escolha um capítulo</Text><ScrollView contentContainerStyle={styles.grid}>{Array.from({ length: book.chapterCount }, (_, index) => index + 1).map((number) => <Pressable accessibilityRole="button" accessibilityState={{ selected: number === chapter }} key={number} onPress={() => { setChapter(number); setSelectorOpen(false); }} style={[styles.chapter, number === chapter && styles.chapterSelected]}><Text style={[styles.number, number === chapter && styles.numberSelected]}>{number}</Text></Pressable>)}</ScrollView></Pressable></Pressable></Modal></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { width: '100%', maxWidth: sizes.contentMax, alignSelf: 'center', padding: spacing.xl, paddingBottom: spacing.huge }, selector: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 44, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: spacing.lg, marginBottom: spacing.xl }, selectorText: { ...typography.body, color: colors.ink, fontWeight: '600' }, message: { ...typography.body, color: colors.muted, padding: spacing.xl }, overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }, sheet: { maxHeight: '72%', backgroundColor: colors.white, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, paddingBottom: spacing.huge }, handle: { width: 40, height: 4, alignSelf: 'center', borderRadius: radius.pill, backgroundColor: colors.border, marginBottom: spacing.lg }, sheetTitle: { ...typography.title, color: colors.ink }, sheetSubtitle: { ...typography.body, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.lg }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.xl }, chapter: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md }, chapterSelected: { backgroundColor: colors.ink }, number: { ...typography.body, color: colors.ink, fontWeight: '600' }, numberSelected: { color: colors.white } });
