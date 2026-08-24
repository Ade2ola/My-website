import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Heading1, Heading2, Quote, 
  List, ListOrdered, Sparkles, Search, 
  Check, X, RefreshCw
} from 'lucide-react';

export default function Editor({ 
  section, 
  onChangeContent, 
  onChangeTitle,
  dividerSymbol 
}) {
  const editorRef = useRef(null);
  const [stats, setStats] = useState({ words: 0, characters: 0, readingTime: 0 });
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Load editor content on mount or when section changes
  useEffect(() => {
    if (editorRef.current && section) {
      if (editorRef.current.innerHTML !== section.content) {
        editorRef.current.innerHTML = section.content;
      }
    }
  }, [section?.id]);

  // Calculate statistics from editor innerText
  const updateStats = () => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    const words = cleanText === '' ? 0 : cleanText.split(/\s+/).length;
    const characters = text.length;
    const readingTime = Math.ceil(words / 200); // 200 wpm average reading speed

    setStats({ words, characters, readingTime });
  };

  useEffect(() => {
    updateStats();
  }, [section?.content]);

  // Handle typing and change notification
  const handleInput = (e) => {
    const html = e.currentTarget.innerHTML;
    onChangeContent(section.id, html);
    updateStats();
  };

  // Keyboard shortcut or Markdown command processor
  const handleKeyDown = (e) => {
    if (e.key === ' ' && editorRef.current) {
      // Check active element text block
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      const range = selection.getRangeAt(0);
      const textNode = range.startContainer;
      
      if (textNode.nodeType === Node.TEXT_NODE) {
        const text = textNode.nodeValue;
        const caretPos = range.startOffset;
        const textBeforeCaret = text.slice(0, caretPos);

        // Check for markdown shortcuts
        if (textBeforeCaret === '#') {
          e.preventDefault();
          // Remove shortcut characters
          textNode.nodeValue = text.slice(caretPos);
          document.execCommand('formatBlock', false, 'h2');
        } else if (textBeforeCaret === '##') {
          e.preventDefault();
          textNode.nodeValue = text.slice(caretPos);
          document.execCommand('formatBlock', false, 'h3');
        } else if (textBeforeCaret === '>') {
          e.preventDefault();
          textNode.nodeValue = text.slice(caretPos);
          document.execCommand('formatBlock', false, 'blockquote');
        } else if (textBeforeCaret === '*' || textBeforeCaret === '-') {
          e.preventDefault();
          textNode.nodeValue = text.slice(caretPos);
          document.execCommand('insertUnorderedList', false, null);
        } else if (textBeforeCaret === '1.') {
          e.preventDefault();
          textNode.nodeValue = text.slice(caretPos);
          document.execCommand('insertOrderedList', false, null);
        }
      }
    }
  };

  // Formatting Actions
  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChangeContent(section.id, editorRef.current.innerHTML);
    }
  };

  const insertSceneBreak = () => {
    const symbol = dividerSymbol || '❦';
    const breakHtml = `<div class="scene-break" data-type="divider" style="text-align: center; margin: 32px 0; font-size: 18px; user-select: none;">${symbol}</div><p><br></p>`;
    applyFormat('insertHTML', breakHtml);
  };

  // Find and Replace Logic
  const handleFind = () => {
    if (!findText) {
      setMatchCount(0);
      return;
    }
    const html = editorRef.current.innerHTML;
    // Simple mock highlighting or counting
    const regex = new RegExp(findText, 'gi');
    const matches = html.match(regex);
    setMatchCount(matches ? matches.length : 0);
  };

  const handleReplace = (replaceAll = false) => {
    if (!findText || !editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const regex = new RegExp(findText, replaceAll ? 'gi' : 'i');
    const newHtml = html.replace(regex, replaceText);
    editorRef.current.innerHTML = newHtml;
    onChangeContent(section.id, newHtml);
    updateStats();
    handleFind();
  };

  if (!section) {
    return (
      <div className="editor-empty flex flex-col items-center justify-center flex-1">
        <Sparkles size={48} className="text-muted mb-3" />
        <h3>Select a Chapter or Section</h3>
        <p className="text-muted">Pick a section from the left sidebar to start editing.</p>
      </div>
    );
  }

  return (
    <div className="center-editor flex flex-col flex-1">
      {/* Editor Header / Title Input */}
      <div className="editor-header flex items-center justify-between">
        <input 
          type="text" 
          className="editor-title-input" 
          value={section.title}
          onChange={(e) => onChangeTitle(section.id, e.target.value)}
          placeholder="Untitled Section"
        />
        
        <button 
          className={`find-replace-trigger ${showFindReplace ? 'active' : ''}`}
          onClick={() => setShowFindReplace(!showFindReplace)}
          title="Find and Replace"
        >
          <Search size={16} />
        </button>
      </div>

      {/* Find and Replace Panel */}
      {showFindReplace && (
        <div className="find-replace-panel flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <input 
              type="text" 
              placeholder="Find..." 
              value={findText}
              onChange={(e) => { setFindText(e.target.value); }}
              onKeyUp={(e) => e.key === 'Enter' && handleFind()}
              className="find-replace-input"
            />
            <input 
              type="text" 
              placeholder="Replace with..." 
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              className="find-replace-input"
            />
            <button className="text-btn flex items-center gap-1" onClick={handleFind}>
              <span>Find</span>
              {matchCount > 0 && <span className="match-badge">{matchCount}</span>}
            </button>
            <button className="text-btn" onClick={() => handleReplace(false)}>Replace</button>
            <button className="text-btn" onClick={() => handleReplace(true)}>Replace All</button>
          </div>
          <button className="action-icon-btn" onClick={() => setShowFindReplace(false)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Editor Toolbar */}
      <div className="editor-toolbar flex items-center gap-1">
        <button className="toolbar-icon-btn" onClick={() => applyFormat('bold')} title="Bold (Ctrl+B)">
          <Bold size={15} />
        </button>
        <button className="toolbar-icon-btn" onClick={() => applyFormat('italic')} title="Italic (Ctrl+I)">
          <Italic size={15} />
        </button>
        <button className="toolbar-icon-btn" onClick={() => applyFormat('formatBlock', 'h2')} title="Heading 1">
          <Heading1 size={15} />
        </button>
        <button className="toolbar-icon-btn" onClick={() => applyFormat('formatBlock', 'h3')} title="Heading 2">
          <Heading2 size={15} />
        </button>
        <button className="toolbar-icon-btn" onClick={() => applyFormat('formatBlock', 'blockquote')} title="Blockquote">
          <Quote size={15} />
        </button>
        
        <div className="toolbar-separator" />

        <button className="toolbar-icon-btn" onClick={() => applyFormat('insertUnorderedList')} title="Bullet List">
          <List size={15} />
        </button>
        <button className="toolbar-icon-btn" onClick={() => applyFormat('insertOrderedList')} title="Numbered List">
          <ListOrdered size={15} />
        </button>
        
        <div className="toolbar-separator" />

        <button className="toolbar-icon-btn text-accent flex items-center gap-1" onClick={insertSceneBreak} title="Insert Scene Break">
          <Sparkles size={15} />
          <span style={{ fontSize: '11px', fontWeight: '600' }}>Scene Break</span>
        </button>
      </div>

      {/* Writing Canvas Container */}
      <div className="editor-canvas-container flex-1">
        <div 
          ref={editorRef}
          className="editor-content-area"
          contentEditable={true}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Start writing here..."
        />
      </div>

      {/* Editor Footer / Stats */}
      <div className="editor-footer flex items-center justify-between">
        <div className="flex gap-4">
          <span className="footer-stat-item"><strong>{stats.words}</strong> words</span>
          <span className="footer-stat-item"><strong>{stats.characters}</strong> characters</span>
        </div>
        <span className="footer-stat-item">Estimated reading time: <strong>{stats.readingTime}</strong> min</span>
      </div>

      <style>{`
        .center-editor {
          background-color: var(--ui-bg);
          height: 100%;
          border-right: 1px solid var(--ui-border);
        }

        .editor-empty {
          color: var(--ui-text-muted);
          text-align: center;
        }

        .editor-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--ui-border);
        }

        .editor-title-input {
          font-size: 20px;
          font-weight: 600;
          border: none;
          background: transparent;
          color: var(--ui-text);
          outline: none;
          width: 80%;
        }

        .find-replace-trigger {
          color: var(--ui-text-muted);
          padding: 6px;
          border-radius: 6px;
        }

        .find-replace-trigger.active, .find-replace-trigger:hover {
          background-color: var(--ui-panel-bg);
          color: var(--ui-text);
        }

        .find-replace-panel {
          padding: 8px 24px;
          background-color: var(--ui-panel-bg);
          border-bottom: 1px solid var(--ui-border);
          font-size: 13px;
        }

        .find-replace-input {
          padding: 4px 8px;
          border: 1px solid var(--ui-border);
          background-color: var(--ui-bg);
          border-radius: 4px;
          outline: none;
          width: 140px;
        }

        .text-btn {
          font-size: 12px;
          padding: 4px 8px;
          border: 1px solid var(--ui-border);
          border-radius: 4px;
          font-weight: 500;
        }

        .text-btn:hover {
          background-color: var(--ui-border);
        }

        .match-badge {
          background: var(--ui-accent);
          color: white;
          padding: 0 4px;
          border-radius: 4px;
          font-size: 10px;
        }

        .editor-toolbar {
          padding: 8px 24px;
          border-bottom: 1px solid var(--ui-border);
          background-color: var(--ui-panel-bg);
          flex-wrap: wrap;
        }

        .toolbar-icon-btn {
          color: var(--ui-text-muted);
          padding: 6px;
          border-radius: 6px;
        }

        .toolbar-icon-btn:hover {
          background-color: var(--ui-border);
          color: var(--ui-text);
        }

        .editor-canvas-container {
          padding: 32px 0;
          overflow-y: auto;
          display: flex;
          justify-content: center;
        }

        .editor-content-area {
          width: 100%;
          max-width: 650px;
          padding: 0 32px;
          outline: none;
          font-size: 15.5px;
          line-height: 1.6;
          color: var(--ui-text);
          min-height: 100%;
        }

        .editor-content-area[placeholder]:empty:before {
          content: attr(placeholder);
          color: var(--ui-text-muted);
          cursor: text;
        }

        /* Basic rich text styling in canvas */
        .editor-content-area h2 {
          font-size: 1.5em;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }

        .editor-content-area h3 {
          font-size: 1.25em;
          margin-top: 1.25em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }

        .editor-content-area p {
          margin-bottom: 1em;
        }

        .editor-content-area blockquote {
          border-left: 4px solid var(--ui-accent);
          padding-left: 16px;
          margin-left: 0;
          margin-bottom: 1em;
          font-style: italic;
          color: var(--ui-text-muted);
        }

        .editor-content-area ul, .editor-content-area ol {
          margin-left: 20px;
          margin-bottom: 1em;
        }

        .editor-footer {
          padding: 8px 24px;
          border-top: 1px solid var(--ui-border);
          font-size: 12px;
          color: var(--ui-text-muted);
          background-color: var(--ui-panel-bg);
        }

        .footer-stat-item {
          display: inline-block;
        }
      `}</style>
    </div>
  );
}
