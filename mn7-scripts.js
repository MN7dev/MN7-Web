
// Loading Screen
window.addEventListener('load', () => {
   const minLoadTime = 100; // حداقل ۲ ثانیه
   const startTime = performance.now();
   
   setTimeout(() => {
      const elapsed = performance.now() - startTime;
      const remaining = Math.max(0, minLoadTime - elapsed);
      setTimeout(() => {
         document.getElementById('loadingScreen').classList.add('hidden');
      }, remaining);
   }, 0);
});

// Menu Item Click Handler
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const menuGrid = document.getElementById('menuGrid');
const mainHeader = document.getElementById('mainHeader');
const mainFooter = document.getElementById('mainFooter');
let isTransitioning = false;

menuItems.forEach(item => {
   item.addEventListener('click', () => {
      if (isTransitioning) return;

      const sectionId = item.dataset.section;

      // اگه بخش بلاگ بود، modal «به‌زودی» نشون بده
      if (sectionId === 'testimonials') {
         openComingSoon();
         return;
      }

      showSection(sectionId);
   });
});

function showSection(sectionId) {
   isTransitioning = true;

   // First, ensure all menu items are in visible state before transitioning
   menuItems.forEach((item) => {
      // Remove initial-load class
      item.classList.remove('initial-load');

      // Set to visible state explicitly
      item.style.opacity = '1';
      item.style.transform = 'translateY(0) scale(1)';
      item.style.animation = 'none';
   });

   // Force reflow to apply the visible state
   void menuGrid.offsetWidth;

   // Now apply staggered fade out transition
   menuItems.forEach((item, index) => {
      setTimeout(() => {
         item.style.transition = 'all 0.4s ease-out';
         item.style.opacity = '0';
         item.style.transform = 'translateY(40px) scale(0.9)';
      }, index * 50);
   });

   // Hide header and footer
   mainHeader.style.animation = 'none';
   mainHeader.style.opacity = '1';
   mainFooter.style.animation = 'none';
   mainFooter.style.opacity = '1';

   void mainHeader.offsetWidth;

   mainHeader.style.transition = 'opacity 0.4s ease';
   mainHeader.style.opacity = '0';
   mainFooter.style.transition = 'opacity 0.4s ease';
   mainFooter.style.opacity = '0';

   // Show content section after menu animation
   setTimeout(() => {
      menuGrid.style.display = 'none';
      mainHeader.style.display = 'none';
      mainFooter.style.display = 'none';

      // Reset menu item styles for next time
      menuItems.forEach(item => {
         item.style.transition = '';
         item.style.opacity = '';
         item.style.transform = '';
         item.classList.remove('exit-up', 'visible');
      });

      const section = document.getElementById(sectionId);
      section.classList.add('active');

      // Animate stats if introduction section
      if (sectionId === 'introduction') {
         setTimeout(animateStats, 500);
      }

      isTransitioning = false;
   }, 550);
}

function backToMenu() {
   if (isTransitioning) return;
   isTransitioning = true;

   const activeSection = document.querySelector('.content-section.active');
   if (activeSection) {
      // Get fixed elements that need to fade out
      const sectionHeaderSmall = activeSection.querySelector('.section-header-small');
      const backBtn = activeSection.querySelector('.back-btn');

      // Step 1: Cancel the forwards animation so we can control opacity
      activeSection.style.animation = 'none';
      activeSection.style.opacity = '1'; // Reset to visible state first

      // Force reflow to apply the animation cancel
      void activeSection.offsetWidth;

      // Step 2: Now apply fade out transition to ALL elements
      activeSection.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      activeSection.style.opacity = '0';
      activeSection.style.transform = 'translateY(-20px)';

      if (sectionHeaderSmall) {
         sectionHeaderSmall.style.transition = 'opacity 0.5s ease';
         sectionHeaderSmall.style.opacity = '0';
      }
      if (backBtn) {
         backBtn.style.transition = 'opacity 0.5s ease';
         backBtn.style.opacity = '0';
      }

      // Step 3: Wait for complete fade out
      setTimeout(() => {
         // Hide section completely
         activeSection.classList.remove('active');
         activeSection.style.animation = '';
         activeSection.style.opacity = '';
         activeSection.style.transform = '';
         activeSection.style.transition = '';

         if (sectionHeaderSmall) {
            sectionHeaderSmall.style.opacity = '';
            sectionHeaderSmall.style.transition = '';
         }
         if (backBtn) {
            backBtn.style.opacity = '';
            backBtn.style.transition = '';
         }

         // Step 4: Prepare menu elements (hidden initially)
         menuGrid.style.display = 'grid';
         mainHeader.style.display = 'block';
         mainFooter.style.display = 'block';

         // Cancel CSS animations to prevent re-triggering
         mainHeader.style.animation = 'none';
         mainFooter.style.animation = 'none';

         mainHeader.style.opacity = '0';
         mainHeader.style.transform = 'translateY(20px)';
         mainFooter.style.opacity = '0';

         menuItems.forEach(item => {
            item.classList.remove('exit-up', 'initial-load', 'return', 'visible');
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px) scale(0.9)';
         });

         // Step 5: Brief pause then fade in menu
         setTimeout(() => {
            // Fade in header
            mainHeader.style.transition = 'all 0.5s ease';
            mainHeader.style.opacity = '1';
            mainHeader.style.transform = 'translateY(0)';

            // Fade in footer
            mainFooter.style.transition = 'all 0.5s ease';
            mainFooter.style.opacity = '1';

            // Staggered fade in for menu items
            menuItems.forEach((item, index) => {
               setTimeout(() => {
                  item.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                  item.style.opacity = '1';
                  item.style.transform = 'translateY(0) scale(1)';
               }, index * 80);
            });

            // Step 6: Clean up after all animations complete
            setTimeout(() => {
               mainHeader.style.transition = '';
               mainHeader.style.transform = '';
               mainFooter.style.transition = '';

               menuItems.forEach(item => {
                  item.style.transition = '';
                  item.style.opacity = '';
                  item.style.transform = '';
                  item.classList.add('visible');
               });

               isTransitioning = false;
            }, 600);
         }, 150);
      }, 550);
   }
}

