import React from 'react';
import { X, Palette, Check } from 'lucide-react';
import { themes, svgOrnaments, getChapterLabel } from '../themes/presets';

export default function ThemeGallery({ 
  isOpen, 
  onClose, 
  activeThemeId, 
  onSelectTheme 
}) {
  if (!isOpen) return null;

  // Group themes by category for organized display
  const categories = [...new Set(themes.map(t => t.category))];

  const renderMiniPagePreview = (theme) => {
    const co = theme.chapterOpening || {};
    const align = co.layout === 'left-aligned' ? 'left' : 'center';

    return (
      <div 
        className="theme-mini-page"
        style={{ fontFamily: theme.bodyFont }}
      >
        {/* Decorative border corners */}
        {co.decorativeBorder && (
          <>
            <div className="mini-border-corner top-left" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
            <div className="mini-border-corner top-right" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
            <div className="mini-border-corner bottom-left" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
            <div className="mini-border-corner bottom-right" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
          </>
        )}

        {/* Chapter number label */}
        <div 
          className="mini-chapter-number"
          style={{ 
            fontFamily: theme.headingFont,
            textAlign: align,
            fontSize: co.numberSize ? `calc(${co.numberSize} * 0.65)` : '6px',
            letterSpacing: co.numberLetterSpacing || '2px',
            fontWeight: co.numberWeight || 400,
            fontVariant: co.numberVariant || 'all-small-caps',
            marginBottom: '2px',
          }}
        >
          CHAPTER ONE
        </div>

        {/* Chapter title */}
        <div 
          className="mini-chapter-title"
          style={{ 
            fontFamily: theme.headingFont,
            textAlign: align,
            fontSize: co.titleSize ? `calc(${co.titleSize} * 0.42)` : '10px',
            fontWeight: co.titleWeight || 500,
            letterSpacing: co.titleLetterSpacing || '0px',
            marginBottom: '4px',
          }}
        >
          The Broken Crown
        </div>

        {/* Ornament */}
        {co.ornamentType === 'svg' && co.ornamentSvgKey && svgOrnaments[co.ornamentSvgKey] ? (
          <div 
            className="mini-ornament-svg"
            style={{ textAlign: align }}
            dangerouslySetInnerHTML={{ __html: svgOrnaments[co.ornamentSvgKey] }}
          />
        ) : co.ornamentType === 'symbol' ? (
          <div 
            className="mini-ornament-symbol"
            style={{ textAlign: align }}
          >
            {theme.dividerSymbol}
          </div>
        ) : null}

        {/* Body text preview */}
        <div 
          className="mini-body-text"
          style={{ 
            textAlign: theme.justify ? 'justify' : 'left',
            textIndent: theme.indentation || '0',
            fontSize: '6.5px',
            lineHeight: '1.4',
          }}
        >
          {theme.dropCaps && (
            <span className="mini-drop-cap" style={{ fontFamily: theme.bodyFont }}>I</span>
          )}
          {theme.firstParagraphStyle === 'small-caps' ? (
            <span><span style={{ fontVariant: 'small-caps', fontSize: '7px' }}>t was a cold, foggy</span> night in London when she first discovered the hidden vial behind a loose brick in the old cellar wall...</span>
          ) : theme.firstParagraphStyle === 'bold' ? (
            <span><strong>It was a cold, foggy</strong> night in London when she first discovered the hidden vial behind a loose brick in the old cellar wall...</span>
          ) : theme.firstParagraphStyle === 'uppercase' ? (
            <span><span style={{ textTransform: 'uppercase', fontSize: '6px' }}>It was a cold, foggy</span> night in London when she first discovered the hidden vial behind a loose brick in the old cellar wall...</span>
          ) : (
            <span>It was a cold, foggy night in London when she first discovered the hidden vial behind a loose brick in the old cellar wall...</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content themes-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="text-accent" size={18} />
            <h3 className="modal-title">Theme Gallery</h3>
          </div>
          <button className="action-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body">
          <p className="modal-description text-muted">
            Choose a book theme preset designed by professional book designers. Each theme applies unique chapter title designs, ornaments, typography, and page layout styling.
          </p>

          {categories.map(category => (
            <div key={category} className="theme-category-section">
              <h4 className="theme-category-label">{category}</h4>
              <div className="themes-grid">
                {themes.filter(t => t.category === category).map((theme) => {
                  const isActive = theme.id === activeThemeId;
                  return (
                    <div 
                      key={theme.id} 
                      className={`theme-card ${isActive ? 'active' : ''}`}
                      onClick={() => onSelectTheme(theme.id)}
                    >
                      {/* Live Mini Page Preview */}
                      {renderMiniPagePreview(theme)}

                      {/* Theme Info */}
                      <div className="theme-card-info">
                        <div className="flex items-center justify-between">
                          <h4 className="theme-card-name">{theme.name}</h4>
                          {isActive && (
                            <div className="theme-card-active-dot flex items-center justify-center">
                              <Check size={10} />
                            </div>
                          )}
                        </div>
                        <p className="theme-card-description">{theme.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer flex justify-end">
          <button className="theme-apply-btn" onClick={onClose}>Done</button>
        </div>
      </div>

      <style>{`
        .themes-modal-content {
          max-width: 920px;
          padding: 24px;
        }

        .modal-description {
          font-size: 13px;
          line-height: 1.5;
        }

        .theme-category-section {
          margin-top: 20px;
        }

        .theme-category-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--ui-text-muted);
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid var(--ui-border);
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          max-height: none;
          overflow: visible;
          margin-bottom: 8px;
        }

        .themes-modal-content .modal-body {
          max-height: 62vh;
          overflow-y: auto;
          padding-right: 8px;
        }

        .theme-card {
          border: 1px solid var(--ui-border);
          border-radius: var(--ui-radius);
          background-color: var(--ui-panel-bg);
          cursor: pointer;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .theme-card:hover {
          border-color: var(--ui-border-hover);
          transform: translateY(-2px);
          box-shadow: var(--ui-shadow);
        }

        .theme-card.active {
          border-color: var(--ui-accent);
          background-color: var(--ui-bg);
          box-shadow: 0 0 0 2px var(--ui-accent-light), var(--ui-shadow);
        }

        .theme-card-info {
          padding: 10px 12px 12px;
        }

        .theme-card-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--ui-text);
        }

        .theme-card-active-dot {
          background-color: var(--ui-accent);
          color: white;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .theme-card-description {
          font-size: 11px;
          color: var(--ui-text-muted);
          line-height: 1.35;
          margin-top: 3px;
        }

        /* ── Mini Page Preview ── */
        .theme-mini-page {
          background-color: #faf8f5;
          color: #2c251e;
          padding: 20px 16px 14px;
          position: relative;
          min-height: 160px;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          overflow: hidden;
        }

        .mini-chapter-number {
          opacity: 0.65;
          line-height: 1.2;
        }

        .mini-chapter-title {
          line-height: 1.2;
          color: #1a1815;
        }

        .mini-ornament-svg {
          width: 80px;
          margin: 3px auto 6px;
          opacity: 0.6;
        }

        .mini-ornament-svg svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .theme-mini-page[style*="text-align: left"] .mini-ornament-svg {
          margin-left: 0;
          margin-right: auto;
        }

        .mini-ornament-symbol {
          font-size: 8px;
          opacity: 0.5;
          margin: 3px 0 6px;
        }

        .mini-body-text {
          color: #3a352d;
          opacity: 0.75;
          margin-top: 4px;
          overflow: hidden;
          max-height: 42px;
        }

        .mini-drop-cap {
          float: left;
          font-size: 22px;
          line-height: 0.7;
          margin-right: 2px;
          margin-top: 1px;
          font-weight: 600;
        }

        /* Decorative border corners */
        .mini-border-corner {
          position: absolute;
          width: 22px;
          height: 22px;
          opacity: 0.4;
        }

        .mini-border-corner svg {
          width: 100%;
          height: 100%;
        }

        .mini-border-corner.top-left {
          top: 6px;
          left: 6px;
        }

        .mini-border-corner.top-right {
          top: 6px;
          right: 6px;
          transform: scaleX(-1);
        }

        .mini-border-corner.bottom-left {
          bottom: 6px;
          left: 6px;
          transform: scaleY(-1);
        }

        .mini-border-corner.bottom-right {
          bottom: 6px;
          right: 6px;
          transform: scale(-1, -1);
        }

        .theme-apply-btn {
          background-color: var(--ui-accent);
          color: white;
          padding: 8px 16px;
          border-radius: var(--ui-radius-sm);
          font-size: 13px;
          font-weight: 600;
          margin-top: 16px;
        }

        .theme-apply-btn:hover {
          background-color: var(--ui-accent-hover);
        }
      `}</style>
    </div>
  );
}
