import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '@/components/AppHeader';
import { bibleRepository } from '@/repositories/BibleRepository';
import { userBibleStorage } from '@/storage/UserBibleStorage';
import { colors, radius, sizes, spacing, typography } from '@/theme/tokens';

export default function Chapters() {
  const { book: bookId } = useLocalSearchParams<{ book: string }>();
  const book = bibleRepository.getBook(bookId);
  const [firstChapter, setFirstChapter] = useState(1);
  const [loadedCount, setLoadedCount] = useState(1);
  const [pickerOpen, setPickerOpen] = useState(false);
  const chapters = useMemo(() => book ? Array.from({ length: loadedCount }, (_, index) => {
    const number = firstChapter + index;
    return { number, verses: bibleRepository.getChapter(book.id, number) };
  }) : [], [book, firstChapter, loadedCount]);

  useEffect(() => {
    if (!book || !chapters[0]?.verses.length) return;
    void userBibleStorage.recordReading({ versionId: book.versionId, bookId: book.id, chapter: firstChapter });
  }, [book, chapters, firstChapter]);

  if (!book) return <SafeAreaView style={styles.safe}><AppHeader title="Livro indisponível" back /><Text style={styles.message}>Não encontramos esse livro.</Text></SafeAreaView>;

  const selectChapter = (chapter: number) => { setFirstChapter(chapter); setLoadedCount(1); setPickerOpen(false); };
  const header = <View style={styles.header}><AppHeader title={book.name} back /><Pressable accessibilityRole="button" accessibilityLabel="Escolher capítulo" onPress={() => setPickerOpen(true)} style={styles.pickerButton}><Text style={styles.pickerText}>{firstChapter === 1 ? 'Escolher capítulo' : `Capítulo ${firstChapter}`}</Text><Feather name="chevron-down" size={18} color={colors.ink} /></Pressable></View>;

  return <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}><FlatList contentContainerStyle={styles.content} data={chapters} keyExtractor={(item) => String(item.number)} ListHeaderComponent={header} onEndReached={() => setLoadedCount((current) => Math.min(current + 1, book.chapterCount - firstChapter + 1))} onEndReachedThreshold={0.6} renderItem={({ item }) => <View style={styles.section}><Text style={styles.heading}>{book.name} {item.number}</Text>{item.verses.length ? item.verses.map((verse) => <Text key={verse.id} style={styles.verse}><Text style={styles.verseNumber}>{verse.verse} </Text>{verse.text}</Text>) : <Text style={styles.unavailable}>Texto ainda não importado. Consulte a documentação de proveniência.</Text>}</View>} />
    <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}><Pressable style={styles.overlay} onPress={() => setPickerOpen(false)}><Pressable accessibilityRole="none" style={styles.sheet} onPress={(event) => event.stopPropagation()}><View style={styles.sheetHandle} /><Text style={styles.sheetTitle}>{book.name}</Text><Text style={styles.sheetSubtitle}>Escolha um capítulo</Text><ScrollView contentContainerStyle={styles.chapterGrid} showsVerticalScrollIndicator={false}>{Array.from({ length: book.chapterCount }, (_, index) => index + 1).map((chapter) => <Pressable accessibilityRole="button" accessibilityLabel={`Capítulo ${chapter}`} key={chapter} onPress={() => selectChapter(chapter)} style={[styles.chapter, chapter === firstChapter && styles.chapterSelected]}><Text style={[styles.number, chapter === firstChapter && styles.numberSelected]}>{chapter}</Text></Pressable>)}</ScrollView></Pressable></Pressable></Modal>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.background }, content: { width: '100%', maxWidth: sizes.contentMax, alignSelf: 'center', padding: spacing.xl, paddingBottom: spacing.huge }, header: { marginBottom: spacing.sm }, pickerButton: { minHeight: 44, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md }, pickerText: { ...typography.body, color: colors.ink, fontWeight: '600' }, section: { marginTop: spacing.xl }, heading: { ...typography.heading, color: colors.ink, marginBottom: spacing.md }, verse: { fontSize: 19, lineHeight: 31, color: colors.ink, marginBottom: spacing.xs }, verseNumber: { ...typography.caption, color: colors.gold }, unavailable: { ...typography.body, color: colors.muted }, message: { ...typography.body, color: colors.muted, padding: spacing.xl }, overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }, sheet: { maxHeight: '78%', backgroundColor: colors.white, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl }, sheetHandle: { width: 40, height: 4, alignSelf: 'center', backgroundColor: colors.border, borderRadius: radius.pill, marginVertical: spacing.md }, sheetTitle: { ...typography.heading, color: colors.ink }, sheetSubtitle: { ...typography.body, color: colors.muted, marginTop: spacing.xs, marginBottom: spacing.lg }, chapterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.xl }, chapter: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.md }, chapterSelected: { backgroundColor: colors.ink }, number: { ...typography.body, color: colors.ink, fontWeight: '600' }, numberSelected: { color: colors.white } });
