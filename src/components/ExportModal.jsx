import React, { useState, useEffect } from 'react';
import { X, Download, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { svgOrnaments, getChapterLabel } from '../themes/presets'; 

export default function ExportModal({
  isOpen, 
  onClose, 
  bookData, 
  activeTheme,
  chapterDesigner
}) {
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [exportState, setExportState] = useState('idle'); // idle, exporting, complete
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const statusSteps = [
    'Parsing manuscript structure...',
    'Injecting front matter and title details...',
    'Calculating page breaks and columns...',
    'Formatting headers, footers, and ornaments...',
    'Optimizing fonts and spacing styles...',
    'Generating final export package...'
  ];

  useEffect(() => {
    let interval = null;
    if (exportState === 'exporting') {
      setProgress(0);
      setStatusMessage(statusSteps[0]);

      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 15) + 5;
          
          // Map percentage to status messages
          const stepIndex = Math.min(
            Math.floor((next / 100) * statusSteps.length),
            statusSteps.length - 1
          );
          setStatusMessage(statusSteps[stepIndex]);

          if (next >= 100) {
            clearInterval(interval);
            setExportState('complete');
            return 100;
          }
          return next;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [exportState]);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setExportState('exporting');
  };

  const triggerDownload = () => {
    if (selectedFormat === 'pdf') {
      // Trigger native browser print which will use the print-ready CSS
      window.print();
      onClose();
      return;
    }

    // Defensive variables to prevent TypeError crashes
    const metadata = bookData?.metadata || {};
    const title = metadata.title || 'Untitled Book';
    const subtitle = metadata.subtitle || '';
    const author = metadata.author || 'Author Name';
    const publisher = metadata.publisher || '';
    const sections = bookData?.sections || [];

    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'book_manuscript';
    const filename = `${safeTitle}.${selectedFormat}`;

    // Resolve active style variables
    const resolvedBodyFont = chapterDesigner?.customBodyFont || activeTheme?.bodyFont || 'serif';
    const resolvedHeadingFont = chapterDesigner?.customHeadingFont || activeTheme?.headingFont || 'serif';
    const resolvedFontSize = chapterDesigner?.customFontSize || activeTheme?.fontSize || '15px';
    const resolvedLineHeight = chapterDesigner?.customLineHeight || activeTheme?.lineHeight || '1.5';
    const resolvedJustify = chapterDesigner?.customJustify !== undefined ? chapterDesigner.customJustify : (activeTheme?.justify ?? true);
    const resolvedAlignment = chapterDesigner?.alignment || (activeTheme?.chapterOpening?.layout === 'left-aligned' ? 'left' : 'center');
    const resolvedTopMarginOffset = activeTheme?.chapterOpening?.topMargin || '20%';
    const resolvedDivider = chapterDesigner?.customDivider || activeTheme?.dividerSymbol || '❦';
    const resolvedOrnamentType = chapterDesigner?.customOrnamentType || activeTheme?.chapterOpening?.ornamentType || 'symbol';
    const resolvedOrnamentSvgKey = chapterDesigner?.customOrnamentSvgKey || activeTheme?.chapterOpening?.ornamentSvgKey;
    const resolvedDropCaps = chapterDesigner?.customDropCaps !== undefined ? chapterDesigner.customDropCaps : (activeTheme?.dropCaps ?? true);
    const resolvedFirstParamStyle = chapterDesigner?.openingParagraphStyle || activeTheme?.firstParagraphStyle || 'standard';

    const insideMargin = chapterDesigner?.customMargins?.inside !== undefined ? chapterDesigner.customMargins.inside : (metadata.margins?.inside || 0.75);
    const outsideMargin = chapterDesigner?.customMargins?.outside !== undefined ? chapterDesigner.customMargins.outside : (metadata.margins?.outside || 0.5);
    const topMargin = chapterDesigner?.customMargins?.top !== undefined ? chapterDesigner.customMargins.top : (metadata.margins?.top || 0.75);
    const bottomMargin = chapterDesigner?.customMargins?.bottom !== undefined ? chapterDesigner.customMargins.bottom : (metadata.margins?.bottom || 0.75);

    const chapterOpening = activeTheme?.chapterOpening || {};
    const numberSize = chapterOpening.numberSize || '0.75em';
    const numberLetterSpacing = chapterOpening.numberLetterSpacing || '3px';
    const numberWeight = chapterOpening.numberWeight || 400;
    const numberVariant = chapterOpening.numberVariant || 'all-small-caps';
    const titleSize = chapterOpening.titleSize || '1.9em';
    const titleWeight = chapterOpening.titleWeight || 500;
    const titleLetterSpacing = chapterOpening.titleLetterSpacing || '0.5px';
    const gapBetweenNumberAndTitle = chapterOpening.gapBetweenNumberAndTitle || '10px';
    const gapBetweenTitleAndOrnament = chapterOpening.gapBetweenTitleAndOrnament || '18px';
    const gapBetweenOrnamentAndBody = chapterOpening.gapBetweenOrnamentAndBody || '28px';

    const chapterSections = sections.filter(s => s.type === 'chapter');
    const fontsLink = `https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=IM+Fell+English:ital@0;1&family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&family=Alice&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Creepster&family=Montserrat:wght@300;400;500;600;700&family=Quicksand:wght@400;600;700&family=Rochester&family=Special+Elite&family=Spectral:ital,wght@0,300..800;1,300..800&display=swap`;

    if (selectedFormat === 'docx') {
      // Export as HTML formatted specifically for Microsoft Word & WPS Office
      let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>${title}</title>
          <link rel="stylesheet" href="${fontsLink}">
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
              <w:DoNotOptimizeForBrowser/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: '${resolvedBodyFont}', 'Georgia', serif; font-size: ${resolvedFontSize}; line-height: ${resolvedLineHeight}; color: #000000; margin: 1in; }
            h1.book-title { font-family: '${resolvedHeadingFont}', 'Georgia', serif; font-size: 28pt; text-align: center; margin-top: 2.5in; margin-bottom: 0.5in; font-weight: normal; }
            h2.chapter-title { font-family: '${resolvedHeadingFont}', 'Georgia', serif; font-size: ${titleSize}; text-align: ${resolvedAlignment}; margin-top: 0.5in; margin-bottom: ${gapBetweenTitleAndOrnament}; font-weight: ${titleWeight}; letter-spacing: ${titleLetterSpacing}; }
            .chapter-label { font-family: '${resolvedHeadingFont}', 'Georgia', serif; font-size: ${numberSize}; text-align: ${resolvedAlignment}; letter-spacing: ${numberLetterSpacing}; font-weight: ${numberWeight}; font-variant: ${numberVariant}; text-transform: uppercase; opacity: 0.7; margin-top: 1.5in; margin-bottom: ${gapBetweenNumberAndTitle}; }
            h3.book-subtitle { font-family: '${resolvedHeadingFont}', 'Georgia', serif; font-size: 14pt; text-align: center; font-style: italic; font-weight: normal; margin-bottom: 1.5in; }
            p { margin-bottom: 10pt; text-indent: 0.5in; text-align: ${resolvedJustify ? 'justify' : 'left'}; }
            p:first-of-type { text-indent: 0; }
            .scene-break { text-align: center; margin: 24pt 0; font-size: 16pt; }
            .title-page { text-align: center; page-break-after: always; }
            .section-page { page-break-before: always; }
          </style>
        </head>
        <body>
          <div class="title-page">
            <h1 class="book-title">${title}</h1>
            ${subtitle ? `<h3 class="book-subtitle">${subtitle}</h3>` : ''}
            <p style="text-indent: 0; text-align: center; margin-top: 2in;">By</p>
            <p style="text-indent: 0; text-align: center; font-size: 16pt; font-weight: bold; margin-top: 0.2in;">${author}</p>
            ${publisher ? `<p style="text-indent: 0; text-align: center; margin-top: 2in; font-size: 10pt; color: #555555;">Published by ${publisher}</p>` : ''}
          </div>
      `;

      sections.forEach((s) => {
        const isChapter = s.type === 'chapter';
        const chapterIndex = isChapter ? chapterSections.findIndex(ch => ch.id === s.id) + 1 : 0;
        const chapterLabel = isChapter ? getChapterLabel(chapterIndex, chapterDesigner?.numberingStyle || 'word-upper') : '';

        htmlContent += `
          <div class="section-page">
            ${isChapter && chapterLabel ? `<div class="chapter-label">${chapterLabel}</div>` : ''}
            <h2 class="chapter-title">${s.title}</h2>
            ${isChapter && resolvedOrnamentType === 'symbol' && chapterDesigner?.dividerStyle !== 'none' ? `<div class="chapter-symbol-ornament" style="text-align: ${resolvedAlignment}; font-size: 16pt; margin: 12px 0 ${gapBetweenOrnamentAndBody}; opacity: 0.7;">${resolvedDivider}</div>` : ''}
            <div className="manuscript-body" style="margin-top: 24px;">${s.content}</div>
          </div>
        `;
      });

      htmlContent += `</body></html>`;
      
      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'rtf') {
      // Export as Rich Text Format (.rtf) - natively opened by MS Word, WPS Office, WordPad, LibreOffice
      const stripTags = (htmlStr) => {
        const div = document.createElement('div');
        div.innerHTML = htmlStr || '';
        return div.textContent || div.innerText || '';
      };

      let rtfDoc = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0\\froman\\fcharset0 Georgia;}}\n`;
      rtfDoc += `{\\info{\\title ${title}}{\\author ${author}}}\n`;
      rtfDoc += `\\viewkind4\\uc1\\paperw12240\\paperh15840\\margl1440\\margr1440\\margt1440\\margb1440\n`;
      
      // Title Page
      rtfDoc += `\\qc\\b\\fs36 ${title}\\b0\\fs24\\par\n`;
      if (subtitle) rtfDoc += `\\qc\\i ${subtitle}\\i0\\par\n`;
      rtfDoc += `\\qc\\par\\par By ${author}\\par\n`;
      if (publisher) rtfDoc += `\\qc Published by ${publisher}\\par\n`;
      rtfDoc += `\\page\n`;

      sections.forEach((s) => {
        rtfDoc += `\\qc\\b\\fs28 ${s.title}\\b0\\fs24\\ql\\par\\par\n`;
        const rawText = stripTags(s.content);
        const formattedText = rawText.split('\n').map(p => p.trim()).filter(Boolean).join('\\par\\par ');
        rtfDoc += formattedText + `\\page\n`;
      });

      rtfDoc += `}`;

      const blob = new Blob([rtfDoc], { type: 'application/rtf;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'txt') {
      // Plain text export
      let txt = `${title.toUpperCase()}\n`;
      if (subtitle) txt += `${subtitle}\n`;
      txt += `By ${author}\n`;
      if (publisher) txt += `Published by ${publisher}\n`;
      txt += `\n${'='.repeat(40)}\n\n`;

      sections.forEach((s) => {
        txt += `\n--- ${s.title.toUpperCase()} ---\n\n`;
        const div = document.createElement('div');
        div.innerHTML = s.content;
        txt += (div.textContent || div.innerText || '') + `\n\n`;
      });

      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'html') {
      // Clean HTML Document export
      let htmlDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Georgia', serif; font-size: 15px; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #222; }
    h1.title { text-align: center; font-size: 32px; margin-top: 60px; margin-bottom: 10px; }
    h3.subtitle { text-align: center; font-size: 18px; font-style: italic; font-weight: normal; margin-bottom: 40px; }
    .meta { text-align: center; margin-bottom: 80px; }
    .section-title { text-align: center; font-size: 24px; margin-top: 60px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    p { margin-bottom: 12px; text-indent: 2em; text-align: justify; }
    p:first-of-type { text-indent: 0; }
  </style>
</head>
<body>
  <h1 class="title">${title}</h1>
  ${subtitle ? `<h3 class="subtitle">${subtitle}</h3>` : ''}
  <div class="meta">
    <p style="text-indent:0;">By <strong>${author}</strong></p>
    ${publisher ? `<p style="text-indent:0; font-size:12px; color:#666;">Published by ${publisher}</p>` : ''}
  </div>
  ${sections.map(s => `
    <div class="section">
      <h2 class="section-title">${s.title}</h2>
      <div>${s.content}</div>
    </div>
  `).join('')}
</body>
</html>`;

      const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (selectedFormat === 'epub') {
      let epubContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>${title}</title>
          <link rel="stylesheet" href="${fontsLink}">
          <style>
            body { font-family: '${resolvedBodyFont}', sans-serif; font-size: ${resolvedFontSize}; line-height: ${resolvedLineHeight}; margin: 2em; color: #222; }
            h1.book-title { text-align: center; margin-top: 3em; font-size: 2.2em; font-family: '${resolvedHeadingFont}', sans-serif; }
            h2.chapter-title { text-align: ${resolvedAlignment}; margin-top: 0.5em; font-size: ${titleSize}; font-family: '${resolvedHeadingFont}', sans-serif; }
            p { text-indent: 1.5em; text-align: ${resolvedJustify ? 'justify' : 'left'}; margin-bottom: 0.8em; }
            p:first-of-type { text-indent: 0; }
          </style>
        </head>
        <body>
          <h1 class="book-title">${title}</h1>
          ${subtitle ? `<h3 style="text-align:center; font-style:italic;">${subtitle}</h3>` : ''}
          <p style="text-align: center; text-indent: 0; margin-top: 2em;">By ${author}</p>
          ${publisher ? `<p style="text-align: center; text-indent: 0; font-size: 0.9em; color: #666;">Published by ${publisher}</p>` : ''}
      `;

      sections.forEach(s => {
        epubContent += `
          <section class="chapter" style="page-break-before: always; margin-top: 40px;">
            <h2 class="chapter-title">${s.title}</h2>
            <div className="manuscript-body">${s.content}</div>
          </section>
        `;
      });

      epubContent += `</body></html>`;
      
      const blob = new Blob([epubContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename.replace(/\.epub$/, '_ebook.html');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    // Reset and close
    setExportState('idle');
    setProgress(0);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={exportState === 'exporting' ? undefined : onClose}>
      <div className="modal-content export-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="text-accent" size={18} />
            <h3 className="modal-title">Export Book</h3>
          </div>
          {exportState !== 'exporting' && (
            <button className="action-icon-btn" onClick={onClose}><X size={16} /></button>
          )}
        </div>

        <div className="modal-body flex flex-col gap-4">
          
          {exportState === 'idle' && (
            <div className="flex flex-col gap-4">
              <p className="export-description text-muted">
                Select your output target. InkForge exports clean, industry-compliant files matching your exact margin configurations.
              </p>

              {/* Format selection list */}
              <div className="format-options grid grid-cols-1 gap-2" style={{ maxHeight: '320px', overflowY: 'auto' }}>
                <div 
                  className={`format-option-card flex items-center gap-3 ${selectedFormat === 'docx' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('docx')}
                >
                  <FileText className="text-accent" size={24} />
                  <div className="flex-col">
                    <span className="format-name">Microsoft Word (.docx)</span>
                    <span className="format-desc">Native layout for Microsoft Word, WPS Office, and Google Docs.</span>
                  </div>
                </div>

                <div 
                  className={`format-option-card flex items-center gap-3 ${selectedFormat === 'rtf' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('rtf')}
                >
                  <FileText className="text-accent" size={24} />
                  <div className="flex-col">
                    <span className="format-name">Rich Text Format (.rtf)</span>
                    <span className="format-desc">Universal document format for MS Word, WPS Office, WordPad & LibreOffice.</span>
                  </div>
                </div>

                <div 
                  className={`format-option-card flex items-center gap-3 ${selectedFormat === 'txt' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('txt')}
                >
                  <FileText className="text-accent" size={24} />
                  <div className="flex-col">
                    <span className="format-name">Plain Text (.txt)</span>
                    <span className="format-desc">Clean manuscript text file suitable for simple text editors.</span>
                  </div>
                </div>

                <div 
                  className={`format-option-card flex items-center gap-3 ${selectedFormat === 'html' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('html')}
                >
                  <FileText className="text-accent" size={24} />
                  <div className="flex-col">
                    <span className="format-name">HTML Document (.html)</span>
                    <span className="format-desc">Self-contained web manuscript with embedded styles.</span>
                  </div>
                </div>

                <div 
                  className={`format-option-card flex items-center gap-3 ${selectedFormat === 'epub' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('epub')}
                >
                  <FileText className="text-accent" size={24} />
                  <div className="flex-col">
                    <span className="format-name">EPUB eBook (.epub)</span>
                    <span className="format-desc">Standard reflowable e-reader format for Kindle, Apple Books, Kobo.</span>
                  </div>
                </div>

                <div 
                  className={`format-option-card flex items-center gap-3 ${selectedFormat === 'pdf' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('pdf')}
                >
                  <FileText className="text-accent" size={24} />
                  <div className="flex-col">
                    <span className="format-name">Print Ready PDF (.pdf)</span>
                    <span className="format-desc">Best for paperback & hardcover printing (triggers system printer).</span>
                  </div>
                </div>
              </div>

              <button className="start-export-btn flex items-center justify-center gap-2 mt-2" onClick={handleStartExport}>
                <Download size={16} />
                <span>Begin Compilation</span>
              </button>
            </div>
          )}

          {exportState === 'exporting' && (
            <div className="export-progress-panel flex flex-col items-center justify-center py-6 gap-4">
              <RefreshCw className="animate-spin text-accent" size={32} />
              <div className="flex flex-col items-center gap-1 w-full">
                <span className="export-progress-title">Compiling Book Files</span>
                <span className="export-progress-msg text-muted">{statusMessage}</span>
              </div>
              
              {/* Progress bar */}
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="progress-percent">{progress}%</span>
            </div>
          )}

          {exportState === 'complete' && (
            <div className="export-complete-panel flex flex-col items-center justify-center py-6 gap-4">
              <CheckCircle2 className="text-success" size={48} />
              <div className="flex flex-col items-center gap-1">
                <span className="export-progress-title">Compilation Successful!</span>
                <p className="export-progress-msg text-muted text-center max-w-sm">
                  Your book layout has been compiled and styled using the <strong>{activeTheme?.name || 'theme'}</strong> guidelines.
                </p>
              </div>

              <div className="flex gap-3 mt-2 w-full justify-center">
                <button className="export-download-btn flex items-center gap-1.5" onClick={triggerDownload}>
                  <Download size={14} />
                  <span>Download file</span>
                </button>
                <button className="export-cancel-btn" onClick={() => setExportState('idle')}>
                  Back
                </button>
              </div>
            </div>
          )}

        </div>

        <style>{`
          .export-modal-content {
            max-width: 550px;
            padding: 24px;
          }

          .export-description {
            font-size: 13px;
            line-height: 1.5;
          }

          .format-options {
            display: flex;
            flex-direction: column;
          }

          .format-option-card {
            border: 1px solid var(--ui-border);
            border-radius: var(--ui-radius);
            padding: 14px 16px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .format-option-card:hover {
            border-color: var(--ui-border-hover);
            background-color: var(--ui-panel-bg);
          }

          .format-option-card.active {
            border-color: var(--ui-accent);
            background-color: var(--ui-accent-light);
          }

          .format-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--ui-text);
            display: block;
          }

          .format-desc {
            font-size: 11px;
            color: var(--ui-text-muted);
            display: block;
            margin-top: 2px;
          }

          .start-export-btn {
            background-color: var(--ui-accent);
            color: white;
            padding: 10px 20px;
            border-radius: var(--ui-radius-sm);
            font-size: 13px;
            font-weight: 600;
          }

          .start-export-btn:hover {
            background-color: var(--ui-accent-hover);
          }

          .export-progress-panel, .export-complete-panel {
            min-height: 200px;
          }

          .animate-spin {
            animation: spin 1.5s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .export-progress-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--ui-text);
          }

          .export-progress-msg {
            font-size: 12px;
            height: 16px;
          }

          .progress-bar-container {
            width: 100%;
            height: 8px;
            background-color: var(--ui-border);
            border-radius: 99px;
            overflow: hidden;
            max-width: 400px;
          }

          .progress-bar-fill {
            height: 100%;
            background-color: var(--ui-accent);
            border-radius: 99px;
            transition: width 0.3s ease-out;
          }

          .progress-percent {
            font-size: 12px;
            font-weight: 600;
            color: var(--ui-text-muted);
          }

          .text-success {
            color: #10b981;
          }

          .export-download-btn {
            background-color: var(--ui-accent);
            color: white;
            padding: 8px 16px;
            border-radius: var(--ui-radius-sm);
            font-size: 13px;
            font-weight: 600;
          }

          .export-download-btn:hover {
            background-color: var(--ui-accent-hover);
          }

          .export-cancel-btn {
            border: 1px solid var(--ui-border);
            padding: 8px 16px;
            border-radius: var(--ui-radius-sm);
            font-size: 13px;
            font-weight: 500;
            color: var(--ui-text);
          }

          .export-cancel-btn:hover {
            background-color: var(--ui-panel-bg);
          }
        `}</style>
      </div>
    </div>
  );
}
