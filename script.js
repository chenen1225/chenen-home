/**
 * 陈恩个人主页 - JavaScript文件
 * 包含所有功能：配置、动画、工具函数等
 */

// 配置文件
const CONFIG = {
  // 基本信息
  basic: {
    name: "陈恩",
    title: "AI 知识分享",
    location: "中国，长沙",
    avatar: "./assets/images/chenen_logo.jpg",
  },

  // 联系方式
  contact: {
    wechat: "./assets/images/Wechat.png",
    publicAccount: "./assets/images/gzh.jpg",
    contactText: "欢迎添加个人社交媒体互相学习！",
    github: "https://github.com/chenen1225",
    bilibili: "https://space.bilibili.com/428143691"
  },

  // 关于我部分
  about: {
    content: "AI浪潮中，我筑起文字驿站——用体温镌刻智能纪元的情书。这里寄存碳基文明的诗意，流淌算法难摹的感性光谱。每篇都是时光胶囊，寄给十年后的我与此刻的你。若途经此窗，请饮茶小坐。以汉字为舟，共溯转瞬即逝的心跳。"
  },





  // 个人产品
  products: {
    comingSoon: true,
    productsList: []
  },

  // 版权信息
  copyright: {
    year: "2021 - 2025",
    name: "陈恩",
    url: "https://chenen.club"
  },

  // 主题颜色
  theme: {
    primary: "#3b82f6",
    primaryLight: "#60a5fa",
    primaryDark: "#2563eb",
    background: "#f9fafb",
    cardBackground: "#ffffff",
    text: "#1f2937",
    textLight: "#6b7280",
    accentGreen: "#10b981",
    accentPurple: "#8b5cf6",
    accentOrange: "#f59e0b"
  }
};

// 工具函数
function debounce(func, wait, immediate = false) {
    let timeout;
    return function(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent);
    const isDesktop = !isMobile && !isTablet;

    return { isMobile, isTablet, isDesktop };
}

function copyToClipboard(text) {
    return new Promise((resolve, reject) => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => resolve(true))
                .catch(err => reject(err));
        } else {
            try {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                resolve(true);
            } catch (err) {
                reject(err);
            }
        }
    });
}

// 配置应用函数
function applyConfig() {
    try {
        console.log('开始应用配置...');

        // 应用基本信息
        applyBasicInfo();

        // 应用联系方式
        applyContactInfo();

        // 应用关于我内容
        applyAboutInfo();

        // 应用版权信息
        applyCopyrightInfo();

        // 应用个人产品部分
        applyProductsInfo();

        // 应用主题颜色
        applyTheme();

        console.log('配置已成功应用');
    } catch (error) {
        console.error('应用配置时出错:', error);
    }
}

function applyBasicInfo() {
    if (!CONFIG.basic) return;

    const nameElement = document.querySelector('.profile h1');
    if (nameElement) nameElement.textContent = CONFIG.basic.name || '陈恩';

    const titleElement = document.querySelector('.profile .title');
    if (titleElement) {
        titleElement.innerHTML = `<i class="fas fa-code"></i>${CONFIG.basic.title || 'AI 知识分享'}`;
    }

    const locationElement = document.querySelector('.location span');
    if (locationElement) locationElement.textContent = CONFIG.basic.location || '中国，长沙';

    const avatarElement = document.querySelector('.avatar img');
    if (avatarElement) avatarElement.src = CONFIG.basic.avatar || './assets/images/chenen_logo.jpg';
}

function applyContactInfo() {
    if (!CONFIG.contact) return;

    const contactTextElement = document.querySelector('.contact-text p');
    if (contactTextElement) contactTextElement.textContent = CONFIG.contact.contactText || '欢迎添加个人社交媒体互相学习！';
}

function applyAboutInfo() {
    if (!CONFIG.about) return;

    const aboutContentElement = document.querySelector('.about-widget .widget-content p');
    if (aboutContentElement) aboutContentElement.textContent = CONFIG.about.content;
}




function applyCopyrightInfo() {
    if (!CONFIG.copyright) return;

    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        copyrightElement.innerHTML = `
            <span class="year">${CONFIG.copyright.year}</span> ©
            <a href="${CONFIG.copyright.url}" target="_blank">
                <span class="name">${CONFIG.copyright.name}</span>
            </a>
        `;
    }
}

