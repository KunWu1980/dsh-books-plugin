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
      typography: '排版', typoPreset: '预设', typoGov: '公文标准 22×28', typoComfort: '舒适', typoCompact: '紧凑', typoLarge: '大字', typoAuto: '自适应屏幕',
      typoLines: '每页行数', typoChars: '每行字数', typoLineHeight: '行距', typoFont: '字体',
      typoIndent: '首行缩进 2 字', typoJustify: '两端对齐',
      typoFontFangsong: '仿宋', typoFontSong: '宋体', typoFontHei: '黑体', typoFontKai: '楷体', typoFontSystem: '系统默认',
      typoInfo: '字号 {size}px · {lines} 行 × {chars} 字 · 版心 {w}×{h}',
      typoRule: '默认依据《党政机关公文格式》GB/T 9704-2012：正文仿宋，每面 22 行、每行 28 字，行距 1.75 倍。字号随窗口自动缩放以保持该行数/字数。',
      typoSaved: '排版已保存', typoCustom: '自定义',
      typoLimited: '（窗口较小，已自动缩减）',
      // Reading theme
      theme: '配色', themeAuto: '跟随系统', themePaper: '纸白', themeSepia: '护眼米黄', themeNight: '夜间', themeDark: '深灰',
      themeHint: '配色只影响阅读界面，不影响书架。',
      // Per-book typography + progress
      typoScope: '排版范围', typoScopeBook: '仅此书', typoScopeGlobal: '全局（所有书）',
      typoScopeHint: '「仅此书」保存的排版只对该书生效；「全局」是默认排版。',
      progressBadge: '读到 {n}%', progressResume: '上次读到这里（第 {n} 章 / 第 {p} 页），已为你续读。',
      finished: '已读完',
      // In-book full-text search
      bookSearch: '书内搜索', bookSearchPlaceholder: '输入关键词搜索本书',
      bookSearchHint: '在当前书籍的全部章节中搜索，点击结果可跳转到对应章节。',
      searchNoResults: '没有找到匹配的内容', searchResults: '找到 {n} 处（最多显示 60 处）',
      searchEmpty: '请输入关键词', searchJump: '跳转', searchScanned: '扫描版 PDF 没有文字层，无法全文搜索。',
      // National Library online reading
      onlineLibrary: '在线图书馆', localLibrary: '本地书架',
      nlcHint: '国家图书馆 · 公版民国文献（在线逐页浏览，不下载到本地）',
      nlcSearchPlaceholder: '检索书名或关键词（如：县志）', nlcSearchBtn: '检索',
      nlcCatalog: '浏览书目', nlcTotal: '共 {n} 条', nlcEmpty: '没有找到相关书目',
      nlcLoading: '加载中...', nlcFail: '加载失败', nlcBackList: '返回书目',
      nlcPageOf: '第 {n} 页 / 共 {total} 页', nlcOcr: '本页 OCR 文字（自动识别，可能有误）',
      nlcNoOcr: '本页没有可识别的文字', nlcLoadMore: '加载更多',
      nlcDisclaimer: '资源来自国家图书馆公开数字资源，仅供在线阅读，版权归原权利方所有。',
      nlcPublish: '{n} · {p}',
      // Online reading — per-source hints/disclaimers
      onlineHintMap: '当前：{n} · 在线逐页浏览，不下载到本地',
      gdHint: '广东省立中山图书馆 · 《广东通志》开放 OCR 全文（繁简对照，在线阅读）',
      gdDisclaimer: '资源来自广东省立中山图书馆公开数字资源，OCR 文字供在线阅读，版权归原权利方所有。',
      sxHint: '陕西省图书馆 · 历史文献数据库（珍贵古籍/陕西方志/民国报刊，在线逐页看图）',
      sxDisclaimer: '资源来自陕西省图书馆公开数字资源，仅供在线阅读，版权归原权利方所有。',
      sxNoVolume: '该书暂无适配的卷册可浏览。',
      jsHint: '江苏省古籍数字资源集成平台 · 古书籍影像（南京图书馆等馆藏，在线逐页看图）',
      jsDisclaimer: '资源来自江苏省古籍数字资源集成平台公开数字资源，仅供在线阅读，版权归原权利方所有。',
      jsNoVolume: '该书暂无适配的卷册可浏览。',
      hnHint: '湖南省图书馆 · 古籍智慧化平台（在线阅读：逐页原图 + OCR 文本对照）',
      hnDisclaimer: '资源来自湖南省图书馆公开数字资源，仅供在线阅读，版权归原权利方所有。',
      // Multi-library source switcher (from dsh-library-sources weekly index)
      libSources: '图书馆源', libSourcesHint: '来源：各馆公开数字资源索引 · {d} 更新',
      libSourceActive: '可阅读', libSourceCandidate: '待接入', libSourceSoon: '该馆正在接入中：{n}',
      libSourceHealthy: '可访问', libSourceDown: '暂不可访问', libSourceOrigin: '索引来源：{n}',
      libSourceRefresh: '刷新源', libSourceNoAdapter: '此馆尚未配置阅读适配器，敬请期待。',
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
      typography: 'Typography', typoPreset: 'Preset', typoGov: 'Official 22×28', typoComfort: 'Comfort', typoCompact: 'Compact', typoLarge: 'Large', typoAuto: 'Fit screen',
      typoLines: 'Lines per page', typoChars: 'Characters per line', typoLineHeight: 'Line spacing', typoFont: 'Typeface',
      typoIndent: 'Indent first line (2em)', typoJustify: 'Justify',
      typoFontFangsong: 'FangSong', typoFontSong: 'SimSun', typoFontHei: 'SimHei', typoFontKai: 'KaiTi', typoFontSystem: 'System default',
      typoInfo: '{size}px · {lines} lines × {chars} chars · page {w}×{h}',
      typoRule: 'Defaults follow GB/T 9704-2012 (Chinese official document format): FangSong body, 22 lines per page, 28 characters per line, 1.75x line spacing. The font size scales with the window so that line/character counts stay exact.',
      typoSaved: 'Typography saved', typoCustom: 'Custom',
      typoLimited: '(auto-reduced to fit the window)',
      // Reading theme
      theme: 'Theme', themeAuto: 'Follow system', themePaper: 'Paper', themeSepia: 'Sepia (eye-friendly)', themeNight: 'Night', themeDark: 'Dark grey',
      themeHint: 'The theme affects only the reading view, not the shelf.',
      // Per-book typography + progress
      typoScope: 'Typography scope', typoScopeBook: 'This book only', typoScopeGlobal: 'Global (all books)',
      typoScopeHint: '"This book only" saves typography for this book; "Global" is the default.',
      progressBadge: '{n}% read', progressResume: 'You were at chapter {n} / page {p}; resumed for you.',
      finished: 'Finished',
      // In-book full-text search
      bookSearch: 'Search in book', bookSearchPlaceholder: 'Enter a keyword to search this book',
      bookSearchHint: 'Search across all chapters of the current book; click a result to jump to that chapter.',
      searchNoResults: 'No matches found', searchResults: '{n} match(es) (up to 60 shown)',
      searchEmpty: 'Enter a keyword', searchJump: 'Jump', searchScanned: 'Scanned PDFs have no text layer and cannot be searched.',
      // National Library online reading
      onlineLibrary: 'Online library', localLibrary: 'My bookshelf',
      nlcHint: 'National Library of China · public-domain Republican-era texts (browse page by page, never downloaded locally)',
      nlcSearchPlaceholder: 'Search titles or keywords (e.g. 县志)', nlcSearchBtn: 'Search',
      nlcCatalog: 'Browse catalog', nlcTotal: '{n} titles', nlcEmpty: 'No matching titles',
      nlcLoading: 'Loading...', nlcFail: 'Failed to load', nlcBackList: 'Back to list',
      nlcPageOf: 'Page {n} / {total}', nlcOcr: 'OCR text for this page (auto-recognized, may contain errors)',
      nlcNoOcr: 'No recognizable text on this page', nlcLoadMore: 'Load more',
      nlcDisclaimer: 'Resources come from the National Library of China public digital collections, for online reading only; copyright remains with the respective rights holders.',
      nlcPublish: '{n} · {p}',
      // Online reading — per-source hints/disclaimers
      onlineHintMap: 'Source: {n} · browse page by page, never downloaded locally',
      gdHint: 'Sun Yat-sen Library of Guangdong · open OCR full text of 广东通志 (traditional/simplified, online reading)',
      gdDisclaimer: 'Resources come from the Sun Yat-sen Library of Guangdong public digital collections; OCR text is for online reading only; copyright remains with the respective rights holders.',
      sxHint: 'Shaanxi Provincial Library · historical documents database (rare books / gazetteers / Republican press, online page-by-page image reading)',
      sxDisclaimer: 'Resources come from the Shaanxi Provincial Library public digital collections, for online reading only; copyright remains with the respective rights holders.',
      sxNoVolume: 'No readable volume available for this title yet.',
      jsHint: 'Jiangsu ancient books platform · image scans of rare books (Nanjing Library and others, online page-by-page image reading)',
      jsDisclaimer: 'Resources come from the Jiangsu ancient books platform public digital collections, for online reading only; copyright remains with the respective rights holders.',
      jsNoVolume: 'No readable volume available for this title yet.',
      hnHint: 'Hunan Provincial Library · ancient books platform (online reading: page images + OCR text side by side)',
      hnDisclaimer: 'Resources come from the Hunan Provincial Library public digital collections, for online reading only; copyright remains with the respective rights holders.',
      // Multi-library source switcher (from dsh-library-sources weekly index)
      libSources: 'Library sources', libSourcesHint: 'From the public-library index · updated {d}',
      libSourceActive: 'Readable', libSourceCandidate: 'Coming soon', libSourceSoon: 'This library is being connected: {n}',
      libSourceHealthy: 'Online', libSourceDown: 'Unavailable', libSourceOrigin: 'Index source: {n}',
      libSourceRefresh: 'Refresh sources', libSourceNoAdapter: 'No reading adapter for this library yet. Stay tuned.',
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
      .books-mode-tabs{display:flex;gap:2px;padding:2px;background:${C.layer1};border-radius:8px;}
      .books-mode-tab{padding:5px 12px;border:none;border-radius:6px;background:transparent;color:${C.muted};font-size:13px;cursor:pointer;white-space:nowrap;}
      .books-mode-tab.active{background:${C.brand};color:#fff;font-weight:600;}
      .books-src-strip{display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:8px 0 4px;}
      .books-src-chip{display:flex;flex-direction:column;gap:2px;padding:6px 10px;border:1px solid ${C.border};border-radius:8px;background:${C.layer1};cursor:pointer;min-width:96px;}
      .books-src-chip:hover{border-color:${C.brand};}
      .books-src-chip.active{border-color:${C.brand};background:${C.layer2};}
      .books-src-chip.disabled{opacity:.55;cursor:not-allowed;}
      .books-src-name{font-size:13px;font-weight:600;}
      .books-src-badge{font-size:10px;color:${C.muted};display:flex;align-items:center;gap:4px;}
      .books-src-badge.ready{color:${C.brand};}
      .books-src-dot{width:6px;height:6px;border-radius:50%;background:${C.muted};}
      .books-src-dot.ok{background:#2e9b5b;}
      .books-src-dot.bad{background:${C.error};}
      .books-nlc-search{display:flex;gap:8px;margin-bottom:10px;}
      .books-nlc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;}
      .books-nlc-card{padding:12px;border:1px solid ${C.border};border-radius:8px;background:${C.layer1};cursor:pointer;}
      .books-nlc-card:hover{border-color:${C.brand};}
      .books-nlc-card-title{font-weight:600;line-height:1.4;margin-bottom:6px;}
      .books-nlc-card-meta{font-size:12px;color:${C.muted};line-height:1.6;}
      .books-nlc-page-wrap{display:flex;flex-direction:column;gap:10px;overflow:auto;}
      .books-nlc-page-img{max-width:100%;width:100%;border:1px solid ${C.border};border-radius:6px;background:${C.layer2};}
      .books-nlc-ocr{padding:10px 12px;border:1px solid ${C.border};border-radius:8px;background:${C.layer1};font-size:13px;line-height:1.8;white-space:pre-wrap;max-height:280px;overflow:auto;}
      .books-nlc-disclaimer{font-size:11px;color:${C.faint};padding:8px 0;line-height:1.5;}
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
      .books-text-frame{height:calc(100vh - 300px);min-height:340px;display:flex;justify-content:center;align-items:flex-start;overflow:hidden;}
      .books-text-viewport{width:100%;height:100%;overflow-y:auto;overflow-x:hidden;scroll-behavior:smooth;border:1px solid ${C.border};border-radius:8px;background:${C.layer1};padding:0 24px;box-sizing:border-box;}
      .books-text{white-space:pre-wrap;word-break:break-word;margin:0 auto;}
      .books-text p{margin:0;padding:0;}
      .books-text h2{font-size:1.08em;font-weight:600;margin:1.5em 0 .6em;}
      .books-typo-bar{display:flex;gap:10px;align-items:center;margin-bottom:10px;flex-wrap:wrap;}
      .books-typo-info{font-size:12px;color:${C.faint};}
      .books-typo-panel{border:1px solid ${C.border};background:${C.layer1};border-radius:8px;padding:12px;margin-bottom:14px;}
      .books-typo-row{display:flex;gap:10px;align-items:center;margin:8px 0;flex-wrap:wrap;}
      .books-typo-label{font-size:12px;color:${C.muted};min-width:96px;}
      .books-typo-presets{display:flex;gap:6px;flex-wrap:wrap;}
      .books-typo-preset{border:1px solid ${C.border};background:${C.bg};color:${C.muted};border-radius:6px;padding:4px 10px;font-size:12px;cursor:pointer;}
      .books-typo-preset:hover{border-color:${C.brand};color:${C.brand};}
      .books-typo-preset.active{border-color:${C.brand};color:${C.brand};font-weight:600;}
      .books-typo-range{flex:1;min-width:120px;accent-color:${C.brand};}
      .books-typo-num{width:64px;border:1px solid ${C.border};background:${C.bg};color:${C.text};border-radius:6px;padding:4px 8px;font-size:12px;outline:none;}
      .books-typo-num:focus{border-color:${C.brand};}
      .books-typo-select{border:1px solid ${C.border};background:${C.bg};color:${C.text};border-radius:6px;padding:4px 8px;font-size:12px;outline:none;cursor:pointer;}
      .books-typo-note{font-size:11px;color:${C.faint};line-height:1.6;margin-top:4px;}
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
      .books-theme-dots{display:flex;gap:6px;align-items:center;}
      .books-theme-dot{width:22px;height:22px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0;}
      .books-theme-dot.active{border-color:${C.brand};}
      .books-search-box{border:1px solid ${C.border};background:${C.layer1};border-radius:8px;padding:10px 12px;margin-bottom:12px;}
      .books-search-input{width:100%;box-sizing:border-box;border:1px solid ${C.border};background:${C.bg};color:${C.text};border-radius:6px;padding:6px 10px;font-size:13px;outline:none;}
      .books-search-input:focus{border-color:${C.brand};}
      .books-search-result{display:flex;gap:8px;align-items:flex-start;padding:6px 4px;border-bottom:1px solid ${C.border};font-size:12px;}
      .books-search-heading{color:${C.brand};white-space:nowrap;}
      .books-search-snippet{flex:1;color:${C.muted};line-height:1.5;}
      .books-search-jump{border:1px solid ${C.border};background:${C.bg};color:${C.brand};border-radius:5px;padding:1px 7px;cursor:pointer;font-size:11px;white-space:nowrap;}
      .books-progress-badge{display:inline-block;font-size:10px;color:${C.brand};border:1px solid ${C.brand};border-radius:10px;padding:0 6px;margin-left:6px;}
      .books-bookbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:10px;}
    `;

    // ---- Reading typography -------------------------------------------------
    // GB/T 9704-2012 (党政机关公文格式): 正文三号仿宋, 每面 22 行, 每行 28 字,
    // 行距 28 磅 (1.75 倍). On screen the page (版心) is emulated instead of
    // fixed in millimetres: "每行字数" pins the measure, the font size is then
    // derived from the available width, and shrunk when the requested number
    // of lines would not fit the available height.
    const TYPO_PRESETS = {
      gov: { lines: 22, chars: 28, lineHeight: 1.75, font: 'fangsong', indent: true, justify: true },
      comfort: { lines: 20, chars: 36, lineHeight: 1.9, font: 'song', indent: true, justify: true },
      compact: { lines: 26, chars: 42, lineHeight: 1.6, font: 'system', indent: true, justify: true },
      large: { lines: 14, chars: 24, lineHeight: 2.0, font: 'kai', indent: true, justify: true },
      auto: { lines: 0, chars: 0, lineHeight: 1.8, font: 'system', indent: true, justify: true },
    };
    const TYPO_FONTS = {
      fangsong: '"FangSong","仿宋","FangSong_GB2312","STFangsong",serif',
      song: '"SimSun","宋体","Songti SC","STSong",serif',
      hei: '"SimHei","黑体","Heiti SC","PingFang SC","Microsoft YaHei",sans-serif',
      kai: '"KaiTi","楷体","KaiTi_GB2312","STKaiti",serif',
      system: 'inherit',
    };
    const TYPO_DEFAULT = { preset: 'gov', lines: 22, chars: 28, lineHeight: 1.75, font: 'fangsong', indent: true, justify: true, theme: 'auto' };

    // Reading colour palettes. Each is a set of inline CSS values applied to
    // the reading surface only (never the shelf). "auto" uses the host theme
    // tokens already in C; the rest override them with concrete colours.
    const THEMES = {
      auto: {},
      paper: { bg: '#ffffff', text: '#1a1a1a', muted: '#555', border: '#e0dcd3' },
      sepia: { bg: '#f5ecd7', text: '#3b2f1e', muted: '#6b5a3e', border: '#d9c9a3' },
      night: { bg: '#1c1c1c', text: '#c8c8c8', muted: '#8a8a8a', border: '#333' },
      dark: { bg: '#2b2b2b', text: '#d6d6d6', muted: '#9a9a9a', border: '#444' },
    };
    const themePalette = (name) => THEMES[name] || THEMES.auto;

    function clampNumber(value, lo, hi, fallback) {
      const n = Number(value);
      if (!Number.isFinite(n)) return fallback;
      return Math.min(hi, Math.max(lo, n));
    }

    /**
     * Turn a typography preference plus the measured text area into concrete
     * pixel metrics. Pure: the same input always yields the same output, which
     * keeps the pager stable across re-renders.
     */
    function computeLayout(typo, box) {
      const width = Math.max(160, (box && box.width) || 640);
      const height = Math.max(200, (box && box.height) || 480);
      const lineHeight = clampNumber(typo && typo.lineHeight, 1.2, 2.6, 1.75);
      let lines = Math.round(clampNumber(typo && typo.lines, 6, 40, 22));
      let chars = Math.round(clampNumber(typo && typo.chars, 16, 60, 28));
      if (typo && typo.preset === 'auto') {
        // Keep a comfortable body size (~17px) and fit as many lines and
        // characters as the window allows.
        const target = 17;
        chars = Math.round(clampNumber(Math.floor(width / target), 18, 60, 32));
        lines = Math.round(clampNumber(Math.floor(height / (target * lineHeight)), 8, 40, 20));
      }
      // Fit both asks at once: the measure (chars per line) and the page
      // height (lines per page). A larger font means fewer chars and fewer
      // lines, so the body size is the smaller of the two constraints,
      // clamped to a legible range. If the window is too small for both, the
      // page is trimmed instead of shrinking the type below MIN_FONT.
      const MIN_FONT = 13;
      const MAX_FONT = 28;
      const fontSize = clampNumber(
        Math.min(width / chars, height / (lines * lineHeight)),
        MIN_FONT, MAX_FONT, 17,
      );
      if (chars * fontSize > width) {
        chars = Math.max(16, Math.floor(width / fontSize));
      }
      const linePx = fontSize * lineHeight;
      const maxLines = Math.max(6, Math.floor(height / linePx));
      if (lines > maxLines) lines = maxLines;
      return {
        lines,
        chars,
        lineHeight,
        fontSize: Math.round(fontSize * 100) / 100,
        linePx: Math.round(linePx * 100) / 100,
        textWidth: Math.round(chars * fontSize),
        viewportHeight: Math.round(lines * linePx),
      };
    }

    /**
     * Decides whether a book's text is "one paragraph per line" (typical for
     * TXT/EPUB/AZW3 exports) or hard-wrapped visual lines (typical for PDFs).
     * Only the former gets per-paragraph first-line indentation, because
     * indenting every wrapped PDF line would look broken.
     */
    function looksParagraphic(chapters) {
      // Judge on body text, not front matter: skip the first 30% of chapters
      // (cover, copyright, table of contents) where lines rarely end in a
      // sentence mark, then collect up to 60 non-empty lines.
      const list = chapters || [];
      const start = Math.floor(list.length * 0.3);
      const lines = [];
      for (let i = start; i < list.length && lines.length < 60; i += 1) {
        const text = String((list[i] && list[i].text) || '');
        if (!text.trim()) continue;
        const chunk = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
        for (const line of chunk) {
          lines.push(line);
          if (lines.length >= 60) break;
        }
      }
      if (lines.length < 8) return true;
      const terminated = lines.filter((l) => /[。！？…”』」】)]$/.test(l)).length;
      return terminated / lines.length >= 0.5;
    }

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
      // Typography
      const [typo, setTypo] = React.useState(TYPO_DEFAULT);
      const [layout, setLayout] = React.useState(null);   // computed px metrics
      const [showTypo, setShowTypo] = React.useState(false);
      const textFrameRef = React.useRef(null);
      const typoTimer = React.useRef(null);
      // Per-book typography scope, progress and in-book search
      const [typoScope, setTypoScope] = React.useState('global'); // global|book
      const [showSearch, setShowSearch] = React.useState(false);
      const [searchQ, setSearchQ] = React.useState('');
      const [searchResult, setSearchResult] = React.useState(null);
      const progressTimer = React.useRef(null);
      // National Library online reading (separate from the local shelf; nothing is saved locally)
      const [mode, setMode] = React.useState('local'); // local|online
      const [nlcQuery, setNlcQuery] = React.useState('');
      const [nlcList, setNlcList] = React.useState([]);
      const [nlcTotal, setNlcTotal] = React.useState(0);
      const [nlcLoading, setNlcLoading] = React.useState(false);
      const [nlcStatus, setNlcStatus] = React.useState('idle'); // idle|loading|error
      const [nlcBook, setNlcBook] = React.useState(null);  // {sourceId,volume,title,pageCount}
      const [nlcPageNo, setNlcPageNo] = React.useState(1);  // 1-based
      const [nlcPageData, setNlcPageData] = React.useState(null); // {filePath,text}
      const [nlcPageLoading, setNlcPageLoading] = React.useState(false);
      // Multi-library source switcher (weekly index from dsh-library-sources)
      const [libSources, setLibSources] = React.useState([]);
      const [libSourceId, setLibSourceId] = React.useState('nlc');
      const [libSourceMeta, setLibSourceMeta] = React.useState({ updatedAt: null, origin: null });

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
          if (data.typography) setTypo({ ...TYPO_DEFAULT, ...data.typography });
          setStatus('idle');
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      }, []);

      React.useEffect(() => { void loadList(); }, [loadList]);

      // ---- Library source index (multi-library switcher) ----
      const loadSources = React.useCallback(async (force) => {
        try {
          const data = await api('sources' + (force ? '?force=1' : ''));
          const list = (data.sources || []).slice().sort((a, b) => (a.priority ?? 9) - (b.priority ?? 9));
          setLibSources(list);
          setLibSourceMeta({ updatedAt: data.updatedAt || null, origin: data.origin || null });
        } catch {
          /* keep whatever list we already have; the active source still works */
        }
      }, []);

      React.useEffect(() => { void loadSources(false); }, [loadSources]);

      // ---- Online reading functions (source-aware: nlc = images, gd = text, sx = images) ----
      const isGd = () => libSourceId === 'guangdong' || String(libSourceId).startsWith('gd');
      const isSx = () => libSourceId === 'shaanxi' || String(libSourceId).startsWith('sx');
      const isJs = () => libSourceId === 'jiangsu' || String(libSourceId).startsWith('js');
      const isHn = () => libSourceId === 'hunan' || String(libSourceId).startsWith('hn');

      const nlcCatalog = React.useCallback(async (sourceOverride) => {
        setNlcLoading(true); setNlcStatus('loading'); setNlcBook(null);
        try {
          const sid = sourceOverride || libSourceId;
          const data = isGd()
            ? await api('gd/catalog?page=1&rows=100')
            : isSx()
              ? await api('sx/catalog?page=1&rows=100')
              : isJs()
                ? await api('js/catalog?page=1&rows=30')
                : isHn()
                  ? await api('hn/catalog?page=1&rows=30')
                  : await api('nlc/catalog?page=1&rows=30');
          setNlcList(data.books || []); setNlcTotal(data.total || 0); setNlcStatus('idle');
        } catch (e) { setNlcStatus('error'); setErrorText(String(e && e.message || e)); }
        finally { setNlcLoading(false); }
      }, [libSourceId]);

      const nlcDoSearch = React.useCallback(async () => {
        const q = nlcQuery.trim();
        if (!q) return;
        setNlcLoading(true); setNlcStatus('loading'); setNlcBook(null);
        try {
          const data = isGd()
            ? await api('gd/search?q=' + encodeURIComponent(q) + '&page=1&rows=100')
            : isSx()
              ? await api('sx/search?q=' + encodeURIComponent(q) + '&page=1&rows=100')
              : isJs()
                ? await api('js/search?q=' + encodeURIComponent(q) + '&page=1&rows=40')
                : isHn()
                  ? await api('hn/search?q=' + encodeURIComponent(q) + '&page=1&rows=40')
                  : await api('nlc/search?q=' + encodeURIComponent(q) + '&page=1&rows=40');
          setNlcList(data.books || []); setNlcTotal(data.total || 0); setNlcStatus('idle');
        } catch (e) { setNlcStatus('error'); setErrorText(String(e && e.message || e)); }
        finally { setNlcLoading(false); }
      }, [nlcQuery, libSourceId]);

      const nlcOpenBook = React.useCallback(async (book) => {
        setNlcLoading(true); setNlcStatus('loading');
        try {
          const data = isGd()
            ? await api('gd/meta?treeId=' + encodeURIComponent(book.treeId || ''))
            : isSx()
              ? await api('sx/meta?wholeId=' + encodeURIComponent(book.wholeId || ''))
              : isJs()
                ? await api('js/meta?id=' + encodeURIComponent(book.id || ''))
                : isHn()
                  ? await api('hn/meta?id=' + encodeURIComponent(book.id || ''))
                  : await api('nlc/meta?sourceId=' + encodeURIComponent(book.sourceId) + '&volume=' + encodeURIComponent(book.volume || '001'));
          setNlcBook({
            sourceId: book.sourceId, treeId: book.treeId || '',
            wholeId: book.wholeId || '',
            id: book.id || '',
            volume: book.volume || '001',
            title: data.title || book.title || book.section || '',
            author: data.author || '',
            pageCount: data.pageCount || 1,
            identifier: data.identifier || '',
          });
          setNlcPageNo(1);
          setNlcStatus('idle');
        } catch (e) { setNlcStatus('error'); setErrorText(String(e && e.message || e)); }
        finally { setNlcLoading(false); }
      }, [libSourceId]);

      const nlcLoadPage = React.useCallback(async (pn) => {
        if (!nlcBook) return;
        const target = Math.max(1, Math.min(nlcBook.pageCount, pn));
        setNlcPageLoading(true); setNlcPageNo(target);
        try {
          const data = isGd()
            ? await api('gd/page?treeId=' + encodeURIComponent(nlcBook.treeId) + '&page=' + target)
            : isSx()
              ? await api('sx/page?wholeId=' + encodeURIComponent(nlcBook.wholeId) + '&page=' + target)
              : isJs()
                ? await api('js/page?id=' + encodeURIComponent(nlcBook.id) + '&page=' + target)
                : isHn()
                  ? await api('hn/page?id=' + encodeURIComponent(nlcBook.id) + '&page=' + target)
                  : await api('nlc/page?sourceId=' + encodeURIComponent(nlcBook.sourceId)
                    + '&volume=' + encodeURIComponent(nlcBook.volume) + '&page=' + target);
          setNlcPageData({ filePath: data.filePath || '', text: data.text || '' });
        } catch (e) { setErrorText(String(e && e.message || e)); }
        finally { setNlcPageLoading(false); }
      }, [nlcBook, libSourceId]);

      // Load page 1 whenever a book is opened.
      React.useEffect(() => {
        if (nlcBook) void nlcLoadPage(1);
      }, [nlcBook, nlcLoadPage]);

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

      // Measure the available text area and turn the typography preference
      // into concrete pixel metrics (font size, line height, page box).
      // Height comes from the frame (fixed by CSS, so it cannot feed back),
      // width from the viewport's clientWidth, which already excludes the
      // vertical scrollbar.
      React.useEffect(() => {
        if (!reader || reader.mode === 'images') { setLayout(null); return; }
        const frame = textFrameRef.current;
        if (!frame) return;
        const update = () => {
          const vp = textViewportRef.current;
          const width = (vp ? vp.clientWidth : frame.clientWidth) - 48;
          const next = computeLayout(typo, { width, height: frame.clientHeight });
          setLayout((prev) => (prev && prev.lines === next.lines && prev.chars === next.chars
            && prev.fontSize === next.fontSize && prev.viewportHeight === next.viewportHeight
            && prev.textWidth === next.textWidth && prev.lineHeight === next.lineHeight ? prev : next));
        };
        update();
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
        if (ro) {
          ro.observe(frame);
          if (textViewportRef.current) ro.observe(textViewportRef.current);
        }
        return () => { if (ro) ro.disconnect(); };
      }, [reader, typo, status]);

      // Recompute how many pages the current text occupies. Paging is one
      // viewport height at a time, so with a page box of exactly N lines each
      // page always holds N lines.
      React.useEffect(() => {
        if (!reader || reader.mode === 'images') return;
        const vp = textViewportRef.current;
        if (!vp) return;
        const update = () => {
          const pages = Math.max(1, Math.ceil(vp.scrollHeight / Math.max(1, vp.clientHeight)));
          setTextPageCount(pages);
          setTextPage((p) => Math.min(p, pages - 1));
        };
        update();
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : null;
        if (ro) ro.observe(vp);
        return () => { if (ro) ro.disconnect(); };
      }, [reader, chapter, visibleCount, status, layout]);

      // Whenever the reading position changes, persist it. Debounced inside
      // saveProgress so rapid arrow-key flips produce a single write.
      React.useEffect(() => {
        if (!reader) return;
        if (reader.mode === 'images') saveProgress({ pageNum });
        else saveProgress({ chapter, textPage });
      }, [reader, pageNum, textPage, chapter]);

      // Persist typography edits (debounced: dragging a slider must not write
      // the config file on every pixel). When the scope is "book", the change
      // is saved into that book's own override instead of the global setting.
      const persistTypo = React.useCallback((next, scope) => {
        if (typoTimer.current) clearTimeout(typoTimer.current);
        typoTimer.current = setTimeout(() => {
          const bookId = scope === 'book' && reader ? reader.id : null;
          api('config', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(bookId
              ? { bookTypography: { [bookId]: next } }
              : { typography: next }),
          }).then(() => { /* saved; local state already updated */ }).catch(() => { /* best effort */ });
        }, 400);
      }, [reader]);

      React.useEffect(() => () => {
        if (typoTimer.current) clearTimeout(typoTimer.current);
        if (progressTimer.current) clearTimeout(progressTimer.current);
      }, []);

      const updateTypo = (patch) => {
        const next = { ...typo, ...patch };
        if (!('preset' in patch)) next.preset = 'custom';
        setTypo(next);
        persistTypo(next, typoScope);
      };

      const applyPreset = (id) => {
        const base = TYPO_PRESETS[id] || TYPO_PRESETS.gov;
        const next = { ...typo, ...base, preset: id };
        setTypo(next);
        persistTypo(next);
        setShowTypo(true);
      };

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
          const book = data.book;
          setReader(book);
          // Apply the book's own typography when one is saved, and remember
          // that we are now editing this book's scope.
          if (data.typography) {
            setTypo({ ...TYPO_DEFAULT, ...data.typography });
            const meta = (books || []).find((b) => b.id === id);
            setTypoScope(meta && meta.hasTypography ? 'book' : 'global');
          }
          // Restore the saved reading position.
          const prog = data.progress;
          const isImages = book.mode === 'images';
          if (isImages) {
            setPageNum(prog ? Math.max(0, Math.round(prog.page || 0)) : 0);
          } else {
            const ch = prog && prog.chapter >= 0 ? Math.round(prog.chapter) : -1;
            setChapter(ch);
            setVisibleCount(ch >= 0 ? Math.max(12, ch + 1) : 12);
            // textPage is restored after the paging effect recomputes; keep
            // the desired index in a ref-like state until then.
            setTextPage(prog ? Math.max(0, Math.round(prog.page || 0)) : 0);
          }
          setPageZoom(1.4);
          setTextPageCount(1);
          // Search state is per book.
          setShowSearch(false);
          setSearchQ('');
          setSearchResult(null);
          setStatus('idle');
        } catch (e) {
          setErrorText(String(e && e.message || e));
          setStatus('error');
        }
      };

      // Persist the current reading position (debounced). For text books the
      // chapter + within-page index; for image books the scanned page index.
      const saveProgress = React.useCallback((patch) => {
        if (!reader) return;
        if (progressTimer.current) clearTimeout(progressTimer.current);
        progressTimer.current = setTimeout(() => {
          const payload = {
            id: reader.id,
            chapter: reader.mode === 'images' ? -1 : (typeof patch.chapter === 'number' ? patch.chapter : chapter),
            page: reader.mode === 'images'
              ? (typeof patch.pageNum === 'number' ? patch.pageNum : pageNum)
              : (typeof patch.textPage === 'number' ? patch.textPage : textPage),
            ratio: typeof patch.ratio === 'number' ? patch.ratio : 0,
          };
          api('progress', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => { /* best effort */ });
        }, 600);
      }, [reader, chapter, pageNum, textPage]);

      const doBookSearch = async () => {
        const q = searchQ.trim();
        if (!q) { setMsg(t('searchEmpty')); return; }
        if (!reader || reader.mode === 'images') { setMsg(t('searchScanned')); return; }
        try {
          const data = await api('search?id=' + encodeURIComponent(reader.id) + '&q=' + encodeURIComponent(q));
          setSearchResult(data);
        } catch (e) {
          setMsg(String(e && e.message || e));
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
      // Indent per paragraph only when the text really is paragraph-per-line.
      const paragraphic = React.useMemo(() => looksParagraphic(chapters), [reader]);

      return h('div', { className: 'books-root' },
        h('style', null, STYLES),
        h('div', { className: 'books-head' },
          h('div', { className: 'books-title' }, reader ? (reader.title || t('untitled')) : t('library')),
          reader
            ? h('button', { className: 'books-btn', onClick: () => { setReader(null); setChapter(-1); void loadList(); } }, '‹ ' + t('back'))
            : h(React.Fragment, null,
                h('div', { className: 'books-mode-tabs' },
                  h('button', {
                    className: 'books-mode-tab' + (mode === 'local' ? ' active' : ''),
                    onClick: () => setMode('local'),
                  }, '\uD83D\uDCDA ' + t('localLibrary')),
                  h('button', {
                    className: 'books-mode-tab' + (mode === 'online' ? ' active' : ''),
                    onClick: () => { setMode('online'); void loadSources(false); if (nlcList.length === 0 && !nlcBook) void nlcCatalog(); },
                  }, '\uD83C\uDFDB\uFE0F ' + t('onlineLibrary')),
                ),
                mode === 'local' && h('button', { className: 'books-btn', onClick: () => setShowImport((v) => !v) }, t('import')),
                mode === 'local' && h('button', { className: 'books-btn', onClick: openSettings }, '⚙ ' + t('settings')),
                mode === 'local' && h('button', { className: 'books-btn', onClick: () => void loadList() }, t('refresh')),
              ),
        ),
        h('div', { className: 'books-body' },
          // ---- Online library (National Library of China) ----
          mode === 'online' && h('div', { className: 'books-nlc' , style: { padding: 16, overflow: 'auto', flex: 1 } },
            // Library source switcher — every source from the weekly index.
            h('div', { className: 'books-src-strip' },
              h('span', { style: { fontSize: 12, color: C.muted, marginRight: 4 } }, t('libSources') + ':'),
              libSources.map((s) => {
                // Locally installed adapters can make a stale index entry readable.
                const localAdapters = { nlc: true, guangdong: true, shaanxi: true, jiangsu: true, hunan: true };
                const ready = (s.adapter && s.adapter !== 'none') || Boolean(localAdapters[s.id]);
                const health = s.health && typeof s.health.ok === 'boolean' ? s.health.ok : null;
                const active = libSourceId === s.id;
                return h('div', {
                  key: s.id,
                  className: 'books-src-chip' + (active ? ' active' : '') + (ready ? '' : ' disabled'),
                  title: ready ? (s.name + (s.adapterNote ? '\n' + s.adapterNote : '')) : t('libSourceNoAdapter'),
                  onClick: () => {
                    if (!ready) return;
                    setLibSourceId(s.id);
                    setNlcBook(null); setNlcPageData(null); setNlcList([]);
                    void nlcCatalog(s.id);
                  },
                },
                  h('span', { className: 'books-src-name' }, s.name || s.id),
                  h('span', { className: 'books-src-badge' + (ready ? ' ready' : '') },
                    h('i', { className: 'books-src-dot' + (health === true ? ' ok' : health === false ? ' bad' : '') }),
                    ready ? t('libSourceActive') : t('libSourceCandidate'),
                  ),
                );
              }),
              h('button', { className: 'books-btn', style: { marginLeft: 4 }, onClick: () => void loadSources(true) }, t('libSourceRefresh')),
            ),
            libSourceMeta.updatedAt && h('div', { className: 'books-nlc-disclaimer' },
              t('libSourcesHint').replace('{d}', String(libSourceMeta.updatedAt).slice(0, 10))
              + (libSourceMeta.origin ? ' · ' + t('libSourceOrigin').replace('{n}', libSourceMeta.origin) : ''),
            ),
            h('div', { className: 'books-hint' },
              (libSourceId === 'guangdong' || String(libSourceId).startsWith('gd')) ? t('gdHint')
                : (libSourceId === 'shaanxi' || String(libSourceId).startsWith('sx')) ? t('sxHint')
                  : (libSourceId === 'jiangsu' || String(libSourceId).startsWith('js')) ? t('jsHint')
                    : (libSourceId === 'hunan' || String(libSourceId).startsWith('hn')) ? t('hnHint')
                      : t('nlcHint')),
            h('div', { className: 'books-nlc-disclaimer' },
              (libSourceId === 'guangdong' || String(libSourceId).startsWith('gd')) ? t('gdDisclaimer')
                : (libSourceId === 'shaanxi' || String(libSourceId).startsWith('sx')) ? t('sxDisclaimer')
                  : (libSourceId === 'jiangsu' || String(libSourceId).startsWith('js')) ? t('jsDisclaimer')
                    : (libSourceId === 'hunan' || String(libSourceId).startsWith('hn')) ? t('hnDisclaimer')
                      : t('nlcDisclaimer')),
            nlcBook
              ? h('div', { className: 'books-nlc-page-wrap' },
                  h('div', { style: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', margin: '6px 0' } },
                    h('button', { className: 'books-btn', onClick: () => { setNlcBook(null); setNlcPageData(null); } }, '‹ ' + t('nlcBackList')),
                    h('span', { style: { fontWeight: 600 } }, nlcBook.title),
                  ),
                  h('div', { className: 'books-pager' },
                    h('button', { className: 'books-btn', disabled: nlcPageNo <= 1 || nlcPageLoading, onClick: () => void nlcLoadPage(nlcPageNo - 1) }, '‹ ' + t('prevPage')),
                    h('span', { className: 'books-page-label' }, t('nlcPageOf').replace('{n}', nlcPageNo).replace('{total}', nlcBook.pageCount)),
                    h('button', { className: 'books-btn', disabled: nlcPageNo >= nlcBook.pageCount || nlcPageLoading, onClick: () => void nlcLoadPage(nlcPageNo + 1) }, t('nextPage') + ' ›'),
                  ),
                  nlcPageLoading && h('div', { className: 'books-loading' }, t('nlcLoading')),
                  nlcPageData && (nlcPageData.filePath || isHn()) && h('img', {
                    className: 'books-nlc-page-img',
                    src: isHn() ? '/api/books/hn/image?id=' + encodeURIComponent(nlcBook.id) + '&page=' + nlcPageNo
                      : (isJs() ? '/api/books/js/image?file='
                      : isSx() ? '/api/books/sx/image?file='
                        : '/api/books/nlc/image?file=') + encodeURIComponent(nlcPageData.filePath),
                    alt: t('nlcPageOf').replace('{n}', nlcPageNo).replace('{total}', nlcBook.pageCount),
                  }),
                  nlcPageData && h('div', null,
                    h('div', { className: 'books-cats-title' }, t('nlcOcr')),
                    nlcPageData.text
                      ? h('div', { className: 'books-nlc-ocr' }, nlcPageData.text)
                      : h('div', { className: 'books-hint' }, t('nlcNoOcr')),
                  ),
                )
              : h(React.Fragment, null,
                  h('div', { className: 'books-nlc-search' },
                    h('input', {
                      className: 'books-input', placeholder: t('nlcSearchPlaceholder'), value: nlcQuery,
                      onChange: (e) => setNlcQuery(e.target.value),
                      onKeyDown: (e) => { if (e.key === 'Enter') void nlcDoSearch(); },
                    }),
                    h('button', { className: 'books-btn', onClick: () => void nlcDoSearch(), disabled: nlcLoading }, t('nlcSearchBtn')),
                    h('button', { className: 'books-btn', onClick: () => void nlcCatalog(), disabled: nlcLoading }, t('nlcCatalog')),
                  ),
                  (nlcLoading || nlcStatus === 'loading') && h('div', { className: 'books-loading' }, t('nlcLoading')),
                  nlcStatus === 'error' && h('div', { className: 'books-error' }, t('nlcFail') + ': ' + errorText),
                  nlcStatus === 'idle' && h('div', { className: 'books-hint' }, t('nlcTotal').replace('{n}', nlcTotal)),
                  nlcList.length === 0 && nlcStatus === 'idle'
                    ? h('div', { className: 'books-empty' }, t('nlcEmpty'))
                    : h('div', { className: 'books-nlc-grid' }, nlcList.map((b) =>
                        h('div', { key: b.sourceId, className: 'books-nlc-card', onClick: () => void nlcOpenBook(b) },
                          h('div', { className: 'books-nlc-card-title' }, b.title || b.section || t('untitled')),
                          h('div', { className: 'books-nlc-card-meta' },
                            t('nlcPublish').replace('{n}', b.publishDate || '').replace('{p}', b.publisher || ''),
                            b.classification ? h('div', null, b.classification) : null,
                            b.abstract ? h('div', null, b.abstract.slice(0, 80)) : null,
                          ),
                        ),
                      )),
                ),
          ),
          // ---- Local shelf ----
          mode === 'local' && status === 'loading' && h('div', { className: 'books-loading' }, t('loading')),
          mode === 'local' && status !== 'loading' && errorText && h('div', { className: 'books-error' }, t('error') + ': ' + errorText),
          mode === 'local' && status === 'idle' && !reader && h('div', { className: 'books-main' },
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
                      b.progress && b.progress.ratio > 0 && h('span', { className: 'books-progress-badge' },
                        b.progress.ratio >= 1 ? t('finished') : t('progressBadge').replace('{n}', Math.round(b.progress.ratio * 100))),
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
          mode === 'local' && status === 'idle' && reader && h('div', { className: 'books-reader' },
            reader.mode === 'images' && h('div', { className: 'books-warn' },
              t('scannedHint').replace('{n}', reader.pageCount || 0)),
            reader.mode !== 'images' && reader.warning && h('div', { className: 'books-warn' }, reader.warning || t('noText')),
            h('div', { className: 'books-reader-title' }, reader.title || t('untitled')),
            reader.author && h('div', { className: 'books-reader-author' }, reader.author),
            h('div', { className: 'books-bookbar' },
              reader.mode !== 'images' && h('button', {
                className: 'books-chapter-all' + (showSearch ? ' active' : ''),
                onClick: () => setShowSearch((v) => !v),
              }, '🔍 ' + t('bookSearch')),
              h('div', { className: 'books-theme-dots' },
                [['auto', t('themeAuto')], ['paper', t('themePaper')], ['sepia', t('themeSepia')], ['night', t('themeNight')], ['dark', t('themeDark')]]
                  .map((pair) => {
                    const pal = THEMES[pair[0]];
                    return h('button', {
                      key: pair[0],
                      title: pair[1],
                      className: 'books-theme-dot' + ((typo.theme || 'auto') === pair[0] ? ' active' : ''),
                      style: { background: pair[0] === 'auto' ? 'linear-gradient(135deg,#fff 50%,#333 50%)' : (pal.bg || '#fff') },
                      onClick: () => updateTypo({ theme: pair[0], preset: typo.preset || 'gov' }),
                    });
                  }),
              ),
            ),
            reader.mode !== 'images' && showSearch && h('div', { className: 'books-search-box' },
              h('div', { className: 'books-hint' }, t('bookSearchHint')),
              h('div', { className: 'books-row' },
                h('input', {
                  className: 'books-search-input',
                  placeholder: t('bookSearchPlaceholder'),
                  value: searchQ,
                  onChange: (e) => setSearchQ(e.target.value),
                  onKeyDown: (e) => { if (e.key === 'Enter') { e.preventDefault(); void doBookSearch(); } },
                }),
                h('button', { className: 'books-btn', onClick: () => void doBookSearch() }, t('bookSearch')),
              ),
              searchResult && h('div', { style: { marginTop: 8 } },
                searchResult.matches && searchResult.matches.length === 0 && h('div', { className: 'books-hint' }, t('searchNoResults')),
                searchResult.matches && searchResult.matches.length > 0 && h('div', { className: 'books-hint' },
                  t('searchResults').replace('{n}', searchResult.total)),
                (searchResult.matches || []).map((m, i) => h('div', { key: i, className: 'books-search-result' },
                  h('span', { className: 'books-search-heading' }, m.heading || ('#' + (m.chapter + 1))),
                  h('span', { className: 'books-search-snippet' }, m.snippet),
                  h('button', {
                    className: 'books-search-jump',
                    onClick: () => {
                      setChapter(m.chapter); setVisibleCount(Math.max(12, m.chapter + 1));
                      setTextPage(0); setShowSearch(false);
                      const vp = textViewportRef.current; if (vp) vp.scrollTop = 0;
                    },
                  }, t('searchJump')),
                )),
              ),
            ),
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
            reader.mode !== 'images' && h('div', { className: 'books-typo-bar' },
              h('button', {
                className: 'books-chapter-all' + (showTypo ? ' active' : ''),
                onClick: () => setShowTypo((v) => !v),
              }, 'Aa ' + t('typography')),
              layout && h('span', { className: 'books-typo-info' },
                t('typoInfo')
                  .replace('{size}', layout.fontSize)
                  .replace('{lines}', layout.lines)
                  .replace('{chars}', layout.chars)
                  .replace('{w}', layout.textWidth)
                  .replace('{h}', layout.viewportHeight)
                + (layout.lines !== typo.lines || layout.chars !== typo.chars ? ' ' + t('typoLimited') : '')),
            ),
            reader.mode !== 'images' && showTypo && h('div', { className: 'books-typo-panel' },
              h('div', { className: 'books-typo-row' },
                h('span', { className: 'books-typo-label' }, t('typoScope')),
                h('div', { className: 'books-typo-presets' },
                  [['global', t('typoScopeGlobal')], ['book', t('typoScopeBook')]]
                    .map((pair) => h('button', {
                      key: pair[0],
                      className: 'books-typo-preset' + (typoScope === pair[0] ? ' active' : ''),
                      onClick: () => {
                        setTypoScope(pair[0]);
                        // Switch the visible typography to the corresponding
                        // stored value (book override vs global default).
                        void api('read?id=' + encodeURIComponent(reader.id || '')).then((d) => {
                          if (d && d.typography) setTypo({ ...TYPO_DEFAULT, ...d.typography });
                        }).catch(() => {});
                      },
                    }, pair[1])),
                ),
              ),
              h('div', { className: 'books-typo-note' }, t('typoScopeHint')),
              h('div', { className: 'books-typo-row' },
                h('span', { className: 'books-typo-label' }, t('typoPreset')),
                h('div', { className: 'books-typo-presets' },
                  [['gov', t('typoGov')], ['comfort', t('typoComfort')], ['compact', t('typoCompact')], ['large', t('typoLarge')], ['auto', t('typoAuto')]]
                    .map((pair) => h('button', {
                      key: pair[0],
                      className: 'books-typo-preset' + (typo.preset === pair[0] ? ' active' : ''),
                      onClick: () => applyPreset(pair[0]),
                    }, pair[1])),
                ),
              ),
              h('div', { className: 'books-typo-row' },
                h('span', { className: 'books-typo-label' }, t('typoLines')),
                h('input', {
                  type: 'range', min: 6, max: 40, step: 1, className: 'books-typo-range',
                  value: layout ? layout.lines : typo.lines,
                  onChange: (e) => updateTypo({ lines: Number(e.target.value) }),
                }),
                h('input', {
                  type: 'number', min: 6, max: 40, className: 'books-typo-num',
                  value: layout ? layout.lines : typo.lines,
                  onChange: (e) => updateTypo({ lines: clampNumber(e.target.value, 6, 40, typo.lines) }),
                }),
              ),
              h('div', { className: 'books-typo-row' },
                h('span', { className: 'books-typo-label' }, t('typoChars')),
                h('input', {
                  type: 'range', min: 16, max: 60, step: 1, className: 'books-typo-range',
                  value: layout ? layout.chars : typo.chars,
                  onChange: (e) => updateTypo({ chars: Number(e.target.value) }),
                }),
                h('input', {
                  type: 'number', min: 16, max: 60, className: 'books-typo-num',
                  value: layout ? layout.chars : typo.chars,
                  onChange: (e) => updateTypo({ chars: clampNumber(e.target.value, 16, 60, typo.chars) }),
                }),
              ),
              h('div', { className: 'books-typo-row' },
                h('span', { className: 'books-typo-label' }, t('typoLineHeight')),
                h('select', {
                  className: 'books-typo-select',
                  value: String(typo.lineHeight),
                  onChange: (e) => updateTypo({ lineHeight: Number(e.target.value) }),
                }, [1.5, 1.6, 1.75, 1.9, 2.0, 2.2].map((v) => h('option', { key: v, value: String(v) }, v + '×'))),
                h('span', { className: 'books-typo-label' }, t('typoFont')),
                h('select', {
                  className: 'books-typo-select',
                  value: typo.font,
                  onChange: (e) => updateTypo({ font: e.target.value }),
                },
                  [['fangsong', t('typoFontFangsong')], ['song', t('typoFontSong')], ['hei', t('typoFontHei')], ['kai', t('typoFontKai')], ['system', t('typoFontSystem')]]
                    .map((pair) => h('option', { key: pair[0], value: pair[0] }, pair[1])),
                ),
                h('label', { className: 'books-check' },
                  h('input', { type: 'checkbox', checked: Boolean(typo.indent), onChange: (e) => updateTypo({ indent: e.target.checked }) }),
                  t('typoIndent'),
                ),
                h('label', { className: 'books-check' },
                  h('input', { type: 'checkbox', checked: Boolean(typo.justify), onChange: (e) => updateTypo({ justify: e.target.checked }) }),
                  t('typoJustify'),
                ),
              ),
              h('div', { className: 'books-typo-note' }, t('typoRule')),
            ),
            reader.mode !== 'images' && h('div', {
              className: 'books-text-frame',
              ref: textFrameRef,
              style: (() => {
                const pal = themePalette(typo.theme || 'auto');
                return {
                  background: pal.bg || C.bg,
                  color: pal.text || C.text,
                  border: '1px solid ' + (pal.border || C.border),
                  borderRadius: '10px',
                };
              })(),
            },
              h('div', {
                className: 'books-text-viewport',
                ref: textViewportRef,
                style: layout ? { height: layout.viewportHeight + 'px', flex: 'none' } : null,
                onScroll: (e) => {
                  const vp = e.currentTarget;
                  setTextPage(Math.min(textPageCount - 1, Math.round(vp.scrollTop / Math.max(1, vp.clientHeight))));
                },
              },
                h('div', {
                  className: 'books-text',
                  style: layout ? {
                    width: layout.textWidth + 'px',
                    fontSize: layout.fontSize + 'px',
                    lineHeight: String(layout.lineHeight),
                    fontFamily: TYPO_FONTS[typo.font] || TYPO_FONTS.system,
                    textAlign: typo.justify ? 'justify' : 'left',
                  } : null,
                },
                  renderedChapters.length === 0
                    ? h('div', { className: 'books-warn' }, t('noText'))
                    : renderedChapters.map((ch, i) => h('div', { key: i },
                        h('h2', null, ch.heading || t('untitled')),
                        (paragraphic
                          ? String(ch.text || '').split('\n').filter((p) => p.trim().length > 0)
                          : [String(ch.text || '')]
                        ).map((para, j) => h('p', {
                          key: j,
                          style: typo.indent && paragraphic ? { textIndent: '2em' } : null,
                        }, para)),
                      )),
                ),
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
