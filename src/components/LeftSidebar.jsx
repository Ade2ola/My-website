import React, { useState } from 'react';
import { 
  BookOpen, ChevronDown, ChevronRight, Plus, 
  Trash2, Copy, Edit3, Image, FileText, 
  ArrowUp, ArrowDown, Move, BookCheck
} from 'lucide-react';

export default function LeftSidebar({
  sections,
  activeSectionId,
  setActiveSectionId,
  onAddSection,
  onRemoveSection,
  onDuplicateSection,
  onRenameSection,
  onReorderSections,
  coverImage,
  onUploadCover
}) {
  const [collapsed, setCollapsed] = useState({
    frontMatter: false,
    chapters: false,
    backMatter: false
  });

  const [draggedIndex, setDraggedIndex] = useState(null);

  const toggleCollapse = (key) => {
    setCollapsed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const frontMatter = sections.filter(s => s.type === 'front-matter');
  const chapters = sections.filter(s => s.type === 'chapter');
  const backMatter = sections.filter(s => s.type === 'back-matter');

  // Drag and Drop handlers for chapters
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    setDraggedIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex, type) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    // Filter sections of this type
    const typedSections = sections.filter(s => s.type === type);
    const draggedItem = typedSections[draggedIndex];
    
    // Construct new order
    const remaining = typedSections.filter((_, idx) => idx !== draggedIndex);
    remaining.splice(targetIndex, 0, draggedItem);
    
    // Merge back with other types
    const otherSections = sections.filter(s => s.type !== type);
    
    let finalSections = [];
    if (type === 'front-matter') {
      finalSections = [...remaining, ...sections.filter(s => s.type !== 'front-matter')];
    } else if (type === 'chapter') {
      const fm = sections.filter(s => s.type === 'front-matter');
      const bm = sections.filter(s => s.type === 'back-matter');
      finalSections = [...fm, ...remaining, ...bm];
    } else {
      finalSections = [...sections.filter(s => s.type !== 'back-matter'), ...remaining];
    }

    onReorderSections(finalSections);
  };

  // Up / Down sorting controls (fallback for accessibility & speed)
  const moveItem = (item, direction) => {
    const type = item.type;
    const typed = sections.filter(s => s.type === type);
    const index = typed.findIndex(s => s.id === item.id);
    
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === typed.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const itemToMove = typed[index];
    const itemToSwap = typed[targetIdx];

    // Swap contents in array
    const newTyped = [...typed];
    newTyped[index] = itemToSwap;
    newTyped[targetIdx] = itemToMove;

    let finalSections = [];
    if (type === 'front-matter') {
      finalSections = [...newTyped, ...sections.filter(s => s.type !== 'front-matter')];
    } else if (type === 'chapter') {
      const fm = sections.filter(s => s.type === 'front-matter');
      const bm = sections.filter(s => s.type === 'back-matter');
      finalSections = [...fm, ...newTyped, ...bm];
    } else {
      finalSections = [...sections.filter(s => s.type !== 'back-matter'), ...newTyped];
    }

    onReorderSections(finalSections);
  };

  const handleCreateMockCover = () => {
    const colors = ['#2563eb', '#1d1d1f', '#0f766e', '#b91c1c', '#6d28d9', '#c2410c', '#374151'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = randomColor;
    ctx.fillRect(0, 0, 300, 450);

    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(15, 15, 270, 420);

    // Decorative ornament
    ctx.fillStyle = '#ffffff';
    ctx.font = '28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('❦', 150, 100);

    // Title
    ctx.font = 'bold 20px Georgia';
    ctx.fillText('THE LOST', 150, 190);
    ctx.fillText('ALCHEMIST', 150, 220);

    // Subtitle
    ctx.font = 'italic 12px Georgia';
    ctx.fillText('A Tale of Shadows and Gold', 150, 260);

    // Author
    ctx.font = '14px Georgia';
    ctx.fillText('Aveline Thorne', 150, 360);

    onUploadCover(canvas.toDataURL());
  };

  const renderSectionList = (items, type) => {
    return items.map((item, idx) => {
      const isActive = item.id === activeSectionId;
      return (
        <div 
          key={item.id}
          className={`sidebar-item flex items-center justify-between ${isActive ? 'active' : ''}`}
          draggable={type === 'chapter'}
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, idx, type)}
          onClick={() => setActiveSectionId(item.id)}
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <Move size={12} className="drag-handle text-muted" style={{ cursor: 'grab', display: type === 'chapter' ? 'block' : 'none' }} />
            <span className="sidebar-item-title">{item.title}</span>
          </div>

          <div className="sidebar-item-actions flex items-center gap-0.5">
            <button 
              className="action-icon-btn" 
              onClick={(e) => { e.stopPropagation(); moveItem(item, 'up'); }}
              disabled={idx === 0}
              title="Move Up"
            >
              <ArrowUp size={11} />
            </button>
            <button 
              className="action-icon-btn" 
              onClick={(e) => { e.stopPropagation(); moveItem(item, 'down'); }}
              disabled={idx === items.length - 1}
              title="Move Down"
            >
              <ArrowDown size={11} />
            </button>
            <button 
              className="action-icon-btn"
              onClick={(e) => { e.stopPropagation(); onDuplicateSection(item); }}
              title="Duplicate"
            >
              <Copy size={11} />
            </button>
            <button 
              className="action-icon-btn delete-btn"
              onClick={(e) => { e.stopPropagation(); onRemoveSection(item.id); }}
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="left-sidebar flex flex-col">
      {/* Book Cover Setup */}
      <div className="sidebar-cover-section">
        <h4 className="sidebar-group-title">Book Cover</h4>
        {coverImage ? (
          <div className="sidebar-cover-preview-wrapper flex flex-col items-center">
            <img src={coverImage} alt="Cover Preview" className="sidebar-cover-img" />
            <div className="flex gap-2 mt-2 w-full justify-center">
              <button className="small-text-btn" onClick={handleCreateMockCover}>Regenerate</button>
              <button className="small-text-btn text-danger" onClick={() => onUploadCover(null)}>Remove</button>
            </div>
          </div>
        ) : (
          <div className="sidebar-cover-placeholder flex flex-col items-center justify-center" onClick={handleCreateMockCover}>
            <Image size={24} className="text-muted mb-2" />
            <span>Generate Cover Mockup</span>
          </div>
        )}
      </div>

      <div className="sidebar-divider" />

      {/* Front Matter Section */}
      <div className="sidebar-group flex-col">
        <div className="sidebar-group-header flex items-center justify-between" onClick={() => toggleCollapse('frontMatter')}>
          <div className="flex items-center gap-1.5">
            {collapsed.frontMatter ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            <span className="sidebar-group-title">Front Matter</span>
          </div>
          <button 
            className="add-sub-btn" 
            onClick={(e) => { e.stopPropagation(); onAddSection('front-matter'); }}
            title="Add Front Matter Page"
          >
            <Plus size={14} />
          </button>
        </div>
        {!collapsed.frontMatter && (
          <div className="sidebar-items-list">
            {frontMatter.length > 0 ? renderSectionList(frontMatter, 'front-matter') : (
              <span className="sidebar-empty-text">No Front Matter</span>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-divider" />

      {/* Chapters Section */}
      <div className="sidebar-group flex-col flex-1" style={{ overflowY: 'auto' }}>
        <div className="sidebar-group-header flex items-center justify-between" onClick={() => toggleCollapse('chapters')}>
          <div className="flex items-center gap-1.5">
            {collapsed.chapters ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            <span className="sidebar-group-title">Chapters</span>
          </div>
          <button 
            className="add-sub-btn" 
            onClick={(e) => { e.stopPropagation(); onAddSection('chapter'); }}
            title="Add New Chapter"
          >
            <Plus size={14} />
          </button>
        </div>
        {!collapsed.chapters && (
          <div className="sidebar-items-list">
            {chapters.length > 0 ? renderSectionList(chapters, 'chapter') : (
              <span className="sidebar-empty-text">No Chapters</span>
            )}
          </div>
        )}
      </div>

      <div className="sidebar-divider" />

      {/* Back Matter Section */}
      <div className="sidebar-group flex-col">
        <div className="sidebar-group-header flex items-center justify-between" onClick={() => toggleCollapse('backMatter')}>
          <div className="flex items-center gap-1.5">
            {collapsed.backMatter ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
            <span className="sidebar-group-title">Back Matter</span>
          </div>
          <button 
            className="add-sub-btn" 
            onClick={(e) => { e.stopPropagation(); onAddSection('back-matter'); }}
            title="Add Back Matter Page"
          >
            <Plus size={14} />
          </button>
        </div>
        {!collapsed.backMatter && (
          <div className="sidebar-items-list">
            {backMatter.length > 0 ? renderSectionList(backMatter, 'back-matter') : (
              <span className="sidebar-empty-text">No Back Matter</span>
            )}
          </div>
        )}
      </div>

      <style>{`
        .left-sidebar {
          width: 250px;
          border-right: 1px solid var(--ui-border);
          background-color: var(--ui-panel-bg);
          height: 100%;
          user-select: none;
        }

        .sidebar-cover-section {
          padding: 16px;
        }

        .sidebar-cover-preview-wrapper {
          width: 100%;
        }

        .sidebar-cover-img {
          width: 90px;
          height: 135px;
          border-radius: var(--ui-radius-sm);
          box-shadow: var(--ui-shadow);
          object-fit: cover;
          border: 1px solid var(--ui-border);
        }

        .sidebar-cover-placeholder {
          height: 120px;
          border: 2px dashed var(--ui-border);
          border-radius: var(--ui-radius);
          cursor: pointer;
          font-size: 11px;
          font-weight: 500;
          color: var(--ui-text-muted);
          transition: all 0.2s;
        }

        .sidebar-cover-placeholder:hover {
          border-color: var(--ui-accent);
          color: var(--ui-accent);
          background: var(--ui-accent-light);
        }

        .sidebar-divider {
          height: 1px;
          background-color: var(--ui-border);
          margin: 0 16px;
        }

        .sidebar-group {
          padding: 12px 16px;
        }

        .sidebar-group-header {
          cursor: pointer;
          color: var(--ui-text);
          margin-bottom: 8px;
        }

        .sidebar-group-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--ui-text-muted);
        }

        .add-sub-btn {
          color: var(--ui-text-muted);
          padding: 2px;
          border-radius: 4px;
        }

        .add-sub-btn:hover {
          background-color: var(--ui-border);
          color: var(--ui-text);
        }

        .sidebar-items-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          padding: 6px 8px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          color: var(--ui-text);
          position: relative;
        }

        .sidebar-item:hover {
          background-color: var(--ui-border);
        }

        .sidebar-item.active {
          background-color: var(--ui-accent-light);
          color: var(--ui-accent);
          font-weight: 500;
        }

        .sidebar-item-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-item-actions {
          display: none;
        }

        .sidebar-item:hover .sidebar-item-actions {
          display: flex;
        }

        .action-icon-btn {
          color: var(--ui-text-muted);
          padding: 2px;
          border-radius: 3px;
        }

        .action-icon-btn:hover:not(:disabled) {
          background-color: var(--ui-border-hover);
          color: var(--ui-text);
        }

        .action-icon-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .action-icon-btn.delete-btn:hover {
          color: #ef4444;
          background-color: rgba(239, 68, 68, 0.1);
        }

        .small-text-btn {
          font-size: 11px;
          font-weight: 500;
          color: var(--ui-accent);
        }

        .small-text-btn.text-danger {
          color: #ef4444;
        }

        .sidebar-empty-text {
          font-size: 11px;
          color: var(--ui-text-muted);
          font-style: italic;
          padding: 4px 8px;
        }

        .drag-handle {
          cursor: grab;
          opacity: 0.5;
        }

        .drag-handle:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
