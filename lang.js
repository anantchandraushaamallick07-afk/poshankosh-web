```javascript
// PoshanKosh® Final All-in-One Shortcut (lang.js)
// 1. Hides top green NEW RELEASE bar across all pages
// 2. Protects Poshankosh® brand & tagline from translation distortion
// 3. Enables English <-> हिंदी switcher across all 9 pages
// 4. Keeps Footer short, clean & centered with proper logo+text alignment

(function () {
  // Protect Header & Footer brand lockup from translation mangling
  document.querySelectorAll('header a:first-child, footer a:first-child').forEach(el => {
    el.classList.add('notranslate');
    el.setAttribute('translate', 'no');
  });

  // Global CSS rules for all pages & devices
  const style = document.createElement('style');
  style.textContent = `
    body > aside:first-of-type { display: none !important; }
    .goog-te-banner-frame.skiptranslate, .goog-te-gadget-simple, #google_translate_element, body > .skiptranslate { display: none !important; }
    body { top: 0px !important; }
    footer, footer > div, footer > div > div, footer nav, footer p {
      text-align: center !important;
      justify-content: center !important;
      align-items: center !important;
    }
    footer > div > div {
      flex-direction: column !important;
      width: 100% !important;
    }
    footer p {
      width: 100% !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }
    footer a:first-child {
      display: inline-flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: center !important;
      width: auto !important;
      gap: 0.75rem !important;
      margin: 0 auto !important;
    }
    footer a:first-child > div {
      display: flex !important;
      flex-direction: column !important;
      align-items: flex-start !important;
      text-align: left !important;
    }
  `;
  document.head.appendChild(style);

  // Short & clean Footer bottom bar across all pages
  const footer = document.querySelector('footer');
  if (footer) {
    const bottomBar = footer.querySelector('div > div:last-child');
    if (bottomBar && bottomBar.querySelectorAll('p').length > 0) {
      bottomBar.className = 'mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500';
      bottomBar.innerHTML = '<p class="w-full text-center notranslate" translate="no">© 2026 PoshanKosh®. Independent Teacher Utility</p>';
    }
  }

  // Language Switcher (English <-> हिंदी)
  const btn = document.getElementById('lang-toggle-btn');
  const btnText = document.getElementById('lang-btn-text');
  if (!btn || !btnText) return;

  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.display = 'none';
  document.body.appendChild(gtDiv);

  const isHomeWithInline = document.querySelectorAll('.lang-text').length > 0;
  let currentLang = localStorage.getItem('pk_lang') || 'en';

  function setCookie(name, value) {
    document.cookie = name + '=' + value + '; path=/';
    document.cookie = name + '=' + value + '; path=/; domain=.' + location.hostname;
  }

  function applyButtonLabel(lang) {
    btnText.textContent = lang === 'hi' ? 'English' : 'हिंदी';
  }

  function triggerGoogleTranslate(lang) {
    setCookie('googtrans', lang === 'hi' ? '/en/hi' : '/en/en');
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang === 'hi' ? 'hi' : 'en';
      select.dispatchEvent(new Event('change'));
    } else if (lang === 'hi' && !window._pkGtLoading) {
      window._pkGtLoading = true;
      window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement(
          { pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false },
          'google_translate_element'
        );
        setTimeout(() => {
          const s = document.querySelector('.goog-te-combo');
          if (s && localStorage.getItem('pk_lang') === 'hi') {
            s.value = 'hi';
            s.dispatchEvent(new Event('change'));
          }
        }, 400);
      };
      const sc = document.createElement('script');
      sc.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      sc.async = true;
      document.body.appendChild(sc);
    }
  }

  applyButtonLabel(currentLang);
  if (!isHomeWithInline && currentLang === 'hi') {
    triggerGoogleTranslate('hi');
  }

  if (!isHomeWithInline) {
    btn.addEventListener('click', function () {
      currentLang = (localStorage.getItem('pk_lang') || 'en') === 'hi' ? 'en' : 'hi';
      localStorage.setItem('pk_lang', currentLang);
      applyButtonLabel(currentLang);
      if (currentLang === 'en') {
        setCookie('googtrans', '/en/en');
        location.reload();
      } else {
        triggerGoogleTranslate('hi');
      }
    });
  } else {
    btn.addEventListener('click', function () {
      const next = btnText.textContent.trim() === 'English' ? 'hi' : 'en';
      localStorage.setItem('pk_lang', next);
    });
  }
})();
```
