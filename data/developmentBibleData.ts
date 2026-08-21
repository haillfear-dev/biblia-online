import { BibleBook, BibleVerse, BibleVersion } from '@/models/bible';
import { DEVELOPMENT_VERSION_ID, bibleBookMetadata } from '@/data/bookMetadata';

// Development-only, original sample prose. Replace this data source with a licensed full Bible later.
const versionId = DEVELOPMENT_VERSION_ID;
export const developmentBibleData: { versions: BibleVersion[]; books: BibleBook[]; verses: BibleVerse[] } = {
  versions: [{ id: versionId, name: 'Conteúdo demonstrativo', abbreviation: 'DEV', language: 'pt-BR' }],
  books: bibleBookMetadata,
  verses: [],
};
const samples: Record<string, string[][]> = {
  'GEN': [['No princípio, Deus deu início à criação.', 'A luz rompeu a escuridão, e o dia começou.', 'A criação revelou ordem, beleza e propósito.'], ['O descanso marcou a conclusão da obra.', 'A humanidade recebeu cuidado e responsabilidade.', 'A vida floresceu no jardim preparado.']],
  'PSA': [['Feliz é quem encontra direção na sabedoria.', 'Sua vida é como árvore junto às águas.', 'Em cada estação, persevera e produz fruto.'], ['A esperança sustenta o coração em dias difíceis.', 'A voz de Deus convida à confiança.', 'O caminho da paz permanece aberto.']],
  'MAT': [['Uma história de esperança atravessa gerações.', 'Cada nome recorda que Deus age no tempo.', 'A promessa aproxima pessoas e povos.'], ['Sábios seguiram a luz com alegria.', 'Eles chegaram para oferecer honra.', 'Depois, retornaram por um caminho seguro.']],
  'JHN': [['A Palavra estava no princípio com Deus.', 'Nela havia vida, e a vida era luz para todos.', 'A luz continua brilhando na escuridão.'], ['Uma celebração reuniu famílias e amigos.', 'A confiança abriu espaço para um novo sinal.', 'A alegria foi preservada entre os convidados.'], ['O amor de Deus alcança o mundo e oferece vida.', 'Quem acolhe a luz encontra esperança renovada.', 'A verdade liberta de toda condenação.'], ['Jesus parou junto ao poço durante a viagem.', 'Uma conversa simples atravessou antigas barreiras.', 'A água viva se tornou imagem de esperança.']],
  'ACT': [['Os discípulos permaneceram unidos em esperança.', 'Receberam coragem para testemunhar em muitos lugares.', 'A missão começou perto e alcançaria terras distantes.'], ['Um som encheu a casa onde estavam reunidos.', 'Pessoas de muitos povos ouviram uma mensagem de vida.', 'A comunidade cresceu em partilha e oração.']],
};
developmentBibleData.books.filter((book) => samples[book.id]).forEach((book) => samples[book.id].forEach((chapter, chapterIndex) => chapter.forEach((text, verseIndex) => developmentBibleData.verses.push({ id: `${versionId}-${book.id}-${chapterIndex + 1}-${verseIndex + 1}`, versionId, bookId: book.id, chapter: chapterIndex + 1, verse: verseIndex + 1, text }))));
