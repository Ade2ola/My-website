import React, { useState, useEffect } from 'react';
import TopNav from './components/TopNav';
import LeftSidebar from './components/LeftSidebar';
import Editor from './components/Editor';
import RightPreview from './components/RightPreview';
import SetupModal from './components/SetupModal';
import ThemeGallery from './components/ThemeGallery';
import ChapterDesigner from './components/ChapterDesigner';
import StatsPanel from './components/StatsPanel';
import ExportModal from './components/ExportModal';
import ManageBooksModal from './components/ManageBooksModal';
import AddSectionModal from './components/AddSectionModal';

import { defaultBook } from './themes/defaultBook';
import { themes, getChapterLabel, svgOrnaments } from './themes/presets';

const BOOKS_COLLECTION_KEY = 'inkforge_books_collection';
const ACTIVE_BOOK_ID_KEY = 'inkforge_active_book_id';

const getInitialBooks = () => {
  const savedCollection = localStorage.getItem(BOOKS_COLLECTION_KEY);
  if (savedCollection) {
    try {
      const parsed = JSON.parse(savedCollection);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }

  // Migrate legacy single-book data if present
  const legacySaved = localStorage.getItem('inkforge_book_data');
  if (legacySaved) {
    try {
      const parsedLegacy = JSON.parse(legacySaved);
      const initialBookData = parsedLegacy.book || defaultBook;
      const initialTheme = parsedLegacy.activeThemeId || 'classic-novel';
      const initialDesigner = parsedLegacy.chapterDesigner || defaultBook.chapterDesigner;
      
      const migratedBook = {
        id: `book-${Date.now()}`,
        title: initialBookData.metadata?.title || 'The Lost Alchemist',
        author: initialBookData.metadata?.author || 'Aveline Thorne',
        bookData: initialBookData,
        activeThemeId: initialTheme,
        chapterDesigner: initialDesigner,
        updatedAt: new Date().toISOString()
      };
      return [migratedBook];
    } catch (e) {}
  }

  // Default fallback book
  return [{
    id: `book-${Date.now()}`,
    title: defaultBook.metadata.title,
    author: defaultBook.metadata.author,
    bookData: defaultBook,
    activeThemeId: 'classic-novel',
    chapterDesigner: defaultBook.chapterDesigner,
    updatedAt: new Date().toISOString()
  }];
};

export default function App() {
  const [booksCollection, setBooksCollection] = useState(getInitialBooks);
  const [activeBookId, setActiveBookId] = useState(() => {
    const savedId = localStorage.getItem(ACTIVE_BOOK_ID_KEY);
    const initialList = getInitialBooks();
    if (savedId && initialList.some(b => b.id === savedId)) {
      return savedId;
    }
    return initialList[0]?.id;
  });

  const activeEntry = booksCollection.find(b => b.id === activeBookId) || booksCollection[0];

  const [book, setBook] = useState(() => activeEntry.bookData || defaultBook);
  const [activeThemeId, setActiveThemeId] = useState(() => activeEntry.activeThemeId || 'classic-novel');
  const [chapterDesigner, setChapterDesigner] = useState(() => activeEntry.chapterDesigner || defaultBook.chapterDesigner);

  const [activeSectionId, setActiveSectionId] = useState(() => activeEntry.bookData?.sections?.[0]?.id || 'chapter-1');
  const [darkMode, setDarkMode] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState('idle');

  // Modals state
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isThemesOpen, setIsThemesOpen] = useState(false);
  const [isDesignerOpen, setIsDesignerOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isManageBooksOpen, setIsManageBooksOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [addSectionTargetType, setAddSectionTargetType] = useState('front-matter');

  // Undo / Redo history state
  const [history, setHistory] = useState([book.sections]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Sync Dark Mode state with document body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  // Save active book changes back into books collection & localStorage
  useEffect(() => {
    setAutosaveStatus('saving');
    const timer = setTimeout(() => {
      setBooksCollection(prevList => {
        const updatedList = prevList.map(b => {
          if (b.id === activeBookId) {
            return {
              ...b,
              title: book.metadata?.title || 'Untitled Book',
              author: book.metadata?.author || '',
              bookData: book,
              activeThemeId,
              chapterDesigner,
              updatedAt: new Date().toISOString()
            };
          }
          return b;
        });
        localStorage.setItem(BOOKS_COLLECTION_KEY, JSON.stringify(updatedList));
        localStorage.setItem(ACTIVE_BOOK_ID_KEY, activeBookId);
        return updatedList;
      });

      setAutosaveStatus('saved');
      const idleTimer = setTimeout(() => setAutosaveStatus('idle'), 1500);
      return () => clearTimeout(idleTimer);
    }, 800);

    return () => clearTimeout(timer);
  }, [book.metadata, book.sections, book.coverImage, activeThemeId, chapterDesigner, activeBookId]);

  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];
  const activeSection = book.sections.find(s => s.id === activeSectionId) || book.sections[0];

  const insideMargin = chapterDesigner?.customMargins?.inside !== undefined 
    ? chapterDesigner.customMargins.inside 
    : (book.metadata.margins?.inside || 0.75);
  const outsideMargin = chapterDesigner?.customMargins?.outside !== undefined 
    ? chapterDesigner.customMargins.outside 
    : (book.metadata.margins?.outside || 0.5);
  const topMargin = chapterDesigner?.customMargins?.top !== undefined 
    ? chapterDesigner.customMargins.top 
    : (book.metadata.margins?.top || 0.75);
  const bottomMargin = chapterDesigner?.customMargins?.bottom !== undefined 
    ? chapterDesigner.customMargins.bottom 
    : (book.metadata.margins?.bottom || 0.75);

  // Multi-Book Operations
  const handleCreateNewBook = () => {
    const newId = `book-${Date.now()}`;
    const newBookData = {
      ...defaultBook,
      metadata: {
        ...defaultBook.metadata,
        title: 'New Book',
        subtitle: '',
        author: book.metadata?.author || 'Author Name',
        publisher: '',
        isbn: '',
      },
      sections: [
        {
          id: `chapter-${Date.now()}`,
          type: 'chapter',
          subType: 'chapter',
          title: 'Chapter 1',
          content: '<p>Start writing your new book here...</p>'
        }
      ]
    };

    const newBookEntry = {
      id: newId,
      title: 'New Book',
      author: newBookData.metadata.author,
      bookData: newBookData,
      activeThemeId: 'classic-novel',
      chapterDesigner: defaultBook.chapterDesigner,
      updatedAt: new Date().toISOString()
    };

    setBooksCollection(prev => {
      const newList = [...prev, newBookEntry];
      localStorage.setItem(BOOKS_COLLECTION_KEY, JSON.stringify(newList));
      return newList;
    });

    setActiveBookId(newId);
    setBook(newBookData);
    setActiveThemeId('classic-novel');
    setChapterDesigner(defaultBook.chapterDesigner);
    setActiveSectionId(newBookData.sections[0].id);
    setHistory([newBookData.sections]);
    setHistoryIndex(0);
  };

  const handleSelectBook = (bookId) => {
    const target = booksCollection.find(b => b.id === bookId);
    if (!target) return;

    setActiveBookId(bookId);
    setBook(target.bookData || defaultBook);
    setActiveThemeId(target.activeThemeId || 'classic-novel');
    setChapterDesigner(target.chapterDesigner || defaultBook.chapterDesigner);
    const firstSec = target.bookData?.sections?.[0]?.id || 'chapter-1';
    setActiveSectionId(firstSec);
    setHistory([target.bookData?.sections || []]);
    setHistoryIndex(0);
  };

  const handleDuplicateBook = (bookId) => {
    const target = booksCollection.find(b => b.id === bookId);
    if (!target) return;

    const dupId = `book-${Date.now()}`;
    const dupTitle = `${target.title || 'Untitled Book'} (Copy)`;
    const dupBookData = JSON.parse(JSON.stringify(target.bookData));
    dupBookData.metadata.title = dupTitle;

    const dupEntry = {
      id: dupId,
      title: dupTitle,
      author: target.author,
      bookData: dupBookData,
      activeThemeId: target.activeThemeId,
      chapterDesigner: target.chapterDesigner,
      updatedAt: new Date().toISOString()
    };

    setBooksCollection(prev => {
      const newList = [...prev, dupEntry];
      localStorage.setItem(BOOKS_COLLECTION_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const handleRenameBook = (bookId, newTitle) => {
    setBooksCollection(prev => {
      const newList = prev.map(b => {
        if (b.id === bookId) {
          const updatedBookData = {
            ...b.bookData,
            metadata: {
              ...b.bookData.metadata,
              title: newTitle
            }
          };
          return {
            ...b,
            title: newTitle,
            bookData: updatedBookData
          };
        }
        return b;
      });
      localStorage.setItem(BOOKS_COLLECTION_KEY, JSON.stringify(newList));
      return newList;
    });

    if (bookId === activeBookId) {
      setBook(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          title: newTitle
        }
      }));
    }
  };

  const handleDeleteBook = (bookId) => {
    if (booksCollection.length <= 1) return;

    const newList = booksCollection.filter(b => b.id !== bookId);
    setBooksCollection(newList);
    localStorage.setItem(BOOKS_COLLECTION_KEY, JSON.stringify(newList));

    if (bookId === activeBookId) {
      const fallback = newList[0];
      handleSelectBook(fallback.id);
    }
  };

  // New project: reset everything to defaults
  const handleNewProject = () => {
    if (!confirm('Create a new book project? All unsaved changes will be lost.')) return;
    localStorage.removeItem('inkforge_book_data');
    const freshBook = {
      ...defaultBook,
      metadata: {
        ...defaultBook.metadata,
        title: 'Untitled Book',
        subtitle: '',
        author: 'Author Name',
        publisher: '',
        isbn: '',
      },
      sections: [
        {
          id: `chapter-${Date.now()}`,
          type: 'chapter',
          subType: 'chapter',
          title: 'Untitled Chapter',
          content: '<p>Start writing your chapter here...</p>'
        }
      ]
    };
    setBook(freshBook);
    setActiveThemeId('classic-novel');
    setChapterDesigner(defaultBook.chapterDesigner);
    setActiveSectionId(freshBook.sections[0].id);
    setHistory([freshBook.sections]);
    setHistoryIndex(0);
  };

  // Classifier helper to determine if section belongs to Front Matter, Chapters, or Back Matter
  const classifySection = (title) => {
    const cleanTitle = title.trim().toLowerCase();
    
    // Front matter keywords
    const frontMatterTypes = {
      'title-page': ['title page', 'titlepage', 'book title', 'front page', 'cover page'],
      'copyright-page': ['copyright', 'copyright page', 'legal notice', 'legal notices'],
      'dedication': ['dedication', 'dedicated to', 'for my'],
      'epigraph': ['epigraph', 'quotation', 'quotes'],
      'foreword': ['foreword', 'fore word'],
      'preface': ['preface', 'introduction', 'intro']
    };

    // Back matter keywords
    const backMatterTypes = {
      'acknowledgements': ['acknowledgement', 'acknowledgements', 'thank you', 'thanks', 'acknowledgment', 'acknowledgments'],
      'about-the-author': ['about the author', 'about the writer', 'author profile', 'about author', 'biography', 'author bio'],
      'also-by': ['also by', 'other books', 'by the same author', 'works by'],
      'newsletter-signup': ['newsletter', 'newsletter signup', 'subscribe', 'sign up', 'mailing list'],
      'book-club-questions': ['book club', 'discussion questions', 'readers guide', 'questions'],
      'epilogue': ['EPILOGUE','THE END' ]
    };

    // Check front matter
    for (const [subType, keywords] of Object.entries(frontMatterTypes)) {
      if (keywords.some(kw => cleanTitle === kw || cleanTitle.includes(kw))) {
        return { type: 'front-matter', subType };
      }
    }

    // Check back matter
    for (const [subType, keywords] of Object.entries(backMatterTypes)) {
      if (keywords.some(kw => cleanTitle === kw || cleanTitle.includes(kw))) {
        return { type: 'back-matter', subType };
      }
    }

    // Default to chapter
    return { type: 'chapter', subType: 'chapter' };
  };

  // Helper to parse plain text or Markdown into chapter sections
  const parseTextManuscript = (text, fileName) => {
    const normalizedText = text.replace(/\r\n/g, '\n');
    const lines = normalizedText.split('\n');
    const sectionsData = [];
    let currentSection = { title: '', contentLines: [] };
    
    // Regex to match typical chapter headings, e.g. "Chapter 1", "CHAPTER ONE", "PROLOGUE", "Section II"
    const headingRegex = /^(?:Chapter|CHAPTER|Section|SECTION|PROLOGUE|EPILOGUE|ACT|Title Page|Copyright|Dedication|Epigraph|Foreword|Preface|Acknowledgements|About the Author|Also By|Newsletter|Book Club)\s*(?:[0-9a-zA-Z\-_]+|Roman|Page)?/i;

    lines.forEach((line) => {
      const trimmed = line.trim();
      const isMarkdownHeader = line.startsWith('#') || line.startsWith('##') || line.startsWith('###');
      // If a line is a markdown header, matches heading keyword, or is short and in all caps (and current section is long enough to split)
      const isAllCapTitle = trimmed.length > 2 && trimmed.length < 50 && trimmed === trimmed.toUpperCase() && !trimmed.endsWith('.') && !trimmed.endsWith(',');
      const isChapterKeyword = headingRegex.test(trimmed);
      
      if (isMarkdownHeader || isChapterKeyword || (isAllCapTitle && currentSection.contentLines.length > 10)) {
        if (currentSection.contentLines.length > 0 || currentSection.title) {
          sectionsData.push(currentSection);
        }
        const cleanTitle = trimmed.replace(/^#+\s*/, '').trim();
        currentSection = { title: cleanTitle, contentLines: [] };
      } else {
        if (trimmed) {
          currentSection.contentLines.push(trimmed);
        }
      }
    });

    if (currentSection.contentLines.length > 0 || currentSection.title) {
      sectionsData.push(currentSection);
    }

    if (sectionsData.length === 0) {
      const baseName = fileName.replace(/\.[^/.]+$/, "");
      sectionsData.push({
        title: baseName,
        contentLines: lines.map(l => l.trim()).filter(Boolean)
      });
    }

    return sectionsData.map((sec, idx) => {
      const paragraphs = sec.contentLines.map(p => `<p>${p}</p>`).join('\n');
      const classification = classifySection(sec.title || `Chapter ${idx + 1}`);
      return {
        id: `${classification.type}-${Date.now()}-${idx}`,
        type: classification.type,
        subType: classification.subType,
        title: sec.title || (classification.type === 'chapter' ? `Chapter ${idx + 1}` : classification.subType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')),
        content: paragraphs || '<p>Start writing here...</p>'
      };
    });
  };

  // Helper to parse HTML format into chapters by splitting on h1/h2/h3 tags
  const parseHtmlManuscript = (htmlText, fileName) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4'));
    let importedSections = [];

    if (headings.length === 0) {
      const baseName = fileName.replace(/\.[^/.]+$/, "");
      const classification = classifySection(baseName);
      importedSections.push({
        id: `${classification.type}-${Date.now()}`,
        type: classification.type,
        subType: classification.subType,
        title: baseName,
        content: doc.body.innerHTML || '<p>Start writing here...</p>'
      });
    } else {
      headings.forEach((heading, idx) => {
        let contentHtml = '';
        let sibling = heading.nextElementSibling;
        while (sibling && !['H1', 'H2', 'H3', 'H4'].includes(sibling.tagName)) {
          contentHtml += sibling.outerHTML;
          sibling = sibling.nextElementSibling;
        }
        
        const titleText = heading.textContent?.trim() || `Chapter ${idx + 1}`;
        const classification = classifySection(titleText);
        
        importedSections.push({
          id: `${classification.type}-${Date.now()}-${idx}`,
          type: classification.type,
          subType: classification.subType,
          title: titleText,
          content: contentHtml || '<p>Start writing here...</p>'
        });
      });
    }
    return importedSections;
  };

  // Helper to construct a new project from parsed sections, sorted by book structural zones
  const importSectionsAsNewProject = (sections, fileName) => {
    const baseName = fileName.replace(/\.[^/.]+$/, "");
    
    // Sort sections: Front Matter first, then Chapters, then Back Matter
    const front = sections.filter(s => s.type === 'front-matter');
    const chapters = sections.filter(s => s.type === 'chapter');
    const back = sections.filter(s => s.type === 'back-matter');
    
    const sortedSections = [...front, ...chapters, ...back];
    
    // Ensure we have at least one active section
    if (sortedSections.length === 0) {
      sortedSections.push({
        id: `chapter-${Date.now()}`,
        type: 'chapter',
        subType: 'chapter',
        title: 'Chapter 1',
        content: '<p>Start writing here...</p>'
      });
    }

    const importedBook = {
      ...defaultBook,
      metadata: {
        ...defaultBook.metadata,
        title: baseName,
        subtitle: 'Imported Manuscript',
        author: 'Author Name',
        publisher: 'InkForge Press',
        isbn: ''
      },
      sections: sortedSections
    };
    
    setBook(importedBook);
    setActiveThemeId('classic-novel');
    setChapterDesigner(defaultBook.chapterDesigner);
    setActiveSectionId(sortedSections[0]?.id || 'chapter-1');
    setHistory([sortedSections]);
    setHistoryIndex(0);
    
    localStorage.setItem('inkforge_book_data', JSON.stringify({
      book: importedBook,
      activeThemeId: 'classic-novel',
      chapterDesigner: defaultBook.chapterDesigner
    }));
  };

  // Open & Import Project: loads multiple formats (.json, .inkforge, .txt, .md, .html, .docx, .pdf)
  const handleOpenProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.inkforge,.txt,.md,.html,.xhtml,.docx,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const fileName = file.name;
      const extension = fileName.split('.').pop().toLowerCase();
      
      if (['json', 'inkforge'].includes(extension)) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const parsed = JSON.parse(evt.target.result);
            if (parsed.book) {
              setBook(parsed.book);
              if (parsed.activeThemeId) setActiveThemeId(parsed.activeThemeId);
              if (parsed.chapterDesigner) setChapterDesigner(parsed.chapterDesigner);
              setActiveSectionId(parsed.book.sections[0]?.id || 'chapter-1');
              setHistory([parsed.book.sections]);
              setHistoryIndex(0);
              localStorage.setItem('inkforge_book_data', JSON.stringify(parsed));
            } else {
              alert('Invalid project file. Expected InkForge JSON format.');
            }
          } catch (err) {
            alert('Failed to read project file. Make sure it is a valid InkForge JSON file.');
            console.error(err);
          }
        };
        reader.readAsText(file);
      } else if (['txt', 'md'].includes(extension)) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const text = evt.target.result;
          const sections = parseTextManuscript(text, file.name);
          importSectionsAsNewProject(sections, file.name);
        };
        reader.readAsText(file);
      } else if (['html', 'xhtml'].includes(extension)) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const htmlText = evt.target.result;
          const sections = parseHtmlManuscript(htmlText, file.name);
          importSectionsAsNewProject(sections, file.name);
        };
        reader.readAsText(file);
      } else if (extension === 'docx') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const arrayBuffer = evt.target.result;
          if (window.mammoth) {
            window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
              .then((result) => {
                const htmlText = result.value;
                const sections = parseHtmlManuscript(htmlText, file.name);
                importSectionsAsNewProject(sections, file.name);
              })
              .catch((err) => {
                alert("Error parsing Word document: " + err.message);
              });
          } else {
            alert("Word document parser (Mammoth.js) is not loaded yet. Check your internet connection or try again.");
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (extension === 'pdf') {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const arrayBuffer = evt.target.result;
          if (window.pdfjsLib) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = window.pdfjsWorkerSrc;
            const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
            loadingTask.promise.then((pdf) => {
              const numPages = pdf.numPages;
              let pagePromises = [];
              for (let i = 1; i <= numPages; i++) {
                pagePromises.push(
                  pdf.getPage(i).then((page) => {
                    return page.getTextContent().then((textContent) => {
                      return textContent.items.map(item => item.str).join(' ');
                    });
                  })
                );
              }
              Promise.all(pagePromises)
                .then((pagesText) => {
                  const fullText = pagesText.join('\n\n');
                  const sections = parseTextManuscript(fullText, file.name);
                  importSectionsAsNewProject(sections, file.name);
                })
                .catch((err) => {
                  alert("Error extracting PDF text: " + err.message);
                });
            }).catch((err) => {
              alert("Error reading PDF document: " + err.message);
            });
          } else {
            alert("PDF reader (PDF.js) is not loaded yet. Check your internet connection or try again.");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  // Save draft locally to localStorage
  const handleSaveDraftLocal = () => {
    const data = { book, activeThemeId, chapterDesigner };
    localStorage.setItem('inkforge_book_data', JSON.stringify(data));
    setAutosaveStatus('saved');
    // Set status to idle after brief pause
    setTimeout(() => setAutosaveStatus('idle'), 1500);
  };

  // Download draft in any selected format (.json, .docx, .md, .txt, .html)
  const handleDownloadDraft = (format) => {
    const safeName = (book.metadata.title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const filename = `${safeName}_draft.${format}`;
    let content = '';
    let mimeType = 'text/plain;charset=utf-8';

    // Resolve active style variables
    const resolvedBodyFont = chapterDesigner?.customBodyFont || activeTheme?.bodyFont || 'serif';
    const resolvedHeadingFont = chapterDesigner?.customHeadingFont || activeTheme?.headingFont || 'serif';
    const resolvedFontSize = chapterDesigner?.customFontSize || activeTheme?.fontSize || '15px';
    const resolvedLineHeight = chapterDesigner?.customLineHeight || activeTheme?.lineHeight || '1.5';
    const resolvedJustify = chapterDesigner?.customJustify !== undefined ? chapterDesigner.customJustify : (activeTheme?.justify ?? true);
    const resolvedAlignment = chapterDesigner?.alignment || (activeTheme?.chapterOpening?.layout === 'left-aligned' ? 'left' : 'center');
    const resolvedDivider = chapterDesigner?.customDivider || activeTheme?.dividerSymbol || '❦';
    const resolvedOrnamentType = chapterDesigner?.customOrnamentType || activeTheme?.chapterOpening?.ornamentType || 'symbol';
    const resolvedOrnamentSvgKey = chapterDesigner?.customOrnamentSvgKey || activeTheme?.chapterOpening?.ornamentSvgKey;
    const resolvedDropCaps = chapterDesigner?.customDropCaps !== undefined ? chapterDesigner.customDropCaps : (activeTheme?.dropCaps ?? true);
    const resolvedFirstParamStyle = chapterDesigner?.openingParagraphStyle || activeTheme?.firstParagraphStyle || 'standard';

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

    const chapterSections = book.sections.filter(s => s.type === 'chapter');
    const fontsLink = `https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=IM+Fell+English:ital@0;1&family=Lora:ital,wght@0,400..700;1,400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600;700&family=Alice&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Creepster&family=Montserrat:wght@300;400;500;600;700&family=Quicksand:wght@400;600;700&family=Rochester&family=Special+Elite&family=Spectral:ital,wght@0,300..800;1,300..800&display=swap`;

    if (format === 'json') {
      const data = { book, activeThemeId, chapterDesigner };
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json;charset=utf-8';
    } else if (format === 'docx') {
      content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>${book.metadata.title}</title>
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
            body {
              font-family: '${resolvedBodyFont}', 'Georgia', serif;
              font-size: ${resolvedFontSize};
              line-height: ${resolvedLineHeight};
              color: #000000;
              margin: 1in;
            }
            h1.book-title {
              font-family: '${resolvedHeadingFont}', 'Georgia', serif;
              font-size: 28pt;
              text-align: center;
              margin-top: 2.5in;
              margin-bottom: 0.5in;
              font-weight: normal;
            }
            h2.chapter-title {
              font-family: '${resolvedHeadingFont}', 'Georgia', serif;
              font-size: ${titleSize};
              text-align: ${resolvedAlignment};
              margin-top: 0.5in;
              margin-bottom: ${gapBetweenTitleAndOrnament};
              font-weight: ${titleWeight};
              letter-spacing: ${titleLetterSpacing};
            }
            .chapter-label {
              font-family: '${resolvedHeadingFont}', 'Georgia', serif;
              font-size: ${numberSize};
              text-align: ${resolvedAlignment};
              letter-spacing: ${numberLetterSpacing};
              font-weight: ${numberWeight};
              font-variant: ${numberVariant};
              text-transform: uppercase;
              opacity: 0.7;
              margin-top: 1.5in;
              margin-bottom: ${gapBetweenNumberAndTitle};
            }
            h3.book-subtitle {
              font-family: '${resolvedHeadingFont}', 'Georgia', serif;
              font-size: 14pt;
              text-align: center;
              font-style: italic;
              font-weight: normal;
              margin-bottom: 1.5in;
            }
            p {
              margin-bottom: 10pt;
              text-indent: 0.5in;
              text-align: ${resolvedJustify ? 'justify' : 'left'};
            }
            p:first-of-type {
              text-indent: 0;
            }
            .scene-break {
              text-align: center;
              margin: 24pt 0;
              font-size: 16pt;
            }
            .title-page {
              text-align: center;
              page-break-after: always;
            }
            .section-page {
              page-break-before: always;
            }
            
            /* Drop Caps & Paragraph Styles for MS Word */
            .has-drop-cap > p:first-of-type::first-letter {
              float: left;
              font-size: 3.4em;
              line-height: 0.8;
              margin-right: 8px;
              margin-top: 4px;
              font-weight: bold;
            }
            .fp-small-caps > p:first-of-type::first-line {
              font-variant: all-small-caps;
              letter-spacing: 0.5px;
            }
            .fp-uppercase > p:first-of-type::first-line {
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .fp-bold > p:first-of-type::first-line {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="title-page">
            <h1 class="book-title">${book.metadata.title}</h1>
            <h3 class="book-subtitle">${book.metadata.subtitle || ''}</h3>
            <p style="text-indent: 0; text-align: center; margin-top: 2in;">By</p>
            <p style="text-indent: 0; text-align: center; font-size: 16pt; font-weight: bold; margin-top: 0.2in;">${book.metadata.author}</p>
          </div>
      `;

      book.sections.forEach((s, idx) => {
        const isChapter = s.type === 'chapter';
        const chapterIndex = isChapter ? chapterSections.findIndex(ch => ch.id === s.id) + 1 : 0;
        const chapterLabel = isChapter ? getChapterLabel(chapterIndex, chapterDesigner?.numberingStyle || 'word-upper') : '';

        const bodyClasses = [
          'manuscript-body',
          isChapter && resolvedDropCaps ? 'has-drop-cap' : '',
          isChapter ? `fp-${resolvedFirstParamStyle}` : ''
        ].filter(Boolean).join(' ');

        content += `
          <div class="section-page">
            ${isChapter && chapterLabel ? `<div class="chapter-label">${chapterLabel}</div>` : ''}
            <h2 class="chapter-title">${s.title}</h2>
            
            <!-- Chapter Ornaments -->
            ${isChapter && resolvedOrnamentType === 'svg' && resolvedOrnamentSvgKey && svgOrnaments[resolvedOrnamentSvgKey] ? `
              <div class="chapter-svg-ornament-wrap" style="text-align: ${resolvedAlignment}; margin: 12px 0 ${gapBetweenOrnamentAndBody}; opacity: 0.6;">
                ${svgOrnaments[resolvedOrnamentSvgKey].replace('<svg ', `<svg style="width: 120px; height: 18px;" `)}
              </div>
            ` : ''}
            ${isChapter && resolvedOrnamentType === 'symbol' && chapterDesigner?.dividerStyle !== 'none' ? `
              <div class="chapter-symbol-ornament" style="text-align: ${resolvedAlignment}; font-size: 16pt; margin: 12px 0 ${gapBetweenOrnamentAndBody}; opacity: 0.7;">
                ${resolvedDivider}
              </div>
            ` : ''}
            
            <div class="${bodyClasses}" style="margin-top: 24px;">${s.content}</div>
          </div>
        `;
      });

      content += `</body></html>`;
      mimeType = 'application/msword;charset=utf-8';
    } else if (format === 'md') {
      content = `# ${book.metadata.title}\n`;
      if (book.metadata.subtitle) content += `## ${book.metadata.subtitle}\n`;
      content += `### By ${book.metadata.author}\n\n`;

      book.sections.forEach(s => {
        content += `## ${s.title}\n\n`;
        const temp = document.createElement('div');
        temp.innerHTML = s.content;
        
        let text = temp.innerHTML
          .replace(/<\/p>/g, '\n\n')
          .replace(/<p>/g, '')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<div class="scene-break"[^>]*>.*?<\/div>/g, '\n---\n')
          .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
          .replace(/<em>(.*?)<\/em>/g, '*$1*');
          
        const stripped = document.createElement('div');
        stripped.innerHTML = text;
        content += stripped.innerText || stripped.textContent || '';
        content += '\n\n';
      });
      mimeType = 'text/markdown;charset=utf-8';
    } else if (format === 'txt') {
      content = `MANUSCRIPT DRAFT\n`;
      content += `================\n`;
      content += `Title: ${book.metadata.title}\n`;
      if (book.metadata.subtitle) content += `Subtitle: ${book.metadata.subtitle}\n`;
      content += `Author: ${book.metadata.author}\n\n`;

      book.sections.forEach(s => {
        content += `\n\n=== ${s.title.toUpperCase()} ===\n\n`;
        const temp = document.createElement('div');
        temp.innerHTML = s.content;
        content += temp.innerText || temp.textContent || '';
        content += '\n';
      });
      mimeType = 'text/plain;charset=utf-8';
    } else if (format === 'html') {
      content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${book.metadata.title}</title>
          <link rel="stylesheet" href="${fontsLink}">
          <style>
            body { 
              font-family: '${resolvedBodyFont}', sans-serif; 
              font-size: ${resolvedFontSize}; 
              line-height: ${resolvedLineHeight}; 
              margin: 2em auto; 
              max-width: 700px; 
              color: #333; 
            }
            h1.book-title { 
              text-align: center; 
              font-family: '${resolvedHeadingFont}', sans-serif; 
            }
            h2.chapter-title { 
              text-align: ${resolvedAlignment}; 
              margin-top: 1.5em; 
              font-family: '${resolvedHeadingFont}', sans-serif; 
              font-size: ${titleSize}; 
              font-weight: ${titleWeight}; 
              letter-spacing: ${titleLetterSpacing}; 
              margin-bottom: ${gapBetweenTitleAndOrnament};
            }
            .chapter-label { 
              font-family: '${resolvedHeadingFont}', sans-serif; 
              font-size: ${numberSize}; 
              text-align: ${resolvedAlignment}; 
              letter-spacing: ${numberLetterSpacing}; 
              font-weight: ${numberWeight}; 
              font-variant: ${numberVariant}; 
              text-transform: uppercase; 
              opacity: 0.7; 
              margin-top: 2em; 
              margin-bottom: ${gapBetweenNumberAndTitle}; 
            }
            p { 
              margin-bottom: 1em; 
              text-indent: 1.5em; 
              text-align: ${resolvedJustify ? 'justify' : 'left'}; 
            }
            p:first-of-type { 
              text-indent: 0; 
            }
            .scene-break { 
              text-align: center; 
              margin: 2em 0; 
            }
            .chapter { 
              page-break-before: always; 
            }
            
            /* Drop Caps & Paragraph Styles for HTML */
            .has-drop-cap > p:first-of-type::first-letter {
              float: left;
              font-size: 3.4em;
              line-height: 0.8;
              margin-right: 8px;
              margin-top: 4px;
              font-weight: bold;
            }
            .fp-small-caps > p:first-of-type::first-line {
              font-variant: all-small-caps;
              letter-spacing: 0.5px;
            }
            .fp-uppercase > p:first-of-type::first-line {
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .fp-bold > p:first-of-type::first-line {
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <h1 class="book-title">${book.metadata.title}</h1>
          <h3 style="text-align: center; font-style: italic;">${book.metadata.subtitle || ''}</h3>
          <p style="text-align: center; text-indent: 0;">By ${book.metadata.author}</p>
      `;

      book.sections.forEach(s => {
        const isChapter = s.type === 'chapter';
        const chapterIndex = isChapter ? chapterSections.findIndex(ch => ch.id === s.id) + 1 : 0;
        const chapterLabel = isChapter ? getChapterLabel(chapterIndex, chapterDesigner?.numberingStyle || 'word-upper') : '';

        const bodyClasses = [
          'manuscript-body',
          isChapter && resolvedDropCaps ? 'has-drop-cap' : '',
          isChapter ? `fp-${resolvedFirstParamStyle}` : ''
        ].filter(Boolean).join(' ');

        content += `
          <section class="chapter">
            ${isChapter && chapterLabel ? `<div class="chapter-label">${chapterLabel}</div>` : ''}
            <h2 class="chapter-title">${s.title}</h2>
            
            <!-- Chapter Ornaments -->
            ${isChapter && resolvedOrnamentType === 'svg' && resolvedOrnamentSvgKey && svgOrnaments[resolvedOrnamentSvgKey] ? `
              <div class="chapter-svg-ornament-wrap" style="text-align: ${resolvedAlignment}; margin: 12px 0 ${gapBetweenOrnamentAndBody} 0; opacity: 0.6;">
                ${svgOrnaments[resolvedOrnamentSvgKey].replace('<svg ', `<svg style="width: 120px; height: 18px;" `)}
              </div>
            ` : ''}
            ${isChapter && resolvedOrnamentType === 'symbol' && chapterDesigner?.dividerStyle !== 'none' ? `
              <div class="chapter-symbol-ornament" style="text-align: ${resolvedAlignment}; font-size: 16pt; margin: 12px 0 ${gapBetweenOrnamentAndBody} 0; opacity: 0.7;">
                ${resolvedDivider}
              </div>
            ` : ''}
            
            <div class="${bodyClasses}" style="margin-top: 24px;">${s.content}</div>
          </section>
        `;
      });

      content += `</body></html>`;
      mimeType = 'text/html;charset=utf-8';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Toggle justification on the active theme
  const handleToggleJustification = () => {
    // We can't mutate the preset directly, so toggle via chapterDesigner
    setChapterDesigner(prev => ({
      ...prev,
      customJustify: prev.customJustify !== undefined ? !prev.customJustify : !(activeTheme?.justify ?? true),
    }));
  };

  // History management
  const pushToHistory = (newSections) => {
    const freshHistory = history.slice(0, historyIndex + 1);
    freshHistory.push(newSections);
    // Cap history length at 30 to conserve memory
    if (freshHistory.length > 30) {
      freshHistory.shift();
    }
    setHistory(freshHistory);
    setHistoryIndex(freshHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setBook(prev => ({ ...prev, sections: history[prevIdx] }));
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setBook(prev => ({ ...prev, sections: history[nextIdx] }));
    }
  };

  // Section CRUD Actions
  const handleContentChange = (id, newContent) => {
    const updated = book.sections.map(s => s.id === id ? { ...s, content: newContent } : s);
    setBook(prev => ({ ...prev, sections: updated }));
    
    // Throttle / push to history periodically on text inputs
    // For simplicity, update active history state
    const currentHist = [...history];
    currentHist[historyIndex] = updated;
    setHistory(currentHist);
  };

  const handleTitleChange = (id, newTitle) => {
    const updated = book.sections.map(s => s.id === id ? { ...s, title: newTitle } : s);
    setBook(prev => ({ ...prev, sections: updated }));
    pushToHistory(updated);
  };

  const handleOpenAddSectionModal = (type) => {
    setAddSectionTargetType(type || 'front-matter');
    setIsAddSectionOpen(true);
  };

  const handleConfirmAddSection = (type, pageTitle) => {
    const title = pageTitle.trim() || (type === 'front-matter' ? 'Front Matter Page' : (type === 'back-matter' ? 'Back Matter Page' : 'Untitled Chapter'));
    const subType = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    let content = '';
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('trigger') || lowerTitle.includes('content') || lowerTitle.includes('warning') || lowerTitle.includes('sensitivity')) {
      content = `
        <div style="max-width: 600px; margin: 60px auto 0; padding: 20px; border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; background-color: rgba(239, 68, 68, 0.03);">
          <h2 style="text-align: center; margin-bottom: 20px; font-size: 1.6em; color: #b91c1c;">${title}</h2>
          <p style="margin-bottom: 15px; font-weight: 500;">This book contains themes that some readers may find sensitive or triggering:</p>
          <ul style="margin-left: 20px; line-height: 1.8;">
            <li>Theme or event disclosure 1</li>
            <li>Theme or event disclosure 2</li>
            <li>Theme or event disclosure 3</li>
          </ul>
          <p style="margin-top: 20px; font-style: italic; font-size: 0.9em; text-align: center;">Reader discretion is advised.</p>
        </div>
      `;
    } else if (type === 'front-matter') {
      content = `<div style="text-align: center; margin-top: 80px;"><h2>${title}</h2><p style="margin-top: 30px; font-style: italic; line-height: 1.8;">Enter details for ${title} here...</p></div>`;
    } else if (type === 'back-matter') {
      content = `<div style="margin-top: 50px;"><h2>${title}</h2><p style="margin-top: 20px; line-height: 1.8;">Enter details for ${title} here...</p></div>`;
    } else {
      content = `<p>Start writing your chapter here...</p>`;
    }

    const newSec = {
      id: `${subType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      subType,
      title,
      content
    };

    let updated = [];
    if (type === 'front-matter') {
      const lastFmIndex = book.sections.reduce((lastIdx, s, idx) => s.type === 'front-matter' ? idx : lastIdx, -1);
      if (lastFmIndex >= 0) {
        updated = [...book.sections.slice(0, lastFmIndex + 1), newSec, ...book.sections.slice(lastFmIndex + 1)];
      } else {
        updated = [newSec, ...book.sections];
      }
    } else if (type === 'back-matter') {
      updated = [...book.sections, newSec];
    } else {
      const lastChapIndex = book.sections.reduce((lastIdx, s, idx) => s.type === 'chapter' ? idx : lastIdx, -1);
      if (lastChapIndex >= 0) {
        updated = [...book.sections.slice(0, lastChapIndex + 1), newSec, ...book.sections.slice(lastChapIndex + 1)];
      } else {
        updated = [...book.sections, newSec];
      }
    }

    setBook(prev => ({ ...prev, sections: updated }));
    setActiveSectionId(newSec.id);
    pushToHistory(updated);
  };

  const handleRemoveSection = (id) => {
    if (book.sections.length <= 1) {
      alert('Your book must contain at least one section.');
      return;
    }
    if (confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      const updated = book.sections.filter(s => s.id !== id);
      setBook(prev => ({ ...prev, sections: updated }));
      
      // If we deleted the active section, focus another one
      if (activeSectionId === id) {
        setActiveSectionId(updated[0].id);
      }
      pushToHistory(updated);
    }
  };

  const handleDuplicateSection = (section) => {
    const newSec = {
      ...section,
      id: `${section.subType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: `${section.title} (Copy)`
    };
    
    // Find index of duplicated item to insert it right after
    const idx = book.sections.findIndex(s => s.id === section.id);
    const updated = [...book.sections];
    updated.splice(idx + 1, 0, newSec);

    setBook(prev => ({ ...prev, sections: updated }));
    setActiveSectionId(newSec.id);
    pushToHistory(updated);
  };

  const handleReorderSections = (newSections) => {
    setBook(prev => ({ ...prev, sections: newSections }));
    pushToHistory(newSections);
  };

  const handleUploadCover = (imgData) => {
    setBook(prev => ({ ...prev, coverImage: imgData }));
  };

  const handleMetadataChange = (newMeta) => {
    setBook(prev => ({ ...prev, metadata: newMeta }));
  };

  // Compile full book text for native printing with custom overrides resolved
  const renderPrintableContent = () => {
    const resolvedBodyFont = chapterDesigner?.customBodyFont || activeTheme?.bodyFont || 'serif';
    const resolvedHeadingFont = chapterDesigner?.customHeadingFont || activeTheme?.headingFont || 'serif';
    const resolvedFontSize = chapterDesigner?.customFontSize || activeTheme?.fontSize || '15px';
    const resolvedLineHeight = chapterDesigner?.customLineHeight || activeTheme?.lineHeight || '1.5';
    const resolvedDivider = chapterDesigner?.customDivider || activeTheme?.dividerSymbol || '❦';

    const chapterSections = book.sections.filter(s => s.type === 'chapter');

    const chapterOpening = activeTheme?.chapterOpening || {};
    const resolvedOrnamentType = chapterDesigner?.customOrnamentType || chapterOpening.ornamentType || 'symbol';
    const resolvedOrnamentSvgKey = chapterDesigner?.customOrnamentSvgKey || chapterOpening.ornamentSvgKey;
    const resolvedDropCaps = chapterDesigner?.customDropCaps !== undefined ? chapterDesigner.customDropCaps : (activeTheme?.dropCaps ?? true);
    const resolvedFirstParamStyle = chapterDesigner?.openingParagraphStyle || activeTheme?.firstParagraphStyle || 'standard';
    const resolvedAlignment = chapterDesigner?.alignment || (chapterOpening.layout === 'left-aligned' ? 'left' : 'center');
    const resolvedTopMarginOffset = chapterOpening.topMargin || '20%';
    const hasDecorativeBorder = chapterOpening.decorativeBorder;

    return book.sections.map((section) => {
      const isChapter = section.type === 'chapter';
      const chapterIndex = isChapter ? chapterSections.findIndex(s => s.id === section.id) + 1 : 0;
      const chapterLabel = isChapter ? getChapterLabel(chapterIndex, chapterDesigner.numberingStyle || 'word-upper') : '';

      const bodyClasses = [
        'print-body-content',
        isChapter && resolvedDropCaps ? 'has-drop-cap' : '',
        isChapter ? `fp-${resolvedFirstParamStyle}` : ''
      ].filter(Boolean).join(' ');

      return (
        <div 
          key={section.id} 
          className="print-section-page"
          style={{
            fontFamily: resolvedBodyFont,
            fontSize: resolvedFontSize,
            lineHeight: resolvedLineHeight,
            textAlign: activeTheme.justify ? 'justify' : 'left',
            pageBreakAfter: 'always',
            position: 'relative'
          }}
        >
          {isChapter && hasDecorativeBorder && (
            <div className="print-corner-decorations">
              <div className="print-corner-decor-tl" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
              <div className="print-corner-decor-tr" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
              <div className="print-corner-decor-bl" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
              <div className="print-corner-decor-br" dangerouslySetInnerHTML={{ __html: svgOrnaments.ornateCorner }} />
            </div>
          )}

          <div style={{ textAlign: resolvedAlignment, marginTop: isChapter ? resolvedTopMarginOffset : '1.0in', marginBottom: '0.5in' }}>
            {isChapter && chapterLabel && (
              <div style={{ 
                fontFamily: resolvedHeadingFont, 
                fontSize: chapterOpening.numberSize || '0.75em', 
                letterSpacing: chapterOpening.numberLetterSpacing || '3px', 
                fontWeight: chapterOpening.numberWeight || 400,
                fontVariant: chapterOpening.numberVariant || 'all-small-caps',
                opacity: 0.75,
                marginBottom: chapterOpening.gapBetweenNumberAndTitle || '10px'
              }}>
                {chapterLabel}
              </div>
            )}
            <h1 style={{ 
              fontFamily: resolvedHeadingFont, 
              fontSize: chapterOpening.titleSize || '1.9em', 
              fontWeight: chapterOpening.titleWeight || 500,
              letterSpacing: chapterOpening.titleLetterSpacing || '0.5px',
              margin: '0',
              marginBottom: isChapter ? (chapterOpening.gapBetweenTitleAndOrnament || '18px') : '0.5in'
            }}>{section.title}</h1>
            
            {/* Ornament renderer */}
            {isChapter && resolvedOrnamentType === 'svg' && resolvedOrnamentSvgKey && svgOrnaments[resolvedOrnamentSvgKey] && (
              <div 
                className="print-chapter-svg-ornament"
                dangerouslySetInnerHTML={{ __html: svgOrnaments[resolvedOrnamentSvgKey] }}
                style={{ 
                  width: '120px', 
                  margin: resolvedAlignment === 'center' ? '0 auto' : '0', 
                  opacity: 0.6,
                  marginBottom: chapterOpening.gapBetweenOrnamentAndBody || '28px'
                }}
              />
            )}
            {isChapter && resolvedOrnamentType === 'symbol' && chapterDesigner.dividerStyle !== 'none' && (
              <div style={{ 
                fontSize: '1.4em', 
                opacity: 0.7,
                marginBottom: chapterOpening.gapBetweenOrnamentAndBody || '28px'
              }}>
                {resolvedDivider}
              </div>
            )}
          </div>

          <div 
            dangerouslySetInnerHTML={{ __html: section.content }} 
            className={bodyClasses}
            style={{ textIndent: activeTheme.indentation }}
          />
        </div>
      );
    });
  };

  return (
    <div className="inkforge-app flex flex-col h-full w-full">
      
      <TopNav 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSetup={() => setIsSetupOpen(true)}
        onOpenThemes={() => setIsThemesOpen(true)}
        onOpenDesigner={() => setIsDesignerOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenManageBooks={() => setIsManageBooksOpen(true)}
        onAddChapter={() => handleOpenAddSectionModal('chapter')}
        onNewProject={handleCreateNewBook}
        onOpenProject={handleOpenProject}
        onSaveDraftLocal={handleSaveDraftLocal}
        onDownloadDraft={handleDownloadDraft}
        onToggleJustification={handleToggleJustification}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        autosaveStatus={autosaveStatus}
      />

      {/* Main Three-Panel Workspace Layout */}
      <div className="workspace-container flex flex-1 overflow-hidden">
        
        {/* Left Sidebar: Structure Panel */}
        <LeftSidebar 
          sections={book.sections}
          activeSectionId={activeSectionId}
          setActiveSectionId={setActiveSectionId}
          onAddSection={handleOpenAddSectionModal}
          onRemoveSection={handleRemoveSection}
          onDuplicateSection={handleDuplicateSection}
          onReorderSections={handleReorderSections}
          coverImage={book.coverImage}
          onUploadCover={handleUploadCover}
        />

        {/* Center Panel: Editor Canvas */}
        <Editor 
          section={activeSection}
          onChangeContent={handleContentChange}
          onChangeTitle={handleTitleChange}
          dividerSymbol={chapterDesigner?.customSceneBreak || activeTheme?.dividerSymbol}
        />

        {/* Right Panel: Page Layout Live Preview */}
        <RightPreview 
          activeSection={activeSection}
          sections={book.sections}
          metadata={book.metadata}
          activeTheme={activeTheme}
          chapterDesigner={chapterDesigner}
        />
      </div>

      {/* Modals & Dialogs */}
      <AddSectionModal 
        isOpen={isAddSectionOpen}
        onClose={() => setIsAddSectionOpen(false)}
        targetType={addSectionTargetType}
        onConfirmAdd={handleConfirmAddSection}
      />

      <ManageBooksModal
        isOpen={isManageBooksOpen}
        onClose={() => setIsManageBooksOpen(false)}
        books={booksCollection}
        activeBookId={activeBookId}
        onSelectBook={handleSelectBook}
        onCreateBook={handleCreateNewBook}
        onDuplicateBook={handleDuplicateBook}
        onRenameBook={handleRenameBook}
        onDeleteBook={handleDeleteBook}
      />

      <SetupModal 
        isOpen={isSetupOpen}
        onClose={() => setIsSetupOpen(false)}
        metadata={book.metadata}
        onChangeMetadata={handleMetadataChange}
      />

      <ThemeGallery 
        isOpen={isThemesOpen}
        onClose={() => setIsThemesOpen(false)}
        activeThemeId={activeThemeId}
        onSelectTheme={(id) => {
          setActiveThemeId(id);
          const preset = themes.find(t => t.id === id);
          if (preset) {
            const co = preset.chapterOpening || {};
            setChapterDesigner(prev => ({
              ...prev,
              alignment: co.layout === 'left-aligned' ? 'left' : (co.layout === 'right-aligned' ? 'right' : 'center'),
              dividerStyle: preset.dividerStyle || prev.dividerStyle,
              openingParagraphStyle: preset.firstParagraphStyle || prev.openingParagraphStyle,
              dropCaps: preset.dropCaps
            }));
          }
        }}
      />

      <ChapterDesigner 
        isOpen={isDesignerOpen}
        onClose={() => setIsDesignerOpen(false)}
        config={chapterDesigner}
        onChangeConfig={setChapterDesigner}
        activeTheme={activeTheme}
      />

      <StatsPanel 
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        sections={book.sections}
        metadata={book.metadata}
      />

      <ExportModal 
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        bookData={book}
        activeTheme={activeTheme}
        chapterDesigner={chapterDesigner}
      />

      {/* Hidden Book for native Print CSS Compilation */}
      <div className="print-only-book">
        {renderPrintableContent()}
      </div>

      <style>{`
        .inkforge-app {
          background-color: var(--ui-app-bg);
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }

        .workspace-container {
          height: calc(100vh - 80px); /* 36px Menu + 44px Toolbar */
          overflow: hidden;
        }

        /* Printable PDF Styling variables */
        @media print {
          @page {
            size: auto;
            margin-top: ${topMargin}in;
            margin-bottom: ${bottomMargin}in;
          }
          @page :left {
            margin-left: ${outsideMargin}in;
            margin-right: ${insideMargin}in;
          }
          @page :right {
            margin-left: ${insideMargin}in;
            margin-right: ${outsideMargin}in;
          }
          
          /* Hide interactive application UI and modal screens */
          .menu-bar, .toolbar, .workspace-container, .modal-overlay, .menu-backdrop {
            display: none !important;
            visibility: hidden !important;
          }
          
          /* Unlock scroll/height boundaries on app container wrappers for multi-page print layout */
          html, body, #root, .inkforge-app {
            height: auto !important;
            min-height: 100% !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
          }

          .print-only-book {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            color: black !important;
          }
          
          .print-section-page {
            page-break-after: always;
            break-after: page;
            box-sizing: border-box;
            background: white !important;
            color: black !important;
          }
          
          .print-body-content p {
            margin-bottom: 0.8em;
            text-align: justify;
          }

          /* Drop Caps for printing */
          .print-body-content.has-drop-cap > p:first-of-type::first-letter {
            float: left;
            font-size: 3.4em;
            line-height: 0.8;
            margin-right: 8px;
            margin-top: 4px;
            font-weight: 600;
            font-family: inherit;
          }

          /* First paragraph opening styles for printing */
          .print-body-content.fp-small-caps > p:first-of-type::first-line {
            font-variant: all-small-caps;
            letter-spacing: 0.5px;
          }
          .print-body-content.fp-uppercase > p:first-of-type::first-line {
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .print-body-content.fp-bold > p:first-of-type::first-line {
            font-weight: bold;
          }

          /* Decorative page corners for printing */
          .print-corner-decorations {
            position: absolute;
            top: 0.25in;
            left: 0.25in;
            right: 0.25in;
            bottom: 0.25in;
            pointer-events: none;
          }
          .print-corner-decor-tl, .print-corner-decor-tr, .print-corner-decor-bl, .print-corner-decor-br {
            position: absolute;
            width: 36px;
            height: 36px;
            color: #000;
            opacity: 0.3;
          }
          .print-corner-decor-tl { top: 0; left: 0; }
          .print-corner-decor-tr { top: 0; right: 0; transform: rotate(90deg); }
          .print-corner-decor-bl { bottom: 0; left: 0; transform: rotate(-90deg); }
          .print-corner-decor-br { bottom: 0; right: 0; transform: rotate(180deg); }
        }
        @media screen {
          .print-only-book {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