function applyProductsInfo() {
    if (!CONFIG.products) return;

    const productsContainer = document.querySelector('.products-widget .widget-content');
    if (!productsContainer) return;

    if (CONFIG.products.comingSoon) {
        productsContainer.innerHTML = `
            <div class="coming-soon">
                <div class="coming-soon-icon">
                    <i class="fas fa-hourglass-half"></i>
                </div>
                <div class="coming-soon-text">
                    <p>静待...</p>
                </div>
            </div>
        `;
    }
}

function applyTheme() {
    if (!CONFIG.theme) return;

    const root = document.documentElement;
    for (const [key, value] of Object.entries(CONFIG.theme)) {
        const cssVarName = '--' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(cssVarName, value);
    }
}

// 动画和交互功能
function setupLoadingAnimation() {
    window.addEventListener('load', () => {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    });
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    function initFadeInElements() {
        const elements = document.querySelectorAll('.card, .widget-container');
        if (elements.length > 0) {
            elements.forEach(el => {
                el.classList.add('fade-in');
                observer.observe(el);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFadeInElements);
    } else {
        initFadeInElements();
    }
}

function setupProgressBar() {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        // 使用节流优化滚动性能
        const throttledScrollHandler = debounce(() => {
            try {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                if (height > 0) {
                    const scrolled = (winScroll / height) * 100;
                    progressBar.style.width = Math.min(100, Math.max(0, scrolled)) + '%';
                }
            } catch (error) {
                console.error('滚动进度条处理错误:', error);
            }
        }, 16); // 约60fps的更新频率

        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    }
}

function setupModalAnimations() {
    const modal = document.getElementById('social-modal');
    const btn = document.querySelector('.subscribe-btn');
    const closeBtn = modal && modal.querySelector('.close');

    if (btn && modal && closeBtn) {
        btn.onclick = function() {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 10);
        }

        closeBtn.onclick = function() {
            closeModal();
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }

        function closeModal() {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

function addHoverEffects() {
    try {
        // 为社交链接添加触摸反馈（移动端）
        document.querySelectorAll('.social-link').forEach(link => {
            link.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });

            link.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.classList.remove('touch-active');
                }, 150);
            }, { passive: true });
        });
    } catch (error) {
        console.error('添加交互效果错误:', error);
    }
}

function addMouseFollowEffect() {
    // 检测设备类型和屏幕尺寸，仅在桌面端启用
    const deviceInfo = detectDevice();
    const isDesktop = window.innerWidth >= 768 && !deviceInfo.isMobile && !deviceInfo.isTablet;

    if (!isDesktop) {
        return;
    }

    // 检查是否支持精确悬停
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) {
        return;
    }

    let cursorPool = []; // 光标元素池
    const maxPoolSize = 5; // 减少池大小
    const throttleDelay = 100; // 增加节流延迟

    // 预创建光标元素池
    function createCursorPool() {
        for (let i = 0; i < maxPoolSize; i++) {
            const cursor = document.createElement('div');
            cursor.className = 'cursor';
            cursor.style.display = 'none';
            document.body.appendChild(cursor);
            cursorPool.push(cursor);
        }
    }

    // 获取可用的光标元素
    function getCursor() {
        return cursorPool.find(cursor => cursor.style.display === 'none') || null;
    }

    // 回收光标元素
    function recycleCursor(cursor) {
        cursor.style.display = 'none';
        cursor.style.animation = 'none';
    }

    // 节流的鼠标移动处理函数
    const throttledMouseMove = debounce((e) => {
        const cursor = getCursor();
        if (!cursor) return;

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.display = 'block';
        cursor.style.animation = 'fadeOut 1s forwards';

        setTimeout(() => {
            recycleCursor(cursor);
        }, 1000);
    }, throttleDelay);

    // 初始化光标池
    createCursorPool();

    // 添加事件监听器
    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
}



// 微信复制功能
function setupWechatCopy() {
    const copyWechatBtn = document.getElementById('copy-wechat');
    if (copyWechatBtn) {
        copyWechatBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const wechatId = 'museaction';

            if (navigator.vibrate) {
                navigator.vibrate(50);
            }

            copyToClipboard(wechatId)
                .then(() => {
                    showCopySuccess(this);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    showManualCopyTip(wechatId);
                });
        });
    }
}

