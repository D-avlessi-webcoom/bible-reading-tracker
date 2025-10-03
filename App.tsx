import React, { useState, useMemo, useCallback } from 'react';
import { BIBLE_BOOKS, BOOKS_WITH_CUMULATIVE, TOTAL_BIBLE_CHAPTERS, TOTAL_OT_CHAPTERS, TOTAL_NT_CHAPTERS } from './constants';
import { Testament, CalculationResults, Book } from './types';
import StatCard from './components/StatCard';
import BookOpenIcon from './components/icons/BookOpenIcon';
import TargetIcon from './components/icons/TargetIcon';
import CalendarIcon from './components/icons/CalendarIcon';

const getEndOfYear = () => {
  const today = new Date();
  return new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
};

const App: React.FC = () => {
  const [selectedBookId, setSelectedBookId] = useState<string>('');
  const [currentChapter, setCurrentChapter] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(getEndOfYear());
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);

  const selectedBook: Book | undefined = useMemo(() => BIBLE_BOOKS.find(b => b.id === parseInt(selectedBookId, 10)), [selectedBookId]);

  const oldTestamentBooks = useMemo(() => BIBLE_BOOKS.filter(book => book.testament === Testament.Old), []);
  const newTestamentBooks = useMemo(() => BIBLE_BOOKS.filter(book => book.testament === Testament.New), []);

  const handleCalculate = useCallback(() => {
    setError('');
    const bookId = parseInt(selectedBookId, 10);
    const chapterNum = parseInt(currentChapter, 10);

    if (!bookId || !chapterNum) {
      setError('Veuillez sélectionner un livre et un chapitre.');
      return;
    }
    if (!endDate) {
        setError('Veuillez sélectionner une date butoire.');
        return;
    }

    const bookWithData = BOOKS_WITH_CUMULATIVE.find(b => b.id === bookId);
    if (!bookWithData) {
      setError('Livre non trouvé.');
      return;
    }

    if (chapterNum <= 0 || chapterNum > bookWithData.chapters) {
      setError(`Le chapitre doit être entre 1 et ${bookWithData.chapters} pour ce livre.`);
      return;
    }

    const chaptersReadInCurrentBook = chapterNum - 1;
    let remainingInOT = 0;
    let remainingInNT = 0;

    if (bookWithData.testament === Testament.Old) {
      const chaptersReadInOT = bookWithData.chaptersBeforeInOT + chaptersReadInCurrentBook;
      remainingInOT = TOTAL_OT_CHAPTERS - chaptersReadInOT;
      remainingInNT = TOTAL_NT_CHAPTERS;
    } else {
      const chaptersReadInNT = bookWithData.chaptersBeforeInNT + chaptersReadInCurrentBook;
      const chaptersReadInOT = TOTAL_OT_CHAPTERS;
      remainingInOT = TOTAL_OT_CHAPTERS - chaptersReadInOT;
      remainingInNT = TOTAL_NT_CHAPTERS - chaptersReadInNT;
    }
    
    const chaptersReadInBible = bookWithData.chaptersBefore + chaptersReadInCurrentBook;
    const remainingInBible = TOTAL_BIBLE_CHAPTERS - chaptersReadInBible;

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to the start of the day
    const targetDate = new Date(endDate + 'T00:00:00');
    const daysLeft = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    setResults({
      remainingInBible,
      remainingInOT,
      remainingInNT,
      daysLeft,
      dailyGoalForBible: daysLeft > 0 ? Math.ceil(remainingInBible / daysLeft) : remainingInBible,
      dailyGoalForOT: daysLeft > 0 && remainingInOT > 0 ? Math.ceil(remainingInOT / daysLeft) : remainingInOT,
      dailyGoalForNT: daysLeft > 0 && remainingInNT > 0 ? Math.ceil(remainingInNT / daysLeft) : remainingInNT,
      endDate: targetDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
    });
    setShowResults(true);

  }, [selectedBookId, currentChapter, endDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-slate-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        <header className="my-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 tracking-tight">
            Bible Reading Tracker
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl">
            Suivez votre progression, calculez ce qu'il vous reste à lire et atteignez vos objectifs de lecture pour l'année.
          </p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl shadow-slate-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="book-select" className="block text-left text-sm font-medium text-slate-300 mb-2">Livre actuel</label>
              <select
                id="book-select"
                value={selectedBookId}
                onChange={(e) => {
                  setSelectedBookId(e.target.value);
                  setCurrentChapter('');
                  setResults(null);
                  setShowResults(false);
                }}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
              >
                <option value="" disabled>Sélectionnez un livre...</option>
                <optgroup label="Ancien Testament">
                  {oldTestamentBooks.map(book => (
                    <option key={book.id} value={book.id}>{book.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Nouveau Testament">
                  {newTestamentBooks.map(book => (
                    <option key={book.id} value={book.id}>{book.name}</option>
                  ))}
                </optgroup>
              </select>
            </div>
            <div>
              <label htmlFor="chapter-input" className="block text-left text-sm font-medium text-slate-300 mb-2">Chapitre</label>
              <input
                type="number"
                id="chapter-input"
                value={currentChapter}
                onChange={(e) => setCurrentChapter(e.target.value)}
                placeholder="Ex: 25"
                min="1"
                max={selectedBook?.chapters}
                disabled={!selectedBook}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none transition disabled:opacity-50"
              />
            </div>
             <div className="md:col-span-3">
               <label htmlFor="end-date" className="block text-left text-sm font-medium text-slate-300 mb-2">Date butoire</label>
                <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                />
            </div>
          </div>
          <button
            onClick={handleCalculate}
            disabled={!selectedBookId || !currentChapter}
            className="w-full mt-6 bg-amber-400 text-slate-900 font-bold py-3 px-8 rounded-md hover:bg-amber-300 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
          >
            Calculer ma progression
          </button>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {showResults && results && (
          <section className="mt-12 w-full animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    icon={<BookOpenIcon className="w-7 h-7" />} 
                    title="Chapitres restants" 
                    value={results.remainingInBible.toLocaleString()}
                    footer="Pour finir la Bible"
                    className="lg:col-span-3"
                />
                <StatCard 
                    icon={<BookOpenIcon className="w-6 h-6" />} 
                    title="Ancien Testament" 
                    value={results.remainingInOT.toLocaleString()}
                    footer="Chapitres restants"
                />
                <StatCard 
                    icon={<BookOpenIcon className="w-6 h-6" />} 
                    title="Nouveau Testament" 
                    value={results.remainingInNT.toLocaleString()}
                    footer="Chapitres restants"
                />
                 <StatCard 
                    icon={<CalendarIcon className="w-6 h-6" />} 
                    title="Jours restants" 
                    value={results.daysLeft.toLocaleString()}
                    footer={`Jusqu'au ${results.endDate}`}
                />
                <StatCard 
                    icon={<TargetIcon className="w-7 h-7" />} 
                    title="Objectif journalier" 
                    value={`${results.dailyGoalForBible}`}
                    footer="Chapitres/jour pour finir la Bible"
                    className="lg:col-span-3"
                />
                <StatCard 
                    icon={<TargetIcon className="w-6 h-6" />} 
                    title="Objectif A.T." 
                    value={`${results.dailyGoalForOT > 0 ? results.dailyGoalForOT : '-'}`}
                    footer="Chapitres/jour"
                />
                <StatCard 
                    icon={<TargetIcon className="w-6 h-6" />} 
                    title="Objectif N.T." 
                    value={`${results.dailyGoalForNT > 0 ? results.dailyGoalForNT : '-'}`}
                    footer="Chapitres/jour"
                />
             </div>
          </section>
        )}
      </main>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.7s ease-out forwards;
        }
        /* Style the date picker icon */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8) brightness(100%) sepia(100%) hue-rotate(330deg) saturate(300%);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default App;
