import React, { useState } from 'react';
import { X, Plus, Book, Edit3, Copy, Trash2, Check, FileText, ArrowRight } from 'lucide-react';

export default function ManageBooksModal({
  isOpen,
  onClose,
  books,
  activeBookId,
  onSelectBook,
  onCreateBook,
  onDuplicateBook,
  onRenameBook,
  onDeleteBook
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  const handleStartRename = (book) => {
    setEditingId(book.id);
    setEditTitle(book.title || 'Untitled Book');
  };

  const handleSaveRename = (bookId) => {
    if (editTitle.trim()) {
      onRenameBook(bookId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content manage-books-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="text-accent" size={20} />
            <h3 className="modal-title">My Books Collection</h3>
          </div>
          <button className="action-icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-muted text-xs">
              Manage your book projects. Switch between books, rename them, or start a new book file.
            </p>
            <button 
              className="new-book-btn flex items-center gap-1.5"
              onClick={() => {
                onCreateBook();
                onClose();
              }}
            >
              <Plus size={14} />
              <span>New Book</span>
            </button>
          </div>

          {/* Book Cards Grid */}
          <div className="books-grid flex flex-col gap-2 max-h-80 overflow-y-auto pr-1">
            {books.map((b) => {
              const isActive = b.id === activeBookId;
              const isEditing = editingId === b.id;
              const sectionCount = b.bookData?.sections?.length || 0;
              const chapterCount = b.bookData?.sections?.filter(s => s.type === 'chapter')?.length || 0;

              return (
                <div 
                  key={b.id}
                  className={`book-card flex items-center justify-between p-3 border rounded-md transition-all ${
                    isActive ? 'active-book-card border-accent bg-accent-light' : 'hover:border-ui-border-hover'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText size={22} className={isActive ? 'text-accent' : 'text-muted'} />
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="text" 
                            className="rename-input"
                            value={editTitle} 
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(b.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                          />
                          <button className="action-icon-btn text-success" onClick={() => handleSaveRename(b.id)}>
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="book-title-text font-semibold text-sm truncate">
                            {b.title || 'Untitled Book'}
                          </span>
                          {isActive && <span className="active-badge">Active</span>}
                        </div>
                      )}

                      <span className="book-meta-text text-xs text-muted">
                        {b.author ? `By ${b.author} • ` : ''}{chapterCount} chapter{chapterCount !== 1 ? 's' : ''} ({sectionCount} total sections)
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-3">
                    {!isActive && (
                      <button 
                        className="select-book-btn flex items-center gap-1"
                        onClick={() => {
                          onSelectBook(b.id);
                          onClose();
                        }}
                        title="Open this book"
                      >
                        <span>Open</span>
                        <ArrowRight size={12} />
                      </button>
                    )}

                    <button 
                      className="action-icon-btn" 
                      onClick={() => handleStartRename(b)}
                      title="Rename book"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button 
                      className="action-icon-btn" 
                      onClick={() => onDuplicateBook(b.id)}
                      title="Duplicate book"
                    >
                      <Copy size={14} />
                    </button>

                    {books.length > 1 && (
                      <button 
                        className="action-icon-btn text-danger" 
                        onClick={() => {
                          if (confirm(`Delete "${b.title}"? This action cannot be undone.`)) {
                            onDeleteBook(b.id);
                          }
                        }}
                        title="Delete book"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
          .manage-books-modal-content {
            max-width: 580px;
            padding: 24px;
          }

          .new-book-btn {
            background-color: var(--ui-accent);
            color: white;
            padding: 6px 12px;
            border-radius: var(--ui-radius-sm);
            font-size: 12px;
            font-weight: 600;
          }

          .new-book-btn:hover {
            background-color: var(--ui-accent-hover);
          }

          .book-card {
            border: 1px solid var(--ui-border);
            background-color: var(--ui-bg);
          }

          .active-book-card {
            border-color: var(--ui-accent);
            background-color: var(--ui-accent-light, rgba(79, 70, 229, 0.05));
          }

          .active-badge {
            font-size: 10px;
            background-color: var(--ui-accent);
            color: white;
            padding: 1px 6px;
            border-radius: 99px;
            font-weight: 600;
          }

          .select-book-btn {
            background-color: var(--ui-panel-bg);
            border: 1px solid var(--ui-border);
            padding: 4px 10px;
            border-radius: var(--ui-radius-sm);
            font-size: 12px;
            font-weight: 500;
            color: var(--ui-text);
          }

          .select-book-btn:hover {
            border-color: var(--ui-accent);
            color: var(--ui-accent);
          }

          .rename-input {
            border: 1px solid var(--ui-accent);
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 13px;
            background-color: var(--ui-bg);
            color: var(--ui-text);
            width: 100%;
          }

          .text-danger {
            color: #ef4444;
          }
        `}</style>
      </div>
    </div>
  );
}
