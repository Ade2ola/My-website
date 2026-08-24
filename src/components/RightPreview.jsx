import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, BookOpen, Info } from 'lucide-react';
import { svgOrnaments, getChapterLabel } from '../themes/presets';

export default function RightPreview({
  activeSection,
  sections,
  metadata,
  activeTheme,
  chapterDesigner
}) {
  const [zoom, setZoom] = useState(0.85);
  const [previewMode, setPreviewMode] = useState('paperback');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pages, setPages] = useState([]);

  // ─── Resolve custom style overrides ────────────────────────
  const resolvedBodyFont = chapterDesigner?.customBodyFont || activeTheme?.bodyFont || 'serif';
  const resolvedHeadingFont = chapterDesigner?.customHeadingFont || activeTheme?.headingFont || 'serif';
  const resolvedHeaderFont = chapterDesigner?.customHeaderFont || resolvedHeadingFont || resolvedBodyFont;
  const resolvedFontSize = chapterDesigner?.customFontSize || activeTheme?.fontSize || '15px';
  const resolvedLineHeight = chapterDesigner?.customLineHeight || activeTheme?.lineHeight || '1.5';
  const resolvedDivider = chapterDesigner?.customDivider || activeTheme?.dividerSymbol || '❦';
  const resolvedChapterSpacing = chapterDesigner?.customChapterSpacing || activeTheme?.chapterSpacing || '60px';
  const resolvedDropCaps = chapterDesigner?.customDropCaps !== undefined ? chapterDesigner.customDropCaps : (activeTheme?.dropCaps ?? true);
  const resolvedHeaderVisible = chapterDesigner?.customHeaderVisible !== undefined ? chapterDesigner.customHeaderVisible : true;
  const resolvedPageNumPosition = chapterDesigner?.customPageNumPosition || 'top-outer';
  const resolvedFirstParaStyle = chapterDesigner?.openingParagraphStyle || activeTheme?.firstParagraphStyle || 'standard';
  const resolvedNumberingStyle = chapterDesigner?.numberingStyle || 'word-upper';

  // ─── Resolve margins: chapterDesigner.customMargins → metadata.margins ─
  const resolvedMargins = {
    inside: chapterDesigner?.customMargins?.inside ?? metadata.margins?.inside ?? 0.75,
    outside: chapterDesigner?.customMargins?.outside ?? metadata.margins?.outside ?? 0.5,
    top: chapterDesigner?.customMargins?.top ?? metadata.margins?.top ?? 0.75,
    bottom: chapterDesigner?.customMargins?.bottom ?? metadata.margins?.bottom ?? 0.75,
  };

  // ─── Chapter opening config from theme ────────────────────
  const chapterOpening = activeTheme?.chapterOpening || {};

  // ─── Compute chapter index ────────────────────────────────
  const isChapterType = activeSection?.type === 'chapter';
  let chapterIndex = 0;
  if (isChapterType && sections && activeSection) {
    const chapterSections = sections.filter(s => s.type === 'chapter');
    chapterIndex = chapterSections.findIndex(s => s.id === activeSection.id) + 1;
  }
  const chapterLabel = isChapterType ? getChapterLabel(chapterIndex, resolvedNumberingStyle) : '';

  // ─── Trim dimensions ─────────────────────────────────────
  const getTrimDimensions = () => {
    if (previewMode === 'epub') return { width: 400, height: 600 };
    if (previewMode === 'kindle') return { width: 360, height: 560 };
    const size = metadata.trimSize || '6" x 9"';
    if (size === '5" x 8"') return { width: 480, height: 768 };
    if (size === '5.5" x 8.5"') return { width: 528, height: 816 };
    return { width: 576, height: 864 };
  };

  const { width, height } = getTrimDimensions();

  const [lastSectionId, setLastSectionId] = useState(activeSection?.id);

  // ─── Pagination ───────────────────────────────────────────
  useEffect(() => {
    if (!activeSection) {
      setPages([]);
      return;
    }

    const { type, content, title } = activeSection;

    if (type === 'front-matter' || type === 'back-matter') {
      setPages([{
        id: 'fm-page-1',
        title: title,
        content: content,
        isChapterFirstPage: true,
        isFrontBackMatter: true,
        headerText: '',
        pageNumber: 1
      }]);
      if (activeSection.id !== lastSectionId) {
        setLastSectionId(activeSection.id);
        setCurrentPageIndex(0);
      }
      return;
    }

    // Debounce chapter text pagination calculation to eliminate typing lag
    const timer = setTimeout(() => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const elements = Array.from(tempDiv.childNodes);

      let pageList = [];
      let currentBucket = [];
      let currentLength = 0;

      const fSizeNum = parseInt(resolvedFontSize) || 15;
      const targetLength = Math.round(1300 * Math.pow(15 / fSizeNum, 1.8));

      elements.forEach((el) => {
        const outerHtml = el.nodeType === Node.TEXT_NODE ? el.textContent : el.outerHTML || '';
        const textLen = el.textContent ? el.textContent.length : 0;

        if (currentLength + textLen > targetLength && currentBucket.length > 0) {
          pageList.push([...currentBucket]);
          currentBucket = [outerHtml];
          currentLength = textLen;
        } else {
          currentBucket.push(outerHtml);
          currentLength += textLen;
        }
      });

      if (currentBucket.length > 0) {
        pageList.push(currentBucket);
      }

      if (pageList.length === 0) {
        pageList = [['<p><br></p>']];
      }

      const authorHeader = metadata.runningHeaderAuthor || metadata.author || '';
      const titleHeader = metadata.runningHeader || metadata.title || '';

      const compiledPages = pageList.map((paragraphs, idx) => {
        const isFirst = idx === 0;
        const pageNum = idx + 1;
        const isEvenPage = pageNum % 2 === 0; // Even = left page

        return {
          id: `page-${idx}`,
          title: title,
          content: paragraphs.join(''),
          isChapterFirstPage: isFirst,
          isFrontBackMatter: false,
          authorHeader: authorHeader,
          titleHeader: titleHeader,
          pageNumber: pageNum,
          isEvenPage: isEvenPage,
        };
      });

      setPages(compiledPages);

      // Only reset the page view when switching chapters, NOT when typing
      if (activeSection.id !== lastSectionId) {
        setLastSectionId(activeSection.id);
        setCurrentPageIndex(0);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [activeSection?.id, activeSection?.content, metadata, previewMode, resolvedFontSize, lastSectionId]);

  // ─── Page navigation ──────────────────────────────────────
  const isPrintMode = previewMode === 'paperback' || previewMode === 'hardcover';

  const handlePrevPage = () => {
    setCurrentPageIndex(prev => Math.max(0, prev - (isPrintMode ? 2 : 1)));
  };

  const handleNextPage = () => {
    if (isPrintMode) {
      if (currentPageIndex + 2 < pages.length) setCurrentPageIndex(prev => prev + 2);
    } else {
      if (currentPageIndex + 1 < pages.length) setCurrentPageIndex(prev => prev + 1);
    }
  };

  // ─── Page styling ─────────────────────────────────────────
  const getPageStyle = (isChapterFirstPage) => ({
    fontFamily: resolvedBodyFont,
    fontSize: resolvedFontSize,
    lineHeight: resolvedLineHeight,
    textAlign: activeTheme?.justify ? 'justify' : 'left',
    paddingLeft: `${resolvedMargins.inside * 96}px`,
    paddingRight: `${resolvedMargins.outside * 96}px`,
    paddingTop: `${resolvedMargins.top * 96}px`,
    paddingBottom: `${resolvedMargins.bottom * 96}px`,
  });

  const getPaperColorHex = () => {
    if (previewMode === 'kindle') return '#f2f2f2';
    const color = metadata.paperColor || 'cream';
    if (color === 'cream') return '#fdfbf7';
    if (color === 'grey') return '#f5f5f7';
    return '#ffffff';
  };

  const getPaperTextHex = () => {
    if (previewMode === 'kindle') return '#111111';
    const color = metadata.paperColor || 'cream';
    if (color === 'cream') return '#2e2a24';
    return '#111111';
  };

  // ─── Header / page-number visibility logic ────────────────
  const shouldShowHeader = (isFirst) => {
    if (isFirst) return chapterDesigner?.showHeaderOnFirstPage === true && resolvedHeaderVisible;
    return resolvedHeaderVisible;
  };

  const shouldShowPageNumber = (isFirst) => {
    if (resolvedPageNumPosition === 'hidden') return false;
    if (isFirst) return chapterDesigner?.showPageNumOnFirstPage === true;
    return true;
  };

  const isPageNumTopOuter = resolvedPageNumPosition === 'top-outer';
  const isPageNumBottomCenter = resolvedPageNumPosition === 'bottom-center';

  // ─── First-paragraph CSS class ────────────────────────────
  const getFirstParaClass = () => {
    if (resolvedFirstParaStyle === 'small-caps') return 'fp-small-caps';
    if (resolvedFirstParaStyle === 'bold') return 'fp-bold';
    if (resolvedFirstParaStyle === 'uppercase') return 'fp-uppercase';
    return '';
  };

  // ─── Chapter opening layout helpers ───────────────────────
  const coLayout = chapterOpening.layout || 'centered';
  const isCentered = coLayout === 'centered';

  const renderChapterOpeningBlock = (page) => {
    if (!page.isChapterFirstPage || page.isFrontBackMatter) return null;

    const topMarginVal = chapterOpening.topMargin || resolvedChapterSpacing;

    return (
      <div
        className="chapter-opening-block"
        style={{
          textAlign: isCentered ? 'center' : 'left',
          paddingTop: topMarginVal,
        }}
      >
        {/* Line 1: Auto-generated chapter label */}
        {chapterLabel && (
          <div
            className="chapter-number-label"
            style={{
              fontFamily: resolvedHeadingFont,
              fontSize: chapterOpening.numberSize || '0.75em',
              letterSpacing: chapterOpening.numberLetterSpacing || '3px',
              fontWeight: chapterOpening.numberWeight || 400,
              fontVariant: chapterOpening.numberVariant || 'all-small-caps',
              marginBottom: chapterOpening.gapBetweenNumberAndTitle || '10px',
              opacity: 0.75,
            }}
          >
            {chapterLabel}
          </div>
        )}

        {/* Line 2: User-entered chapter title */}
        <div
          className="chapter-title-label"
          style={{
            fontFamily: resolvedHeadingFont,
            fontSize: chapterOpening.titleSize || '1.9em',
            fontWeight: chapterOpening.titleWeight || 500,
            letterSpacing: chapterOpening.titleLetterSpacing || '0.5px',
            marginBottom: chapterOpening.gapBetweenTitleAndOrnament || '18px',
          }}
        >
          {page.title}
        </div>

        {/* Ornament between title and body */}
        {renderOrnament()}

        {/* Decorative borders */}
        {chapterOpening.decorativeBorder && renderDecorativeBorders()}
      </div>
    );
  };

  const renderOrnament = () => {
    const ornType = chapterOpening.ornamentType || 'symbol';
    const ornSvgKey = chapterOpening.ornamentSvgKey;
    const gapAfter = chapterOpening.gapBetweenOrnamentAndBody || '28px';

    if (ornType === 'svg' && ornSvgKey && svgOrnaments[ornSvgKey]) {
      return (
        <div
          className="chapter-svg-ornament"
          dangerouslySetInnerHTML={{ __html: svgOrnaments[ornSvgKey] }}
          style={{
            width: '140px',
            margin: isCentered ? '0 auto' : '0',
            opacity: 0.7,
            marginBottom: gapAfter,
          }}
        />
      );
    }

    // Symbol-type ornament (fallback to divider)
    const symbol = resolvedDivider;
    if (!symbol || symbol === 'None') return null;

    return (
      <div
        className="chapter-symbol-ornament"
        style={{
          fontSize: '14px',
          opacity: 0.6,
          marginBottom: gapAfter,
        }}
      >
        {symbol}
      </div>
    );
  };

  const renderDecorativeBorders = () => {
    if (!svgOrnaments.ornateCorner) return null;
    const cornerStyle = {
      position: 'absolute',
      width: '36px',
      height: '36px',
      opacity: 0.7,
      pointerEvents: 'none',
    };
    return (
      <>
        {/* Top-left */}
        <div
          className="decorative-corner"
          dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }}
          style={{ ...cornerStyle, top: '16px', left: '16px', transform: 'rotate(0deg)' }}
        />
        {/* Top-right */}
        <div
          className="decorative-corner"
          dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }}
          style={{ ...cornerStyle, top: '16px', right: '16px', transform: 'rotate(90deg)' }}
        />
        {/* Bottom-right */}
        <div
          className="decorative-corner"
          dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }}
          style={{ ...cornerStyle, bottom: '16px', right: '16px', transform: 'rotate(180deg)' }}
        />
        {/* Bottom-left */}
        <div
          className="decorative-corner"
          dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }}
          style={{ ...cornerStyle, bottom: '16px', left: '16px', transform: 'rotate(270deg)' }}
        />
      </>
    );
  };

  // ─── Running Header renderer ──────────────────────────────
  const renderRunningHeader = (page, isLeftPage) => {
    const isFirst = page.isChapterFirstPage;
    const showHeader = shouldShowHeader(isFirst);
    const showPageNum = shouldShowPageNumber(isFirst) && isPageNumTopOuter;

    // By default, chapter opening pages have NO headers
    if (isFirst && !showHeader && !showPageNum) return null;

    const headerWrapperStyle = {
      fontFamily: resolvedHeaderFont,
      position: 'absolute',
      top: '32px',
      left: `${resolvedMargins.inside * 96}px`,
      right: `${resolvedMargins.outside * 96}px`,
    };

    if (isLeftPage) {
      // LEFT page (even): [pageNum] ... [author name]
      return (
        <div className="print-page-header-wrapper" style={headerWrapperStyle}>
          <div className="page-header-flex flex items-center justify-between">
            <span className="header-page-num">
              {showPageNum ? page.pageNumber : ''}
            </span>
            <span className="header-title-text">
              {showHeader ? (page.authorHeader || '') : ''}
            </span>
          </div>
          {(showHeader || showPageNum) && <div className="header-divider-line" />}
        </div>
      );
    }

    // RIGHT page (odd): [book title] ... [pageNum]
    return (
      <div className="print-page-header-wrapper" style={headerWrapperStyle}>
        <div className="page-header-flex flex items-center justify-between">
          <span className="header-title-text">
            {showHeader ? (page.titleHeader || '') : ''}
          </span>
          <span className="header-page-num">
            {showPageNum ? page.pageNumber : ''}
          </span>
        </div>
        {(showHeader || showPageNum) && <div className="header-divider-line" />}
      </div>
    );
  };

  // ─── Body content wrapper classes ─────────────────────────
  const getBodyClasses = (page) => {
    const classes = ['page-body-content'];
    if (page.isChapterFirstPage && !page.isFrontBackMatter) {
      if (resolvedDropCaps) classes.push('has-drop-cap');
      const fpClass = getFirstParaClass();
      if (fpClass) classes.push(fpClass);
    }
    return classes.join(' ');
  };

  // ─── Render a single print page ───────────────────────────
  const renderPrintPage = (page, isLeftPage, side) => {
    if (!page) return null;

    const bodyContentMarginTop = page.isChapterFirstPage && !page.isFrontBackMatter
      ? '0' // Spacing handled by chapter opening block
      : '0';

    return (
      <div
        className={`print-page page-container ${side}-page`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: getPaperColorHex(),
          color: getPaperTextHex(),
          ...getPageStyle(page.isChapterFirstPage),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="bleed-line" />

        {/* Running header */}
        {renderRunningHeader(page, isLeftPage)}

        {/* Chapter opening block (heading area) */}
        {renderChapterOpeningBlock(page)}

        {/* Front/back matter title */}
        {page.isChapterFirstPage && page.isFrontBackMatter && (
          <div
            className="chapter-title-label"
            style={{
              fontFamily: resolvedHeadingFont,
              fontSize: '1.8em',
              fontWeight: 500,
              textAlign: chapterDesigner?.alignment || 'center',
              marginBottom: '30px',
              paddingTop: resolvedChapterSpacing,
            }}
          >
            {page.title}
          </div>
        )}

        {/* Text body */}
        <div
          className={getBodyClasses(page)}
          dangerouslySetInnerHTML={{ __html: page.content }}
          style={{
            textIndent: activeTheme?.indentation || '1.5em',
            marginTop: bodyContentMarginTop,
          }}
        />

        {/* Bottom center page number (optional) */}
        {isPageNumBottomCenter && shouldShowPageNumber(page.isChapterFirstPage) && (
          <div className="page-number-footer text-center">
            {page.pageNumber}
          </div>
        )}
      </div>
    );
  };

  // ─── Render e-reader page ─────────────────────────────────
  const renderEReaderPage = (page) => {
    if (!page) return null;

    return (
      <div className="device-page-flow flex-col justify-between h-full">
        {/* Chapter opening */}
        {renderChapterOpeningBlock(page)}

        {/* Front/back matter title */}
        {page.isChapterFirstPage && page.isFrontBackMatter && (
          <div
            className="chapter-title-label"
            style={{
              fontFamily: resolvedHeadingFont,
              fontSize: '1.6em',
              fontWeight: 500,
              textAlign: 'center',
              marginBottom: '20px',
              paddingTop: '40px',
            }}
          >
            {page.title}
          </div>
        )}

        {/* Body */}
        <div
          className={getBodyClasses(page)}
          dangerouslySetInnerHTML={{ __html: page.content }}
          style={{
            textIndent: activeTheme?.indentation || '1.5em',
            marginTop: page.isChapterFirstPage ? '10px' : '0',
          }}
        />

        {/* Footer */}
        <div className="device-footer text-center mt-auto" style={{ fontSize: '11px', opacity: 0.6 }}>
          Page {currentPageIndex + 1} of {pages.length}
        </div>
      </div>
    );
  };

  // ─── Component render ─────────────────────────────────────
  return (
    <div className="right-preview flex flex-col flex-1">
      {/* Top Preview Controls */}
      <div className="preview-toolbar flex items-center justify-between">
        <div className="flex items-center gap-1">
          {['paperback', 'hardcover', 'epub', 'kindle'].map((mode) => (
            <button
              key={mode}
              className={`toolbar-mode-btn ${previewMode === mode ? 'active' : ''}`}
              onClick={() => setPreviewMode(mode)}
              style={{ textTransform: 'capitalize' }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button className="zoom-btn" onClick={() => setZoom(z => Math.max(0.4, z - 0.05))}><ZoomOut size={14} /></button>
          <span className="zoom-text">{Math.round(zoom * 100)}%</span>
          <button className="zoom-btn" onClick={() => setZoom(z => Math.min(1.5, z + 0.05))}><ZoomIn size={14} /></button>
        </div>
      </div>

      {/* Pages Workspace */}
      <div className="preview-workspace flex-1 flex items-center justify-center">
        {pages.length === 0 ? (
          <div className="preview-no-content flex items-center gap-2">
            <Info size={16} />
            <span>No preview available</span>
          </div>
        ) : (
          <div
            className="preview-viewport"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            {/* E-Reader Wrappers */}
            {(previewMode === 'epub' || previewMode === 'kindle') ? (
              <div className={`device-frame ${previewMode}`}>
                <div
                  className="device-screen page-container"
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: getPaperColorHex(),
                    color: getPaperTextHex(),
                    ...getPageStyle(false),
                  }}
                >
                  {pages[currentPageIndex] && renderEReaderPage(pages[currentPageIndex])}
                </div>
              </div>
            ) : (
              /* Print Layout (Paperback / Hardcover) */
              <div className={`print-spread-wrapper ${previewMode}`}>
                {/* Left Page (Even page numbers) */}
                {pages[currentPageIndex]
                  ? renderPrintPage(pages[currentPageIndex], true, 'left')
                  : null}

                {/* Crease Shadow */}
                <div className="spread-crease" />

                {/* Right Page (Odd page numbers) */}
                {pages[currentPageIndex + 1] ? (
                  renderPrintPage(pages[currentPageIndex + 1], false, 'right')
                ) : (
                  isPrintMode && (
                    <div
                      className="print-page page-container right-page empty-page"
                      style={{
                        width: `${width}px`,
                        height: `${height}px`,
                        backgroundColor: getPaperColorHex(),
                      }}
                    />
                  )
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {pages.length > 0 && (
        <div className="preview-pagination-bar flex items-center justify-center gap-4">
          <button
            className="pager-nav-btn"
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <span className="pager-indicator">
            {isPrintMode ? (
              <span>
                Pages {currentPageIndex + 1}
                {currentPageIndex + 1 < pages.length ? ` - ${currentPageIndex + 2}` : ''} of {pages.length}
              </span>
            ) : (
              <span>Page {currentPageIndex + 1} of {pages.length}</span>
            )}
          </span>

          <button
            className="pager-nav-btn"
            onClick={handleNextPage}
            disabled={
              isPrintMode
                ? currentPageIndex + 2 >= pages.length
                : currentPageIndex + 1 >= pages.length
            }
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <style>{`
        /* ───────────────────────────────────────────────
           LAYOUT SHELL
        ─────────────────────────────────────────────── */
        .right-preview {
          background-color: var(--ui-app-bg);
          height: 100%;
          overflow: hidden;
        }

        .preview-toolbar {
          padding: 8px 16px;
          border-bottom: 1px solid var(--ui-border);
          background-color: var(--ui-bg);
        }

        .toolbar-mode-btn {
          font-size: 12px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 4px;
          color: var(--ui-text-muted);
        }

        .toolbar-mode-btn:hover, .toolbar-mode-btn.active {
          background-color: var(--ui-panel-bg);
          color: var(--ui-text);
        }

        .zoom-btn {
          color: var(--ui-text-muted);
          padding: 4px;
          border-radius: 4px;
        }

        .zoom-btn:hover {
          color: var(--ui-text);
          background: var(--ui-panel-bg);
        }

        .zoom-text {
          font-size: 12px;
          font-weight: 500;
          min-width: 36px;
          text-align: center;
        }

        .preview-workspace {
          overflow: auto;
          padding: 40px;
          position: relative;
        }

        .preview-no-content {
          color: var(--ui-text-muted);
          font-size: 13px;
        }

        .preview-viewport {
          transition: transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1);
        }

        /* ───────────────────────────────────────────────
           E-READER DEVICE FRAMES
        ─────────────────────────────────────────────── */
        .device-frame.kindle {
          border: 16px solid #2d3748;
          border-radius: 20px;
          box-shadow: var(--ui-shadow-lg);
          background-color: #2d3748;
        }

        .device-frame.epub {
          border: 12px solid #1a202c;
          border-radius: 16px;
          box-shadow: var(--ui-shadow-lg);
          background-color: #1a202c;
        }

        .device-screen {
          overflow-y: hidden;
        }

        .device-page-flow {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* ───────────────────────────────────────────────
           PRINT SPREAD
        ─────────────────────────────────────────────── */
        .print-spread-wrapper {
          display: flex;
          position: relative;
          background-color: rgba(0, 0, 0, 0.03);
          border-radius: 4px;
          box-shadow: var(--ui-shadow-lg);
        }

        .print-spread-wrapper.hardcover {
          padding: 4px;
          background-color: #5c1d24;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }

        .print-page {
          box-shadow: none;
        }

        .left-page {
          border-top-left-radius: 2px;
          border-bottom-left-radius: 2px;
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }

        .right-page {
          border-top-right-radius: 2px;
          border-bottom-right-radius: 2px;
          border-left: 1px solid rgba(0, 0, 0, 0.05);
        }

        .empty-page {
          background-color: #eaeaea;
        }

        .spread-crease {
          width: 24px;
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          transform: translateX(-50%);
          z-index: 10;
          background: linear-gradient(
            to right,
            rgba(0, 0, 0, 0.06) 0%,
            rgba(0, 0, 0, 0.15) 45%,
            rgba(0, 0, 0, 0.25) 50%,
            rgba(0, 0, 0, 0.15) 55%,
            rgba(0, 0, 0, 0.06) 100%
          );
          pointer-events: none;
        }

        .bleed-line {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          bottom: 12px;
          border: 1px dashed rgba(239, 68, 68, 0.15);
          pointer-events: none;
          border-radius: 2px;
        }

        /* ───────────────────────────────────────────────
           RUNNING HEADERS
        ─────────────────────────────────────────────── */
        .print-page-header-wrapper {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          opacity: 0.7;
        }

        .page-header-flex {
          height: 18px;
        }

        .header-title-text {
          font-weight: 500;
        }

        .header-page-num {
          font-weight: 600;
        }

        .header-divider-line {
          height: 1px;
          background-color: rgba(0, 0, 0, 0.06);
          margin-top: 4px;
        }

        body.dark .header-divider-line {
          background-color: rgba(255, 255, 255, 0.06);
        }

        /* ───────────────────────────────────────────────
           CHAPTER OPENING
        ─────────────────────────────────────────────── */
        .chapter-opening-block {
          position: relative;
        }

        .chapter-number-label {
          text-transform: uppercase;
        }

        .chapter-title-label {
          line-height: 1.2;
        }

        .chapter-svg-ornament svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .chapter-symbol-ornament {
          letter-spacing: 2px;
        }

        .decorative-corner svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        /* ───────────────────────────────────────────────
           PAGE BODY TEXT
        ─────────────────────────────────────────────── */
        .page-body-content p {
          margin-bottom: 0.8em;
          text-align: justify;
        }

        .page-body-content ul, .page-body-content ol {
          margin-left: 1.5em;
          margin-bottom: 0.8em;
        }

        /* ─── Drop Caps ─────────────────────────────── */
        .page-body-content.has-drop-cap > p:first-child::first-letter {
          float: left;
          font-size: 3.4em;
          line-height: 0.8;
          margin-right: 6px;
          margin-top: 4px;
          font-weight: 600;
          font-family: inherit;
        }

        /* ─── First Paragraph Styles ────────────────── */
        .page-body-content.fp-small-caps > p:first-child::first-line {
          font-variant: small-caps;
          font-size: 1.05em;
        }

        .page-body-content.fp-bold > p:first-child::first-line {
          font-weight: 700;
        }

        .page-body-content.fp-uppercase > p:first-child::first-line {
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ───────────────────────────────────────────────
           PAGE NUMBER FOOTER
        ─────────────────────────────────────────────── */
        .page-number-footer {
          font-size: 11px;
          position: absolute;
          bottom: 36px;
          left: 0;
          right: 0;
          opacity: 0.6;
        }

        /* ───────────────────────────────────────────────
           PAGINATION BAR
        ─────────────────────────────────────────────── */
        .preview-pagination-bar {
          padding: 10px;
          border-top: 1px solid var(--ui-border);
          background-color: var(--ui-bg);
        }

        .pager-nav-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 500;
          color: var(--ui-text);
          padding: 6px 12px;
          border-radius: 6px;
        }

        .pager-nav-btn:hover:not(:disabled) {
          background-color: var(--ui-panel-bg);
        }

        .pager-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pager-indicator {
          font-size: 12px;
          color: var(--ui-text-muted);
        }
      `}</style>
    </div>
  );
}
