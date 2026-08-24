import React, { useState } from 'react';
import { 
  BookOpen, Settings, Palette, Download, Layout, 
  BarChart2, Sun, Moon, Plus, Undo2, Redo2, 
  HelpCircle, ChevronDown, Check, FolderOpen, Save, FileText,
  Scissors, Copy, ClipboardPaste, AlignJustify, Keyboard, BookMarked
} from 'lucide-react';

export default function TopNav({ 
  darkMode, 
  setDarkMode, 
  onOpenSetup, 
  onOpenThemes, 
  onOpenDesigner, 
  onOpenExport, 
  onOpenStats,
  onOpenManageBooks,
  onAddChapter,
  onNewProject,
  onOpenProject,
  onSaveDraftLocal,
  onDownloadDraft,
  onToggleJustification,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  autosaveStatus
}) {
  const [activeMenu, setActiveMenu] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  const toggleMenu = (menuName) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const handleMenuAction = (action) => {
    setActiveMenu(null);
    action();
  };

  const handleCut = () => {
    try {
      document.execCommand('cut');
    } catch {
      const sel = window.getSelection();
      if (sel && sel.toString()) {
        navigator.clipboard.writeText(sel.toString());
        const range = sel.getRangeAt(0);
        range.deleteContents();
      }
    }
  };

  const handleCopy = () => {
    try {
      document.execCommand('copy');
    } catch {
      const sel = window.getSelection();
      if (sel && sel.toString()) {
        navigator.clipboard.writeText(sel.toString());
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch {
      alert('Paste is not available via menu in this browser.\nPlease use Ctrl+V (or Cmd+V on Mac) to paste.');
    }
  };

  const menus = {
    File: [
      { label: 'My Books Collection...', icon: BookOpen, action: onOpenManageBooks, shortcut: 'Ctrl+B' },
      { label: 'New Book Project', icon: FileText, action: onNewProject, shortcut: 'Ctrl+Shift+N' },
      { label: 'Open / Import Document...', icon: FolderOpen, action: onOpenProject, shortcut: 'Ctrl+O' },
      { label: 'Save Draft Locally', icon: Save, action: onSaveDraftLocal, shortcut: 'Ctrl+S' },
      { divider: true },
      { label: 'Download as JSON Backup', icon: Download, action: () => onDownloadDraft('json') },
      { label: 'Download as Word Document (.docx)', icon: Download, action: () => onDownloadDraft('docx') },
      { label: 'Download as Markdown (.md)', icon: Download, action: () => onDownloadDraft('md') },
      { label: 'Download as Plain Text (.txt)', icon: Download, action: () => onDownloadDraft('txt') },
      { label: 'Download as Web Page (.html)', icon: Download, action: () => onDownloadDraft('html') },
      { divider: true },
      { label: 'Book Setup...', icon: Settings, action: onOpenSetup },
      { label: 'Export Book...', icon: Download, action: onOpenExport, shortcut: 'Ctrl+E' }
    ],
    Edit: [
      { label: 'Undo', icon: Undo2, action: onUndo, disabled: !canUndo, shortcut: 'Ctrl+Z' },
      { label: 'Redo', icon: Redo2, action: onRedo, disabled: !canRedo, shortcut: 'Ctrl+Y' },
      { divider: true },
      { label: 'Cut', icon: Scissors, action: handleCut, shortcut: 'Ctrl+X' },
      { label: 'Copy', icon: Copy, action: handleCopy, shortcut: 'Ctrl+C' },
      { label: 'Paste', icon: ClipboardPaste, action: handlePaste, shortcut: 'Ctrl+V' }
    ],
    Insert: [
      { label: 'Add Chapter', icon: Plus, action: onAddChapter },
      { label: 'Insert Scene Break', action: () => document.execCommand('insertHTML', false, '<div class="scene-break" data-type="divider">❦</div>') }
    ],
    Book: [
      { label: 'My Books Collection...', icon: BookOpen, action: onOpenManageBooks },
      { label: 'Configure Book Layout...', icon: Settings, action: onOpenSetup },
      { label: 'Theme Gallery...', icon: Palette, action: onOpenThemes },
      { label: 'Chapter Designer...', icon: Layout, action: onOpenDesigner }
    ],
    Style: [
      { label: 'Typography Adjustments...', icon: Layout, action: onOpenDesigner },
      { label: 'Toggle Justification', icon: AlignJustify, action: onToggleJustification }
    ],
    Export: [
      { label: 'Export to PDF (Print)', icon: Download, action: onOpenExport },
      { label: 'Export to EPUB', icon: Download, action: onOpenExport },
      { label: 'Export to DOCX', icon: Download, action: onOpenExport }
    ],
    Help: [
      { label: 'Keyboard Shortcuts', icon: Keyboard, action: () => setShowShortcuts(true) },
      { label: 'About InkForge', icon: BookMarked, action: () => setShowShortcuts('about') }
    ]
  };

  return (
    <div className="top-nav-container">
      {/* Menu Bar */}
      <div className="menu-bar">
        <div className="brand flex items-center gap-2">
          <div className="brand-logo">❦</div>
          <span className="brand-name">InkForge</span>
          <span className="brand-badge">2026</span>
        </div>
        
        <div className="menus-list flex">
          {Object.keys(menus).map((menuName) => (
            <div key={menuName} className="menu-item-wrapper" style={{ position: 'relative' }}>
              <button 
                className={`menu-trigger-btn ${activeMenu === menuName ? 'active' : ''}`}
                onClick={() => toggleMenu(menuName)}
              >
                {menuName}
              </button>
              
              {activeMenu === menuName && (
                <div className="dropdown-menu">
                  {menus[menuName].map((item, idx) => {
                    if (item.divider) {
                      return <div key={idx} className="dropdown-divider" />;
                    }
                    const Icon = item.icon;
                    return (
                      <button 
                        key={idx} 
                        className={`dropdown-item ${item.disabled ? 'disabled' : ''}`}
                        onClick={() => !item.disabled && handleMenuAction(item.action)}
                        disabled={item.disabled}
                      >
                        <span className="dropdown-item-left flex items-center gap-2">
                          {Icon && <Icon size={14} className="dropdown-item-icon" />}
                          <span>{item.label}</span>
                        </span>
                        {item.shortcut && (
                          <span className="dropdown-shortcut">{item.shortcut}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="top-nav-right flex items-center gap-3">
          <div className={`autosave-indicator flex items-center gap-1.5 ${autosaveStatus === 'saving' ? 'saving' : ''}`}>
            <span className="autosave-dot"></span>
            <span className="autosave-text">
              {autosaveStatus === 'saved' && 'Autosaved'}
              {autosaveStatus === 'saving' && 'Saving...'}
              {autosaveStatus === 'idle' && 'All changes saved'}
            </span>
          </div>

          <button 
            className="theme-toggle-btn"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle Light/Dark Workspace"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-group flex items-center gap-1">
          <button className="toolbar-btn flex items-center gap-1.5 font-medium" onClick={onOpenManageBooks} title="Manage Books Collection">
            <BookOpen size={16} className="text-accent" />
            <span>My Books</span>
          </button>
          
          <button className="toolbar-btn text-accent flex items-center gap-1.5" onClick={onAddChapter} title="Add New Chapter">
            <Plus size={16} />
            <span>Chapter</span>
          </button>
        </div>
        
        <div className="toolbar-separator" />
        
        <div className="toolbar-group flex items-center gap-1">
          <button className="toolbar-btn" onClick={onOpenThemes} title="Open Theme Gallery">
            <Palette size={16} />
            <span>Theme Gallery</span>
          </button>
          
          <button className="toolbar-btn" onClick={onOpenDesigner} title="Open Chapter Designer">
            <Layout size={16} />
            <span>Chapter Designer</span>
          </button>

          <button className="toolbar-btn" onClick={onOpenSetup} title="Open Book Layout Settings">
            <Settings size={16} />
            <span>Book Setup</span>
          </button>
        </div>

        <div className="toolbar-separator" />

        <div className="toolbar-group flex items-center gap-1">
          <button className="toolbar-btn" onClick={onOpenStats} title="View Book Statistics & Calculators">
            <BarChart2 size={16} />
            <span>Stats & Pricing</span>
          </button>
          
          <button className="toolbar-btn btn-primary" onClick={onOpenExport} title="Export Book">
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Click-away listener for menus */}
      {activeMenu && (
        <div 
          className="menu-backdrop" 
          onClick={() => setActiveMenu(null)} 
        />
      )}

      {/* Keyboard Shortcuts / About Modal */}
      {showShortcuts && (
        <div className="modal-overlay" onClick={() => setShowShortcuts(false)}>
          <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header flex items-center justify-between">
              <h3 className="modal-title">
                {showShortcuts === 'about' ? 'About InkForge' : 'Keyboard Shortcuts'}
              </h3>
              <button className="action-icon-btn" onClick={() => setShowShortcuts(false)}>✕</button>
            </div>
            <div className="modal-body">
              {showShortcuts === 'about' ? (
                <div className="about-content">
                  <div className="about-brand flex items-center gap-2 mb-3">
                    <span style={{ fontSize: '24px', color: 'var(--ui-accent)' }}>❦</span>
                    <span style={{ fontSize: '18px', fontWeight: 700 }}>InkForge</span>
                    <span className="brand-badge">2026</span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                    InkForge is a professional book formatting application inspired by Vellum.
                    Design beautiful print-ready books with 25 premium themes, live page previews,
                    and full typography control — all in your browser.
                  </p>
                  <div className="shortcut-divider" />
                  <p className="text-muted" style={{ fontSize: '12px' }}>
                    Built with React & Vite. All data saved locally in your browser.
                  </p>
                </div>
              ) : (
                <div className="shortcuts-grid">
                  <div className="shortcut-section">
                    <h4 className="shortcut-section-title">General</h4>
                    <div className="shortcut-row"><span>New Project</span><kbd>Ctrl+Shift+N</kbd></div>
                    <div className="shortcut-row"><span>Open Project</span><kbd>Ctrl+O</kbd></div>
                    <div className="shortcut-row"><span>Save & Download</span><kbd>Ctrl+S</kbd></div>
                    <div className="shortcut-row"><span>Export</span><kbd>Ctrl+E</kbd></div>
                  </div>
                  <div className="shortcut-section">
                    <h4 className="shortcut-section-title">Editing</h4>
                    <div className="shortcut-row"><span>Undo</span><kbd>Ctrl+Z</kbd></div>
                    <div className="shortcut-row"><span>Redo</span><kbd>Ctrl+Y</kbd></div>
                    <div className="shortcut-row"><span>Bold</span><kbd>Ctrl+B</kbd></div>
                    <div className="shortcut-row"><span>Italic</span><kbd>Ctrl+I</kbd></div>
                    <div className="shortcut-row"><span>Cut</span><kbd>Ctrl+X</kbd></div>
                    <div className="shortcut-row"><span>Copy</span><kbd>Ctrl+C</kbd></div>
                    <div className="shortcut-row"><span>Paste</span><kbd>Ctrl+V</kbd></div>
                  </div>
                  <div className="shortcut-section">
                    <h4 className="shortcut-section-title">Editor Shortcuts</h4>
                    <div className="shortcut-row"><span>Heading (H2)</span><kbd># + Space</kbd></div>
                    <div className="shortcut-row"><span>Heading (H3)</span><kbd>## + Space</kbd></div>
                    <div className="shortcut-row"><span>Bullet List</span><kbd>* + Space</kbd></div>
                    <div className="shortcut-row"><span>Blockquote</span><kbd>&gt; + Space</kbd></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .top-nav-container {
          background-color: var(--ui-panel-bg);
          border-bottom: 1px solid var(--ui-border);
          display: flex;
          flex-direction: column;
          z-index: 50;
          position: relative;
        }

        .menu-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 16px;
          height: 36px;
          border-bottom: 1px solid var(--ui-border);
          font-size: 13px;
        }

        .brand {
          font-weight: 600;
          color: var(--ui-text);
        }

        .brand-logo {
          color: var(--ui-accent);
          font-size: 16px;
        }

        .brand-badge {
          font-size: 10px;
          background: var(--ui-accent-light);
          color: var(--ui-accent);
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 500;
        }

        .menus-list {
          margin-left: 24px;
          gap: 4px;
        }

        .menu-trigger-btn {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 13px;
          color: var(--ui-text);
        }

        .menu-trigger-btn:hover, .menu-trigger-btn.active {
          background-color: var(--ui-border);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--ui-bg);
          border: 1px solid var(--ui-border);
          box-shadow: var(--ui-shadow-lg);
          border-radius: 6px;
          padding: 4px;
          width: 260px;
          display: flex;
          flex-direction: column;
          z-index: 100;
          margin-top: 4px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 6px 12px;
          font-size: 13px;
          text-align: left;
          border-radius: 4px;
          width: 100%;
          color: var(--ui-text);
        }

        .dropdown-item-left {
          display: flex;
          align-items: center;
        }

        .dropdown-shortcut {
          font-size: 11px;
          color: var(--ui-text-muted);
          opacity: 0.6;
          font-family: inherit;
        }

        .dropdown-item:hover:not(.disabled) {
          background-color: var(--ui-accent-light);
          color: var(--ui-accent);
        }

        .dropdown-item:hover:not(.disabled) .dropdown-shortcut {
          color: var(--ui-accent);
          opacity: 0.7;
        }

        .dropdown-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .dropdown-item-icon {
          opacity: 0.8;
        }

        .dropdown-divider {
          height: 1px;
          background-color: var(--ui-border);
          margin: 4px 0;
        }

        .menu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 49;
        }

        .top-nav-right {
          color: var(--ui-text-muted);
        }

        .autosave-indicator {
          font-size: 11px;
          color: var(--ui-text-muted);
        }

        .autosave-dot {
          width: 6px;
          height: 6px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
        }

        .autosave-indicator.saving .autosave-dot {
          background-color: var(--ui-accent);
          animation: pulse 1s infinite alternate;
        }

        .theme-toggle-btn {
          color: var(--ui-text-muted);
          padding: 4px;
          border-radius: 4px;
        }

        .theme-toggle-btn:hover {
          background-color: var(--ui-border);
          color: var(--ui-text);
        }

        /* Toolbar styles */
        .toolbar {
          height: 44px;
          padding: 0 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background-color: var(--ui-bg);
        }

        .toolbar-group {
          display: flex;
          align-items: center;
        }

        .toolbar-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 500;
          color: var(--ui-text);
          border-radius: 6px;
          border: 1px solid transparent;
        }

        .toolbar-btn:hover {
          background-color: var(--ui-panel-bg);
          border-color: var(--ui-border);
        }

        .toolbar-btn.text-accent {
          color: var(--ui-accent);
        }

        .toolbar-btn.text-accent:hover {
          background-color: var(--ui-accent-light);
          border-color: var(--ui-accent);
        }

        .btn-primary {
          background-color: var(--ui-accent);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--ui-accent-hover);
          border-color: transparent;
        }

        .toolbar-separator {
          width: 1px;
          height: 20px;
          background-color: var(--ui-border);
        }

        /* Shortcuts Modal */
        .shortcuts-modal {
          max-width: 520px;
          padding: 24px;
        }

        .shortcuts-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .shortcut-section-title {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--ui-text-muted);
          margin-bottom: 8px;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--ui-border);
        }

        .shortcut-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0;
          font-size: 13px;
          color: var(--ui-text);
        }

        .shortcut-row kbd {
          font-family: inherit;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 4px;
          background-color: var(--ui-panel-bg);
          border: 1px solid var(--ui-border);
          color: var(--ui-text-muted);
        }

        .shortcut-divider {
          height: 1px;
          background-color: var(--ui-border);
          margin: 12px 0;
        }

        .about-content {
          padding: 8px 0;
        }
      `}</style>
    </div>
  );
}
