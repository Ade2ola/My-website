import React, { useState } from 'react';
import { 
  X, Layout, AlignLeft, AlignCenter, AlignRight, 
  Type, Columns, Sparkles, Sliders, ChevronDown
} from 'lucide-react';
import { svgOrnaments, getChapterLabel } from '../themes/presets';

export default function ChapterDesigner({ 
  isOpen, 
  onClose, 
  config, 
  onChangeConfig,
  activeTheme
}) {
  const [activeTab, setActiveTab] = useState('typography'); // typography, headers, layout, ornaments

  if (!isOpen) return null;

  const handleUpdate = (field, value) => {
    onChangeConfig({ ...config, [field]: value });
  };

  const handleMarginChange = (side, value) => {
    const numVal = parseFloat(value) || 0;
    // Update margins inside config
    onChangeConfig({
      ...config,
      customMargins: {
        ...(config.customMargins || { inside: 0.75, outside: 0.5, top: 0.75, bottom: 0.75 }),
        [side]: numVal
      }
    });
  };

  const bodyFonts = [
    { name: 'Garamond (Classic)', value: "'EB Garamond', Garamond, serif" },
    { name: 'Lora (Modern Serif)', value: "'Lora', Georgia, serif" },
    { name: 'Cormorant (Elegant)', value: "'Cormorant Garamond', serif" },
    { name: 'Alice (Folklore/Victorian)', value: "'Alice', serif" },
    { name: 'Spectral (Literary)', value: "'Spectral', serif" },
    { name: 'Typewriter (Vintage)', value: "'Special Elite', cursive" },
    { name: 'Inter (Clean Sans)', value: "'Inter', sans-serif" },
    { name: 'Montserrat (Tech Sans)', value: "'Montserrat', sans-serif" }
  ];

  const headingFonts = [
    { name: 'Cinzel (Classical/Fantasy)', value: "'Cinzel', serif" },
    { name: 'Playfair Display (Romance)', value: "'Playfair Display', serif" },
    { name: 'Rochester (Regency Script)', value: "'Rochester', cursive" },
    { name: 'Garamond (Classic)', value: "'EB Garamond', Garamond, serif" },
    { name: 'IM Fell English (Old World)', value: "'IM Fell English', serif" },
    { name: 'Alice (Victorian)', value: "'Alice', serif" },
    { name: 'Special Elite (Typewriter)', value: "'Special Elite', cursive" },
    { name: 'Creepster (Horror/Spooky)', value: "'Creepster', display" },
    { name: 'Quicksand (Friendly Sans)', value: "'Quicksand', sans-serif" },
    { name: 'Montserrat (Modern)', value: "'Montserrat', sans-serif" }
  ];

  const fontSizes = ['12px', '13px', '14px', '14.5px', '15px', '15.5px', '16px', '17px', '18px'];
  const lineHeights = ['1.3', '1.4', '1.45', '1.5', '1.55', '1.6', '1.7'];

  const ornamentOptions = [
    { label: 'Default (Theme)', value: '' },
    { label: '❦ Floral Heart', value: '❦' },
    { label: '✦ ✧ ✦ Stars', value: '✦ ✧ ✦' },
    { label: '❀ ☘ ❀ Botanical', value: '❀ ☘ ❀' },
    { label: '☽ ✵ ☾ Celestial', value: '☽ ✵ ☾' },
    { label: '— Em Dash', value: '—' },
    { label: '• • • Dots', value: '• • •' },
    { label: '◆ Diamond', value: '◆' },
    { label: '✒ Quill', value: '✒' },
    { label: '✥ ✣ ✥ Cross', value: '✥ ✣ ✥' },
    { label: '★ Star', value: '★' },
    { label: 'None', value: 'None' },
  ];

  const sceneBreakOptions = [
    { label: 'Default (Theme)', value: '' },
    { label: '❦ Floral', value: '❦' },
    { label: '✦ Star', value: '✦' },
    { label: '✻ Asterisk', value: '✻' },
    { label: '⚜ Fleur', value: '⚜' },
    { label: '• • • Dots', value: '• • •' },
    { label: '— Dash', value: '—' },
    { label: '🗝 Key', value: '🗝' },
    { label: '🍃 Leaf', value: '🍃' },
    { label: '★ Star', value: '★' },
    { label: 'None', value: 'None' },
  ];

  const resolvedMargins = config.customMargins || { inside: 0.75, outside: 0.5, top: 0.75, bottom: 0.75 };

  // Resolved values for the mock preview
  const resolvedBodyFont = config.customBodyFont || activeTheme?.bodyFont || 'Georgia, serif';
  const resolvedHeadingFont = config.customHeadingFont || activeTheme?.headingFont || 'Georgia, serif';
  const resolvedDivider = config.customDivider || activeTheme?.dividerSymbol || '❦';
  const co = activeTheme?.chapterOpening || {};
  const numberingStyle = config.numberingStyle || 'word-upper';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content designer-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="text-accent" size={18} />
            <h3 className="modal-title">Theme & Layout Customizer</h3>
          </div>
          <button className="action-icon-btn" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="modal-body flex flex-col gap-3">
          {/* Customizer Tabs */}
          <div className="designer-tabs flex">
            <button 
              className={`designer-tab ${activeTab === 'typography' ? 'active' : ''}`}
              onClick={() => setActiveTab('typography')}
            >
              <Type size={14} />
              <span>Typography</span>
            </button>
            <button 
              className={`designer-tab ${activeTab === 'headers' ? 'active' : ''}`}
              onClick={() => setActiveTab('headers')}
            >
              <Columns size={14} />
              <span>Headers & Margins</span>
            </button>
            <button 
              className={`designer-tab ${activeTab === 'layout' ? 'active' : ''}`}
              onClick={() => setActiveTab('layout')}
            >
              <Layout size={14} />
              <span>Chapter Layout</span>
            </button>
            <button 
              className={`designer-tab ${activeTab === 'ornaments' ? 'active' : ''}`}
              onClick={() => setActiveTab('ornaments')}
            >
              <Sparkles size={14} />
              <span>Ornaments</span>
            </button>
          </div>

          <div className="designer-grid mt-2">
            {/* Control Panel */}
            <div className="designer-panel flex flex-col gap-3">
              
              {activeTab === 'typography' && (
                <div className="flex flex-col gap-3 animate-fade">
                  <div className="form-group">
                    <label>Body Font (Override)</label>
                    <select 
                      value={config.customBodyFont || ''} 
                      onChange={(e) => handleUpdate('customBodyFont', e.target.value)}
                    >
                      <option value="">Use Theme Preset Default</option>
                      {bodyFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Heading Font (Override)</label>
                    <select 
                      value={config.customHeadingFont || ''} 
                      onChange={(e) => handleUpdate('customHeadingFont', e.target.value)}
                    >
                      <option value="">Use Theme Preset Default</option>
                      {headingFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Header Font (Override)</label>
                    <select 
                      value={config.customHeaderFont || ''} 
                      onChange={(e) => handleUpdate('customHeaderFont', e.target.value)}
                    >
                      <option value="">Match Heading Font</option>
                      {bodyFonts.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>

                  <div className="setup-grid-2">
                    <div className="form-group">
                      <label>Font Size</label>
                      <select 
                        value={config.customFontSize || ''} 
                        onChange={(e) => handleUpdate('customFontSize', e.target.value)}
                      >
                        <option value="">Default</option>
                        {fontSizes.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Line Spacing</label>
                      <select 
                        value={config.customLineHeight || ''} 
                        onChange={(e) => handleUpdate('customLineHeight', e.target.value)}
                      >
                        <option value="">Default</option>
                        {lineHeights.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'headers' && (
                <div className="flex flex-col gap-3 animate-fade">
                  <div className="setup-grid-2">
                    <div className="form-group">
                      <label>Running Headers</label>
                      <select 
                        value={config.customHeaderVisible !== undefined ? String(config.customHeaderVisible) : ''} 
                        onChange={(e) => handleUpdate('customHeaderVisible', e.target.value === '' ? undefined : e.target.value === 'true')}
                      >
                        <option value="">Visible (Default)</option>
                        <option value="false">Hidden</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Page Number Position</label>
                      <select 
                        value={config.customPageNumPosition || 'top-outer'} 
                        onChange={(e) => handleUpdate('customPageNumPosition', e.target.value)}
                      >
                        <option value="top-outer">Top Outer Corners</option>
                        <option value="bottom-center">Bottom Center</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="setup-grid-2">
                    <label className="checkbox-container flex items-center gap-1.5 mt-2">
                      <input 
                        type="checkbox" 
                        checked={config.showHeaderOnFirstPage === true} 
                        onChange={(e) => handleUpdate('showHeaderOnFirstPage', e.target.checked)}
                      />
                      <span className="checkbox-label" style={{ fontSize: '11px' }}>Show header on opening page</span>
                    </label>

                    <label className="checkbox-container flex items-center gap-1.5 mt-2">
                      <input 
                        type="checkbox" 
                        checked={config.showPageNumOnFirstPage === true} 
                        onChange={(e) => handleUpdate('showPageNumOnFirstPage', e.target.checked)}
                      />
                      <span className="checkbox-label" style={{ fontSize: '11px' }}>Show page num on opening page</span>
                    </label>
                  </div>

                  <div className="setup-divider" />
                  <span className="form-sub-label mt-1">Margins (Inches)</span>

                  <div className="setup-grid-4 mt-1">
                    <div className="form-group">
                      <label>Inside</label>
                      <input 
                        type="number" 
                        step="0.05"
                        value={resolvedMargins.inside} 
                        onChange={(e) => handleMarginChange('inside', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Outside</label>
                      <input 
                        type="number" 
                        step="0.05"
                        value={resolvedMargins.outside} 
                        onChange={(e) => handleMarginChange('outside', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Top</label>
                      <input 
                        type="number" 
                        step="0.05"
                        value={resolvedMargins.top} 
                        onChange={(e) => handleMarginChange('top', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Bottom</label>
                      <input 
                        type="number" 
                        step="0.05"
                        value={resolvedMargins.bottom} 
                        onChange={(e) => handleMarginChange('bottom', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'layout' && (
                <div className="flex flex-col gap-3 animate-fade">
                  <div className="form-group">
                    <label>Title Alignment</label>
                    <div className="toggle-group flex mt-1">
                      {['left', 'center', 'right'].map((align) => (
                        <button 
                          key={align}
                          className={`toggle-btn ${config.alignment === align ? 'active' : ''}`}
                          onClick={() => handleUpdate('alignment', align)}
                        >
                          {align === 'left' && <AlignLeft size={16} />}
                          {align === 'center' && <AlignCenter size={16} />}
                          {align === 'right' && <AlignRight size={16} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Chapter Numbering</label>
                    <select 
                      value={config.numberingStyle || 'word-upper'}
                      onChange={(e) => handleUpdate('numberingStyle', e.target.value)}
                    >
                      <option value="word-upper">CHAPTER ONE</option>
                      <option value="word-capitalize">Chapter One</option>
                      <option value="number">Chapter 1</option>
                      <option value="roman-upper">CHAPTER I</option>
                      <option value="none">None (Title Only)</option>
                    </select>
                  </div>

                  <div className="setup-grid-2">
                    <div className="form-group">
                      <label>First Page Offset</label>
                      <select 
                        value={config.customChapterSpacing || ''}
                        onChange={(e) => handleUpdate('customChapterSpacing', e.target.value)}
                      >
                        <option value="">Default Spacing</option>
                        <option value="30px">Compact (30px)</option>
                        <option value="60px">Standard (60px)</option>
                        <option value="90px">Deep Spacing (90px)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="checkbox-container flex items-center gap-2 mt-7">
                        <input 
                          type="checkbox" 
                          checked={config.customDropCaps !== false} 
                          onChange={(e) => handleUpdate('customDropCaps', e.target.checked)} 
                        />
                        <span className="checkbox-label">Elegant Drop Caps</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>First Paragraph Style</label>
                    <select 
                      value={config.openingParagraphStyle || 'small-caps'}
                      onChange={(e) => handleUpdate('openingParagraphStyle', e.target.value)}
                    >
                      <option value="small-caps">Small Caps First Phrase</option>
                      <option value="bold">Bold First Words</option>
                      <option value="uppercase">Uppercase First Phrase</option>
                      <option value="standard">Standard Paragraph</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'ornaments' && (
                <div className="flex flex-col gap-3 animate-fade">
                  <div className="form-group">
                    <label>Chapter Heading Ornament</label>
                    <select 
                      value={config.customDivider || ''}
                      onChange={(e) => handleUpdate('customDivider', e.target.value)}
                    >
                      {ornamentOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Scene Break Symbol</label>
                    <select 
                      value={config.customSceneBreak || ''}
                      onChange={(e) => handleUpdate('customSceneBreak', e.target.value)}
                    >
                      {sceneBreakOptions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  {/* SVG Ornament preview */}
                  {activeTheme?.chapterOpening?.ornamentSvgKey && (
                    <div className="ornament-preview-section">
                      <label className="form-sub-label">Theme Ornament Preview</label>
                      <div className="ornament-preview-box">
                        <div 
                          dangerouslySetInnerHTML={{ 
                            __html: svgOrnaments[activeTheme.chapterOpening.ornamentSvgKey] || ''
                          }}
                          style={{ width: '160px', margin: '0 auto', color: '#2c251e' }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reset to Default Button */}
              <button 
                className="customizer-reset-btn text-accent mt-2 text-left flex items-center gap-1"
                onClick={() => {
                  if(confirm("Reset all custom style overrides to the theme's base settings?")) {
                    onChangeConfig({
                      alignment: 'center',
                      numberingStyle: 'word-upper',
                      dividerStyle: 'ornament',
                      firstPageSpacing: '60px',
                      dropCaps: true,
                      openingParagraphStyle: 'small-caps'
                    });
                  }
                }}
              >
                <span>Reset to Theme Defaults</span>
              </button>

            </div>

            {/* Layout Mock Preview — now shows dual headings */}
            <div className="designer-preview flex flex-col justify-center">
              <span className="designer-preview-tag text-muted">Live Preview</span>
              <div 
                className="chapter-first-page-mock" 
                style={{ 
                  paddingTop: config.customChapterSpacing || '50px',
                  fontFamily: resolvedBodyFont
                }}
              >
                <div className="mock-chapter-header" style={{ textAlign: config.alignment || 'center' }}>
                  {/* Chapter number label (auto-generated) */}
                  {numberingStyle !== 'none' && (
                    <div 
                      className="mock-chapter-number" 
                      style={{ 
                        fontVariant: co.numberVariant || 'all-small-caps', 
                        letterSpacing: co.numberLetterSpacing || '2px', 
                        opacity: 0.65,
                        fontFamily: resolvedHeadingFont,
                        fontSize: co.numberSize || '0.75em',
                        fontWeight: co.numberWeight || 400,
                        marginBottom: co.gapBetweenNumberAndTitle || '6px',
                      }}
                    >
                      {getChapterLabel(1, numberingStyle)}
                    </div>
                  )}

                  {/* Chapter title (user-entered) */}
                  <h2 
                    className="mock-chapter-title" 
                    style={{ 
                      fontSize: co.titleSize ? `calc(${co.titleSize} * 0.85)` : '1.6em',
                      fontWeight: co.titleWeight || 500,
                      letterSpacing: co.titleLetterSpacing || '0px',
                      margin: '4px 0',
                      fontFamily: resolvedHeadingFont
                    }}
                  >
                    The Copper Vial
                  </h2>
                  
                  {/* Ornament */}
                  {config.customDivider !== 'None' && (
                    <>
                      {co.ornamentType === 'svg' && co.ornamentSvgKey && svgOrnaments[co.ornamentSvgKey] ? (
                        <div 
                          className="mock-svg-ornament"
                          dangerouslySetInnerHTML={{ __html: svgOrnaments[co.ornamentSvgKey] }}
                          style={{ 
                            width: '120px', 
                            margin: `${co.gapBetweenTitleAndOrnament || '12px'} ${config.alignment === 'center' ? 'auto' : '0'}`,
                            opacity: 0.6,
                            color: '#2c251e',
                          }}
                        />
                      ) : (
                        <div className="mock-divider" style={{ margin: '16px 0', opacity: 0.6, fontSize: '12px' }}>
                          {config.customDivider || resolvedDivider}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mock-chapter-body" style={{ fontSize: '11px', lineHeight: '1.5', textAlign: 'justify' }}>
                  {config.customDropCaps !== false ? (
                    <p style={{ position: 'relative' }}>
                      <span style={{ float: 'left', fontSize: '3.2em', lineHeight: '0.8', marginRight: '6px', fontWeight: 'bold' }}>I</span>
                      {config.openingParagraphStyle === 'small-caps' && <span style={{ fontVariant: 'small-caps' }}>t was a cold, foggy</span>}
                      {config.openingParagraphStyle === 'bold' && <strong>t was a cold, foggy</strong>}
                      {config.openingParagraphStyle === 'uppercase' && <span>T WAS A COLD, FOGGY</span>}
                      {config.openingParagraphStyle === 'standard' && 't was a cold, foggy'}
                      {' night in London when Aveline Thorne first discovered the copper vial hidden behind a false brick.'}
                    </p>
                  ) : (
                    <p>
                      {config.openingParagraphStyle === 'small-caps' && <span style={{ fontVariant: 'small-caps' }}>It was a cold, foggy</span>}
                      {config.openingParagraphStyle === 'bold' && <strong>It was a cold, foggy</strong>}
                      {config.openingParagraphStyle === 'uppercase' && <span>IT WAS A COLD, FOGGY</span>}
                      {config.openingParagraphStyle === 'standard' && 'It was a cold, foggy'}
                      {' night in London when Aveline Thorne first discovered the copper vial hidden behind a false brick.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer flex justify-end">
          <button className="designer-done-btn" onClick={onClose}>Apply Styling</button>
        </div>
      </div>

      <style>{`
        .designer-modal-content {
          max-width: 800px;
          padding: 24px;
        }

        .designer-description {
          font-size: 13px;
          line-height: 1.5;
        }

        .designer-tabs {
          border-bottom: 1px solid var(--ui-border);
          gap: 4px;
        }

        .designer-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 500;
          color: var(--ui-text-muted);
          border-bottom: 2px solid transparent;
        }

        .designer-tab:hover {
          color: var(--ui-text);
        }

        .designer-tab.active {
          color: var(--ui-accent);
          border-bottom-color: var(--ui-accent);
        }

        .designer-grid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
        }

        .designer-panel {
          padding-right: 16px;
          border-right: 1px solid var(--ui-border);
          min-height: 320px;
        }

        .animate-fade {
          animation: fade 0.2s ease-out;
        }

        @keyframes fade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toggle-group {
          border: 1px solid var(--ui-border);
          border-radius: var(--ui-radius-sm);
          padding: 2px;
          display: inline-flex;
          background-color: var(--ui-panel-bg);
        }

        .toggle-btn {
          padding: 6px 12px;
          color: var(--ui-text-muted);
          border-radius: var(--ui-radius-sm);
        }

        .toggle-btn.active, .toggle-btn:hover {
          background-color: var(--ui-bg);
          color: var(--ui-accent);
          box-shadow: var(--ui-shadow-sm);
        }

        .designer-preview {
          background-color: #faf8f5;
          color: #2c251e;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: var(--ui-radius);
          padding: 20px;
          position: relative;
          display: flex;
          align-items: stretch;
        }

        .designer-preview-tag {
          position: absolute;
          top: 12px;
          left: 16px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
        }

        .chapter-first-page-mock {
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .mock-chapter-title {
          font-weight: 500;
        }

        .mock-chapter-body {
          margin-top: 12px;
        }

        .mock-svg-ornament svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .ornament-preview-section {
          margin-top: 8px;
        }

        .ornament-preview-box {
          background-color: #faf8f5;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: var(--ui-radius-sm);
          padding: 16px;
          margin-top: 6px;
        }

        .ornament-preview-box svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .customizer-reset-btn {
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
        }

        .designer-done-btn {
          background-color: var(--ui-accent);
          color: white;
          padding: 8px 16px;
          border-radius: var(--ui-radius-sm);
          font-size: 13px;
          font-weight: 600;
        }

        .designer-done-btn:hover {
          background-color: var(--ui-accent-hover);
        }
      `}</style>
    </div>
  );
}
