// Main JavaScript for Hydraulic Platform Website
class HydraulicPlatformApp {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
        this.renderContent();
        this.setupSecurity();
        this.initializeAnimations();
        this.setupPerformanceOptimizations();
    }

    // Theme Management
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        // Add a nice transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Event Listeners
    setupEventListeners() {
        // Dark mode toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Handle button clicks with analytics
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="tel:"], a[href^="https://wa.me"]')) {
                this.trackInteraction(e.target.href.includes('wa.me') ? 'whatsapp' : 'call');
            }
        });

        // Intersection Observer for animations
        this.setupIntersectionObserver();
    }

    // Content Rendering
    renderContent() {
        this.renderSiteInfo();
        this.renderFeatures();
        this.renderServices();
        this.updateContactInfo();
    }

    renderSiteInfo() {
        const elements = {
            siteTitle: document.getElementById('siteTitle'),
            siteSubtitle: document.getElementById('siteSubtitle'),
            siteDescription: document.getElementById('siteDescription'),
            footerTitle: document.getElementById('footerTitle')
        };

        if (elements.siteTitle) elements.siteTitle.textContent = siteData.site.title;
        if (elements.siteSubtitle) elements.siteSubtitle.textContent = siteData.site.subtitle;
        if (elements.siteDescription) elements.siteDescription.textContent = siteData.site.description;
        if (elements.footerTitle) elements.footerTitle.textContent = siteData.site.title;
    }

    renderFeatures() {
        const featuresGrid = document.getElementById('featuresGrid');
        if (!featuresGrid) return;

        featuresGrid.innerHTML = siteData.features.map((feature, index) => `
            <div class="feature-card" style="animation-delay: ${index * 0.1}s">
                <span class="feature-icon">${feature.icon}</span>
                <h4 class="feature-title">${feature.title}</h4>
                <p class="feature-description">${feature.description}</p>
            </div>
        `).join('');
    }

    renderServices() {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) return;

        const activeServices = siteData.services.filter(service => service.active);
        
        servicesGrid.innerHTML = activeServices.map((service, index) => `
            <div class="service-card" style="animation-delay: ${index * 0.15}s">
                <span class="service-icon">${service.icon}</span>
                <h3 class="service-title">${service.title}</h3>
                <p class="service-description">${service.description}</p>
            </div>
        `).join('');
    }

    updateContactInfo() {
        const elements = {
            workingHours: document.getElementById('workingHours'),
            address: document.getElementById('address'),
            callBtn: document.getElementById('callBtn'),
            whatsappBtn: document.getElementById('whatsappBtn')
        };

        if (elements.workingHours) elements.workingHours.textContent = siteData.site.workingHours;
        if (elements.address) elements.address.textContent = siteData.site.address;
        
        if (elements.callBtn) {
            elements.callBtn.href = `tel:${siteData.site.phone}`;
        }
        
        if (elements.whatsappBtn) {
            const whatsappNumber = siteData.site.whatsapp.replace(/[^0-9]/g, '');
            elements.whatsappBtn.href = `https://wa.me/${whatsappNumber}`;
        }

        // Update floating buttons
        const floatingButtons = document.querySelectorAll('.floating-btn');
        floatingButtons.forEach(btn => {
            if (btn.href.includes('wa.me')) {
                const whatsappNumber = siteData.site.whatsapp.replace(/[^0-9]/g, '');
                btn.href = `https://wa.me/${whatsappNumber}`;
            } else if (btn.href.includes('tel:')) {
                btn.href = `tel:${siteData.site.phone}`;
            }
        });
    }

    // Security Features
    setupSecurity() {
        // Disable right-click context menu
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Disable text selection
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });

        // Disable drag
        document.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // Disable developer tools shortcuts
        document.addEventListener('keydown', (e) => {
            // F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+J
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
                (e.ctrlKey && e.key.toLowerCase() === 'u')
            ) {
                e.preventDefault();
                this.showSecurityWarning();
            }
        });

        // Console protection
        this.protectConsole();
    }

    showSecurityWarning() {
        // Create temporary warning
        const warning = document.createElement('div');
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 10000;
            font-family: Cairo, sans-serif;
            direction: rtl;
            box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
        `;
        warning.textContent = 'تحذير أمني: هذا الإجراء محظور';
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
    }

    protectConsole() {
        // Console warning
        const warningStyle = 'font-size: 24px; color: #ef4444; font-weight: bold;';
        const infoStyle = 'font-size: 16px; color: #6b7280;';
        
        console.clear();
        console.log('%cتحذير أمني!', warningStyle);
        console.log('%cهذه منطقة للمطورين. إذا طلب منك أحد نسخ/لصق شيء هنا، فمن المحتمل أن يكون محتالاً.', infoStyle);
        console.log('%cإذا كنت مطوراً وتعرف ما تفعله، فأهلاً بك!', 'color: #10b981;');
    }

    // Animations
    initializeAnimations() {
        // Add entrance animations to elements
        const animatedElements = document.querySelectorAll('.service-card, .feature-card');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-float');
                }
            });
        }, {
            threshold: 0.1
        });

        // Observe floating buttons
        document.querySelectorAll('.floating-btn').forEach(btn => {
            observer.observe(btn);
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Battery saving mode
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                if (battery.level < 0.2 && !battery.charging) {
                    this.enableBatterySaveMode();
                }
                
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2 && !battery.charging) {
                        this.enableBatterySaveMode();
                    }
                });
            });
        }

        // Reduce motion if preferred
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--animation-duration', '0ms');
        }

        // Time-based theme switching
        this.setupTimeBasedTheming();
    }

    enableBatterySaveMode() {
        document.body.classList.add('battery-save-mode');
        
        // Disable animations
        const style = document.createElement('style');
        style.textContent = `
            .battery-save-mode *,
            .battery-save-mode *::before,
            .battery-save-mode *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    setupTimeBasedTheming() {
        const hour = new Date().getHours();
        const isNightTime = hour < 6 || hour > 20;
        
        if (isNightTime && this.currentTheme === 'light') {
            // Suggest dark mode at night
            setTimeout(() => {
                this.showThemeSwitch();
            }, 5000);
        }
    }

    showThemeSwitch() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 120px;
            right: 20px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            font-family: Cairo, sans-serif;
            direction: rtl;
            backdrop-filter: blur(10px);
            max-width: 250px;
            box-shadow: 0 4px 20px var(--shadow-color);
        `;
        
        notification.innerHTML = `
            <p style="margin: 0 0 10px 0; font-size: 14px;">يبدو أن الوقت ليلاً. هل تريد التبديل للوضع المظلم؟</p>
            <button onclick="app.toggleTheme(); this.parentElement.remove();" 
                style="background: var(--btn-primary); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-left: 5px;">
                نعم
            </button>
            <button onclick="this.parentElement.remove();" 
                style="background: var(--bg-secondary); color: var(--text-primary); border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                لا
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 10000);
    }

    // Analytics and Tracking
    trackInteraction(type) {
        // Simple interaction tracking
        const timestamp = new Date().toISOString();
        const interaction = {
            type,
            timestamp,
            userAgent: navigator.userAgent,
            theme: this.currentTheme
        };
        
        // Store in localStorage for basic analytics
        const interactions = JSON.parse(localStorage.getItem('interactions') || '[]');
        interactions.push(interaction);
        
        // Keep only last 100 interactions
        if (interactions.length > 100) {
            interactions.splice(0, interactions.length - 100);
        }
        
        localStorage.setItem('interactions', JSON.stringify(interactions));
        
        console.log(`Interaction tracked: ${type}`);
    }

    // PWA Installation Prompt
    setupPWAInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install prompt after 10 seconds
            setTimeout(() => {
                this.showInstallPrompt(deferredPrompt);
            }, 10000);
        });
    }

    showInstallPrompt(deferredPrompt) {
        if (!deferredPrompt || window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        const installPrompt = document.createElement('div');
        installPrompt.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            padding: 1rem;
            border-radius: 8px;
            z-index: 1000;
            font-family: Cairo, sans-serif;
            direction: rtl;
            backdrop-filter: blur(10px);
            text-align: center;
            box-shadow: 0 4px 20px var(--shadow-color);
        `;
        
        installPrompt.innerHTML = `
            <p style="margin: 0 0 15px 0;">هل تريد تثبيت التطبيق على جهازك للوصول السريع؟</p>
            <button id="installBtn" style="background: var(--btn-primary); color: white; border: none; padding: 8px 16px; border-radius: 4px; margin: 0 5px; cursor: pointer;">
                تثبيت
            </button>
            <button id="dismissBtn" style="background: var(--bg-secondary); color: var(--text-primary); border: none; padding: 8px 16px; border-radius: 4px; margin: 0 5px; cursor: pointer;">
                لاحقاً
            </button>
        `;
        
        document.body.appendChild(installPrompt);
        
        document.getElementById('installBtn').addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((result) => {
                deferredPrompt = null;
                installPrompt.remove();
            });
        });
        
        document.getElementById('dismissBtn').addEventListener('click', () => {
            installPrompt.remove();
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new HydraulicPlatformApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing non-essential operations');
    } else {
        console.log('Page visible - resuming operations');
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});