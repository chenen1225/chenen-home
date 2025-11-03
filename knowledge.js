/**
 * AI知识库 - 交互脚本（参考飞书/思源笔记设计）
 * 作者：陈恩
 * 功能：知识库管理、笔记编辑、用户认证、文件夹管理
 */

// ====================================
// 全局状态管理
// ====================================

const KnowledgeApp = {
    // 应用状态
    state: {
        isLoggedIn: false,
        currentNote: null,
        currentFolder: null, // 当前选中的文件夹
        expandedFolders: {}, // 文件夹展开状态
        draggedNote: null, // 当前拖拽的笔记
        notes: [],
        folders: [],
        searchQuery: '', // 搜索关键词
        searchHistory: [] // 搜索历史
    },

    // 默认管理员账户（实际应用中应该使用后端验证）
    admin: {
        username: 'admin',
        password: 'default_password', // 默认密码占位符（实际验证使用哈希值）
        passwordHash: null    // 存储哈希密码
    },

    // 初始化应用
    init() {
        this.loadData();
        this.initAdminConfig(); // 初始化管理员配置
        this.bindEvents();
        this.renderDocTree();
        this.checkLoginStatus();
    },

    // 初始化管理员配置（如果不存在）
    initAdminConfig() {
        const savedConfig = localStorage.getItem('knowledge_admin_config');
        if (!savedConfig) {
            // 如果没有管理员配置，创建默认配置，包含默认密码的哈希值
            const defaultAdminConfig = {
                username: 'admin',
                passwordHash: '4856b4c766c93797de294cadb3c6ca287703eeba6b8a62c929d37849d826bd17' // Jamesche@19的SHA-256哈希值
            };
            localStorage.setItem('knowledge_admin_config', JSON.stringify(defaultAdminConfig));
        }
    },

    // ====================================
    // 数据管理
    // ====================================

    // 从 localStorage 加载数据
    loadData() {
        const savedNotes = localStorage.getItem('knowledge_notes');
        const savedFolders = localStorage.getItem('knowledge_folders');
        const savedExpandedFolders = localStorage.getItem('knowledge_expanded_folders');
        const loginStatus = localStorage.getItem('knowledge_logged_in');

        if (savedNotes) {
            this.state.notes = JSON.parse(savedNotes);
        } else {
            // 初始化默认笔记
            this.state.notes = [
                {
                    id: 1,
                    title: 'AI知识库使用指南',
                    content: `# AI知识库使用指南

## 欢迎使用AI知识库

这是一个简单而强大的知识管理系统，帮助你记录和组织AI相关的学习笔记。

## 主要功能

### 1. 笔记管理
- 创建、编辑、删除笔记
- 支持 Markdown 格式
- 公开/私密权限设置

### 2. 文件夹组织
- 创建文件夹分类
- 文件夹展开/折叠
- 点击文件夹新建笔记自动归类

### 3. 管理员功能
- 默认账号：admin
- 默认密码：admin123
- 登录后可编辑所有内容

## 快速开始

1. 点击右上角"管理员登录"
2. 输入账号密码
3. 点击文件夹选中它
4. 点击左侧"+"添加笔记到该文件夹
5. 开始记录你的AI学习之旅！

## Markdown 支持

支持常用的 Markdown 语法：

\`\`\`
# 一级标题
## 二级标题
### 三级标题

**粗体文本**
*斜体文本*

- 列表项1
- 列表项2

[链接文本](https://example.com)
\`\`\`

## 小提示

💡 点击文件夹可以选中它
💡 选中文件夹后新建笔记自动归类
💡 双击文件夹可以展开/折叠

---

祝你学习愉快！ 🚀`,
                    date: new Date().toLocaleDateString('zh-CN'),
                    permission: 'public',
                    folder: null
                },
                {
                    id: 2,
                    title: 'Cherry Studio 学习笔记',
                    content: `# Cherry Studio 学习笔记

## 什么是 Cherry Studio？

Cherry Studio 是一个强大的AI应用平台，支持多种AI模型的集成和管理。

## 核心功能

### 多模型集成
- 支持20+服务商
- 统一的调用接口
- 智能模型切换

### Agents 系统
- 自定义智能助手
- 提示词工程
- 任务自动化

### 知识库系统
- 本地/云端存储
- 向量化搜索
- RAG 问答

## 实战应用

1. **文档生成**
   - 报告自动化
   - 会议纪要
   - 邮件撰写

2. **数据分析**
   - 图表生成
   - 趋势分析
   - 智能洞察

3. **创意工作**
   - 文案创作
   - 图像生成
   - 翻译校对

---

更多内容持续更新中...`,
                    date: new Date().toLocaleDateString('zh-CN'),
                    permission: 'public',
                    folder: 'AI工具'
                }
            ];
            this.saveData();
        }

        if (savedFolders) {
            this.state.folders = JSON.parse(savedFolders);
        } else {
            this.state.folders = ['AI工具', '学习笔记', '项目文档'];
            this.saveData();
        }

        if (savedExpandedFolders) {
            this.state.expandedFolders = JSON.parse(savedExpandedFolders);
        } else {
            // 默认所有文件夹都展开
            this.state.folders.forEach(folder => {
                this.state.expandedFolders[folder] = true;
            });
        }

        if (loginStatus === 'true') {
            this.state.isLoggedIn = true;
        }

        // 加载搜索历史
        const savedSearchHistory = localStorage.getItem('knowledge_search_history');
        if (savedSearchHistory) {
            this.state.searchHistory = JSON.parse(savedSearchHistory);
        }
    },

    // 保存数据到 localStorage
    saveData() {
        localStorage.setItem('knowledge_notes', JSON.stringify(this.state.notes));
        localStorage.setItem('knowledge_folders', JSON.stringify(this.state.folders));
        localStorage.setItem('knowledge_expanded_folders', JSON.stringify(this.state.expandedFolders));
        localStorage.setItem('knowledge_logged_in', this.state.isLoggedIn);
    },

    // ====================================
    // 事件绑定
    // ====================================

    bindEvents() {
        // 登录相关
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
        document.getElementById('closeLoginModal').addEventListener('click', () => this.hideLoginModal());
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));

        // 笔记操作
        document.getElementById('editNoteBtn').addEventListener('click', () => this.editCurrentNote());
        document.getElementById('deleteNoteBtn').addEventListener('click', () => this.deleteCurrentNote());
        document.getElementById('saveNoteBtn').addEventListener('click', () => this.saveNote());
        document.getElementById('cancelEditBtn').addEventListener('click', () => this.cancelEdit());

        // 添加按钮
        document.getElementById('addNoteBtn').addEventListener('click', () => this.createNewNote());
        document.getElementById('addFolderBtn').addEventListener('click', () => this.showAddFolderModal());

        // 文件夹模态框
        document.getElementById('closeFolderModal').addEventListener('click', () => this.hideAddFolderModal());
        document.getElementById('addFolderForm').addEventListener('submit', (e) => this.handleAddFolder(e));

        // 重命名文件夹模态框
        document.getElementById('closeRenameModal').addEventListener('click', () => this.hideRenameFolderModal());
        document.getElementById('renameFolderForm').addEventListener('submit', (e) => this.handleRenameFolder(e));

        // 图片粘贴事件
        document.getElementById('editContent').addEventListener('paste', (e) => this.handleImagePaste(e));

        // 搜索相关事件
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('focus', () => this.showSearchHistory());
        searchInput.addEventListener('blur', () => {
            // 延迟隐藏，以便点击历史记录项
            setTimeout(() => this.hideSearchHistory(), 200);
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => this.clearSearch());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearAllSearchHistory());

        // 点击模态框外部关闭
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') this.hideLoginModal();
        });
        document.getElementById('addFolderModal').addEventListener('click', (e) => {
            if (e.target.id === 'addFolderModal') this.hideAddFolderModal();
        });
        document.getElementById('renameFolderModal').addEventListener('click', (e) => {
            if (e.target.id === 'renameFolderModal') this.hideRenameFolderModal();
        });
    },

    // ====================================
    // 登录/登出功能
    // ====================================

    showLoginModal() {
        document.getElementById('loginModal').classList.add('active');
    },

    hideLoginModal() {
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('loginForm').reset();
    },

    async handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // 检查用户名是否正确
        if (username !== this.admin.username) {
            this.showToast('用户名或密码错误', 'error');
            return;
        }

        // 获取存储的密码哈希
        const savedConfig = localStorage.getItem('knowledge_admin_config');
        let storedPasswordHash = null;
        
        if (savedConfig) {
            const config = JSON.parse(savedConfig);
            storedPasswordHash = config.passwordHash;
        }

        // 如果存在存储的哈希密码，则验证哈希值
        if (storedPasswordHash) {
            const inputPasswordHash = await this.hashPassword(password);
            if (inputPasswordHash === storedPasswordHash) {
                this.state.isLoggedIn = true;
                this.saveData();
                this.checkLoginStatus();
                this.hideLoginModal();
                this.showToast('登录成功！');
            } else {
                this.showToast('用户名或密码错误', 'error');
            }
        } else {
            // 如果没有存储的哈希密码，使用默认密码验证（兼容旧版本）
            if (password === this.admin.password) {
                this.state.isLoggedIn = true;
                this.saveData();
                this.checkLoginStatus();
                this.hideLoginModal();
                this.showToast('登录成功！');
            } else {
                this.showToast('用户名或密码错误', 'error');
            }
        }
    },

    logout() {
        this.state.isLoggedIn = false;
        this.state.currentFolder = null;
        this.saveData();
        this.checkLoginStatus();
        this.showToast('已退出登录');
        this.renderDocTree();

        // 如果正在编辑，取消编辑
        if (document.getElementById('noteEdit').style.display !== 'none') {
            this.cancelEdit();
        }
    },

    checkLoginStatus() {
        const loginBtn = document.getElementById('loginBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const addNoteBtn = document.getElementById('addNoteBtn');
        const addFolderBtn = document.getElementById('addFolderBtn');
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        const noteActions = document.getElementById('noteActions');

        if (this.state.isLoggedIn) {
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'flex';
            addNoteBtn.style.display = 'flex';
            addFolderBtn.style.display = 'flex';
            if (adminPanelBtn) adminPanelBtn.style.display = 'flex';
            if (this.state.currentNote) {
                noteActions.style.display = 'flex';
            }
        } else {
            loginBtn.style.display = 'flex';
            logoutBtn.style.display = 'none';
            addNoteBtn.style.display = 'none';
            addFolderBtn.style.display = 'none';
            if (adminPanelBtn) adminPanelBtn.style.display = 'none';
            noteActions.style.display = 'none';
        }
    },

    // ====================================
    // 文档树渲染（参考飞书/思源）
    // ====================================

    renderDocTree() {
        const docTree = document.getElementById('docTree');
        docTree.innerHTML = '';

        // 如果有搜索内容，显示搜索结果
        if (this.state.searchQuery) {
            const searchResults = this.searchNotes(this.state.searchQuery);

            if (searchResults.length === 0) {
                // 无搜索结果
                docTree.innerHTML = `
                    <div class="search-no-results">
                        <i class="fas fa-search"></i>
                        <p>未找到包含「${this.escapeHtml(this.state.searchQuery)}」的笔记</p>
                        <button onclick="KnowledgeApp.clearSearch()">清除搜索</button>
                    </div>
                `;
                return;
            }

            // 显示搜索结果
            searchResults.forEach(note => {
                docTree.appendChild(this.createNoteElement(note, this.state.searchQuery));
            });
            return;
        }

        // 按文件夹分组
        const groupedNotes = this.groupNotesByFolder();

        // 渲染未分类笔记
        if (groupedNotes['未分类'] && groupedNotes['未分类'].length > 0) {
            groupedNotes['未分类'].forEach(note => {
                docTree.appendChild(this.createNoteElement(note));
            });
        }

        // 渲染文件夹和笔记
        this.state.folders.forEach(folder => {
            const hasNotes = groupedNotes[folder] && groupedNotes[folder].length > 0;
            const isExpanded = this.state.expandedFolders[folder] !== false;

            // 创建文件夹容器
            const folderContainer = document.createElement('div');
            folderContainer.className = 'folder-container';

            // 创建文件夹元素（参考飞书/思源样式）
            const folderElement = document.createElement('div');
            folderElement.className = 'doc-tree-folder';
            if (this.state.currentFolder === folder) {
                folderElement.classList.add('selected');
            }

            const expandIcon = isExpanded ?
                '<i class="fas fa-chevron-down expand-icon"></i>' :
                '<i class="fas fa-chevron-right expand-icon"></i>';

            const noteCount = hasNotes ? `(${groupedNotes[folder].length})` : '';

            // 添加文件夹操作按钮（仅登录用户可见）
            const folderActions = this.state.isLoggedIn ? `
                <div class="folder-actions">
                    <button class="folder-action-btn rename-folder-btn" title="重命名">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="folder-action-btn delete-folder-btn" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            ` : '';

            folderElement.innerHTML = `
                ${expandIcon}
                <i class="fas fa-folder folder-icon"></i>
                <span class="folder-name">${folder}</span>
                <span class="note-count">${noteCount}</span>
                ${folderActions}
            `;

            // 点击文件夹 - 选中
            folderElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectFolder(folder);
            });

            // 双击文件夹 - 展开/折叠
            folderElement.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.toggleFolder(folder);
            });

            // 点击展开图标 - 展开/折叠
            const expandIconEl = folderElement.querySelector('.expand-icon');
            if (expandIconEl) {
                expandIconEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFolder(folder);
                });
            }

            // 文件夹操作按钮事件（仅登录用户）
            if (this.state.isLoggedIn) {
                const renameFolderBtn = folderElement.querySelector('.rename-folder-btn');
                const deleteFolderBtn = folderElement.querySelector('.delete-folder-btn');

                if (renameFolderBtn) {
                    renameFolderBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.showRenameFolderModal(folder);
                    });
                }

                if (deleteFolderBtn) {
                    deleteFolderBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteFolder(folder);
                    });
                }
            }

            // 拖拽放置事件（仅登录用户可用）
            if (this.state.isLoggedIn) {
                // 允许拖拽进入
                folderElement.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'move';
                    folderElement.classList.add('drag-over');
                });

                // 拖拽离开
                folderElement.addEventListener('dragleave', (e) => {
                    e.stopPropagation();
                    folderElement.classList.remove('drag-over');
                });

                // 放置笔记
                folderElement.addEventListener('drop', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    folderElement.classList.remove('drag-over');

                    if (this.state.draggedNote) {
                        this.moveNoteToFolder(this.state.draggedNote.id, folder);
                    }
                });
            }

            folderContainer.appendChild(folderElement);

            // 渲染文件夹下的笔记（仅在展开时显示）
            if (isExpanded && hasNotes) {
                const notesContainer = document.createElement('div');
                notesContainer.className = 'folder-notes';

                groupedNotes[folder].forEach(note => {
                    notesContainer.appendChild(this.createNoteElement(note));
                });

                folderContainer.appendChild(notesContainer);
            }

            docTree.appendChild(folderContainer);
        });

        // 如果没有笔记和文件夹，显示提示
        if (this.state.notes.length === 0 && this.state.folders.length === 0) {
            docTree.innerHTML = '<p style="text-align: center; color: var(--knowledge-text-light); padding: 2rem 1rem;">暂无笔记<br>点击右上角 + 添加</p>';
        }
    },

    // 选中文件夹
    selectFolder(folderName) {
        if (this.state.currentFolder === folderName) {
            // 再次点击取消选中
            this.state.currentFolder = null;
        } else {
            this.state.currentFolder = folderName;
        }
        this.renderDocTree();
    },

    // 切换文件夹展开/折叠
    toggleFolder(folderName) {
        this.state.expandedFolders[folderName] = !this.state.expandedFolders[folderName];
        this.saveData();
        this.renderDocTree();
    },

    createNoteElement(note, searchQuery = null) {
        const noteElement = document.createElement('div');
        noteElement.className = 'doc-tree-note';
        if (this.state.currentNote && this.state.currentNote.id === note.id) {
            noteElement.classList.add('active');
        }

        // 只有登录用户才能拖拽
        if (this.state.isLoggedIn) {
            noteElement.setAttribute('draggable', 'true');

            // 拖拽开始
            noteElement.addEventListener('dragstart', (e) => {
                this.state.draggedNote = note;
                noteElement.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', noteElement.innerHTML);
            });

            // 拖拽结束
            noteElement.addEventListener('dragend', (e) => {
                noteElement.classList.remove('dragging');
                this.state.draggedNote = null;
            });
        }

        // 标题高亮
        const highlightedTitle = searchQuery
            ? this.highlightText(note.title, searchQuery)
            : this.escapeHtml(note.title);

        noteElement.innerHTML = `
            <i class="fas fa-file-alt note-icon"></i>
            <span class="note-title">${highlightedTitle}</span>
        `;

        noteElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.viewNote(note.id);
        });

        return noteElement;
    },

    groupNotesByFolder() {
        const grouped = { '未分类': [] };

        this.state.notes.forEach(note => {
            const folder = note.folder || '未分类';
            if (!grouped[folder]) {
                grouped[folder] = [];
            }
            grouped[folder].push(note);
        });

        return grouped;
    },

    // ====================================
    // 笔记查看
    // ====================================

    viewNote(noteId) {
        const note = this.state.notes.find(n => n.id === noteId);
        if (!note) return;

        this.state.currentNote = note;

        // 隐藏欢迎屏幕和编辑区域
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('noteEdit').style.display = 'none';

        // 显示笔记查看区域
        const noteView = document.getElementById('noteView');
        noteView.style.display = 'block';

        // 更新内容
        document.getElementById('noteTitle').textContent = note.title;
        document.getElementById('noteDate').textContent = note.date;
        document.getElementById('notePermission').textContent = note.permission === 'public' ? '公开' : '私密';

        // 渲染Markdown并高亮搜索关键词
        let renderedContent = this.renderMarkdown(note.content);
        if (this.state.searchQuery) {
            // 在渲染后的HTML中高亮搜索关键词
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = renderedContent;
            this.highlightInElement(tempDiv, this.state.searchQuery);
            renderedContent = tempDiv.innerHTML;
        }
        document.getElementById('noteContent').innerHTML = renderedContent;

        // 更新操作按钮显示
        if (this.state.isLoggedIn) {
            document.getElementById('noteActions').style.display = 'flex';
        }

        // 重新渲染文档树以更新高亮
        this.renderDocTree();
    },

    // 在DOM元素中高亮文本
    highlightInElement(element, query) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodesToReplace = [];
        let node;

        while (node = walker.nextNode()) {
            if (node.textContent.toLowerCase().includes(query.toLowerCase())) {
                nodesToReplace.push(node);
            }
        }

        nodesToReplace.forEach(node => {
            const parent = node.parentNode;
            const text = node.textContent;
            const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
            const parts = text.split(regex);

            const fragment = document.createDocumentFragment();
            parts.forEach(part => {
                if (part.toLowerCase() === query.toLowerCase()) {
                    const span = document.createElement('span');
                    span.className = 'search-highlight';
                    span.textContent = part;
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            });

            parent.replaceChild(fragment, node);
        });
    },

    // 转义正则表达式特殊字符
    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    // ====================================
    // 笔记编辑
    // ====================================

    // 填充文件夹选择器
    populateFolderSelect() {
        const folderSelect = document.getElementById('editFolder');
        folderSelect.innerHTML = '<option value="">未分类</option>';

        this.state.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            folderSelect.appendChild(option);
        });
    },

    editCurrentNote() {
        if (!this.state.currentNote || !this.state.isLoggedIn) return;

        // 隐藏查看区域
        document.getElementById('noteView').style.display = 'none';

        // 显示编辑区域
        const noteEdit = document.getElementById('noteEdit');
        noteEdit.style.display = 'block';

        // 填充文件夹选择器
        this.populateFolderSelect();

        // 填充表单
        document.getElementById('editTitle').value = this.state.currentNote.title;
        document.getElementById('editContent').value = this.state.currentNote.content;
        document.getElementById('editPermission').checked = this.state.currentNote.permission === 'public';
        document.getElementById('editFolder').value = this.state.currentNote.folder || '';
    },

    createNewNote() {
        if (!this.state.isLoggedIn) {
            this.showToast('请先登录', 'error');
            return;
        }

        // 创建新笔记对象，自动归属到当前选中的文件夹
        this.state.currentNote = {
            id: Date.now(),
            title: '',
            content: '',
            date: new Date().toLocaleDateString('zh-CN'),
            permission: 'public',
            folder: this.state.currentFolder // 使用当前选中的文件夹
        };

        // 隐藏其他视图
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('noteView').style.display = 'none';

        // 显示编辑区域
        const noteEdit = document.getElementById('noteEdit');
        noteEdit.style.display = 'block';

        // 填充文件夹选择器
        this.populateFolderSelect();

        // 清空表单
        document.getElementById('editTitle').value = '';
        document.getElementById('editContent').value = '';
        document.getElementById('editPermission').checked = true;
        document.getElementById('editFolder').value = this.state.currentFolder || '';

        // 聚焦标题输入框
        document.getElementById('editTitle').focus();

        // 如果选中了文件夹，显示提示
        if (this.state.currentFolder) {
            this.showToast(`新笔记将保存到「${this.state.currentFolder}」`, 'info');
        }
    },

    saveNote() {
        if (!this.state.currentNote || !this.state.isLoggedIn) return;

        const title = document.getElementById('editTitle').value.trim();
        const content = document.getElementById('editContent').value.trim();
        const permission = document.getElementById('editPermission').checked ? 'public' : 'private';
        const folder = document.getElementById('editFolder').value || null;

        if (!title) {
            this.showToast('请输入笔记标题', 'error');
            return;
        }

        if (!content) {
            this.showToast('请输入笔记内容', 'error');
            return;
        }

        // 更新笔记数据
        this.state.currentNote.title = title;
        this.state.currentNote.content = content;
        this.state.currentNote.permission = permission;
        this.state.currentNote.folder = folder;
        this.state.currentNote.date = new Date().toLocaleDateString('zh-CN');

        // 检查是否是新笔记
        const existingIndex = this.state.notes.findIndex(n => n.id === this.state.currentNote.id);
        if (existingIndex === -1) {
            // 新笔记，添加到列表
            this.state.notes.push(this.state.currentNote);
        } else {
            // 更新现有笔记
            this.state.notes[existingIndex] = this.state.currentNote;
        }

        // 保存数据
        this.saveData();

        // 重新渲染文档树
        this.renderDocTree();

        // 切换到查看模式
        this.viewNote(this.state.currentNote.id);

        this.showToast('保存成功！');
    },

    cancelEdit() {
        // 隐藏编辑区域
        document.getElementById('noteEdit').style.display = 'none';

        // 如果有当前笔记，显示查看区域
        if (this.state.currentNote && this.state.notes.find(n => n.id === this.state.currentNote.id)) {
            this.viewNote(this.state.currentNote.id);
        } else {
            // 否则显示欢迎屏幕
            document.getElementById('welcomeScreen').style.display = 'flex';
            this.state.currentNote = null;
        }
    },

    deleteCurrentNote() {
        if (!this.state.currentNote || !this.state.isLoggedIn) return;

        if (confirm('确定要删除这篇笔记吗？此操作不可恢复！')) {
            // 从列表中删除
            this.state.notes = this.state.notes.filter(n => n.id !== this.state.currentNote.id);

            // 保存数据
            this.saveData();

            // 重新渲染文档树
            this.renderDocTree();

            // 显示欢迎屏幕
            document.getElementById('noteView').style.display = 'none';
            document.getElementById('welcomeScreen').style.display = 'flex';

            this.state.currentNote = null;

            this.showToast('笔记已删除');
        }
    },

    // ====================================
    // 文件夹管理
    // ====================================

    showAddFolderModal() {
        document.getElementById('addFolderModal').classList.add('active');
        // 聚焦输入框
        setTimeout(() => {
            document.getElementById('folderName').focus();
        }, 100);
    },

    hideAddFolderModal() {
        document.getElementById('addFolderModal').classList.remove('active');
        document.getElementById('addFolderForm').reset();
    },

    handleAddFolder(e) {
        e.preventDefault();
        const folderName = document.getElementById('folderName').value.trim();

        if (!folderName) {
            this.showToast('请输入文件夹名称', 'error');
            return;
        }

        if (this.state.folders.includes(folderName)) {
            this.showToast('文件夹已存在', 'error');
            return;
        }

        this.state.folders.push(folderName);
        this.state.expandedFolders[folderName] = true; // 新文件夹默认展开
        this.saveData();
        this.renderDocTree();
        this.hideAddFolderModal();
        this.showToast('文件夹创建成功！');
    },

    // 显示重命名文件夹模态框
    showRenameFolderModal(folderName) {
        this.state.renamingFolder = folderName; // 保存正在重命名的文件夹名
        document.getElementById('newFolderName').value = folderName;
        document.getElementById('renameFolderModal').classList.add('active');
        // 聚焦输入框并选中文本
        setTimeout(() => {
            const input = document.getElementById('newFolderName');
            input.focus();
            input.select();
        }, 100);
    },

    // 隐藏重命名文件夹模态框
    hideRenameFolderModal() {
        document.getElementById('renameFolderModal').classList.remove('active');
        document.getElementById('renameFolderForm').reset();
        this.state.renamingFolder = null;
    },

    // 处理重命名文件夹
    handleRenameFolder(e) {
        e.preventDefault();
        const newFolderName = document.getElementById('newFolderName').value.trim();
        const oldFolderName = this.state.renamingFolder;

        if (!newFolderName) {
            this.showToast('请输入新文件夹名称', 'error');
            return;
        }

        if (newFolderName === oldFolderName) {
            this.hideRenameFolderModal();
            return;
        }

        if (this.state.folders.includes(newFolderName)) {
            this.showToast('文件夹名称已存在', 'error');
            return;
        }

        // 更新文件夹列表
        const folderIndex = this.state.folders.indexOf(oldFolderName);
        if (folderIndex !== -1) {
            this.state.folders[folderIndex] = newFolderName;
        }

        // 更新文件夹展开状态
        if (this.state.expandedFolders[oldFolderName] !== undefined) {
            this.state.expandedFolders[newFolderName] = this.state.expandedFolders[oldFolderName];
            delete this.state.expandedFolders[oldFolderName];
        }

        // 更新所有笔记中的文件夹引用
        this.state.notes.forEach(note => {
            if (note.folder === oldFolderName) {
                note.folder = newFolderName;
            }
        });

        // 如果当前选中的是这个文件夹，更新选中状态
        if (this.state.currentFolder === oldFolderName) {
            this.state.currentFolder = newFolderName;
        }

        // 保存数据
        this.saveData();

        // 重新渲染文档树
        this.renderDocTree();

        // 隐藏模态框
        this.hideRenameFolderModal();

        this.showToast(`文件夹已重命名为「${newFolderName}」`);
    },

    // 删除文件夹
    deleteFolder(folderName) {
        // 检查文件夹下是否有笔记
        const notesInFolder = this.state.notes.filter(note => note.folder === folderName);

        let confirmMessage = `确定要删除文件夹「${folderName}」吗？`;
        if (notesInFolder.length > 0) {
            confirmMessage = `文件夹「${folderName}」中还有 ${notesInFolder.length} 篇笔记，删除后这些笔记将移至「未分类」。\n\n确定要删除吗？`;
        }

        if (confirm(confirmMessage)) {
            // 将文件夹下的笔记移至未分类
            this.state.notes.forEach(note => {
                if (note.folder === folderName) {
                    note.folder = null;
                }
            });

            // 从文件夹列表中删除
            this.state.folders = this.state.folders.filter(f => f !== folderName);

            // 删除文件夹展开状态
            delete this.state.expandedFolders[folderName];

            // 如果当前选中的是这个文件夹，清除选中状态
            if (this.state.currentFolder === folderName) {
                this.state.currentFolder = null;
            }

            // 保存数据
            this.saveData();

            // 重新渲染文档树
            this.renderDocTree();

            this.showToast(`文件夹「${folderName}」已删除`);
        }
    },

    // 移动笔记到文件夹
    moveNoteToFolder(noteId, targetFolder) {
        const note = this.state.notes.find(n => n.id === noteId);
        if (!note) return;

        // 如果笔记已经在目标文件夹，不做处理
        if (note.folder === targetFolder) {
            this.showToast('笔记已在该文件夹中', 'info');
            return;
        }

        // 更新笔记的文件夹
        note.folder = targetFolder;

        // 保存数据
        this.saveData();

        // 重新渲染文档树
        this.renderDocTree();

        // 显示成功提示
        this.showToast(`笔记已移动到「${targetFolder}」`);
    },

    // ====================================
    // Markdown 渲染（简单实现）
    // ====================================

    renderMarkdown(text) {
        if (!text) return '';

        let html = text;

        // 代码块（必须在其他规则之前处理）
        html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

        // 行内代码
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // 标题
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // 粗体和斜体
        html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

        // 链接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // 列表
        html = html.replace(/^\- (.+)$/gim, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // 水平线
        html = html.replace(/^---$/gim, '<hr>');

        // 段落（简单处理）
        html = html.split('\n\n').map(para => {
            if (!para.match(/^<[h|u|p|l]/)) {
                return `<p>${para}</p>`;
            }
            return para;
        }).join('\n');

        return html;
    },

    // ====================================
    // 图片粘贴和上传
    // ====================================

    // 处理图片粘贴事件
    async handleImagePaste(e) {
        const items = e.clipboardData.items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            // 检查是否为图片
            if (item.type.indexOf('image') !== -1) {
                e.preventDefault(); // 阻止默认粘贴行为

                const file = item.getAsFile();
                const textarea = document.getElementById('editContent');
                const cursorPosition = textarea.selectionStart;

                // 插入占位符
                const placeholder = '\n![上传中...]()\n';
                const textBefore = textarea.value.substring(0, cursorPosition);
                const textAfter = textarea.value.substring(cursorPosition);
                textarea.value = textBefore + placeholder + textAfter;

                // 显示上传提示
                this.showToast('正在上传图片...', 'info');

                try {
                    // 上传图片
                    const imageUrl = await this.uploadImage(file);

                    // 替换占位符为实际图片URL
                    const markdownImage = `\n![图片](${imageUrl})\n`;
                    textarea.value = textBefore + markdownImage + textAfter;

                    // 设置光标位置到图片后面
                    const newPosition = cursorPosition + markdownImage.length;
                    textarea.setSelectionRange(newPosition, newPosition);
                    textarea.focus();

                    this.showToast('图片上传成功！');
                } catch (error) {
                    // 上传失败，移除占位符
                    textarea.value = textBefore + textAfter;
                    textarea.setSelectionRange(cursorPosition, cursorPosition);

                    this.showToast('图片上传失败：' + error.message, 'error');
                }

                break;
            }
        }
    },

    // 上传图片到图床
    async uploadImage(file) {
        // 使用 SM.MS 图床 API（免费，无需注册）
        const formData = new FormData();
        formData.append('smfile', file);

        try {
            const response = await fetch('https://sm.ms/api/v2/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                return result.data.url;
            } else if (result.code === 'image_repeated') {
                // 图片已存在，使用已有URL
                return result.images;
            } else {
                throw new Error(result.message || '上传失败');
            }
        } catch (error) {
            console.error('图片上传错误:', error);
            throw new Error('网络错误，请检查网络连接');
        }
    },

    // ====================================
    // 搜索功能
    // ====================================

    // 处理搜索
    handleSearch(query) {
        this.state.searchQuery = query.trim();

        // 显示/隐藏清除按钮
        const clearBtn = document.getElementById('clearSearchBtn');
        if (this.state.searchQuery) {
            clearBtn.style.display = 'flex';
        } else {
            clearBtn.style.display = 'none';
        }

        // 隐藏搜索历史
        this.hideSearchHistory();

        // 重新渲染文档树
        this.renderDocTree();

        // 如果有搜索内容，保存到搜索历史
        if (this.state.searchQuery && this.state.searchQuery.length >= 2) {
            this.addToSearchHistory(this.state.searchQuery);
        }
    },

    // 清除搜索
    clearSearch() {
        this.state.searchQuery = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearchBtn').style.display = 'none';
        this.renderDocTree();
    },

    // 添加到搜索历史
    addToSearchHistory(query) {
        // 去重
        this.state.searchHistory = this.state.searchHistory.filter(item => item !== query);
        // 添加到开头
        this.state.searchHistory.unshift(query);
        // 限制历史记录数量为10条
        if (this.state.searchHistory.length > 10) {
            this.state.searchHistory = this.state.searchHistory.slice(0, 10);
        }
        // 保存到localStorage
        localStorage.setItem('knowledge_search_history', JSON.stringify(this.state.searchHistory));
    },

    // 显示搜索历史
    showSearchHistory() {
        if (this.state.searchHistory.length === 0 || this.state.searchQuery) {
            return;
        }

        const historyContainer = document.getElementById('searchHistory');
        const historyList = document.getElementById('searchHistoryList');

        historyList.innerHTML = '';

        this.state.searchHistory.forEach(query => {
            const item = document.createElement('div');
            item.className = 'search-history-item';
            item.innerHTML = `
                <i class="fas fa-clock"></i>
                <span>${this.escapeHtml(query)}</span>
            `;
            item.addEventListener('click', () => {
                document.getElementById('searchInput').value = query;
                this.handleSearch(query);
            });
            historyList.appendChild(item);
        });

        historyContainer.style.display = 'block';
    },

    // 隐藏搜索历史
    hideSearchHistory() {
        document.getElementById('searchHistory').style.display = 'none';
    },

    // 清除所有搜索历史
    clearAllSearchHistory() {
        if (confirm('确定要清除所有搜索历史吗？')) {
            this.state.searchHistory = [];
            localStorage.removeItem('knowledge_search_history');
            this.hideSearchHistory();
            this.showToast('搜索历史已清除');
        }
    },

    // 搜索笔记（标题和内容）
    searchNotes(query) {
        if (!query) {
            return this.state.notes;
        }

        const lowerQuery = query.toLowerCase();
        return this.state.notes.filter(note => {
            const titleMatch = note.title.toLowerCase().includes(lowerQuery);
            const contentMatch = note.content.toLowerCase().includes(lowerQuery);
            return titleMatch || contentMatch;
        });
    },

    // 高亮搜索关键词
    highlightText(text, query) {
        if (!query || !text) {
            return this.escapeHtml(text);
        }

        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.escapeHtml(query);

        // 使用正则表达式进行大小写不敏感的替换
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<span class="search-highlight">$1</span>');
    },

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // 密码哈希函数
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    // ====================================
    // Toast 提示
    // ====================================

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.className = 'toast show';

        if (type === 'error') {
            toast.classList.add('error');
        } else if (type === 'warning') {
            toast.classList.add('warning');
        } else if (type === 'info') {
            toast.classList.add('info');
        }

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.className = 'toast';
            }, 300);
        }, 3000);
    }
};

// ====================================
// 初始化应用
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    KnowledgeApp.init();
});
