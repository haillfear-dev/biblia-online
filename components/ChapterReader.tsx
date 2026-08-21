import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import type { ComponentProps } from 'react';
import { Modal, Pressable, Share, StyleSheet, Text, TextInput, View } from 'react-native';

import { BibleBook, BibleVerse, HighlightColor } from '@/models/bible';
import { bibleRepository } from '@/repositories/BibleRepository';
import { userBibleStorage } from '@/storage/UserBibleStorage';
import { colors, radius, spacing, typography } from '@/theme/tokens';

const swatches: { color: HighlightColor; label: string; value: string }[] = [
  { color: 'yellow', label: 'Amarelo', value: '#F6E7A8' },
  { color: 'green', label: 'Verde', value: '#CDE8CE' },
  { color: 'blue', label: 'Azul', value: '#CFE3F4' },
  { color: 'pink', label: 'Rosa', value: '#F2CDD9' },
];

export function ChapterReader({ book, chapter, focusVerseId }: { book: BibleBook; chapter: number; focusVerseId?: string }) {
  const verses = bibleRepository.getChapter(book.id, chapter);
  const [selected, setSelected] = useState<BibleVerse | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [highlights, setHighlights] = useState<Record<string, HighlightColor>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [colorsOpen, setColorsOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const loadActions = async () => {
    const data = await userBibleStorage.getAll();
    setFavorites(data.favorites.map((item) => item.verseId));
    setHighlights(Object.fromEntries(data.highlights.map((item) => [item.verseId, item.color])));
    setNotes(Object.fromEntries(data.notes.map((item) => [item.verseId, item.content])));
  };

  useEffect(() => {
    void loadActions();
    void userBibleStorage.recordReading({ versionId: book.versionId, bookId: book.id, chapter, verseId: focusVerseId });
  }, [book.id, book.versionId, chapter, focusVerseId]);

  const reference = selected ? bibleRepository.formatReference(selected) : '';
  const update = async (operation: Promise<unknown>) => { await operation; await loadActions(); };
  const close = () => { setSelected(null); setColorsOpen(false); setNoteOpen(false); };

  return <><View style={styles.reader}><Text style={styles.heading}>{book.name} {chapter}</Text>{verses.map((verse) => { const highlight = swatches.find((item) => item.color === highlights[verse.id])?.value; const selectedNow = selected?.id === verse.id || focusVerseId === verse.id; return <Pressable accessibilityRole="button" accessibilityLabel={`${bibleRepository.formatReference(verse)}. ${verse.text}`} accessibilityHint="Abre as ações do versículo" key={verse.id} onPress={() => setSelected(verse)} style={[styles.line, highlight ? { backgroundColor: highlight } : undefined, selectedNow && styles.selected]}><Text style={styles.verse}><Text style={styles.number}>{verse.verse} </Text>{verse.text}{favorites.includes(verse.id) ? <Text style={styles.marker}>  ♥</Text> : null}{notes[verse.id] ? <Text style={styles.marker}>  ✎</Text> : null}</Text></Pressable>; })}</View>
  <Modal visible={!!selected && !noteOpen} transparent animationType="slide" onRequestClose={close}><Pressable style={styles.overlay} onPress={close}><Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>{selected && <><Text style={styles.reference}>{reference}</Text><Text numberOfLines={3} style={styles.preview}>{selected.text}</Text>{colorsOpen ? <><Text style={styles.label}>Escolha uma cor</Text><View style={styles.colors}>{swatches.map((item) => <Pressable accessibilityRole="button" accessibilityLabel={`Grifar em ${item.label}`} key={item.color} onPress={() => void update(userBibleStorage.setHighlight(selected.id, item.color)).then(() => setColorsOpen(false))} style={[styles.swatch, { backgroundColor: item.value }, highlights[selected.id] === item.color && styles.swatchSelected]} />)}{highlights[selected.id] && <Pressable onPress={() => void update(userBibleStorage.setHighlight(selected.id, null)).then(() => setColorsOpen(false))} style={styles.remove}><Text style={styles.removeText}>Remover grifo</Text></Pressable>}</View></> : <View style={styles.actions}><Action icon="edit-3" label="Grifar" onPress={() => setColorsOpen(true)} /><Action icon="heart" filledHeart={favorites.includes(selected.id)} label={favorites.includes(selected.id) ? 'Desfavoritar' : 'Favoritar'} active={favorites.includes(selected.id)} onPress={() => void update(userBibleStorage.toggleFavorite(selected.id))} /><Action icon="share-2" label="Compartilhar" onPress={() => void Share.share({ message: `"${selected.text}"\n— ${reference}` })} /><Action icon="message-square" label="Anotar" active={Boolean(notes[selected.id])} onPress={() => { setNoteText(notes[selected.id] ?? ''); setNoteOpen(true); }} /></View>}<Pressable onPress={close} style={styles.close}><Text style={styles.closeText}>Fechar</Text></Pressable></>}</Pressable></Pressable></Modal>
  <Modal visible={noteOpen} transparent animationType="fade" onRequestClose={() => setNoteOpen(false)}><View style={styles.overlay}><View style={styles.noteSheet}><Text style={styles.reference}>Anotação · {reference}</Text><TextInput accessibilityLabel="Texto da anotação" multiline value={noteText} onChangeText={setNoteText} placeholder="Escreva sua reflexão..." style={styles.input} /><View style={styles.noteActions}>{selected && notes[selected.id] ? <Pressable onPress={() => void update(userBibleStorage.deleteNote(selected.id)).then(close)}><Text style={styles.delete}>Excluir</Text></Pressable> : null}<Pressable onPress={() => setNoteOpen(false)}><Text style={styles.cancel}>Cancelar</Text></Pressable><Pressable disabled={!noteText.trim()} onPress={() => selected && void update(userBibleStorage.saveNote(selected.id, noteText)).then(close)}><Text style={[styles.save, !noteText.trim() && styles.disabled]}>Salvar</Text></Pressable></View></View></View></Modal></>;
}

function Action({ icon, label, active, filledHeart, onPress }: { icon: ComponentProps<typeof Feather>['name']; label: string; active?: boolean; filledHeart?: boolean; onPress(): void }) { return <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[styles.action, active && styles.actionActive]}>{filledHeart ? <Text style={styles.filledHeart}>♥</Text> : <Feather name={icon} size={20} color={active ? colors.gold : colors.ink} />}<Text style={[styles.actionText, active && styles.actionTextActive]}>{label}</Text></Pressable>; }

