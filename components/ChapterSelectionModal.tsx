import React, { useEffect, useRef } from 'react';
import { Book } from '../types';
import XIcon from './icons/XIcon';

interface ChapterSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | undefined | null;
  selectedChapter: number | null;
  onSelectChapter: (chapter: number) => void;
}

const ChapterSelectionModal: React.FC<ChapterSelectionModalProps> = ({
  isOpen,
  onClose,
  book,
  selectedChapter,
  onSelectChapter,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && selectedChapter && gridRef.current) {
      const selectedButton = gridRef.current.querySelector<HTMLButtonElement>(`[data-chapter='${selectedChapter}']`);
      if (selectedButton) {
        // Use a timeout to ensure the element is visible before scrolling
        setTimeout(() => {
          selectedButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [isOpen, selectedChapter]);

  if (!isOpen || !book) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-modal-content"
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
      >
        <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2 id="modal-title" className="text-xl font-bold text-amber-400">
            Chapitres de {book.name}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-6 overflow-y-auto" ref={gridRef}>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: book.chapters }, (_, i) => i + 1).map((chapter) => (
              <button
                key={chapter}
                data-chapter={chapter}
                onClick={() => onSelectChapter(chapter)}
                className={`flex items-center justify-center aspect-square rounded-md text-sm font-semibold transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-400 ${
                  chapter === selectedChapter
                    ? 'bg-amber-400 text-slate-900'
                    : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                }`}
                aria-pressed={chapter === selectedChapter}
              >
                {chapter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterSelectionModal;
