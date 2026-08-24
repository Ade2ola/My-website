import React, { useState } from 'react';
import { X, Plus, FileText, AlertTriangle, BookOpen, Sparkles, Check } from 'lucide-react';

export default function AddSectionModal({
  isOpen,
  onClose,
  targetType, // 'front-matter', 'back-matter', 'chapter'
  onConfirmAdd
}) {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  if (!isOpen) return null;

  const isFront = targetType === 'front-matter';
  const isBack = targetType === 'back-matter';

  const frontPresets = [
    { title: 'Title Page', desc: 'Book title, subtitle, author name & publisher' },
    { title: 'Copyright Page', desc: 'Legal notices, edition info, and ISBN' },
    { title: 'Trigger Warnings / Content Notes', desc: 'Important content sensitivity disclosures' },
    { title: 'Dedication', desc: 'Personal dedication statement' },
    { title: 'Epigraph', desc: 'Introductory poem, quote, or thematic excerpt' },
    { title: 'Foreword', desc: 'Introductory statement by a guest writer or editor' },
    { title: 'Preface', desc: 'Author\'s introduction explaining background context' },
    { title: 'Map & Dramatis Personae', desc: 'List of characters, locations, or timeline' },
  ];

  const backPresets = [
    { title: 'Acknowledgements', desc: 'Thanks & appreciation for editors, helpers & supporters' },
    { title: 'About the Author', desc: 'Author biography and social/website links' },
    { title: 'Also By', desc: 'List of previous or related published works' },
    { title: 'Epilogue', desc: 'Concluding chapter or concluding story section' },
    { title: 'Newsletter Signup', desc: 'Call to action for reader email subscription' },
    { title: 'Book Club Questions', desc: 'Discussion prompts for reader groups' },
    { title: 'Glossary & Index', desc: 'Terminology definitions and reference index' },
  ];

  const presets = isFront ? frontPresets : (isBack ? backPresets : []);

  const handleSelectPreset = (title) => {
    setSelectedPreset(title);
    setCustomTitle(title);
  };

  const handleAdd = () => {
    const finalTitle = customTitle.trim() || selectedPreset || (isFront ? 'Custom Front Matter' : (isBack ? 'Custom Back Matter' : 'New Chapter'));
    onConfirmAdd(targetType, finalTitle);
    setCustomTitle('');
    setSelectedPreset('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-section-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="text-accent" size={20} />
            <h3 className="modal-title">
              {isFront ? 'Add Front Matter Page' : (isBack ? 'Add Back Matter Page' : 'Add New Chapter')}
            </h3>
          </div>
          <button className="action-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body flex flex-col gap-4">
          
          {/* Custom Page Title Input */}
          <div className="form-group flex flex-col gap-1.5">
            <label className="font-semibold text-xs text-ui-text flex items-center gap-1">
              <FileText size={14} className="text-accent" />
              <span>Page Title (Custom or Preset)</span>
            </label>
            <input 
              type="text" 
              className="custom-title-input" 
              placeholder={isFront ? 'e.g. Trigger Warnings, Content Notes, Epigraph...' : (isBack ? 'e.g. Acknowledgements, Glossary, Author\'s Note...' : 'e.g. Chapter Title...')}
              value={customTitle}
              onChange={(e) => {
                setCustomTitle(e.target.value);
                setSelectedPreset('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
              }}
              autoFocus
            />
          </div>

          {/* Preset Options List */}
          {presets.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-muted font-medium">Or choose from popular presets:</span>
              <div className="presets-grid grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                {presets.map((p) => {
                  const isSelected = selectedPreset === p.title || customTitle === p.title;
                  return (
                    <div 
                      key={p.title}
                      className={`preset-card flex items-center justify-between p-2.5 border rounded-md cursor-pointer transition-all ${
                        isSelected ? 'border-accent bg-accent-light' : 'hover:border-ui-border-hover'
                      }`}
                      onClick={() => handleSelectPreset(p.title)}
                    >
                      <div className="flex flex-col">
                        <span className="preset-title font-medium text-xs text-ui-text">{p.title}</span>
                        <span className="preset-desc text-muted text-xs opacity-75">{p.desc}</span>
                      </div>
                      {isSelected && <Check size={16} className="text-accent ml-2 flex-shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button className="export-cancel-btn" onClick={onClose}>Cancel</button>
            <button className="start-export-btn flex items-center gap-1.5" onClick={handleAdd}>
              <Plus size={14} />
              <span>Add Page</span>
            </button>
          </div>

        </div>

        <style>{`
          .add-section-modal-content {
            max-width: 500px;
            padding: 24px;
          }

          .custom-title-input {
            border: 1px solid var(--ui-border);
            border-radius: var(--ui-radius-sm);
            padding: 8px 12px;
            font-size: 14px;
            background-color: var(--ui-bg);
            color: var(--ui-text);
            width: 100%;
          }

          .custom-title-input:focus {
            border-color: var(--ui-accent);
            outline: none;
          }

          .preset-card {
            border: 1px solid var(--ui-border);
            background-color: var(--ui-bg);
          }

          .preset-card:hover {
            border-color: var(--ui-accent);
          }

          .preset-card.border-accent {
            border-color: var(--ui-accent);
            background-color: var(--ui-accent-light, rgba(79, 70, 229, 0.05));
          }
        `}</style>
      </div>
    </div>
  );
}
