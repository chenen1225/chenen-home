// 导航栏滚动高亮
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-blue-600', 'border-blue-600');
                    link.classList.add('text-slate-600', 'border-transparent');
                    
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.remove('text-slate-600', 'border-transparent');
                        link.classList.add('text-blue-600', 'border-blue-600');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // 滚动动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Mermaid 双主题动态渲染逻辑
    const mermaidNodes = document.querySelectorAll('.mermaid');
    mermaidNodes.forEach((node, index) => {
        node.dataset.originalCode = node.textContent || node.innerText;
    });

    function renderMermaid(isDark) {
        if (typeof mermaid === 'undefined') return;

        const themeVars = isDark ? {
            primaryColor: '#3b82f6',
            primaryTextColor: '#f8fafc',
            primaryBorderColor: '#2563eb',
            lineColor: '#94a3b8',
            secondaryColor: '#06b6d4',
            tertiaryColor: '#a855f7',
            background: '#1e293b',
            mainBkg: '#0f172a',
            nodeBorder: '#3b82f6',
            clusterBkg: '#0f172a',
            clusterBorder: '#1e293b',
            titleColor: '#ffffff',
            edgeLabelBackground: '#1e293b',
            fontSize: '14px'
        } : {
            primaryColor: '#2563EB',
            primaryTextColor: '#FFFFFF',
            primaryBorderColor: '#1D4ED8',
            lineColor: '#475569',
            secondaryColor: '#06B6D4',
            tertiaryColor: '#7C3AED',
            background: '#FFFFFF',
            mainBkg: '#2563EB',
            nodeBorder: '#1D4ED8',
            clusterBkg: '#F8FAFC',
            clusterBorder: '#E2E8F0',
            titleColor: '#0F172A',
            edgeLabelBackground: '#FFFFFF',
            fontSize: '14px'
        };

        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: themeVars,
            flowchart: {
                curve: 'basis',
                padding: 12
            },
            mindmap: {
                padding: 12,
                useMaxWidth: true
            }
        });

        const darkNodeStyles = [
            'style A fill:#1e293b,stroke:#475569,color:#f8fafc',
            'style B fill:#1e3a8a,stroke:#3b82f6,color:#bfdbfe',
            'style C fill:#312e81,stroke:#6366f1,color:#c7d2fe',
            'style D fill:#831843,stroke:#ec4899,color:#fbcfe8',
            'style E fill:#78350f,stroke:#f59e0b,color:#fde68a',
            'style F fill:#064e3b,stroke:#10b981,color:#a7f3d0',
            'style G fill:#0f172a,stroke:#334155,color:#f8fafc'
        ];
        const lightNodeStyles = [
            'style A fill:#f1f5f9,stroke:#94a3b8,color:#0f172a',
            'style B fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a',
            'style C fill:#e0e7ff,stroke:#6366f1,color:#312e81',
            'style D fill:#fce7f3,stroke:#ec4899,color:#831843',
            'style E fill:#fef3c7,stroke:#f59e0b,color:#78350f',
            'style F fill:#d1fae5,stroke:#10b981,color:#064e3b',
            'style G fill:#e2e8f0,stroke:#64748b,color:#0f172a'
        ];

        mermaidNodes.forEach((node) => {
            let code = node.dataset.originalCode;
            // 先清除所有可能的节点样式（深色+浅色），再注入当前主题样式
            const allStyles = [...darkNodeStyles, ...lightNodeStyles];
            allStyles.forEach((s) => {
                const idx = code.indexOf(s);
                if (idx !== -1) {
                    code = code.substring(0, idx) + code.substring(idx + s.length);
                }
            });
            const newStyles = isDark ? darkNodeStyles : lightNodeStyles;
            // 在 flowchart TD 后插入节点样式
            const insertPos = code.indexOf('flowchart TD');
            if (insertPos !== -1) {
                const prefix = code.substring(0, insertPos + 'flowchart TD'.length);
                const suffix = code.substring(insertPos + 'flowchart TD'.length);
                code = prefix + '\n' + newStyles.join('\n') + suffix;
            }
            node.innerHTML = code;
            node.removeAttribute('data-processed');
        });

        mermaid.init(undefined, '.mermaid');
    }

    // 首次渲染 Mermaid
    const initialIsDark = document.documentElement.classList.contains('dark');
    renderMermaid(initialIsDark);

    // 主题切换按钮事件监听器
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            renderMermaid(isDark);
        });
    }

    // 监听系统主题偏好变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.theme) {
            const isDark = e.matches;
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            renderMermaid(isDark);
        }
    });
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});