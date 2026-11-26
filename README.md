# @local/books — 书架插件 for DeepSeek Harness

一个在 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) 内**阅读和管理本地书库**的插件。侧边栏提供独立的「书架」面板，支持 TXT / EPUB / PDF / AZW3 / DOC / DOCX（以及 MOBI / AZW）。

## 功能

- 📚 **书架面板**：侧边栏新增书本图标，独立中央面板显示书库。
- 📖 **多格式阅读**：TXT / EPUB / PDF / AZW3 / DOC / DOCX / MOBI / AZW。
  - TXT 自动识别 BOM / UTF-8 / GB18030 编码。
  - EPUB / AZW3 按 spine / 章节顺序抽取正文。
  - DOCX 用 python-docx 抽取（标题/作者/章节/表格）；DOC 优先用本机 Microsoft Word COM 抽取，无 Word 时用 olefile 回退。
  - 有文字层的 PDF 逐页抽取文本。
  - **扫描版 PDF**（无文字层）自动切换为逐页看图模式：翻页、缩放、←/→ 键翻页。
- 📄 **整页翻页**：文字书按窗口高度切成一屏一页，←/→ 键或按钮整屏翻动；章节下拉跳转、"全文"渐进加载（不卡顿）。
- 🏷️ **分类**：自定义分类（手动勾选） + 📁 文件夹分类（按书库目录结构自动生成）。
- ⚙️ **自定义书库位置**：通过原生目录选择窗口指定路径，可一键把已有书籍搬到新位置（跨磁盘自动复制后删除），也可恢复默认位置。
- 🤖 **Agent 工具**：模型可通过 `books` 工具 `list` / `read` / `add` / `setpath` 访问同一书库。

## 安装

本插件是一个 DeepSeek Harness **bundle 插件**。在 Harness 中安装：

1. 克隆 / 下载本仓库到本地。
2. 在 Harness 里用插件管理器安装该目录（bundle 入口由 `package.json` 的 `dsh.bundle.patch` 指向 `cordis.patch.yml`）。
   - 或在对话中让 Harness 执行：`plugin_manager install_bundle`，target 指向本目录。
3. 首次加载后如提示需要重启，重启 Harness。

## 依赖

Host 侧调用本机 Python 解析书籍，需要以下 Python 包（装入 Harness 的捆绑 Python 或系统 Python 均可）：

```
pip install pypdf ebooklib mobi beautifulsoup4 lxml pymupdf python-docx olefile pywin32
```

其中 `python-docx` 用于 DOCX；DOC 优先用本机 Microsoft Word（通过 `pywin32` 的 COM）抽取，未安装 Word/非 Windows 时退回到 `olefile`（纯文本提取，排版可能不完美）。`pywin32` 仅 Windows 需要。

Python 可执行文件的查找顺序：插件配置 `python` → 环境变量 `BOOKS_PYTHON` → Harness 捆绑 Python（`~/.dsh/dsh-runtimes/.../python.exe`）→ `PATH` 中的 `python`。

DRM 加密的书籍不支持。

## 隐私

插件不上传任何数据；所有书籍、配置、缓存都只保存在本机：

- 配置：`~/.dsh/books-plugin/config.json`
- 文本提取缓存：`~/.dsh/books-plugin/extract-cache/`
- 页面图片缓存：`~/.dsh/books-plugin/page-cache/`

默认的书库位置是用户主目录下的 `Books` 文件夹，可在设置面板中随时更改。

## 许可

插件自身代码采用 MIT 许可（见 [LICENSE](LICENSE)）。其 Python 依赖（pypdf / ebooklib / mobi / PyMuPDF / python-docx / olefile / pywin32 等）各有独立许可，使用前请自行查阅；部分依赖为 copyleft 许可，本地个人使用通常无碍。
