
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { BIBLE_BOOKS, BOOKS_WITH_CUMULATIVE, TOTAL_BIBLE_CHAPTERS, TOTAL_OT_CHAPTERS, TOTAL_NT_CHAPTERS } from './constants';
import { Testament, CalculationResults, Book } from './types';
import StatCard from './components/StatCard';
import BookOpenIcon from './components/icons/BookOpenIcon';
import TargetIcon from './components/icons/TargetIcon';
import CalendarIcon from './components/icons/CalendarIcon';
import ChapterSelectionModal from './components/ChapterSelectionModal';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOTIncluded, setIsOTIncluded] = useState<boolean>(true);
  const [isNTIncluded, setIsNTIncluded] = useState<boolean>(true);
  const resultsRef = useRef<HTMLElement>(null);

  const selectedBook: Book | undefined = useMemo(() => BIBLE_BOOKS.find(b => b.id === parseInt(selectedBookId, 10)), [selectedBookId]);

  const oldTestamentBooks = useMemo(() => BIBLE_BOOKS.filter(book => book.testament === Testament.Old), []);
  const newTestamentBooks = useMemo(() => BIBLE_BOOKS.filter(book => book.testament === Testament.New), []);
  
  useEffect(() => {
    if (showResults && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showResults]);

  const handleChapterSelect = (chapter: number) => {
    setCurrentChapter(String(chapter));
    setResults(null);
    setShowResults(false);
    setIsModalOpen(false);
  };

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
      remainingInNT = isNTIncluded ? TOTAL_NT_CHAPTERS : 0;
    } else { // New Testament book
      const chaptersReadInNT = bookWithData.chaptersBeforeInNT + chaptersReadInCurrentBook;
      remainingInNT = TOTAL_NT_CHAPTERS - chaptersReadInNT;
      remainingInOT = isOTIncluded ? 0 : TOTAL_OT_CHAPTERS;
    }
    
    const remainingInBible = remainingInOT + remainingInNT;

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

  }, [selectedBookId, currentChapter, endDate, isOTIncluded, isNTIncluded]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-slate-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      <main className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        <header className="my-10 animate-fade-in-slow">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 tracking-tight">
            Bible Reading Tracker
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl">
            Suivez votre progression, calculez ce qu'il vous reste à lire et atteignez vos objectifs de lecture pour l'année.
          </p>
        </header>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 sm:p-8 w-full max-w-3xl shadow-2xl shadow-slate-900/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
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
                  setIsOTIncluded(true);
                  setIsNTIncluded(true);
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
              <label htmlFor="chapter-select-button" className="block text-left text-sm font-medium text-slate-300 mb-2">Chapitre</label>
               <button
                  id="chapter-select-button"
                  onClick={() => setIsModalOpen(true)}
                  disabled={!selectedBook}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-md p-3 text-white focus:ring-2 focus:ring-amber-400 focus:outline-none transition disabled:opacity-50 text-left"
                >
                  {currentChapter ? `Chapitre ${currentChapter}` : 'Sélectionner...'}
                </button>
            </div>
            {selectedBook?.testament && (
              <div className="md:col-span-3 mt-2 flex items-center justify-between rounded-md p-3 bg-slate-900/50 border border-slate-700">
                <span className="text-sm font-medium text-slate-300 pr-4">
                  {selectedBook.testament === Testament.New
                    ? "Voulez-vous inclure l'ancien testament dans l'objectif ?"
                    : "Voulez-vous inclure le nouveau testament dans l'objectif ?"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedBook.testament === Testament.New) {
                      setIsOTIncluded(!isOTIncluded);
                    } else {
                      setIsNTIncluded(!isNTIncluded);
                    }
                  }}
                  className={`${
                    (selectedBook.testament === Testament.New && isOTIncluded) ||
                    (selectedBook.testament === Testament.Old && isNTIncluded)
                      ? 'bg-amber-400'
                      : 'bg-slate-600'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-800`}
                  role="switch"
                  aria-checked={selectedBook.testament === Testament.New ? isOTIncluded : isNTIncluded}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={`${
                      (selectedBook.testament === Testament.New && isOTIncluded) ||
                      (selectedBook.testament === Testament.Old && isNTIncluded)
                        ? 'translate-x-5'
                        : 'translate-x-0'
                    } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  />
                </button>
              </div>
            )}
             <div className="md:col-span-3">
               <label htmlFor="end-date" className="block text-left text-sm font-medium text-slate-300 mb-2">Date butoire</label>
                <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setResults(null);
                      setShowResults(false);
                    }}
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
        
        <section className="mt-12 w-full animate-fade-in-slow">
          <h2 className="text-2xl font-bold text-slate-200 mb-6 text-center">Un peu de motivation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-sky-900/40 to-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-sky-700/50 text-left transform transition-transform duration-300 hover:scale-105">
                <div className="flex items-center gap-4 mb-3">
                    <div className="bg-sky-800/50 p-3 rounded-lg text-sky-300">
                        <TargetIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-sky-200">Objectif N.T.</h3>
                </div>
                <p className="text-slate-300">
                    Finis le Nouveau Testament en <strong>90 jours</strong> en lisant seulement <strong>3 chapitres</strong> par jour !
                </p>
            </div>
            <div className="bg-gradient-to-br from-amber-900/40 to-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-amber-700/50 text-left transform transition-transform duration-300 hover:scale-105">
                 <div className="flex items-center gap-4 mb-3">
                    <div className="bg-amber-800/50 p-3 rounded-lg text-amber-300">
                        <BookOpenIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-200">La Bible entière</h3>
                </div>
                <p className="text-slate-300">
                    Lis la Bible en <strong>un an</strong> avec seulement <strong>~3.25 chapitres</strong> par jour. C'est possible !
                </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-indigo-700/50 text-left transform transition-transform duration-300 hover:scale-105">
                 <div className="flex items-center gap-4 mb-3">
                    <div className="bg-indigo-800/50 p-3 rounded-lg text-indigo-300">
                        <TargetIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-indigo-200">Objectif A.T.</h3>
                </div>
                <p className="text-slate-300">
                    L'Ancien Testament en <strong>10 mois</strong> ? Facile avec <strong>3 chapitres</strong> quotidiens.
                </p>
            </div>
          </div>
        </section>

        {showResults && results && (
          <section ref={resultsRef} className="mt-12 w-full animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    icon={<BookOpenIcon className="w-7 h-7" />} 
                    title="Chapitres restants (Objectif total)" 
                    value={results.remainingInBible.toLocaleString()}
                    footer="Pour finir votre objectif"
                    className="md:col-span-2"
                />
                <StatCard 
                    icon={<TargetIcon className="w-7 h-7" />} 
                    title="Objectif journalier (Total)" 
                    value={`${results.dailyGoalForBible}`}
                    footer="Chapitres/jour pour finir votre objectif"
                />
                <StatCard 
                    icon={<CalendarIcon className="w-6 h-6" />} 
                    title="Jours restants" 
                    value={results.daysLeft.toLocaleString()}
                    footer={`Jusqu'au ${results.endDate}`}
                />

                {results.remainingInOT > 0 && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
                     <h3 className="md:col-span-2 text-xl font-bold text-slate-200 text-left mb-2">Détails: Ancien Testament</h3>
                    <StatCard 
                        icon={<BookOpenIcon className="w-6 h-6" />} 
                        title="A.T. restant" 
                        value={results.remainingInOT.toLocaleString()}
                        footer="Chapitres restants"
                    />
                    <StatCard 
                        icon={<TargetIcon className="w-6 h-6" />} 
                        title="Objectif A.T." 
                        value={`${results.dailyGoalForOT > 0 ? results.dailyGoalForOT : '-'}`}
                        footer="Chapitres/jour"
                    />
                  </div>
                )}

                {results.remainingInNT > 0 && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
                    <h3 className="md:col-span-2 text-xl font-bold text-slate-200 text-left mb-2">Détails: Nouveau Testament</h3>
                    <StatCard 
                        icon={<BookOpenIcon className="w-6 h-6" />} 
                        title="N.T. restant" 
                        value={results.remainingInNT.toLocaleString()}
                        footer="Chapitres restants"
                    />
                    <StatCard 
                        icon={<TargetIcon className="w-6 h-6" />} 
                        title="Objectif N.T." 
                        value={`${results.dailyGoalForNT > 0 ? results.dailyGoalForNT : '-'}`}
                        footer="Chapitres/jour"
                    />
                  </div>
                )}
             </div>
          </section>
        )}
      </main>
      <ChapterSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          book={selectedBook}
          selectedChapter={currentChapter ? parseInt(currentChapter, 10) : null}
          onSelectChapter={handleChapterSelect}
      />
      <style>{`
        @keyframes simple-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modal-backdrop {
          animation: simple-fade-in 0.3s ease-out forwards;
        }
        .animate-modal-content {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in-up 0.7s ease-out forwards;
        }
        .animate-fade-in-slow {
          animation: fade-in-up 0.9s ease-out forwards;
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
