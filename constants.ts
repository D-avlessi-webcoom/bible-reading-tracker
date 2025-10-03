
import { Book, Testament } from './types';

export const BIBLE_BOOKS: Book[] = [
  // Ancien Testament
  { id: 1, name: 'Genèse', chapters: 50, testament: Testament.Old },
  { id: 2, name: 'Exode', chapters: 40, testament: Testament.Old },
  { id: 3, name: 'Lévitique', chapters: 27, testament: Testament.Old },
  { id: 4, name: 'Nombres', chapters: 36, testament: Testament.Old },
  { id: 5, name: 'Deutéronome', chapters: 34, testament: Testament.Old },
  { id: 6, name: 'Josué', chapters: 24, testament: Testament.Old },
  { id: 7, name: 'Juges', chapters: 21, testament: Testament.Old },
  { id: 8, name: 'Ruth', chapters: 4, testament: Testament.Old },
  { id: 9, name: '1 Samuel', chapters: 31, testament: Testament.Old },
  { id: 10, name: '2 Samuel', chapters: 24, testament: Testament.Old },
  { id: 11, name: '1 Rois', chapters: 22, testament: Testament.Old },
  { id: 12, name: '2 Rois', chapters: 25, testament: Testament.Old },
  { id: 13, name: '1 Chroniques', chapters: 29, testament: Testament.Old },
  { id: 14, name: '2 Chroniques', chapters: 36, testament: Testament.Old },
  { id: 15, name: 'Esdras', chapters: 10, testament: Testament.Old },
  { id: 16, name: 'Néhémie', chapters: 13, testament: Testament.Old },
  { id: 17, name: 'Esther', chapters: 10, testament: Testament.Old },
  { id: 18, name: 'Job', chapters: 42, testament: Testament.Old },
  { id: 19, name: 'Psaumes', chapters: 150, testament: Testament.Old },
  { id: 20, name: 'Proverbes', chapters: 31, testament: Testament.Old },
  { id: 21, name: 'Ecclésiaste', chapters: 12, testament: Testament.Old },
  { id: 22, name: 'Cantique des Cantiques', chapters: 8, testament: Testament.Old },
  { id: 23, name: 'Ésaïe', chapters: 66, testament: Testament.Old },
  { id: 24, name: 'Jérémie', chapters: 52, testament: Testament.Old },
  { id: 25, name: 'Lamentations', chapters: 5, testament: Testament.Old },
  { id: 26, name: 'Ézéchiel', chapters: 48, testament: Testament.Old },
  { id: 27, name: 'Daniel', chapters: 12, testament: Testament.Old },
  { id: 28, name: 'Osée', chapters: 14, testament: Testament.Old },
  { id: 29, name: 'Joël', chapters: 4, testament: Testament.Old },
  { id: 30, name: 'Amos', chapters: 9, testament: Testament.Old },
  { id: 31, name: 'Abdias', chapters: 1, testament: Testament.Old },
  { id: 32, name: 'Jonas', chapters: 4, testament: Testament.Old },
  { id: 33, name: 'Michée', chapters: 7, testament: Testament.Old },
  { id: 34, name: 'Nahum', chapters: 3, testament: Testament.Old },
  { id: 35, name: 'Habakuk', chapters: 3, testament: Testament.Old },
  { id: 36, name: 'Sophonie', chapters: 3, testament: Testament.Old },
  { id: 37, name: 'Aggée', chapters: 2, testament: Testament.Old },
  { id: 38, name: 'Zacharie', chapters: 14, testament: Testament.Old },
  { id: 39, name: 'Malachie', chapters: 3, testament: Testament.Old },
  // Nouveau Testament
  { id: 40, name: 'Matthieu', chapters: 28, testament: Testament.New },
  { id: 41, name: 'Marc', chapters: 16, testament: Testament.New },
  { id: 42, name: 'Luc', chapters: 24, testament: Testament.New },
  { id: 43, name: 'Jean', chapters: 21, testament: Testament.New },
  { id: 44, name: 'Actes des Apôtres', chapters: 28, testament: Testament.New },
  { id: 45, name: 'Romains', chapters: 16, testament: Testament.New },
  { id: 46, name: '1 Corinthiens', chapters: 16, testament: Testament.New },
  { id: 47, name: '2 Corinthiens', chapters: 13, testament: Testament.New },
  { id: 48, name: 'Galates', chapters: 6, testament: Testament.New },
  { id: 49, name: 'Éphésiens', chapters: 6, testament: Testament.New },
  { id: 50, name: 'Philippiens', chapters: 4, testament: Testament.New },
  { id: 51, name: 'Colossiens', chapters: 4, testament: Testament.New },
  { id: 52, 'name': '1 Thessaloniciens', chapters: 5, testament: Testament.New },
  { id: 53, 'name': '2 Thessaloniciens', chapters: 3, testament: Testament.New },
  { id: 54, 'name': '1 Timothée', chapters: 6, testament: Testament.New },
  { id: 55, 'name': '2 Timothée', chapters: 4, testament: Testament.New },
  { id: 56, 'name': 'Tite', chapters: 3, testament: Testament.New },
  { id: 57, 'name': 'Philémon', chapters: 1, testament: Testament.New },
  { id: 58, 'name': 'Hébreux', chapters: 13, testament: Testament.New },
  { id: 59, 'name': 'Jacques', chapters: 5, testament: Testament.New },
  { id: 60, 'name': '1 Pierre', chapters: 5, testament: Testament.New },
  { id: 61, 'name': '2 Pierre', chapters: 3, testament: Testament.New },
  { id: 62, 'name': '1 Jean', chapters: 5, testament: Testament.New },
  { id: 63, 'name': '2 Jean', chapters: 1, testament: Testament.New },
  { id: 64, 'name': '3 Jean', chapters: 1, testament: Testament.New },
  { id: 65, 'name': 'Jude', chapters: 1, testament: Testament.New },
  { id: 66, 'name': 'Apocalypse', chapters: 22, testament: Testament.New },
];

export const TOTAL_OT_CHAPTERS = BIBLE_BOOKS.filter(b => b.testament === Testament.Old).reduce((sum, book) => sum + book.chapters, 0);
export const TOTAL_NT_CHAPTERS = BIBLE_BOOKS.filter(b => b.testament === Testament.New).reduce((sum, book) => sum + book.chapters, 0);
export const TOTAL_BIBLE_CHAPTERS = TOTAL_OT_CHAPTERS + TOTAL_NT_CHAPTERS;

export const BOOKS_WITH_CUMULATIVE = BIBLE_BOOKS.map((book, index) => {
    const chaptersBefore = BIBLE_BOOKS.slice(0, index).reduce((sum, b) => sum + b.chapters, 0);
    const chaptersBeforeInOT = BIBLE_BOOKS.slice(0, index).filter(b => b.testament === Testament.Old).reduce((sum, b) => sum + b.chapters, 0);
    const chaptersBeforeInNT = BIBLE_BOOKS.slice(0, index).filter(b => b.testament === Testament.New).reduce((sum, b) => sum + b.chapters, 0);
    return { ...book, chaptersBefore, chaptersBeforeInOT, chaptersBeforeInNT };
});
