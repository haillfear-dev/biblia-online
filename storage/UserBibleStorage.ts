import AsyncStorage from '@react-native-async-storage/async-storage';
import { Favorite, Highlight, HighlightColor, Note, ReadingHistoryEntry, ReadingProgress } from '@/models/bible';
export interface UserBibleData { favorites: Favorite[]; highlights: Highlight[]; notes: Note[]; progress: ReadingProgress | null; history: ReadingHistoryEntry[] }
const KEY = '@biblia-online:user-bible:v1';
const empty: UserBibleData = { favorites: [], highlights: [], notes: [], progress: null, history: [] };
class UserBibleStorage {
  async getAll(): Promise<UserBibleData> { try { const value = await AsyncStorage.getItem(KEY); return value ? { ...empty, ...JSON.parse(value) as UserBibleData } : { ...empty }; } catch { return { ...empty }; } }
  private async update(transform: (data: UserBibleData) => UserBibleData) { const next = transform(await this.getAll()); await AsyncStorage.setItem(KEY, JSON.stringify(next)); return next; }
  toggleFavorite(verseId: string) { return this.update((data) => { const exists = data.favorites.some((item) => item.verseId === verseId); return { ...data, favorites: exists ? data.favorites.filter((item) => item.verseId !== verseId) : [...data.favorites, { id: `favorite:${verseId}`, verseId, createdAt: new Date().toISOString() }] }; }); }
  setHighlight(verseId: string, color: HighlightColor | null) { return this.update((data) => ({ ...data, highlights: color ? [...data.highlights.filter((item) => item.verseId !== verseId), { id: `highlight:${verseId}`, verseId, color, createdAt: new Date().toISOString() }] : data.highlights.filter((item) => item.verseId !== verseId) })); }
  saveNote(verseId: string, content: string) { const clean = content.trim(); return this.update((data) => { const current = data.notes.find((item) => item.verseId === verseId); const notes = data.notes.filter((item) => item.verseId !== verseId); if (!clean) return { ...data, notes }; const now = new Date().toISOString(); return { ...data, notes: [...notes, { id: current?.id ?? `note:${verseId}`, verseId, content: clean, createdAt: current?.createdAt ?? now, updatedAt: now }] }; }); }
  deleteNote(verseId: string) { return this.saveNote(verseId, ''); }
  recordReading(progress: Omit<ReadingProgress, 'updatedAt'>) { return this.update((data) => { const now = new Date().toISOString(); const latest = data.history[0]; const duplicate = latest?.bookId === progress.bookId && latest.chapter === progress.chapter; return { ...data, progress: { ...progress, updatedAt: now }, history: duplicate ? data.history : [{ bookId: progress.bookId, chapter: progress.chapter, accessedAt: now }, ...data.history].slice(0, 100) }; }); }
}
export const userBibleStorage = new UserBibleStorage();