// 公众号二维码显示功能
function setupPublicAccountQR() {
    const publicAccountBtn = document.getElementById('show-public-account');
    if (publicAccountBtn) {
        publicAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // 创建二维码显示弹窗
            const qrModal = document.createElement('div');
            qrModal.className = 'modal qr-modal';
            qrModal.style.display = 'flex';
            qrModal.innerHTML = `
                <div class="modal-content qr-modal-content">
                    <span class="close qr-close">
                        <i class="fas fa-times"></i>
                    </span>
                    <div class="modal-header">
                        <i class="fas fa-rss"></i>
                        <h3>公众号二维码</h3>
                    </div>
                    <div class="qr-container">
                        <img src="${CONFIG.contact.publicAccount}" alt="公众号二维码" class="qr-image">
                        <p class="qr-text">扫码关注「我是陈恩」</p>
                    </div>
                </div>
            `;

            document.body.appendChild(qrModal);

            // 添加动画效果
            setTimeout(() => {
                qrModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 10);

            // 关闭功能
            const closeBtn = qrModal.querySelector('.qr-close');
            closeBtn.onclick = function() {
                closeQRModal();
            };

            qrModal.onclick = function(event) {
                if (event.target === qrModal) {
                    closeQRModal();
                }
            };

            function closeQRModal() {
                qrModal.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(qrModal);
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }
}

function showCopySuccess(element) {
    element.classList.add('copy-active');
    setTimeout(() => {
        element.classList.remove('copy-active');
    }, 300);

    const socialArrow = element.querySelector('.social-arrow');
    if (socialArrow) {
        socialArrow.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => {
            socialArrow.innerHTML = '<i class="fas fa-copy"></i>';
        }, 2000);
    }

    const toast = document.getElementById('toast-message');
    if (toast) {
        if (window.toastTimeout) {
            clearTimeout(window.toastTimeout);
        }

        toast.classList.add('show');
        window.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function showManualCopyTip(text) {
    alert(`请手动复制以下微信号: ${text}`);
}

// 性能优化函数
function optimizePerformance() {
    // 检测设备性能
    const deviceInfo = detectDevice();
    const isLowPerformance = deviceInfo.isMobile || deviceInfo.isTablet || window.innerWidth < 768;

    if (isLowPerformance) {
        // 移动端性能优化
        document.body.classList.add('low-performance');

        // 禁用复杂动画
        const style = document.createElement('style');
        style.textContent = `
            .low-performance * {
                animation-duration: 0.01ms !important;
                animation-delay: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
            .low-performance .card,
            .low-performance .avatar:before,
            .low-performance body {
                animation: none !important;
            }
        `;
        document.head.appendChild(style);

        // 减少DOM操作
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.willChange = 'auto';
                } else {
                    entry.target.style.willChange = 'auto';
                }
            });
        });

        document.querySelectorAll('.card, .widget').forEach(el => {
            observer.observe(el);
        });
    }
}

// 初始化所有功能
function initAnimations() {
    optimizePerformance();
    setupLoadingAnimation();
    setupScrollAnimations();
    setupProgressBar();
    setupModalAnimations();
    addHoverEffects();
    addMouseFollowEffect();
}

// 主初始化函数
function init() {
    try {
        console.log('脚本开始加载...');

        const deviceInfo = detectDevice();
        console.log('设备信息:', deviceInfo);

        // 应用配置
        applyConfig();

        // 初始化动画和交互
        initAnimations();

        // 设置微信复制功能
        setupWechatCopy();

        // 设置公众号二维码功能
        setupPublicAccountQR();

        console.log('初始化完成');
    } catch (error) {
        console.error('初始化过程中出错:', error);
    }
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 优化加载体验
    setTimeout(function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(function() {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 500);

    // 初始化页面滚动监听
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        const scrollPercentage = (scrollPosition / (documentHeight - windowHeight)) * 100;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${scrollPercentage}%`;
        }
    });

    // 初始化主要功能
    init();
});

// 确保在页面完全加载后也执行一次初始化
window.addEventListener('load', function() {
    // 再次确保配置已应用
    applyConfig();
});
