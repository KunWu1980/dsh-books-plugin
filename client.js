window.__ModuleLoader__.load({
  id: '@local/books',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    const NS = 'books';
    const PANEL_ID = 'books';

    const zh = {
      meta: { title: '书架', description: '在 DeepSeek Harness 内阅读和管理你的书库' },
      panel: '书架', library: '书库', empty: '未找到书籍。请将 TXT/EPUB/PDF/AZW3/DOC/DOCX 文件放入书库目录。',
      loading: '加载中...', refresh: '刷新', search: '搜索书名或作者', untitled: '无标题',
      unknownAuthor: '未知作者', chapters: '目录', back: '返回书库',
      noText: '此书没有可提取的文本（可能是扫描版 PDF 或受 DRM 保护）。', error: '错误',
      settings: '设置', libraryPath: '书库目录', save: '保存', cancel: '取消',
      format: '格式', added: '文件已加入书库', addFailed: '添加文件失败',
      import: '导入书籍', importHint: '点击下方按钮选择要导入的书籍文件（可多选），文件将被复制到书库目录', importAction: '选择书籍文件',
      importDone: '已导入 {n} 本，失败 {s} 本', importFailed: '导入失败',
      pathLabel: '书库位置', chapterPlaceholder: '选择章节', allChapters: '全文',
      setPath: '更换书库位置', setPathHint: '修改书库保存目录。勾选“移动已有书籍”会把当前书库里的文件一并搬到新目录。',
      moveExisting: '移动已有书籍到新位置', moveNote: '原目录中已存在同名文件时跳过；跨磁盘会自动复制后删除。',
      resetDefault: '恢复默认位置', saved: '书库位置已更新', moveResult: '已移动 {n} 个文件，跳过 {s} 个。',
      defaultBadge: '默认', customBadge: '自定义',
      pickFolder: '选择文件夹', pickPlaceholder: '尚未选择目录', pickFailed: '无法打开目录选择窗口',
      scannedHint: '这是扫描版 PDF（共 {n} 页），没有文字层，已切换为逐页看图模式：可翻页、缩放，但无法搜索或复制文字。',
      prevPage: '上一页', nextPage: '下一页', pageOf: '第 {n} / {total} 页', zoomIn: '放大', zoomOut: '缩小',
      allBooks: '全部书籍', rootFolder: '（根目录）', newCategory: '新建分类',
      categoryName: '分类名称', createCategory: '创建分类', categorize: '分类',
      categorizeFor: '为《{n}》选择分类', noCustomYet: '还没有自定义分类。',
      renameCategory: '重命名分类', saveName: '保存名称',
      categoryHint: '自定义分类由你管理；📁 分类根据书库中的文件夹自动生成。',
      arrowHint: '提示：阅读时按 ← / → 键翻页。',
      textPagerPrev: '上一页', textPagerNext: '下一页',
      loadMore: '加载更多（还有 {n} 章）', chapterLabel: '跳转章节',
      deleteCategory: '删除分类',
      myCategories: '我的分类', folderCategories: '文件夹分类', close: '关闭',
      deleteBook: '删除书籍',
      deleteTitle: '删除《{n}》',
      deleteHint: '请选择删除方式：',
      deleteRecord: '仅从书架移除（保留本地文件）', deleteRecordNote: '书籍将从书架消失，但文件仍保留在书库目录中，可随时重新导入。',
      deleteFile: '从书架移除并删除本地文件', deleteFileNote: '书籍记录和书库目录中的文件都会被永久删除，此操作不可撤销。',
      deleteDone: '已从书架移除《{n}》', deleteFileDone: '已删除《{n}》及其本地文件', deleteFailed: '删除失败',
      confirmDelete: '确认删除', deleteWarn: '此操作不可撤销，请谨慎选择。',
    };
    const en = {
      meta: { title: 'Books', description: 'Read and manage your book library inside DeepSeek Harness' },
      panel: 'Books', library: 'Library', empty: 'No books found. Add TXT/EPUB/PDF/AZW3/DOC/DOCX files to your library folder.',
      loading: 'Loading...', refresh: 'Refresh', search: 'Search title or author', untitled: 'Untitled',
      unknownAuthor: 'Unknown author', chapters: 'Chapters', back: 'Back to library',
      noText: 'This book has no extractable text (it may be a scanned image PDF or DRM-protected).', error: 'Error',
      settings: 'Settings', libraryPath: 'Library folder', save: 'Save', cancel: 'Cancel',
      format: 'Format', added: 'Files added to library', addFailed: 'Failed to add files',
      import: 'Import books', importHint: 'Click the button below to choose book files (multiple allowed); they will be copied into the library folder', importAction: 'Choose book files',
      importDone: 'Imported {n}, failed {s}', importFailed: 'Import failed',
      pathLabel: 'Library location', chapterPlaceholder: 'Select a chapter', allChapters: 'All chapters',
      setPath: 'Change library location', setPathHint: 'Change where books are stored. Check "move existing books" to also move files from the current folder.',
      moveExisting: 'Move existing books to new location', moveNote: 'Files with the same name already at the target are skipped; cross-volume moves fall back to copy + delete.',
      resetDefault: 'Restore default location', saved: 'Library location updated', moveResult: 'Moved {n} file(s), skipped {s}.',
      defaultBadge: 'Default', customBadge: 'Custom',
      pickFolder: 'Choose folder', pickPlaceholder: 'No folder selected', pickFailed: 'Could not open the folder picker',
      scannedHint: 'This is a scanned PDF ({n} pages) with no text layer. Page-by-page image view is enabled: you can flip and zoom, but text cannot be searched or copied.',
      prevPage: 'Previous', nextPage: 'Next', pageOf: 'Page {n} / {total}', zoomIn: 'Zoom in', zoomOut: 'Zoom out',
      allBooks: 'All books', rootFolder: '(root)', newCategory: 'New category',
      categoryName: 'Category name', createCategory: 'Create category', categorize: 'Categorize',
      categorizeFor: 'Choose categories for "{n}"', noCustomYet: 'No custom categories yet.',
      renameCategory: 'Rename category', saveName: 'Save name',
      categoryHint: 'Custom categories are managed by you; 📁 categories are generated from folders in the library.',
      arrowHint: 'Tip: press ← / → to flip pages while reading.',
      textPagerPrev: 'Prev page', textPagerNext: 'Next page',
      loadMore: 'Load more ({n} chapters left)', chapterLabel: 'Jump to chapter',
      deleteCategory: 'Delete category',
      myCategories: 'My categories', folderCategories: 'Folders', close: 'Close',
      deleteBook: 'Delete book',
      deleteTitle: 'Delete "{n}"',
      deleteHint: 'Choose how to delete:',
      deleteRecord: 'Remove from shelf only (keep local file)', deleteRecordNote: 'The book disappears from the shelf but the file stays in the library folder; you can re-import it anytime.',
      deleteFile: 'Remove from shelf and delete local file', deleteFileNote: 'Both the shelf record and the file in the library folder are permanently deleted. This cannot be undone.',
      deleteDone: 'Removed "{n}" from the shelf', deleteFileDone: 'Deleted "{n}" and its local file', deleteFailed: 'Delete failed',
      confirmDelete: 'Confirm delete', deleteWarn: 'This cannot be undone; please choose carefully.',
    };

    const C = {
      bg: 'var(--dsw-alias-bg-base)',
      layer1: 'var(--dsw-alias-bg-layer-1)',
      layer2: 'var(--dsw-alias-bg-layer-2)',
      border: 'var(--dsw-alias-border-l2)',
      text: 'var(--dsw-alias-label-primary)',
      muted: 'var(--dsw-alias-label-secondary)',
      faint: 'var(--dsw-alias-label-tertiary)',
      brand: 'var(--dsw-alias-brand-primary)',
      error: 'var(--dsw-alias-state-error-primary)',
    };

    const STYLES = `
      .books-root{height:100%;box-sizing:border-box;background:${C.bg};color:${C.text};display:flex;flex-direction:column;font-size:14px;}
      .books-head{display:flex;align-items:center;gap:8px;padding:14px 20px;border-bottom:1px solid ${C.border};flex:none;}
      .books-title{font-size:17px;font-weight:600;flex:1;}
      .books-btn{border:1px solid ${C.border};background:${C.layer1};color:${C.text};border-radius:6px;padding:5px 12px;cursor:pointer;font-size:13px;}
      .books-btn:hover{border-color:${C.brand};color:${C.brand};}
      .books-btn.danger{border-color:${C.error};color:${C.error};}
      .books-btn.danger:hover{background:${C.error};color:${C.bg};}
      .books-btn:disabled{opacity:.5;cursor:not-allowed;}
      .books-body{flex:1;overflow:auto;padding:16px 20px;}
      .books-toolbar{display:flex;gap:8px;align-items:center;margin-bottom:14px;flex-wrap:wrap;}
      .books-input{border:1px solid ${C.border};background:${C.layer1};color:${C.text};border-radius:6px;padding:6px 10px;font-size:13px;min-width:220px;outline:none;}
      .books-input:focus{border-color:${C.brand};}
      .books-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:12px;}
      .books-card{border:1px solid ${C.border};background:${C.layer1};border-radius:10px;padding:14px;cursor:pointer;transition:border-color .15s;}
      .books-card:hover{border-color:${C.brand};}
      .books-card-title{font-weight:600;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .books-card-meta{font-size:12px;color:${C.muted};}
      .books-badge{display:inline-block;font-size:11px;padding:1px 6px;border-radius:4px;background:${C.layer2};border:1px solid ${C.border};margin-right:6px;text-transform:uppercase;}
      .books-empty,.books-loading,.books-error{padding:40px 0;text-align:center;color:${C.muted};}
      .books-error{color:${C.error};}
      .books-reader{max-width:760px;margin:0 auto;}
      .books-reader-title{font-size:22px;font-weight:600;margin-bottom:4px;}
      .books-reader-author{font-size:13px;color:${C.muted};margin-bottom:16px;}
      .books-chapterbar{display:flex;gap:8px;align-items:center;margin-bottom:18px;flex-wrap:wrap;}
      .books-chapter-select{border:1px solid ${C.border};background:${C.layer1};color:${C.text};border-radius:6px;padding:6px 10px;font-size:13px;max-width:420px;outline:none;cursor:pointer;}
      .books-chapter-select:focus{border-color:${C.brand};}
      .books-chapter-all{border:1px solid ${C.border};background:${C.layer1};color:${C.muted};border-radius:6px;padding:6px 12px;font-size:13px;cursor:pointer;white-space:nowrap;}
      .books-chapter-all.active{border-color:${C.brand};color:${C.brand};}
      .books-loadmore{display:block;margin:16px auto;padding:8px 18px;border:1px solid ${C.border};background:${C.layer1};color:${C.brand};border-radius:6px;font-size:13px;cursor:pointer;}
      .books-loadmore:hover{border-color:${C.brand};}
      .books-text-viewport{height:calc(100vh - 300px);min-height:340px;overflow-y:auto;scroll-behavior:smooth;border:1px solid ${C.border};border-radius:8px;background:${C.layer1};padding:0 20px;box-sizing:border-box;}
      .books-text{line-height:1.9;white-space:pre-wrap;word-break:break-word;font-size:15px;}
      .books-text h2{font-size:17px;font-weight:600;margin:22px 0 8px;}
      .books-warn{background:${C.layer2};border:1px solid ${C.border};border-radius:6px;padding:10px 12px;color:${C.muted};font-size:13px;margin-bottom:16px;}
      .books-import-box{border:1px solid ${C.border};background:${C.layer1};border-radius:8px;padding:12px;margin-bottom:14px;}
      .books-import-box textarea{width:100%;box-sizing:border-box;min-height:64px;resize:vertical;border:1px solid ${C.border};background:${C.bg};color:${C.text};border-radius:6px;padding:8px;font-size:13px;outline:none;}
      .books-hint{font-size:12px;color:${C.faint};margin-bottom:6px;}
      .books-row{display:flex;gap:8px;align-items:center;}
      .books-row input{flex:1;}
      .books-settings-box{border:1px solid ${C.border};background:${C.layer1};border-radius:8px;padding:12px;margin-bottom:14px;}
      .books-picker-row{display:flex;gap:8px;align-items:center;margin:8px 0;}
      .books-picker-path{flex:1;min-width:0;border:1px solid ${C.border};background:${C.bg};color:${C.text};border-radius:6px;padding:8px 10px;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .books-picker-path.empty{color:${C.faint};}
      .books-check{display:flex;align-items:center;gap:6px;margin:10px 0;font-size:13px;color:${C.muted};cursor:pointer;}
      .books-badge.small{font-size:10px;padding:0 5px;margin-left:6px;}
      .books-msg{font-size:12px;color:${C.brand};margin-top:8px;}
      .books-pager{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;margin:10px 0 14px;}
      .books-page-label{font-size:13px;color:${C.muted};min-width:110px;text-align:center;}
      .books-page-frame{border:1px solid ${C.border};background:${C.layer1};border-radius:8px;padding:10px;text-align:center;overflow:auto;max-height:calc(100vh - 220px);}
      .books-page-img{max-width:100%;height:auto;display:block;margin:0 auto;box-shadow:0 2px 10px rgba(0,0,0,.25);}
      .books-main{display:flex;gap:16px;align-items:flex-start;}
      .books-cats{width:200px;flex:none;border:1px solid ${C.border};background:${C.layer1};border-radius:10px;padding:10px;max-height:calc(100vh - 160px);overflow:auto;}
      .books-cats-title{font-size:12px;color:${C.faint};text-transform:uppercase;letter-spacing:.5px;margin:4px 6px 8px;}
      .books-cat-item{display:flex;align-items:center;gap:6px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:13px;color:${C.muted};}
      .books-cat-item:hover{background:${C.layer2};}
      .books-cat-item.active{background:${C.layer2};color:${C.brand};font-weight:600;}
      .books-cat-count{margin-left:auto;font-size:11px;color:${C.faint};}
      .books-cat-sep{height:1px;background:${C.border};margin:10px 4px;}
      .books-cat-addrow{display:flex;gap:4px;margin-top:6px;}
      .books-cat-addrow input{min-width:0;width:100%;border:1px solid ${C.border};background:${C.bg};color:${C.text};border-radius:6px;padding:5px 7px;font-size:12px;outline:none;}
      .books-cat-addrow input:focus{border-color:${C.brand};}
      .books-cat-rename{font-size:11px;color:${C.faint};margin-left:auto;padding:0 3px;}
      .books-content{flex:1;min-width:0;}
      .books-cat-chip{border:1px solid ${C.border};background:${C.layer1};color:${C.muted};border-radius:12px;padding:2px 8px;font-size:11px;cursor:pointer;}
      .books-cat-chip.on{border-color:${C.brand};color:${C.brand};}
      .books-arrow-hint{font-size:12px;color:${C.faint};margin-top:10px;text-align:center;}
      .books-card-actions{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;}
      .books-card-btn{border:1px solid ${C.border};background:${C.layer1};color:${C.muted};border-radius:6px;padding:2px 8px;font-size:11px;cursor:pointer;}
      .books-card-btn:hover{border-color:${C.brand};color:${C.brand};}
      .books-card-btn.danger:hover{border-color:${C.error};color:${C.error};}
      .books-del-option{display:flex;gap:10px;align-items:flex-start;border:1px solid ${C.border};background:${C.bg};border-radius:8px;padding:10px 12px;margin:8px 0;cursor:pointer;}
      .books-del-option:hover{border-color:${C.brand};}
      .books-del-option.danger:hover{border-color:${C.error};}
      .books-del-radio{margin-top:2px;accent-color:${C.brand};}
      .books-del-option.danger .books-del-radio{accent-color:${C.error};}
      .books-del-label{font-weight:600;font-size:13px;color:${C.text};}
      .books-del-note{font-size:12px;color:${C.faint};margin-top:2px;line-height:1.5;}
      .books-del-warn{font-size:12px;color:${C.error};margin:8px 0;}
    `;

    function BooksIcon(props) {
      const size = props && typeof props.size === 'number' ? props.size : 18;
      const active = Boolean(props && props.active);
      return h('svg', {
        viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': true,
        style: { display: 'block', color: active ? C.brand : C.faint },
      },
        h('path', { d: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22.5z', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
        h('path', { d: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
        h('path', { d: 'M8 7h8M8 11h6', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7 }),
      );
    }

    async function api(path, options) {
      const r = await fetch('/api/books/' + path, options);
      const text = await r.text();
      let data;
      try { data = JSON.parse(text); } catch { throw new Error(text.slice(0, 200) || ('HTTP ' + r.status)); }
      if (!r.ok || data.ok === false) throw new Error(data.error || ('HTTP ' + r.status));
      return data;
    }

    function BooksPanel(props) {
      const t = typeof props.t === 'function' ? props.t : (key) => key;
      const pickFolder = props.pickFolder;
      const [books, setBooks] = React.useState([]);
      const [libraryPath, setLibraryPath] = React.useState('');
      const [defaultLibraryPath, setDefaultLibraryPath] = React.useState('');
      const [isCustom, setIsCustom] = React.useState(false);
      const [status, setStatus] = React.useState('idle'); // idle|loading|error
      const [errorText, setErrorText] = React.useState('');
      const [query, setQuery] = React.useState('');
      const [current, setCurrent] = React.useState(null); // book object
      const [reader, setReader] = React.useState(null);   // extracted book
      const [chapter, setChapter] = React.useState(-1);   // -1 = all
      const [visibleCount, setVisibleCount] = React.useState(12); // progressive chapter rendering
      const [showImport, setShowImport] = React.useState(false);
      const fileInputRef = React.useRef(null);
      const [showSettings, setShowSettings] = React.useState(false);
      const [pathDraft, setPathDraft] = React.useState('');
      const [moveExisting, setMoveExisting] = React.useState(true);
      const [msg, setMsg] = React.useState('');
      const [pageNum, setPageNum] = React.useState(0);   // 0-based page index (image mode)
      const [pageZoom, setPageZoom] = React.useState(1.4);
      const [textPage, setTextPage] = React.useState(0); // 0-based page index (text mode, screen-height paging)
      const [textPageCount, setTextPageCount] = React.useState(1);
      const textViewportRef = React.useRef(null);
      // Categories
      const [categories, setCategories] = React.useState([]);   // [{id,name,type,count}]
      const [activeCat, setActiveCat] = React.useState(null);   // null = all books
      const [newCatName, setNewCatName] = React.useState('');
      const [renameCat, setRenameCat] = React.useState(null);   // {id,name}
      const [categorizeBook, setCategorizeBook] = React.useState(null); // book object
      const [deleteBook, setDeleteBook] = React.useState(null);   // book object pending deletion
      const [deleteMode, setDeleteMode] = React.useState('record'); // record|file

      const loadList = React.useCallback(async () => {
        setStatus('loading');
        setErrorText('');
        try {
          // Single bootstrap request: one scan, one round-trip (was 4 sequential calls).
          const data = await api('bootstrap');
          setLibraryPath(data.libraryPath || '');
          setDefaultLibraryPath(data.defaultLibraryPath || '');
          setIsCustom(Boolean(data.isCustom));
          setBooks(data.books || []);
          setCategories(data.categories || []);
          setStatus('idle');
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      }, []);

      React.useEffect(() => { void loadList(); }, [loadList]);

      // Left/Right arrow keys flip pages: image mode flips one scanned page,
      // text mode scrolls one screen-height page inside the text viewport.
      React.useEffect(() => {
        if (!reader) return;
        const isImages = reader.mode === 'images';
        const total = isImages ? Math.max(1, reader.pageCount || 1) : Math.max(1, textPageCount);
        const onKey = (e) => {
          const tag = ((e.target && e.target.tagName) || '').toLowerCase();
          if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
          let dir = 0;
          if (e.key === 'ArrowLeft') dir = -1;
          else if (e.key === 'ArrowRight') dir = 1;
          else return;
          e.preventDefault();
          if (isImages) {
            setPageNum((v) => Math.max(0, Math.min(total - 1, v + dir)));
          } else {
            setTextPage((v) => {
              const next = Math.max(0, Math.min(total - 1, v + dir));
              const vp = textViewportRef.current;
              if (vp) vp.scrollTo({ top: next * vp.clientHeight, behavior: 'smooth' });
              return next;
            });
          }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [reader, textPageCount]);

      // Recompute how many screen-height pages the current text occupies.
      React.useEffect(() => {
        if (!reader || reader.mode === 'images') return;
        const vp = textViewportRef.current;
        if (!vp) return;
        const update = () => {
          const pages = Math.max(1, Math.ceil(vp.scrollHeight / Math.max(1, vp.clientHeight)));
          setTextPageCount(pages);
        };
        update();
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
        if (ro) ro.observe(vp);
        return () => { if (ro) ro.disconnect(); };
      }, [reader, chapter, visibleCount, status]);

      const mutateCat = async (action, payload) => {
        setStatus('loading');
        try {
          const data = await api('categories', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ action, ...payload }),
          });
          setCategories(data.categories || []);
          setStatus('idle');
          return data;
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
          return null;
        }
      };

      const createCategory = async () => {
        const name = newCatName.trim();
        if (!name) return;
        const data = await mutateCat('create', { name });
        if (data) setNewCatName('');
      };

      const saveRename = async () => {
        if (!renameCat) return;
        const name = renameCat.name.trim();
        if (!name) return;
        const data = await mutateCat('rename', { id: renameCat.id, name });
        if (data && activeCat && activeCat.id === renameCat.id) setActiveCat({ ...activeCat, name });
        setRenameCat(null);
      };

      const removeCategory = async (id) => {
        if (!window.confirm) return; // no-op in restricted contexts
        if (!window.confirm(t('deleteCategory') + '?')) return;
        const data = await mutateCat('delete', { id });
        if (data && activeCat && activeCat.id === id) setActiveCat(null);
      };

      const toggleBookCategory = async (book, catId) => {
        const current = Array.isArray(book.categories) ? book.categories : [];
        const next = current.includes(catId) ? current.filter((x) => x !== catId) : [...current, catId];
        await mutateCat('assign', { bookId: book.id, categories: next });
        setCategorizeBook((b) => b ? { ...b, categories: next } : b);
      };

      const openDelete = (book) => {
        setDeleteBook(book);
        setDeleteMode('record');
      };

      const doDelete = async () => {
        if (!deleteBook) return;
        const book = deleteBook;
        setStatus('loading');
        try {
          const data = await api('delete', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ id: book.id, mode: deleteMode }),
          });
          setMsg((deleteMode === 'file' ? t('deleteFileDone') : t('deleteDone')).replace('{n}', book.title || t('untitled')));
          setDeleteBook(null);
          if (reader && reader.id === book.id) { setReader(null); setChapter(-1); }
          await loadList();
        } catch (e) {
          setMsg(t('deleteFailed') + ': ' + String(e && e.message || e));
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      };

      const openBook = async (id) => {
        setStatus('loading');
        setErrorText('');
        try {
          const data = await api('read?id=' + encodeURIComponent(id));
          setReader(data.book);
          setChapter(-1);
          setVisibleCount(12);
          setPageNum(0);
          setPageZoom(1.4);
          setTextPage(0);
          setTextPageCount(1);
          setStatus('idle');
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      };

      const openSettings = () => {
        setPathDraft(libraryPath);
        setMoveExisting(true);
        setMsg('');
        setShowSettings((v) => !v);
      };

      const chooseFolder = async () => {
        if (typeof pickFolder !== 'function') { setMsg(t('pickFailed')); return; }
        try {
          const picked = await pickFolder();
          if (picked) setPathDraft(picked);
        } catch (e) {
          setMsg(t('pickFailed') + ': ' + String(e && e.message || e));
        }
      };

      const savePath = async () => {
        const target = pathDraft.trim();
        if (!target) { setMsg(libraryPath); return; }
        setStatus('loading');
        setMsg('');
        try {
          const data = await api('config', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ libraryPath: target, move: moveExisting }),
          });
          setLibraryPath(data.libraryPath || '');
          setDefaultLibraryPath(data.defaultLibraryPath || '');
          setIsCustom(Boolean(data.isCustom));
          extractCacheHint(data.move);
          setShowSettings(false);
          await loadList(); // refresh books + categories via a single bootstrap
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      };

      const resetPath = async () => {
        setStatus('loading');
        setMsg('');
        try {
          const data = await api('config', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ reset: true, move: true }),
          });
          setLibraryPath(data.libraryPath || '');
          setDefaultLibraryPath(data.defaultLibraryPath || '');
          setIsCustom(Boolean(data.isCustom));
          setPathDraft(data.libraryPath || '');
          extractCacheHint(data.move);
          setShowSettings(false);
          await loadList(); // refresh books + categories via a single bootstrap
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      };

      function extractCacheHint(move) {
        if (move && !move.same) {
          setMsg(t('moveResult').replace('{n}', move.moved).replace('{s}', move.skipped));
        } else {
          setMsg(t('saved'));
        }
      }

      const doImport = async (files) => {
        const list = Array.from(files || []);
        if (!list.length) return;
        setStatus('loading');
        try {
          const form = new FormData();
          for (const f of list) form.append('books', f, f.name);
          const data = await api('import', { method: 'POST', body: form });
          const added = Array.isArray(data.added) ? data.added.length : 0;
          const failed = Array.isArray(data.failed) ? data.failed.length : 0;
          setMsg(t('importDone').replace('{n}', added).replace('{s}', failed));
          setShowImport(false);
          await loadList(); // refresh books + categories via a single bootstrap
        } catch (e) {
          setMsg(t('importFailed') + ': ' + String(e && e.message || e));
          setErrorText(String(e && e.message || e));
          setStatus('error');
        } finally {
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };

      const inCategory = (b) => {
        if (!activeCat) return true;
        if (activeCat.type === 'folder') return b.folder === activeCat.name;
        // custom
        return Array.isArray(b.categories) && b.categories.includes(activeCat.id);
      };
      const filtered = books.filter((b) => {
        if (!inCategory(b)) return false;
        const q = query.trim().toLowerCase();
        return !q || (b.title || '').toLowerCase().includes(q) || (b.author || '').toLowerCase().includes(q);
      });
      const customCats = categories.filter((c) => c.type === 'custom');
      const folderCats = categories.filter((c) => c.type === 'folder');

      const chapters = reader && Array.isArray(reader.chapters) ? reader.chapters : [];
      // When a chapter is selected via the dropdown, show only that chapter.
      // In "all chapters" mode, render progressively to keep the DOM light.
      const wholeBook = chapter < 0;
      const renderedChapters = wholeBook ? chapters.slice(0, visibleCount) : chapters.slice(chapter, chapter + 1);
      const remaining = chapters.length - visibleCount;

      return h('div', { className: 'books-root' },
        h('style', null, STYLES),
        h('div', { className: 'books-head' },
          h('div', { className: 'books-title' }, reader ? (reader.title || t('untitled')) : t('library')),
          reader
            ? h('button', { className: 'books-btn', onClick: () => { setReader(null); setChapter(-1); void loadList(); } }, '‹ ' + t('back'))
            : h(React.Fragment, null,
                h('button', { className: 'books-btn', onClick: () => setShowImport((v) => !v) }, t('import')),
                h('button', { className: 'books-btn', onClick: openSettings }, '⚙ ' + t('settings')),
                h('button', { className: 'books-btn', onClick: () => void loadList() }, t('refresh')),
              ),
        ),
        h('div', { className: 'books-body' },
          status === 'loading' && h('div', { className: 'books-loading' }, t('loading')),
          status !== 'loading' && errorText && h('div', { className: 'books-error' }, t('error') + ': ' + errorText),
          status === 'idle' && !reader && h('div', { className: 'books-main' },
            h('aside', { className: 'books-cats' },
              h('div', {
                className: 'books-cat-item' + (activeCat === null ? ' active' : ''),
                onClick: () => setActiveCat(null),
              }, '\uD83D\uDCDA ' + t('allBooks'),
                h('span', { className: 'books-cat-count' }, books.length),
              ),
              h('div', { className: 'books-cats-title' }, t('myCategories')),
              customCats.map((c) =>
                renameCat && renameCat.id === c.id
                  ? h('div', { key: c.id, className: 'books-cat-item active' },
                      h('input', {
                        value: renameCat.name, autoFocus: true, style: { width: 90 },
                        onChange: (e) => setRenameCat({ id: c.id, name: e.target.value }),
                        onKeyDown: (e) => {
                          if (e.key === 'Enter') void saveRename();
                          if (e.key === 'Escape') setRenameCat(null);
                        },
                      }),
                      h('button', { className: 'books-cat-rename', onClick: () => void saveRename() }, '\u2713'),
                    )
                  : h('div', {
                      key: c.id,
                      className: 'books-cat-item' + (activeCat && activeCat.id === c.id ? ' active' : ''),
                      onClick: () => setActiveCat(c),
                    },
                      h('span', null, '\uD83C\uDFF7 ' + c.name),
                      h('span', { className: 'books-cat-count' }, c.count),
                      h('button', {
                        className: 'books-cat-rename', title: t('renameCategory'),
                        onClick: (e) => { e.stopPropagation(); setRenameCat({ id: c.id, name: c.name }); },
                      }, '\u270E'),
                    ),
              ),
              customCats.length === 0 && h('div', { className: 'books-hint', style: { padding: '0 8px' } }, t('noCustomYet')),
              h('div', { className: 'books-cat-addrow' },
                h('input', {
                  placeholder: t('categoryName'), value: newCatName,
                  onChange: (e) => setNewCatName(e.target.value),
                  onKeyDown: (e) => { if (e.key === 'Enter') void createCategory(); },
                }),
                h('button', { className: 'books-btn', title: t('createCategory'), onClick: () => void createCategory() }, '+'),
              ),
              h('div', { className: 'books-cat-sep' }),
              h('div', { className: 'books-cats-title' }, t('folderCategories')),
              folderCats.length === 0
                ? h('div', { className: 'books-hint', style: { padding: '0 8px' } }, t('rootFolder'))
                : folderCats.map((c) =>
                    h('div', {
                      key: c.id,
                      className: 'books-cat-item' + (activeCat && activeCat.id === c.id ? ' active' : ''),
                      onClick: () => setActiveCat(c),
                    },
                      h('span', { title: c.name }, '\uD83D\uDCC1 ' + c.name),
                      h('span', { className: 'books-cat-count' }, c.count),
                    ),
                  ),
            ),
            h('div', { className: 'books-content' },
            h('div', { className: 'books-toolbar' },
              h('input', { className: 'books-input', placeholder: t('search'), value: query, onChange: (e) => setQuery(e.target.value) }),
              h('span', { style: { color: C.faint, fontSize: 12 } },
                t('pathLabel') + ': ' + libraryPath,
                h('span', { className: 'books-badge small' }, isCustom ? t('customBadge') : t('defaultBadge')),
              ),
            ),
            msg && h('div', { className: 'books-msg' }, msg),
            showSettings && h('div', { className: 'books-settings-box' },
              h('div', { style: { fontWeight: 600, marginBottom: 8 } }, t('setPath')),
              h('div', { className: 'books-hint' }, t('setPathHint')),
              h('div', { className: 'books-picker-row' },
                h('div', { className: 'books-picker-path' + (pathDraft ? '' : ' empty') }, pathDraft || t('pickPlaceholder')),
                h('button', { className: 'books-btn', onClick: () => void chooseFolder() }, t('pickFolder')),
              ),
              h('label', { className: 'books-check' },
                h('input', { type: 'checkbox', checked: moveExisting, onChange: (e) => setMoveExisting(e.target.checked) }),
                t('moveExisting'),
              ),
              h('div', { className: 'books-hint' }, t('moveNote')),
              h('div', { style: { marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' } },
                h('button', { className: 'books-btn', onClick: () => void savePath(), disabled: status === 'loading' }, t('save')),
                h('button', { className: 'books-btn', onClick: () => void resetPath(), disabled: status === 'loading' }, t('resetDefault')),
                h('button', { className: 'books-btn', onClick: () => { setShowSettings(false); setMsg(''); } }, t('cancel')),
              ),
            ),
            showImport && h('div', { className: 'books-import-box' },
              h('div', { className: 'books-hint' }, t('importHint')),
              h('input', {
                type: 'file', multiple: true, ref: fileInputRef,
                accept: '.txt,.epub,.pdf,.azw3,.mobi,.azw,.doc,.docx',
                style: { display: 'none' },
                onChange: (e) => { void doImport(e.target.files); },
              }),
              h('div', { style: { marginTop: 8, display: 'flex', gap: 8 } },
                h('button', { className: 'books-btn', onClick: () => fileInputRef.current && fileInputRef.current.click(), disabled: status === 'loading' }, t('importAction')),
                h('button', { className: 'books-btn', onClick: () => setShowImport(false) }, t('cancel')),
              ),
            ),
            categorizeBook && h('div', { className: 'books-settings-box' },
              h('div', { style: { fontWeight: 600, marginBottom: 8 } }, t('categorizeFor').replace('{n}', categorizeBook.title || t('untitled'))),
              h('div', { className: 'books-hint' }, t('categoryHint')),
              h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' } },
                customCats.length === 0
                  ? h('div', { className: 'books-hint' }, t('noCustomYet'))
                  : customCats.map((c) => h('button', {
                      key: c.id,
                      className: 'books-cat-chip' + (Array.isArray(categorizeBook.categories) && categorizeBook.categories.includes(c.id) ? ' on' : ''),
                      onClick: () => void toggleBookCategory(categorizeBook, c.id),
                    }, '\uD83C\uDFF7 ' + c.name)),
              ),
              h('button', { className: 'books-btn', onClick: () => setCategorizeBook(null) }, t('close')),
            ),
            deleteBook && h('div', { className: 'books-settings-box' },
              h('div', { style: { fontWeight: 600, marginBottom: 4 } }, t('deleteTitle').replace('{n}', deleteBook.title || t('untitled'))),
              h('div', { className: 'books-hint' }, t('deleteHint')),
              h('label', { className: 'books-del-option' },
                h('input', {
                  type: 'radio', name: 'books-del-mode', className: 'books-del-radio',
                  checked: deleteMode === 'record', onChange: () => setDeleteMode('record'),
                }),
                h('div', null,
                  h('div', { className: 'books-del-label' }, t('deleteRecord')),
                  h('div', { className: 'books-del-note' }, t('deleteRecordNote')),
                ),
              ),
              h('label', { className: 'books-del-option danger' },
                h('input', {
                  type: 'radio', name: 'books-del-mode', className: 'books-del-radio',
                  checked: deleteMode === 'file', onChange: () => setDeleteMode('file'),
                }),
                h('div', null,
                  h('div', { className: 'books-del-label' }, t('deleteFile')),
                  h('div', { className: 'books-del-note' }, t('deleteFileNote')),
                ),
              ),
              h('div', { className: 'books-del-warn' }, t('deleteWarn')),
              h('div', { style: { display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' } },
                h('button', {
                  className: 'books-btn' + (deleteMode === 'file' ? ' danger' : ''),
                  onClick: () => void doDelete(), disabled: status === 'loading',
                }, t('confirmDelete')),
                h('button', { className: 'books-btn', onClick: () => setDeleteBook(null) }, t('cancel')),
              ),
            ),
            filtered.length === 0
              ? h('div', { className: 'books-empty' }, t('empty'))
              : h('div', { className: 'books-grid' }, filtered.map((b) =>
                  h('div', { key: b.id, className: 'books-card', onClick: () => void openBook(b.id) },
                    h('div', { className: 'books-card-title' }, b.title || t('untitled')),
                    h('div', { className: 'books-card-meta' },
                      h('span', { className: 'books-badge' }, b.format), Math.round(b.size / 1024) + ' KB',
                      b.folder ? h('span', { className: 'books-badge', style: { marginLeft: 6 } }, '\uD83D\uDCC1 ' + b.folder) : null,
                    ),
                    h('div', { className: 'books-card-actions' },
                      h('button', {
                        className: 'books-card-btn',
                        onClick: (e) => { e.stopPropagation(); setCategorizeBook(b); },
                      }, t('categorize')),
                      h('button', {
                        className: 'books-card-btn danger',
                        onClick: (e) => { e.stopPropagation(); openDelete(b); },
                      }, t('deleteBook')),
                    ),
                  ),
                )),
            ),
          ),
          status === 'idle' && reader && h('div', { className: 'books-reader' },
            reader.mode === 'images' && h('div', { className: 'books-warn' },
              t('scannedHint').replace('{n}', reader.pageCount || 0)),
            reader.mode !== 'images' && reader.warning && h('div', { className: 'books-warn' }, reader.warning || t('noText')),
            h('div', { className: 'books-reader-title' }, reader.title || t('untitled')),
            reader.author && h('div', { className: 'books-reader-author' }, reader.author),
            reader.mode === 'images' && h(React.Fragment, null,
              h('div', { className: 'books-pager' },
                h('button', {
                  className: 'books-btn',
                  disabled: pageNum <= 0,
                  onClick: () => setPageNum((v) => Math.max(0, v - 1)),
                }, '‹ ' + t('prevPage')),
                h('span', { className: 'books-page-label' },
                  t('pageOf').replace('{n}', pageNum + 1).replace('{total}', reader.pageCount || 0)),
                h('button', {
                  className: 'books-btn',
                  disabled: pageNum >= (reader.pageCount || 1) - 1,
                  onClick: () => setPageNum((v) => Math.min((reader.pageCount || 1) - 1, v + 1)),
                }, t('nextPage') + ' ›'),
                h('button', {
                  className: 'books-btn',
                  disabled: pageZoom <= 0.5,
                  onClick: () => setPageZoom((v) => Math.max(0.4, +(v - 0.2).toFixed(2))),
                }, t('zoomOut')),
                h('button', {
                  className: 'books-btn',
                  disabled: pageZoom >= 4,
                  onClick: () => setPageZoom((v) => Math.min(4, +(v + 0.2).toFixed(2))),
                }, t('zoomIn')),
              ),
              h('div', { className: 'books-page-frame' },
                h('img', {
                  className: 'books-page-img',
                  src: '/api/books/page?id=' + encodeURIComponent(reader.id || '') + '&page=' + pageNum + '&zoom=' + pageZoom,
                  alt: t('pageOf').replace('{n}', pageNum + 1).replace('{total}', reader.pageCount || 0),
                }),
              ),
              h('div', { className: 'books-arrow-hint' }, t('arrowHint')),
            ),
            reader.mode !== 'images' && chapters.length > 1 && h('div', { className: 'books-chapterbar' },
              h('button', {
                className: 'books-chapter-all' + (wholeBook ? ' active' : ''),
                onClick: () => {
                  setChapter(-1); setVisibleCount(12); setTextPage(0);
                  const vp = textViewportRef.current; if (vp) vp.scrollTop = 0;
                },
              }, t('allChapters')),
              h('select', {
                className: 'books-chapter-select',
                value: chapter,
                'aria-label': t('chapterLabel'),
                onChange: (e) => {
                  const v = Number(e.target.value);
                  setChapter(v); setTextPage(0);
                  const vp = textViewportRef.current; if (vp) vp.scrollTop = 0;
                  if (v >= 0) setVisibleCount(12);
                },
              },
                h('option', { value: -1 }, t('chapterPlaceholder')),
                chapters.map((ch, i) => h('option', { key: i, value: i }, (i + 1) + '. ' + (ch.heading || t('untitled')))),
              ),
            ),
            reader.mode !== 'images' && h('div', {
              className: 'books-text-viewport',
              ref: textViewportRef,
              onScroll: (e) => {
                const vp = e.currentTarget;
                setTextPage(Math.min(textPageCount - 1, Math.round(vp.scrollTop / Math.max(1, vp.clientHeight))));
              },
            },
              h('div', { className: 'books-text' },
                renderedChapters.length === 0
                  ? h('div', { className: 'books-warn' }, t('noText'))
                  : renderedChapters.map((ch, i) => h('div', { key: i },
                      h('h2', null, ch.heading || t('untitled')),
                      h('div', null, ch.text),
                    )),
              ),
            ),
            reader.mode !== 'images' && h('div', { className: 'books-pager' },
              h('button', {
                className: 'books-btn',
                disabled: textPage <= 0,
                onClick: () => {
                  const next = Math.max(0, textPage - 1);
                  setTextPage(next);
                  const vp = textViewportRef.current;
                  if (vp) vp.scrollTo({ top: next * vp.clientHeight, behavior: 'smooth' });
                },
              }, '‹ ' + t('textPagerPrev')),
              h('span', { className: 'books-page-label' },
                t('pageOf').replace('{n}', textPage + 1).replace('{total}', textPageCount)),
              h('button', {
                className: 'books-btn',
                disabled: textPage >= textPageCount - 1,
                onClick: () => {
                  const next = Math.min(textPageCount - 1, textPage + 1);
                  setTextPage(next);
                  const vp = textViewportRef.current;
                  if (vp) vp.scrollTo({ top: next * vp.clientHeight, behavior: 'smooth' });
                },
              }, t('textPagerNext') + ' ›'),
            ),
            reader.mode !== 'images' && h('div', { className: 'books-arrow-hint' }, t('arrowHint')),
            reader.mode !== 'images' && wholeBook && remaining > 0 && h('button', {
              className: 'books-loadmore',
              onClick: () => setVisibleCount((v) => v + 12),
            }, t('loadMore').replace('{n}', remaining)),
          ),
        ),
      );
    }

    return {
      inject: ['slots', 'locale', 'layout', 'remote'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'books: dictionaries');
        const t = ctx.locale.bind(NS);

        // Native directory picker: prefer the Electron preload bridge, then the Remote service.
        const pickFolder = async () => {
          const desktop = globalThis.__DSH_DIRECTORY_PICKER__;
          if (desktop && typeof desktop.pick === 'function') {
            return await desktop.pick();
          }
          if (ctx.remote && ctx.remote.directoryPicker && typeof ctx.remote.directoryPicker.pick === 'function') {
            const result = await ctx.remote.directoryPicker.pick();
            if (result && result.ok) return result.value;
            if (result && result.error) throw new Error(String(result.error));
            return null;
          }
          throw new Error('directory picker unavailable');
        };

        ctx.slots.inject('main', function* () {
          yield ctx.slots.register({
            name: 'main',
            key: PANEL_ID,
            locale: NS,
            inject: () => ({ t, pickFolder }),
          }, BooksPanel);
        });

        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: 25,
          locale: NS,
          label: () => t('panel'),
        }, BooksIcon));
      },
    };
  },
});
