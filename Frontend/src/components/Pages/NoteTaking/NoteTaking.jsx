import {
    Trash2,
    Pin,
    Plus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const NoteTaking = () => {
    // Local storage state management for notes
    const [notes, setNotes] = useState(() => {
        try {
            const savedNotes = localStorage.getItem('pomodoro_note_taker_notes');
            if (savedNotes) {
                return JSON.parse(savedNotes);
            }
        } catch (e) {
            console.error("Failed to load notes from localStorage", e);
        }
    });

    // State for new note input box expansion
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const inputRef = useRef(null);

    // Save notes to LocalStorage whenever notes state changes
    useEffect(() => {
        try {
            localStorage.setItem('pomodoro_note_taker_notes', JSON.stringify(notes));
        } catch (e) {
            console.error("Failed to save notes to localStorage", e);
        }
    }, [notes]);

    const handleAddNote = () => {
        if (!title.trim() && !content.trim()) {
            setIsExpanded(false);
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            title: title.trim(),
            content: content.trim(),
            pinned: false,
            createdAt: new Date().toISOString()
        };

        setNotes([newNote, ...notes]);
        setTitle('');
        setContent('');
        setIsExpanded(false);
    };

    // Click outside listener to auto-close the create note form
    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                if (title.trim() || content.trim()) {
                    handleAddNote();
                } else {
                    setIsExpanded(false);
                }
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title, content]);


    const handleDeleteNote = (id, e) => {
        e.stopPropagation();
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleTogglePin = (id, e) => {
        e.stopPropagation();
        setNotes(notes.map(note =>
            note.id === id ? { ...note, pinned: !note.pinned } : note
        ));
    };

    const pinnedNotes = notes.filter(n => n.pinned);
    const otherNotes = notes.filter(n => !n.pinned);

    return (
        <div className="min-h-screen bg-[#1c1d22] text-gray-200 font-sans flex flex-col selection:bg-gray-700 selection:text-white">
            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col items-center">

                {/* Google Keep Input Bar */}
                <div
                    ref={inputRef}
                    className="w-full max-w-xl bg-[#282a30] rounded-xl border border-gray-700/60 shadow-lg overflow-hidden transition-all duration-200 mb-10"
                >
                    {isExpanded ? (
                        <div className="p-4 flex flex-col space-y-3">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-transparent text-white placeholder-gray-400 font-medium text-lg outline-none w-full"
                                autoFocus
                            />
                            <textarea
                                placeholder="Take a note..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={3}
                                className="bg-transparent text-gray-200 placeholder-gray-400 text-sm outline-none resize-none w-full leading-relaxed"
                            />
                            <div className="flex items-center justify-between pt-2 border-t border-gray-700/40">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    {/* <button type="button" title="Checklist" className="p-1.5 hover:bg-gray-700/50 rounded-full transition"><CheckSquare size={18} /></button>
                                    <button type="button" title="Draw" className="p-1.5 hover:bg-gray-700/50 rounded-full transition"><Edit3 size={18} /></button>
                                    <button type="button" title="Image" className="p-1.5 hover:bg-gray-700/50 rounded-full transition"><ImageIcon size={18} /></button> */}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTitle('');
                                            setContent('');
                                            setIsExpanded(false);
                                        }}
                                        className="px-4 py-1.5 text-xs font-semibold text-gray-300 hover:bg-gray-700/50 rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddNote}
                                        className="px-4 py-1.5 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 rounded-lg shadow transition"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsExpanded(true)}
                            className="flex items-center justify-between px-4 py-3 cursor-text text-gray-400"
                        >
                            <span className="text-sm font-medium">Take a note...</span>
                            <div className="flex items-center space-x-3 text-gray-400">
                                <button type="button" className="p-1 hover:text-gray-200 transition"><Plus size={18} /></button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full space-y-8">
                    {/* Pinned Notes Section */}
                    {pinnedNotes.length > 0 && (
                        <div>
                            <h2 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-1">
                                PINNED
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {pinnedNotes.map((note) => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        onDelete={handleDeleteNote}
                                        onTogglePin={handleTogglePin}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Notes Section */}
                    {otherNotes.length > 0 && (
                        <div>
                            {pinnedNotes.length > 0 && (
                                <h2 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3 px-1">
                                    OTHERS
                                </h2>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {otherNotes.map((note) => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        onDelete={handleDeleteNote}
                                        onTogglePin={handleTogglePin}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {notes.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            <p className="text-lg">No notes yet. Take a note above!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

function NoteCard({ note, onDelete, onTogglePin }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative bg-[#282a30] border border-gray-700/50 hover:border-gray-500/80 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between hover:shadow-xl break-inside-avoid"
        >
            <div>
                {/* Card Header (Title & Pin Button) */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    {note.title && (
                        <h3 className="font-semibold text-gray-100 text-base leading-tight wrap-break-word">
                            {note.title}
                        </h3>
                    )}
                    <button
                        onClick={(e) => onTogglePin(note.id, e)}
                        className={`p-1.5 rounded-full transition-opacity duration-200 ${note.pinned
                            ? 'text-yellow-400 opacity-100'
                            : 'text-gray-400 hover:text-gray-200 opacity-0 group-hover:opacity-100'
                            }`}
                        title={note.pinned ? "Unpin note" : "Pin note"}
                    >
                        <Pin size={16} className={note.pinned ? "fill-yellow-400" : ""} />
                    </button>
                </div>

                {/* Card Body Content */}
                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed wrap-break-word">
                    {note.content}
                </p>
            </div>

            {/* Card Footer Actions (Trash Icon visible on hover) */}
            <div className={`flex items-center justify-end mt-4 pt-2 border-t border-gray-700/30 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={(e) => onDelete(note.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                    title="Delete note"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}

export default NoteTaking;