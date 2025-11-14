/**
 * AI知识库 - 管理后台脚本
 * 作者：陈恩
 * 功能：数据统计、批量管理、系统设置、数据备份
 */

// ====================================
// 全局状态管理
// ====================================

const AdminApp = {
    // 应用状态
    state: {
        notes: [],
        folders: [],
        selectedNotes: new Set(),
        currentSection: 'dashboard',
        adminConfig: null,
        siteConfig: null
    },

    // 初始化应用
    init() {
        // 检查登录状态
        if (!this.checkAuth()) {
            window.location.href = 'knowledge.html';
            alert('请先登录管理员账号');
            return;
        }

        this.loadData();
        this.loadConfig();
        this.bindEvents();
        this.showSection('dashboard');
        this.updateDashboard();
    },

    // ====================================
    // 权限验证
    // ====================================

    checkAuth() {
        return localStorage.getItem('knowledge_logged_in') === 'true';
    },

    // ====================================
    // 数据加载
    // ====================================

    loadData() {
        const savedNotes = localStorage.getItem('knowledge_notes');
        const savedFolders = localStorage.getItem('knowledge_folders');

        this.state.notes = savedNotes ? JSON.parse(savedNotes) : [];
        this.state.folders = savedFolders ? JSON.parse(savedFolders) : [];
    },

    loadConfig() {
        // 加载管理员配置
        const adminConfig = localStorage.getItem('knowledge_admin_config');
        if (adminConfig) {
            this.state.adminConfig = JSON.parse(adminConfig);
        } else {
            // 默认配置 - 使用与knowledge.js相同的初始哈希值
            this.state.adminConfig = {
                username: 'admin',
                passwordHash: '4856b4c766c93797de294cadb3c6ca287703eeba6b8a62c929d37849d826bd17' // Jamesche@19的SHA-256哈希值
            };
        }

        // 加载站点配置
        const siteConfig = localStorage.getItem('knowledge_site_config');
        if (siteConfig) {
            this.state.siteConfig = JSON.parse(siteConfig);
        } else {
            // 默认配置
            this.state.siteConfig = {
                title: 'AI知识库',
                defaultPermission: 'public',
                searchHistoryLimit: 10
            };
        }

        // 更新UI
        document.getElementById('adminUsername').textContent = this.state.adminConfig.username;
    },

    saveData() {
        localStorage.setItem('knowledge_notes', JSON.stringify(this.state.notes));
        localStorage.setItem('knowledge_folders', JSON.stringify(this.state.folders));
    },

    saveConfig() {
        localStorage.setItem('knowledge_admin_config', JSON.stringify(this.state.adminConfig));
        localStorage.setItem('knowledge_site_config', JSON.stringify(this.state.siteConfig));
    },

    // ====================================
    // 事件绑定
    // ====================================

    bindEvents() {
        // 顶部导航按钮
        document.getElementById('backToKnowledge').addEventListener('click', () => {
            window.location.href = 'knowledge.html';
        });

        document.getElementById('logoutBtn').addEventListener('click', () => {
            if (confirm('确定要退出登录吗？')) {
                localStorage.removeItem('knowledge_logged_in');
                window.location.href = 'knowledge.html';
            }
        });

        // 侧边栏导航
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // 笔记管理事件
        this.bindNotesEvents();

        // 系统设置事件
        this.bindSettingsEvents();

        // 备份恢复事件
        this.bindBackupEvents();
    },

    bindNotesEvents() {
        // 搜索和过滤
        document.getElementById('notesSearchInput').addEventListener('input', (e) => {
            this.filterNotes();
        });

        document.getElementById('folderFilter').addEventListener('change', () => {
            this.filterNotes();
        });

        document.getElementById('permissionFilter').addEventListener('change', () => {
            this.filterNotes();
        });

        // 全选
        document.getElementById('selectAllCheckbox').addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        document.getElementById('selectAllBtn').addEventListener('click', () => {
            const checkbox = document.getElementById('selectAllCheckbox');
            checkbox.checked = !checkbox.checked;
            this.toggleSelectAll(checkbox.checked);
        });

        // 批量操作
        document.getElementById('batchDeleteBtn').addEventListener('click', () => {
            this.batchDelete();
        });

        document.getElementById('batchMoveBtn').addEventListener('click', () => {
            this.showBatchMoveModal();
        });

        document.getElementById('batchPermissionBtn').addEventListener('click', () => {
            this.showBatchPermissionModal();
        });

        // 批量移动弹窗
        document.getElementById('closeBatchMoveModal').addEventListener('click', () => {
            this.hideModal('batchMoveModal');
        });

        document.getElementById('confirmBatchMoveBtn').addEventListener('click', () => {
            this.confirmBatchMove();
        });

        // 批量权限弹窗
        document.getElementById('closeBatchPermissionModal').addEventListener('click', () => {
            this.hideModal('batchPermissionModal');
        });

        document.getElementById('confirmBatchPermissionBtn').addEventListener('click', () => {
            this.confirmBatchPermission();
        });

        // 点击弹窗外部关闭
        document.getElementById('batchMoveModal').addEventListener('click', (e) => {
            if (e.target.id === 'batchMoveModal') {
                this.hideModal('batchMoveModal');
            }
        });

        document.getElementById('batchPermissionModal').addEventListener('click', (e) => {
            if (e.target.id === 'batchPermissionModal') {
                this.hideModal('batchPermissionModal');
            }
        });
    },

    bindSettingsEvents() {
        // 更新密码
        document.getElementById('updatePasswordBtn').addEventListener('click', () => {
            this.updatePassword();
        });

        // 保存站点配置
        document.getElementById('saveSiteConfigBtn').addEventListener('click', () => {
            this.saveSiteConfig();
        });

        // 清理缓存
        document.getElementById('clearCacheBtn').addEventListener('click', () => {
            this.clearCache();
        });

        // 重置所有数据
        document.getElementById('resetAllDataBtn').addEventListener('click', () => {
            this.resetAllData();
        });
    },

    bindBackupEvents() {
        // 导出JSON
        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            this.exportJson();
        });

        // 导出Markdown
        document.getElementById('exportMarkdownBtn').addEventListener('click', () => {
            this.exportMarkdown();
        });

        // 文件上传区域
        const uploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('importFileInput');

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--admin-primary)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--admin-border)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--admin-border)';
            const file = e.dataTransfer.files[0];
            this.handleFileSelect(file);
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            this.handleFileSelect(file);
        });

        // 导入数据
        document.getElementById('importDataBtn').addEventListener('click', () => {
            this.importData();
        });

        // 立即备份
        document.getElementById('backupNowBtn').addEventListener('click', () => {
            this.exportJson();
            this.updateLastBackupTime();
        });
    },

    // ====================================
    // 导航切换
    // ====================================

    showSection(sectionName) {
        this.state.currentSection = sectionName;

        // 更新导航高亮
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.section === sectionName) {
                item.classList.add('active');
            }
        });

        // 切换内容区域
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        document.getElementById(`${sectionName}-section`).classList.add('active');

        // 根据不同页面加载数据
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'notes':
                this.loadNotesTable();
                break;
            case 'settings':
                this.loadSettings();
                break;
            case 'backup':
                this.loadBackupInfo();
                break;
        }
    },

    // ====================================
    // 数据统计看板
    // ====================================

    updateDashboard() {
        const stats = this.calculateStats();

        // 更新统计卡片
        document.getElementById('totalNotes').textContent = stats.totalNotes;
        document.getElementById('totalFolders').textContent = stats.totalFolders;
        document.getElementById('publicNotes').textContent = stats.publicNotes;
        document.getElementById('privateNotes').textContent = stats.privateNotes;

        // 更新存储信息
        this.updateStorageInfo();

        // 更新图表
        this.updateFolderChart(stats.folderDistribution);
    },

    calculateStats() {
        const notes = this.state.notes;
        const folders = this.state.folders;

        const publicNotes = notes.filter(n => n.permission === 'public').length;
        const privateNotes = notes.filter(n => n.permission === 'private').length;

        // 按文件夹分布
        const folderDistribution = {};
        notes.forEach(note => {
            const folder = note.folder || '未分类';
            folderDistribution[folder] = (folderDistribution[folder] || 0) + 1;
        });

        return {
            totalNotes: notes.length,
            totalFolders: folders.length,
            publicNotes,
            privateNotes,
            folderDistribution
        };
    },

    updateStorageInfo() {
        let totalSize = 0;

        // 计算所有localStorage数据大小
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith('knowledge_')) {
                totalSize += localStorage.getItem(key).length;
            }
        }

        // 转换为KB
        const sizeInKB = (totalSize / 1024).toFixed(2);
        const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);

        // 大多数浏览器localStorage限制为5-10MB
        const maxSize = 5 * 1024 * 1024; // 5MB
        const percentage = (totalSize / maxSize * 100).toFixed(1);

        document.getElementById('storageUsed').textContent = sizeInKB + ' KB';
        document.getElementById('storageTotal').textContent = '5 MB';
        document.getElementById('storageBar').style.width = percentage + '%';

        // 如果使用超过80%，改变颜色
        if (percentage > 80) {
            document.getElementById('storageBar').style.background = 'var(--admin-danger)';
        } else if (percentage > 50) {
            document.getElementById('storageBar').style.background = 'var(--admin-warning)';
        }
    },

    updateFolderChart(distribution) {
        const canvas = document.getElementById('folderChart');
        const ctx = canvas ? canvas.getContext('2d') : null;

        if (!ctx) return;

        // 简单的文本显示（如需完整图表可集成Chart.js）
        canvas.width = 400;
        canvas.height = 250;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '14px "LXGW WenKai Screen"';
        ctx.textAlign = 'left';

        let y = 30;
        const entries = Object.entries(distribution);

        if (entries.length === 0) {
            ctx.fillText('暂无数据', 150, 125);
            return;
        }

        entries.forEach(([folder, count]) => {
            const text = `${folder}: ${count} 篇`;
            ctx.fillText(text, 20, y);
            y += 30;
        });
    },

    // ====================================
    // 笔记批量管理
    // ====================================

    loadNotesTable() {
        // 填充文件夹过滤器
        const folderFilter = document.getElementById('folderFilter');
        folderFilter.innerHTML = '<option value="">所有文件夹</option>';
        this.state.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            folderFilter.appendChild(option);
        });

        // 填充批量移动目标文件夹
        const targetFolder = document.getElementById('targetFolder');
        targetFolder.innerHTML = '<option value="">未分类</option>';
        this.state.folders.forEach(folder => {
            const option = document.createElement('option');
            option.value = folder;
            option.textContent = folder;
            targetFolder.appendChild(option);
        });

        // 填充导出文件夹选择器
        const exportFolder = document.getElementById('exportFolder');
        if (exportFolder) {
            exportFolder.innerHTML = '<option value="">所有文件夹</option>';
            this.state.folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                option.textContent = folder;
                exportFolder.appendChild(option);
            });
        }

        // 渲染表格
        this.renderNotesTable(this.state.notes);
    },

    renderNotesTable(notes) {
        const tbody = document.getElementById('notesTableBody');
        tbody.innerHTML = '';

        if (notes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">
                        暂无笔记
                    </td>
                </tr>
            `;
            return;
        }

        notes.forEach(note => {
            const tr = document.createElement('tr');
            tr.dataset.noteId = note.id;

            if (this.state.selectedNotes.has(note.id)) {
                tr.classList.add('selected');
            }

            const permissionClass = note.permission === 'public' ? 'public' : 'private';
            const permissionText = note.permission === 'public' ? '公开' : '私密';

            tr.innerHTML = `
                <td>
                    <input type="checkbox" class="note-checkbox" data-id="${note.id}" ${this.state.selectedNotes.has(note.id) ? 'checked' : ''}>
                </td>
                <td class="note-title">${this.escapeHtml(note.title)}</td>
                <td>${this.escapeHtml(note.folder || '未分类')}</td>
                <td><span class="permission-badge ${permissionClass}">${permissionText}</span></td>
                <td>${note.date}</td>
                <td>
                    <button class="table-action-btn delete" onclick="AdminApp.deleteNote(${note.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            // 复选框事件
            const checkbox = tr.querySelector('.note-checkbox');
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.toggleNoteSelection(note.id, e.target.checked);
            });

            tbody.appendChild(tr);
        });

        this.updateBatchButtons();
    },

    filterNotes() {
        const searchQuery = document.getElementById('notesSearchInput').value.toLowerCase();
        const folderFilter = document.getElementById('folderFilter').value;
        const permissionFilter = document.getElementById('permissionFilter').value;

        const filtered = this.state.notes.filter(note => {
            // 搜索过滤
            const matchSearch = !searchQuery ||
                note.title.toLowerCase().includes(searchQuery) ||
                note.content.toLowerCase().includes(searchQuery);

            // 文件夹过滤
            const matchFolder = !folderFilter ||
                note.folder === folderFilter ||
                (!note.folder && folderFilter === '');

            // 权限过滤
            const matchPermission = !permissionFilter ||
                note.permission === permissionFilter;

            return matchSearch && matchFolder && matchPermission;
        });

        this.renderNotesTable(filtered);
    },

    toggleNoteSelection(noteId, selected) {
        if (selected) {
            this.state.selectedNotes.add(noteId);
        } else {
            this.state.selectedNotes.delete(noteId);
        }

        // 更新行样式
        const tr = document.querySelector(`tr[data-note-id="${noteId}"]`);
        if (tr) {
            if (selected) {
                tr.classList.add('selected');
            } else {
                tr.classList.remove('selected');
            }
        }

        this.updateBatchButtons();
    },

    toggleSelectAll(checked) {
        document.querySelectorAll('.note-checkbox').forEach(checkbox => {
            checkbox.checked = checked;
            const noteId = parseInt(checkbox.dataset.id);
            this.toggleNoteSelection(noteId, checked);
        });
    },

    updateBatchButtons() {
        const selectedCount = this.state.selectedNotes.size;
        const hasSelection = selectedCount > 0;

        document.getElementById('batchDeleteBtn').disabled = !hasSelection;
        document.getElementById('batchMoveBtn').disabled = !hasSelection;
        document.getElementById('batchPermissionBtn').disabled = !hasSelection;
    },

    deleteNote(noteId) {
        if (!confirm('确定要删除这篇笔记吗？')) {
            return;
        }

        this.state.notes = this.state.notes.filter(n => n.id !== noteId);
        this.saveData();
        this.loadNotesTable();
        this.showToast('笔记已删除');
    },

    batchDelete() {
        const count = this.state.selectedNotes.size;
        if (!confirm(`确定要删除选中的 ${count} 篇笔记吗？此操作不可恢复！`)) {
            return;
        }

        this.state.notes = this.state.notes.filter(n => !this.state.selectedNotes.has(n.id));
        this.state.selectedNotes.clear();
        this.saveData();
        this.loadNotesTable();
        this.showToast(`已删除 ${count} 篇笔记`);
    },

    showBatchMoveModal() {
        document.getElementById('selectedCount').textContent = this.state.selectedNotes.size;
        this.showModal('batchMoveModal');
    },

    confirmBatchMove() {
        const targetFolder = document.getElementById('targetFolder').value || null;
        const count = this.state.selectedNotes.size;

        this.state.notes.forEach(note => {
            if (this.state.selectedNotes.has(note.id)) {
                note.folder = targetFolder;
            }
        });

        this.state.selectedNotes.clear();
        this.saveData();
        this.hideModal('batchMoveModal');
        this.loadNotesTable();
        this.showToast(`已移动 ${count} 篇笔记`);
    },

    showBatchPermissionModal() {
        document.getElementById('selectedCountPermission').textContent = this.state.selectedNotes.size;
        this.showModal('batchPermissionModal');
    },

    confirmBatchPermission() {
        const targetPermission = document.getElementById('targetPermission').value;
        const count = this.state.selectedNotes.size;

        this.state.notes.forEach(note => {
            if (this.state.selectedNotes.has(note.id)) {
                note.permission = targetPermission;
            }
        });

        this.state.selectedNotes.clear();
        this.saveData();
        this.hideModal('batchPermissionModal');
        this.loadNotesTable();
        this.showToast(`已修改 ${count} 篇笔记的权限`);
    },

    // ====================================
    // 系统设置
    // ====================================

    loadSettings() {
        // 加载当前配置到表单
        document.getElementById('settingsUsername').value = this.state.adminConfig.username;
        document.getElementById('siteTitle').value = this.state.siteConfig.title;
        document.getElementById('defaultPermission').value = this.state.siteConfig.defaultPermission;
        document.getElementById('searchHistoryLimit').value = this.state.siteConfig.searchHistoryLimit;

        // 更新存储信息
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith('knowledge_')) {
                totalSize += localStorage.getItem(key).length;
            }
        }

        const sizeInKB = (totalSize / 1024).toFixed(2);
        const notesSize = (localStorage.getItem('knowledge_notes')?.length / 1024 || 0).toFixed(2);

        document.getElementById('storageUsageInfo').textContent = sizeInKB + ' KB';
        document.getElementById('notesDataSize').textContent = notesSize + ' KB';
    },

    async updatePassword() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!newPassword) {
            this.showToast('请输入新密码', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showToast('两次输入的密码不一致', 'error');
            return;
        }

        if (newPassword.length < 6) {
            this.showToast('密码长度至少为6位', 'error');
            return;
        }

        // 使用SHA-256加密密码
        const passwordHash = await this.hashPassword(newPassword);
        this.state.adminConfig.passwordHash = passwordHash;
        this.saveConfig();

        // 清空输入框
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';

        this.showToast('密码已更新');
    },

    saveSiteConfig() {
        this.state.siteConfig.title = document.getElementById('siteTitle').value;
        this.state.siteConfig.defaultPermission = document.getElementById('defaultPermission').value;
        this.state.siteConfig.searchHistoryLimit = parseInt(document.getElementById('searchHistoryLimit').value);

        this.saveConfig();
        this.showToast('配置已保存');
    },

    clearCache() {
        if (!confirm('确定要清理缓存吗？这将清除搜索历史和临时数据。')) {
            return;
        }

        localStorage.removeItem('knowledge_search_history');
        this.showToast('缓存已清理');
    },

    resetAllData() {
        const confirmation = prompt('此操作将删除所有数据！\n请输入 "RESET" 确认：');

        if (confirmation !== 'RESET') {
            this.showToast('操作已取消', 'warning');
            return;
        }

        // 清除所有数据
        for (let key in localStorage) {
            if (key.startsWith('knowledge_')) {
                localStorage.removeItem(key);
            }
        }

        this.showToast('所有数据已重置', 'success');
        setTimeout(() => {
            window.location.href = 'knowledge.html';
        }, 1500);
    },

    // ====================================
    // 数据备份与恢复
    // ====================================

    loadBackupInfo() {
        const lastBackup = localStorage.getItem('knowledge_last_backup');
        if (lastBackup) {
            const date = new Date(parseInt(lastBackup));
            document.getElementById('lastBackupTime').textContent = date.toLocaleString('zh-CN');

            const daysAgo = Math.floor((Date.now() - parseInt(lastBackup)) / (1000 * 60 * 60 * 24));
            document.getElementById('backupDaysAgo').textContent = daysAgo + ' 天前';

            if (daysAgo > 7) {
                document.getElementById('backupDaysAgo').style.color = 'var(--admin-danger)';
            }
        } else {
            document.getElementById('lastBackupTime').textContent = '从未备份';
            document.getElementById('backupDaysAgo').textContent = '-';
        }
    },

    exportJson() {
        const scope = document.getElementById('exportScope')?.value || 'all';
        const folderFilter = document.getElementById('exportFolder')?.value;

        let data = {
            version: '2.1.0',
            exportDate: new Date().toISOString(),
            notes: [],
            folders: [],
            config: {}
        };

        switch (scope) {
            case 'all':
                data.notes = folderFilter ?
                    this.state.notes.filter(n => n.folder === folderFilter) :
                    this.state.notes;
                data.folders = this.state.folders;
                data.config = this.state.siteConfig;
                break;
            case 'notes':
                data.notes = folderFilter ?
                    this.state.notes.filter(n => n.folder === folderFilter) :
                    this.state.notes;
                break;
            case 'folders':
                data.folders = this.state.folders;
                break;
        }

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('数据已导出');
    },

    exportMarkdown() {
        const folderFilter = document.getElementById('exportFolder')?.value;
        const notes = folderFilter ?
            this.state.notes.filter(n => n.folder === folderFilter) :
            this.state.notes;

        if (notes.length === 0) {
            this.showToast('没有可导出的笔记', 'warning');
            return;
        }

        // 创建一个大的Markdown文件
        let markdown = '# AI知识库导出\n\n';
        markdown += `导出时间：${new Date().toLocaleString('zh-CN')}\n`;
        markdown += `笔记数量：${notes.length}\n\n`;
        markdown += '---\n\n';

        notes.forEach((note, index) => {
            markdown += `## ${index + 1}. ${note.title}\n\n`;
            markdown += `**文件夹**：${note.folder || '未分类'}  \n`;
            markdown += `**权限**：${note.permission === 'public' ? '公开' : '私密'}  \n`;
            markdown += `**日期**：${note.date}  \n\n`;
            markdown += note.content;
            markdown += '\n\n---\n\n';
        });

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge-export-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);

        this.showToast('Markdown文件已导出');
    },

    handleFileSelect(file) {
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            this.showToast('请选择JSON文件', 'error');
            return;
        }

        this.selectedFile = file;
        document.getElementById('fileUploadArea').innerHTML = `
            <i class="fas fa-check-circle" style="color: var(--admin-success);"></i>
            <p>已选择：${file.name}</p>
        `;
        document.getElementById('importDataBtn').disabled = false;
    },

    importData() {
        if (!this.selectedFile) {
            this.showToast('请先选择文件', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const mode = document.getElementById('importMode').value;

                if (mode === 'replace') {
                    if (!confirm('覆盖模式将删除所有现有数据！确定继续吗？')) {
                        return;
                    }
                    this.state.notes = data.notes || [];
                    this.state.folders = data.folders || [];
                } else {
                    // 合并模式
                    const existingIds = new Set(this.state.notes.map(n => n.id));
                    const newNotes = (data.notes || []).filter(n => !existingIds.has(n.id));
                    this.state.notes = [...this.state.notes, ...newNotes];

                    const existingFolders = new Set(this.state.folders);
                    const newFolders = (data.folders || []).filter(f => !existingFolders.has(f));
                    this.state.folders = [...this.state.folders, ...newFolders];
                }

                this.saveData();
                this.loadNotesTable();
                this.showToast('数据导入成功');

                // 重置文件选择
                this.selectedFile = null;
                document.getElementById('fileUploadArea').innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>点击或拖拽JSON文件到此处</p>
                `;
                document.getElementById('importDataBtn').disabled = true;
                document.getElementById('importFileInput').value = '';
            } catch (error) {
                this.showToast('JSON文件格式错误', 'error');
            }
        };

        reader.readAsText(this.selectedFile);
    },

    updateLastBackupTime() {
        localStorage.setItem('knowledge_last_backup', Date.now().toString());
        this.loadBackupInfo();
    },

    // ====================================
    // 工具函数
    // ====================================

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    },

    hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    },

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
    AdminApp.init();
});