// Animate Stats
function animateStats() {
   const metricValues = document.querySelectorAll('.metric-value[data-target]');
   metricValues.forEach((el, index) => {
      setTimeout(() => {
         const target = parseInt(el.dataset.target);
         let current = 0;
         const increment = target / 40;
         const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
               current = target;
               clearInterval(timer);
            }
            el.textContent = Math.floor(current);
         }, 30);
      }, index * 200);
   });
}

// Tab Switching
function switchTab(btn, tabId) {
   document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
   document.getElementById(tabId).classList.add('active');
}

// Gallery Filter
function filterGallery(category, btn) {
   document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
   btn.classList.add('active');

   const items = document.querySelectorAll('.gallery-item');
   items.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
         item.style.display = 'block';
         item.style.animation = 'tabFade 0.4s ease-out';
      } else {
         item.style.display = 'none';
      }
   });
}

// Tech Marquee - کپی خودکار برای حرکت پیوسته
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.tech-track');
    if (track) {
        // کپی کل محتوا (برای حرکت بی‌وقفه)
        const content = track.innerHTML;
        track.innerHTML = content + content;
    }
});


// ===== Coming Soon برای بخش بلاگ =====
// document.addEventListener('DOMContentLoaded', () => {
//     const blogMenuItem = document.querySelector('.menu-item[data-section="testimonials"]');
    
//     if (blogMenuItem) {
//         // حذف event listener قبلی با کلون کردن
//         const newBlogItem = blogMenuItem.cloneNode(true);
//         blogMenuItem.parentNode.replaceChild(newBlogItem, blogMenuItem);
        
//         // اضافه کردن listener جدید
//         newBlogItem.addEventListener('click', (e) => {
//             e.preventDefault();
//             e.stopPropagation();
//             openComingSoon();
//         });
//     }
// });

function openComingSoon() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeComingSoon() {
    const modal = document.getElementById('comingSoonModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// بستن با کلیک بیرون modal
document.addEventListener('click', (e) => {
    const modal = document.getElementById('comingSoonModal');
    if (modal && e.target === modal) {
        closeComingSoon();
    }
});

// بستن با دکمه Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeComingSoon();
    }
});

// تابع واسط برای رفتن از یک سکشن به سکشن دیگه
function navigateToSection(sectionId) {
    if (isTransitioning) return;
    
    const activeSection = document.querySelector('.content-section.active');
    
    if (activeSection) {
        // توی سکشنی هستیم → اول برگرد به منو
        backToMenu();
        
        const checkInterval = setInterval(() => {
            if (!isTransitioning && !document.querySelector('.content-section.active')) {
                clearInterval(checkInterval);
                showSection(sectionId);
            }
        }, 100);
    } else {
        // توی منو هستیم → مستقیم برو
        showSection(sectionId);
    }
}


// ===== نمایش خطای ارسال پیام =====
function showSendError() {
    // پیدا کردن دکمه
    const btn = document.querySelector('.submit-btn');
    const originalText = btn.textContent;

    // تغییر ظاهر دکمه
    btn.textContent = '⚠️ ارسال ممکن نبود';
    btn.style.background = 'rgba(255, 0, 100, 0.15)';
    btn.style.borderColor = '#ff0064';
    btn.style.color = '#ff0064';
    btn.disabled = true;

    // نمایش پیام خطا
    showErrorToast('متأسفانه ارسال پیام ممکن نبود. اشکال از سمت سرور است. لطفاً از راه‌های ارتباطی زیر استفاده کنید.(تلگرام)');

    // برگرداندن دکمه به حالت اول بعد از ۳ ثانیه
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.disabled = false;
    }, 3000);
}

// ===== نمایش Toast خطا =====
function showErrorToast(message) {
    // اگه قبلاً toast هست، حذفش کن
    const existingToast = document.querySelector('.error-toast');
    if (existingToast) existingToast.remove();

    // ساخت toast جدید
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <div class="error-toast-icon">⚠️</div>
        <div class="error-toast-text">${message}</div>
        <button class="error-toast-close" onclick="this.parentElement.remove()">✕</button>
    `;

    document.body.appendChild(toast);

    // انیمیشن ورود
    setTimeout(() => toast.classList.add('show'), 10);

    // حذف خودکار بعد از ۶ ثانیه
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 6000);
}