const styles = StyleSheet.create({ reader: { gap: 2 }, heading: { ...typography.heading, color: colors.ink, marginBottom: spacing.md }, line: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, borderRadius: radius.sm }, selected: { borderWidth: 1, borderColor: colors.gold }, verse: { fontSize: 19, lineHeight: 31, color: colors.ink }, number: { ...typography.caption, color: colors.gold }, marker: { color: colors.gold, fontSize: 13 }, overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' }, sheet: { backgroundColor: colors.white, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, padding: spacing.xl, paddingBottom: spacing.xxl }, reference: { ...typography.heading, color: colors.ink }, preview: { ...typography.body, color: colors.muted, marginTop: spacing.sm }, label: { ...typography.caption, color: colors.muted, marginTop: spacing.lg }, colors: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md }, swatch: { width: 44, height: 44, borderRadius: radius.pill }, swatchSelected: { borderWidth: 3, borderColor: colors.ink }, remove: { padding: spacing.sm }, removeText: { ...typography.caption, color: colors.muted }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg }, action: { minHeight: 72, flexBasis: '47%', flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, backgroundColor: colors.surface, borderRadius: radius.md }, actionActive: { borderWidth: 1, borderColor: colors.gold }, actionText: { ...typography.caption, color: colors.ink }, actionTextActive: { color: colors.gold }, filledHeart: { color: colors.gold, fontSize: 22, lineHeight: 22 }, close: { alignItems: 'center', paddingTop: spacing.lg }, closeText: { ...typography.body, color: colors.muted }, noteSheet: { margin: spacing.xl, marginBottom: '40%', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl }, input: { minHeight: 130, textAlignVertical: 'top', ...typography.body, color: colors.ink, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg }, noteActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: spacing.lg, marginTop: spacing.lg }, delete: { ...typography.body, color: '#A33', marginRight: 'auto' }, cancel: { ...typography.body, color: colors.muted }, save: { ...typography.body, color: colors.gold, fontWeight: '600' }, disabled: { opacity: 0.4 } });
