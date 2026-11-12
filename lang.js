// PoshanKosh® Universal Language Switcher (English <-> हिंदी) for All 9 Pages
(function () {
  const btn = document.getElementById('lang-toggle-btn');
  const btnText = document.getElementById('lang-btn-text');
  if (!btn || !btnText) return;

  // Hide Google Translate top banner cleanly
  const style = document.createElement('style');
  style.textContent = `
    .goog-te-banner-frame.skiptranslate, .goog-te-gadget-simple, #google_translate_element, body > .skiptranslate { display: none !important; }
    body { top: 0px !important; }
  `;
  document.head.appendChild(style);

  // Hidden container for Google Translate
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
    if (lang === 'hi') {
      setCookie('googtrans', '/en/hi');
    } else {
      setCookie('googtrans', '/en/en');
    }
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

  // Clone button on sub-pages to ensure clean single click handler
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
