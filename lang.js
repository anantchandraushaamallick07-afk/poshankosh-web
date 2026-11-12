// PoshanKosh® Clean & Tested All-in-One Script (lang.js)
(function () {
  function initPoshanKosh() {
    // 1. Remove top green NEW RELEASE bar if present
    document.querySelectorAll('body > aside').forEach(function (el) {
      if (el.textContent && el.textContent.indexOf('NEW RELEASE') !== -1) {
        el.remove();
      }
    });

    // 2. Protect Header & Footer brand logo+tagline ONLY (not nav links)
    var headerBrand = document.querySelector('header a[href="index.html"], header a[href="#top"]');
    var footerBrand = document.querySelector('footer > div > div:first-child > a');
    [headerBrand, footerBrand].forEach(function (el) {
      if (el) {
        el.classList.add('notranslate');
        el.setAttribute('translate', 'no');
      }
    });

    // 3. Clean CSS: hide top bar + Google Translate bar + center footer cleanly
    var style = document.createElement('style');
    style.textContent =
      'body > aside:first-of-type { display: none !important; }' +
      '.goog-te-banner-frame.skiptranslate, .goog-te-gadget-simple, #google_translate_element, body > .skiptranslate { display: none !important; }' +
      'body { top: 0px !important; }' +
      'footer > div > div { display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; text-align: center !important; width: 100% !important; }' +
      'footer nav { display: flex !important; flex-wrap: wrap !important; justify-content: center !important; align-items: center !important; text-align: center !important; }' +
      'footer > div > div:first-child > a { display: inline-flex !important; flex-direction: row !important; align-items: center !important; justify-content: center !important; gap: 0.75rem !important; margin: 0 auto !important; }' +
      'footer > div > div:first-child > a > div { display: flex !important; flex-direction: column !important; align-items: flex-start !important; text-align: left !important; }' +
      'footer p { width: 100% !important; text-align: center !important; margin-left: auto !important; margin-right: auto !important; }';
    document.head.appendChild(style);

    // 4. Short & clean Footer copyright bar on all pages
    var footer = document.querySelector('footer');
    if (footer) {
      var bottomBar = footer.querySelector('div > div:last-child');
      if (bottomBar && bottomBar.querySelectorAll('p').length > 0) {
        bottomBar.className = 'mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500';
        bottomBar.innerHTML = '<p class="w-full text-center notranslate" translate="no">© 2026 PoshanKosh®. Independent Teacher Utility</p>';
      }
    }

    // 5. Language Switcher (English <-> हिंदी) across all pages
    var btn = document.getElementById('lang-toggle-btn');
    var btnText = document.getElementById('lang-btn-text');
    if (!btn || !btnText) return;

    var gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    gtDiv.style.display = 'none';
    document.body.appendChild(gtDiv);

    var isHomeWithInline = document.querySelectorAll('.lang-text').length > 0;
    var currentLang = localStorage.getItem('pk_lang') || 'en';

    function setCookie(name, value) {
      document.cookie = name + '=' + value + '; path=/';
      document.cookie = name + '=' + value + '; path=/; domain=.' + location.hostname;
    }

    function applyButtonLabel(lang) {
      btnText.textContent = lang === 'hi' ? 'English' : 'हिंदी';
    }

    function triggerGoogleTranslate(lang) {
      setCookie('googtrans', lang === 'hi' ? '/en/hi' : '/en/en');
      var select = document.querySelector('.goog-te-combo');
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
          setTimeout(function () {
            var s = document.querySelector('.goog-te-combo');
            if (s && localStorage.getItem('pk_lang') === 'hi') {
              s.value = 'hi';
              s.dispatchEvent(new Event('change'));
            }
          }, 400);
        };
        var sc = document.createElement('script');
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
        var next = btnText.textContent.trim() === 'English' ? 'hi' : 'en';
        localStorage.setItem('pk_lang', next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPoshanKosh);
  } else {
    initPoshanKosh();
  }
})();
