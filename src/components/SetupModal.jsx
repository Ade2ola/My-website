import React from 'react';
import { X, Settings, Layout, Info } from 'lucide-react';

export default function SetupModal({ 
  isOpen, 
  onClose, 
  metadata, 
  onChangeMetadata 
}) {
  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    onChangeMetadata({ ...metadata, [field]: value });
  };

  const handleMarginChange = (side, value) => {
    const numValue = parseFloat(value) || 0;
    onChangeMetadata({
      ...metadata,
      margins: {
        ...metadata.margins,
        [side]: numValue
      }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content setup-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="text-accent" size={18} />
            <h3 className="modal-title">Book Layout & Setup</h3>
          </div>
          <button className="action-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body flex flex-col gap-4">
          {/* Metadata Section */}
          <div className="setup-section">
            <h4 className="setup-section-title">Metadata Settings</h4>
            <div className="setup-grid-2">
              <div className="form-group">
                <label>Book Title</label>
                <input 
                  type="text" 
                  value={metadata.title || ''} 
                  onChange={(e) => handleInputChange('title', e.target.value)} 
                  placeholder="e.g. The Lost Alchemist"
                />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input 
                  type="text" 
                  value={metadata.subtitle || ''} 
                  onChange={(e) => handleInputChange('subtitle', e.target.value)} 
                  placeholder="e.g. A Tale of Shadows and Gold"
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input 
                  type="text" 
                  value={metadata.author || ''} 
                  onChange={(e) => handleInputChange('author', e.target.value)} 
                  placeholder="e.g. Aveline Thorne"
                />
              </div>
              <div className="form-group">
                <label>Publisher</label>
                <input 
                  type="text" 
                  value={metadata.publisher || ''} 
                  onChange={(e) => handleInputChange('publisher', e.target.value)} 
                  placeholder="e.g. Independent Publishing"
                />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input 
                  type="text" 
                  value={metadata.isbn || ''} 
                  onChange={(e) => handleInputChange('isbn', e.target.value)} 
                  placeholder="e.g. 978-3-16-148410-0"
                />
              </div>
              <div className="form-group">
                <label>Language</label>
                <select 
                  value={metadata.language || 'en'} 
                  onChange={(e) => handleInputChange('language', e.target.value)}
                >
                  <option value="en">English (US/UK)</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="es">Spanish</option>
                  <option value="it">Italian</option>
                </select>
              </div>
            </div>
          </div>

          <div className="setup-divider" />

          {/* Layout Section */}
          <div className="setup-section">
            <h4 className="setup-section-title">Layout & Styling</h4>
            <div className="setup-grid-3">
              <div className="form-group">
                <label>Trim Size</label>
                <select 
                  value={metadata.trimSize || '6" x 9"'} 
                  onChange={(e) => handleInputChange('trimSize', e.target.value)}
                >
                  <option value='5" x 8"'>Pocket (5" x 8")</option>
                  <option value='5.5" x 8.5"'>Trade (5.5" x 8.5")</option>
                  <option value='6" x 9"'>Standard (6" x 9")</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Paper Color</label>
                <select 
                  value={metadata.paperColor || 'cream'} 
                  onChange={(e) => handleInputChange('paperColor', e.target.value)}
                >
                  <option value="cream">Cream (Classic Fiction)</option>
                  <option value="white">White (Non-fiction / Sci-Fi)</option>
                  <option value="grey">Grey (Faux Matte E-Ink)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bleed Margin</label>
                <select 
                  value={metadata.bleed || 0.125} 
                  onChange={(e) => handleInputChange('bleed', parseFloat(e.target.value))}
                >
                  <option value="0">No Bleed</option>
                  <option value="0.125">0.125" Bleed (Standard)</option>
                  <option value="0.25">0.25" Bleed (Full Page Art)</option>
                </select>
              </div>
            </div>

            <div className="form-sub-label flex items-center gap-1 mt-3">
              <Layout size={12} className="text-accent" />
              <span>Margins (inches)</span>
            </div>

            <div className="setup-grid-4 mt-2">
              <div className="form-group">
                <label>Inside (Gutter)</label>
                <input 
                  type="number" 
                  step="0.05"
                  min="0.4"
                  max="1.5"
                  value={metadata.margins?.inside || 0.75} 
                  onChange={(e) => handleMarginChange('inside', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Outside</label>
                <input 
                  type="number" 
                  step="0.05"
                  min="0.3"
                  max="1.5"
                  value={metadata.margins?.outside || 0.5} 
                  onChange={(e) => handleMarginChange('outside', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Top</label>
                <input 
                  type="number" 
                  step="0.05"
                  min="0.4"
                  max="1.5"
                  value={metadata.margins?.top || 0.75} 
                  onChange={(e) => handleMarginChange('top', e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Bottom</label>
                <input 
                  type="number" 
                  step="0.05"
                  min="0.4"
                  max="1.5"
                  value={metadata.margins?.bottom || 0.75} 
                  onChange={(e) => handleMarginChange('bottom', e.target.value)} 
                />
              </div>
            </div>
          </div>

          <div className="setup-divider" />

          {/* Running Headers & Page Numbers Section */}
          <div className="setup-section">
            <h4 className="setup-section-title">Headers & Page Numbers</h4>
            <div className="setup-grid-2">
              <div className="form-group">
                <label>Left Page Running Header (Author)</label>
                <input 
                  type="text" 
                  value={metadata.runningHeaderAuthor || ''} 
                  onChange={(e) => handleInputChange('runningHeaderAuthor', e.target.value)} 
                  placeholder="e.g. Aveline Thorne"
                />
              </div>
              <div className="form-group">
                <label>Right Page Running Header (Title)</label>
                <input 
                  type="text" 
                  value={metadata.runningHeader || ''} 
                  onChange={(e) => handleInputChange('runningHeader', e.target.value)} 
                  placeholder="e.g. The Lost Alchemist"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              <label className="checkbox-container flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={metadata.showPageNumbers !== false} 
                  onChange={(e) => handleInputChange('showPageNumbers', e.target.checked)} 
                />
                <span className="checkbox-label">Show Page Numbers in Footer</span>
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer flex justify-end gap-2">
          <button className="setup-save-btn" onClick={onClose}>Apply Changes</button>
        </div>
      </div>

      <style>{`
        .setup-modal-content {
          max-width: 650px;
          padding: 24px;
        }

        .modal-header {
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--ui-text);
        }

        .setup-section {
          display: flex;
          flex-direction: column;
        }

        .setup-section-title {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--ui-text-muted);
          margin-bottom: 12px;
          letter-spacing: 0.5px;
        }

        .setup-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .setup-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .setup-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-group label {
          font-size: 11px;
          font-weight: 500;
          color: var(--ui-text-muted);
        }

        .form-group input, .form-group select {
          padding: 8px 12px;
          border: 1px solid var(--ui-border);
          background-color: var(--ui-bg);
          border-radius: var(--ui-radius-sm);
          font-size: 13px;
          outline: none;
          color: var(--ui-text);
        }

        .form-group input:focus, .form-group select:focus {
          border-color: var(--ui-accent);
        }

        .form-sub-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--ui-text-muted);
        }

        .setup-divider {
          height: 1px;
          background-color: var(--ui-border);
          margin: 4px 0;
        }

        .checkbox-container {
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label {
          font-size: 13px;
          color: var(--ui-text);
        }

        .modal-footer {
          margin-top: 24px;
          border-top: 1px solid var(--ui-border);
          padding-top: 16px;
        }

        .setup-save-btn {
          background-color: var(--ui-accent);
          color: white;
          padding: 8px 16px;
          border-radius: var(--ui-radius-sm);
          font-size: 13px;
          font-weight: 600;
        }

        .setup-save-btn:hover {
          background-color: var(--ui-accent-hover);
        }
      `}</style>
    </div>
  );
}
