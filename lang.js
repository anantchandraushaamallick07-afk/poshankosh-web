// Short, Clean & Centered Footer Across All Pages
(function () {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const bottomBar = footer.querySelector('div > div:last-child');
  if (bottomBar && bottomBar.querySelectorAll('p').length > 0) {
    bottomBar.className = 'mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500';
    bottomBar.innerHTML = '<p class="w-full text-center">© 2026 PoshanKosh®. Independent Teacher Utility</p>';
  }

  const st = document.createElement('style');
  st.textContent = `
    footer, footer > div, footer > div > div, footer nav, footer p {
      text-align: center !important;
      justify-content: center !important;
      align-items: center !important;
    }
    footer > div > div { flex-direction: column !important; width: 100% !important; }
  `;
  document.head.appendChild(st);
})();

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
//REMOVE BANNER 
document.querySelectorAll('aside').forEach(function (el) {
  if (el.textContent.indexOf('NEW RELEASE') !== -1) {
    el.remove();
  }
});

// PoshanKosh® Always-Visible Voice UI + Language-Aware & Time-Aware AI Agent
(function () {
  function startAIAgent() {
    // 1. Auto-scroll & open exact FAQ if user lands on faqs.html#q...
    if (location.pathname.indexOf('faqs') !== -1) {
      document.querySelectorAll('.faq-item').forEach(function (el, idx) { el.id = 'q' + (idx + 1); });
      if (location.hash && /^#q\d+$/.test(location.hash)) {
        var targetFaq = document.querySelector(location.hash);
        if (targetFaq) {
          setTimeout(function () {
            var ans = targetFaq.querySelector('.faq-a');
            var icon = targetFaq.querySelector('.faq-plus');
            if (ans && ans.classList.contains('hidden')) {
              ans.classList.remove('hidden');
              if (icon) icon.textContent = '−';
            }
            targetFaq.style.boxShadow = '0 0 0 2px #1b8045';
            targetFaq.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 250);
        }
      }
    }

    var form = document.getElementById('ai-chat-form');
    var inp = document.getElementById('ai-input');
    var box = document.getElementById('chat-messages');
    if (!form || !inp || !box) return;

    function isHindiMode() {
      var btnTxt = document.getElementById('lang-btn-text');
      if (btnTxt && btnTxt.textContent.trim() === 'English') return true;
      return localStorage.getItem('pk_lang') === 'hi';
    }

    // 2. Clear Natural Voice Output (Filters out emojis/symbols & picks best Indian voice)
    var voiceOn = true;
    var hiVoice = null, enVoice = null;
    function pickBestVoice(voices, langRegex) {
      var list = voices.filter(function (v) { return langRegex.test(v.lang); });
      return list.find(function (v) { return /google|natural|online|neural|rishi|lekha/i.test(v.name); }) || list[0] || null;
    }
    function loadVoices() {
      if (!('speechSynthesis' in window)) return;
      var voices = window.speechSynthesis.getVoices() || [];
      hiVoice = pickBestVoice(voices, /hi[-_]IN/i);
      enVoice = pickBestVoice(voices, /en[-_]IN/i);
    }
    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    function speakText(html) {
      if (!voiceOn || !('speechSynthesis' in window)) return;
      try {
        window.speechSynthesis.cancel();
        var clean = html
          .replace(/<[^>]+>/g, ' ')
          .replace(/👉.*$/g, '')
          .replace(/[®™•⋮→🙏☀️🌤️🌆🌙🎤🔴🔊🔇]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!clean) return;
        var hasHindi = /[\u0900-\u097F]/.test(clean);
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = hasHindi ? 'hi-IN' : 'en-IN';
        u.rate = 0.96;
        u.pitch = 1.0;
        if (hasHindi && hiVoice) u.voice = hiVoice;
        else if (!hasHindi && enVoice) u.voice = enVoice;
        window.speechSynthesis.speak(u);
      } catch (e) {}
    }


    // 3. Language-Aware & Time-Aware Greeting
    function getGreeting(hi) {
      var hr = new Date().getHours();
      if (hi) {
        if (hr >= 5 && hr < 12) return 'सुप्रभात! ☀️';
        if (hr >= 12 && hr < 17) return 'नमस्ते! 🌤️';
        if (hr >= 17 && hr < 21) return 'शुभ संध्या! 🌆';
        return 'नमस्ते! 🌙';
      }
      if (hr >= 5 && hr < 12) return 'Good Morning! ☀️';
      if (hr >= 12 && hr < 17) return 'Good Afternoon! 🌤️';
      if (hr >= 17 && hr < 21) return 'Good Evening! 🌆';
      return 'Hello! 🌙';
    }

    function welcomeBubble() {
      var hi = isHindiMode();
      var body = hi
        ? '<b>' + getGreeting(true) + '</b><br>मैं <b>PoshanKosh® AI Sahayak</b> हूँ। बताइए, आज मैं आपकी किस तरह सहायता कर सकती हूँ? 🙏<br><span class="text-[11px] text-slate-500">(आप टाइप करके या 🎤 माइक दबाकर बोलकर कुछ भी पूछ सकते हैं)</span>'
        : '<b>' + getGreeting(false) + '</b><br>I am <b>PoshanKosh® AI Sahayak</b>. How may I help you today? 🙏<br><span class="text-[11px] text-slate-500">(Type your question or tap 🎤 Mic to ask by voice)</span>';
      return '<div class="flex items-start gap-2.5">' +
        '<div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div>' +
        '<div class="bg-white p-3.5 rounded-2xl text-slate-800 border border-slate-200 shadow-2xs max-w-[85%] text-xs sm:text-sm leading-relaxed">' + body + '</div></div>';
    }

    box.innerHTML = welcomeBubble();

    var langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        setTimeout(function () {
          if (box.children.length <= 1) box.innerHTML = welcomeBubble();
        }, 60);
      });
    }

    if (clearBtn) {
      var freshClear = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(freshClear, clearBtn);
      freshClear.addEventListener('click', function () {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        box.innerHTML = welcomeBubble();
      });
    }

    // 4. Typo-tolerant & Hinglish normalizer
    function norm(s) {
      return s.toLowerCase()
        .replace(/[^\w\s\u0900-\u097F]/g, ' ')
        .replace(/(.)\1+/g, '$1')
        .replace(/ee/g, 'i').replace(/oo/g, 'u').replace(/ph/g, 'f')
        .replace(/\bkse\b|\bkese\b|\bkaese\b/g, 'kaise')
        .replace(/\bkre\b|\bkrna\b|\bkarein\b|\bkro\b/g, 'kar')
        .replace(/\bnhi\b|\bni\b/g, 'nahi')
        .replace(/\bkhata\b|\bacount\b|\baccnt\b/g, 'account')
        .replace(/\bchaval\b|\bchawal\b|\bric\b/g, 'rice')
        .replace(/\bstok\b|\bstck\b/g, 'stock')
        .replace(/\bupdt\b|\bupdat\b/g, 'update')
        .replace(/\bedt\b|\bglt\b|\bgalat\b|\bsudhar\b/g, 'edit')
        .replace(/\bcashbok\b|\bcashbuk\b/g, 'cashbook')
        .replace(/\bstatmnt\b|\bstament\b/g, 'statement')
        .replace(/\bvochr\b|\bvouchr\b/g, 'voucher')
        .replace(/\bmotto\b/g, 'moto');
    }

    function editDist(a, b) {
      if (Math.abs(a.length - b.length) > 2) return 9;
      var dp = Array.from({ length: a.length + 1 }, function (_, i) { return [i]; });
      for (var j = 1; j <= b.length; j++) dp[0][j] = j;
      for (var i = 1; i <= a.length; i++) {
        for (var j2 = 1; j2 <= b.length; j2++) {
          dp[i][j2] = a[i - 1] === b[j2 - 1] ? dp[i - 1][j2 - 1] : 1 + Math.min(dp[i - 1][j2 - 1], dp[i - 1][j2], dp[i][j2 - 1]);
        }
      }
      return dp[a.length][b.length];
    }

    var topics = [
      {
        w: 4,
        k: ['hello', 'hi', 'hey', 'namaste', 'hlo', 'good morning', 'good afternoon', 'good evening', 'नमस्ते', 'हेलो', 'सुप्रभात'],
        a: function () {
          return isHindiMode()
            ? '<b>' + getGreeting(true) + '</b> मैं बिल्कुल ठीक हूँ! बताइए, PoshanKosh ऐप में आज मैं आपकी किस तरह सहायता कर सकती हूँ?'
            : '<b>' + getGreeting(false) + '</b> I am doing great! How may I assist you with PoshanKosh today?';
        }
      },
      {
        w: 4,
        k: ['thank', 'thanks', 'dhanyawad', 'shukriya', 'bye', 'ok', 'धन्यवाद', 'शुक्रिया'],
        a: function () {
          return isHindiMode()
            ? 'आपका बहुत-बहुत स्वागत है! जब भी रजिस्टर, स्टॉक या कैशबुक से जुड़ी कोई मदद चाहिए हो, बेझिझक पूछिएगा।'
            : 'You are most welcome! Feel free to ask anytime you need help with registers, stock, or cashbook.';
        }
      },
      {
        w: 6,
        k: ['use', 'uses', 'usage', 'useful', 'feature', 'features', 'kaam', 'karta', 'उपयोग', 'काम', 'इस्तेमाल'],
        a: '<b>PoshanKosh® ऐप का उपयोग (Use of This App):</b><br>यह ऐप शिक्षकों के PM-POSHAN (MDM) के पूरे काम को आसान बनाता है: दैनिक हाजिरी से लेकर 12+ पंजियाँ, 3-डॉट क्विक स्टॉक, Cheque No. के साथ बैंक निकासी, कैशबुक व बैंक स्टेटमेंट मिलान, 4 मासिक वाउचर और 2-पेज का MPR PDF — सब कुछ 100% ऑफलाइन एक ही जगह!<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">How to Use Guide</a> | <a href="how-beneficial.html" class="text-brand-green font-bold underline">Benefits</a>'
      },
      {
        w: 6,
        k: ['moto', 'mission', 'vision', 'goal', 'aim', 'purpose', 'objective', 'uddeshya', 'लक्ष्य', 'उद्देश्य'],
        a: '<b>PoshanKosh® का मुख्य उद्देश्य (Motto &amp; Mission):</b><br>हमारा टैगलाइन है — <i>“विद्यालय का पोषण, उज्ज्वल कल”</i>। हमारा एकमात्र लक्ष्य है कि शिक्षक शाम को घर लौटकर देर रात तक 12 रजिस्टरों और 10 पैसे के हिसाब में न उलझें, बल्कि हर महीने 15+ घंटे बचाकर अपने परिवार के साथ सुकून से समय बिताएँ।<br>👉 <a href="about.html" class="text-brand-green font-bold underline">About Us</a> | <a href="journey.html" class="text-brand-green font-bold underline">Our Story</a>'
      },
      {
        w: 6,
        k: ['story', 'journey', 'founder', 'creator', 'owner', 'developer', 'made', 'built', 'banaya', 'कहानी', 'यात्रा'],
        a: '<b>PoshanKosh® की कहानी (Our Story):</b><br>इस ऐप की शुरुआत एक शिक्षक पिता के संघर्ष को देखकर हुई, जो हर शाम स्कूल से लौटकर रात 11 बजे तक 12 भारी MDM रजिस्टरों और कैलकुलेटर में उलझे रहते थे और परिवार को समय नहीं दे पाते थे। उन्हीं की शामें हर शिक्षक को वापस लौटाने के लिए PoshanKosh® बनाया गया।<br>👉 <a href="journey.html" class="text-brand-green font-bold underline">पूरी कहानी पढ़ें (Our Journey) →</a>'
      },
      {
        w: 5,
        k: ['account', 'create', 'signup', 'login', 'register', 'setup', 'udise', 'opening', 'खाता', 'लॉगिन', 'बनाना'],
        a: 'बिल्कुल, मैं आपको अकाउंट सेटअप बताती हूँ:<br>1. ऐप खोलकर <b>Sign in with Google</b> दबाएँ और <b>Google Drive वाले बॉक्स पर टिक</b> ज़रूर करें।<br>2. अपना राज्य, स्कूल नाम, UDISE कोड व Opening Balance भरकर सेव करें।<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">Step-by-Step Guide</a> | <a href="faqs.html#q1" class="text-brand-green font-bold underline">FAQ #1 देखें</a>'
      },
      {
        w: 6,
        k: ['stock', 'restock', 'rice', 'add', 'update', 'dot', 'quick', 'kg', 'चावल', 'स्टॉक', 'जोड़', 'राशि'],
        a: 'ज़रूर! चावल या फंड स्टॉक जोड़ने के लिए ये आसान स्टेप अपनाएँ:<br>1. नीचे <b>Registers</b> टैब में जाकर संबंधित रजिस्टर खोलें (<i>Rice Register, Daily Expenditure, Egg/Fruit</i> या <i>Ragi</i>)।<br>2. ऊपर दाईं ओर <b>3-डॉट (⋮)</b> दबाकर <b>Quick Restock</b> चुनें।<br>3. <b>KG–5</b> और <b>6–8</b> की मात्रा अलग-अलग भरें, कुल टोटल नीचे अपने आप जुड़ जाएगा, फिर Save करें।<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">How to Use</a> | <a href="faqs.html#q25" class="text-brand-green font-bold underline">FAQ #25 देखें</a>'
      },
      {
        w: 6,
        k: ['edit', 'mistake', 'correct', 'change', 'wrong', 'delete', 'सुधार', 'बदल', 'गलत', 'डिलीट'],
        a: 'कोई बात नहीं, पुरानी एंट्री सुधारना बहुत आसान है:<br>• <b>Attendance</b>, संबंधित <b>Register</b> या <b>Cashbook</b> खोलकर उस तारीख वाली लाइन पर टैप करें, सही मान भरकर <b>Update</b> दबाएँ। आगे के सभी टोटल अपने आप ठीक हो जाएँगे।<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">How to Use</a> | <a href="faqs.html#q37" class="text-brand-green font-bold underline">FAQ #37 देखें</a>'
      },
      {
        w: 5,
        k: ['tab', 'tabs', 'where', 'option', 'menu', 'navigation', 'कहाँ', 'ऑप्शन', 'मेनू', 'टैब'],
        a: 'ऐप में नीचे <b>5 मुख्य टैब</b> हैं: 1. <b>Home</b> (Withdrawal, Cashbook, 7-Day Alert, ऊपर Settings), 2. <b>Attendance</b> (दैनिक हाजिरी), 3. <b>MDM</b> (भोजन फ्लो), 4. <b>Registers</b> (सभी 12+ पंजियाँ, 3-डॉट स्टॉक व Scheme Register), 5. <b>Reports</b> (4 वाउचर व MPR PDF)।<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">पूरा Navigation Map देखें</a>'
      },
      {
        w: 5,
        k: ['attendance', 'daily', 'entry', 'present', 'caste', 'हाजिरी', 'दैनिक', 'एंट्री'],
        a: 'दैनिक हाजिरी के लिए <b>Attendance</b> टैब खोलें, तारीख चुनें, KG–5 व 6–8 में उपस्थित छात्र भरें और अंडा, फल या रागी चुनकर <b>Save</b> करें। चावल और कुकिंग कॉस्ट अपने आप दर्ज हो जाएँगे।<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">How to Use</a> | <a href="faqs.html#q13" class="text-brand-green font-bold underline">FAQ #13 देखें</a>'
      },
      {
        w: 5,
        k: ['cashbook', 'bank', 'statement', 'match', 'reconcile', 'interest', 'verified', 'seal', 'कैशबुक', 'बैंक', 'मिलान'],
        a: 'बैंक स्टेटमेंट मिलाने के लिए <b>Home → Cashbook</b> खोलें, बैंक स्टेटमेंट अपलोड करें, 1-क्लिक में ब्याज व चार्ज Auto-Fill करें और 100% मिलान पर Royal Blue <b>POSHANKOSH VERIFIED</b> मुहर पाएँ।<br>👉 <a href="how-to-use.html" class="text-brand-green font-bold underline">Cashbook Guide</a> | <a href="faqs.html#q61" class="text-brand-green font-bold underline">FAQ #61 देखें</a>'
      },
      {
        w: 5,
        k: ['withdrawal', 'cheque', 'contra', 'निकासी', 'चेक'],
        a: 'बैंक निकासी के लिए <b>Home → Withdrawal</b> खोलें, तारीख, राशि और <b>Cheque No.</b> डालकर सेव करें — Cashbook में Bank से Cash की कॉन्ट्रा एंट्री अपने आप हो जाएगी।<br>👉 <a href="faqs.html#q56" class="text-brand-green font-bold underline">FAQ #56 देखें</a>'
      },
      {
        w: 5,
        k: ['scheme', 'utensil', 'kitchen', 'settled', 'योजना', 'स्कीम', 'बर्तन'],
        a: 'विशेष अनुदान के लिए <b>Registers → Scheme Register</b> में राशि जोड़ें, खर्च विभाजित करें और पूरा होने पर <b>Settled</b> मार्क करें।<br>👉 <a href="faqs.html#q54" class="text-brand-green font-bold underline">FAQ #54 देखें</a>'
      },
      {
        w: 5,
        k: ['voucher', 'mpr', 'draft', 'report', 'pdf', 'वाउचर', 'रिपोर्ट', 'ड्राफ्ट'],
        a: 'मासिक रिपोर्ट के लिए नीचे <b>Reports</b> टैब खोलें — वहाँ से चारों वाउचर और 2-पेज का हिंदी/अंग्रेज़ी MPR PDF, Draft Mode सहित, 1 क्लिक में डाउनलोड हो जाएगा।<br>👉 <a href="faqs.html#q73" class="text-brand-green font-bold underline">FAQ #73 देखें</a>'
      },
      {
        w: 4,
        k: ['chakhna', 'ragi', 'iron', 'ifa', 'egg', 'fruit', '12', 'registers', 'चखना', 'रागी', 'आयरन', 'पंजी'],
        a: 'PoshanKosh में सभी 12+ पंजियाँ शामिल हैं: दैनिक व्यय, कैशबुक, चावल, रागी, अंडा/फल, IFA आयरन (गुलाबी/नीली गोली), चखना (Food Tasting), दैनिक हाजिरी, साप्ताहिक, मासिक MPR, त्रैमासिक UC, अर्द्धवार्षिक व वार्षिक ऑडिट।<br>👉 <a href="faqs.html#q49" class="text-brand-green font-bold underline">FAQ #49 देखें</a>'
      },
      {
        w: 5,
        k: ['backup', 'restore', 'drive', 'sync', 'phone', 'offline', 'alert', 'बैकअप', 'रीस्टोर', 'ऑफलाइन'],
        a: 'पूरा ऐप 100% ऑफलाइन चलता है और 7-दिन लो-कैश अलर्ट भी देता है। नेटवर्क मिलने पर <b>Home → Settings → Google Drive Backup → Backup Now</b> दबाएँ — नए फोन में उसी Gmail से लॉगिन करते ही सारा डेटा वापस आ जाएगा।<br>👉 <a href="faqs.html#q85" class="text-brand-green font-bold underline">FAQ #85 देखें</a>'
      },
      {
        w: 5,
        k: ['119', 'price', 'fee', 'trial', 'free', 'privacy', 'server', 'govt', 'government', 'फीस', 'ट्रायल', 'प्राइवेसी', 'सरकारी'],
        a: '<b>PoshanKosh एक स्वतंत्र शिक्षक ऐप है (सरकारी ऐप नहीं)</b> और आपका कोई भी वित्तीय डेटा सर्वर पर नहीं रखता। नए स्कूल को <b>30 दिन Free Trial</b> मिलता है; उसके बाद 119 रुपये प्रति वर्ष सर्वर व मेंटेनेंस के लिए है।<br>👉 <a href="privacy.html" class="text-brand-green font-bold underline">Privacy</a> | <a href="terms.html" class="text-brand-green font-bold underline">Terms</a> | <a href="faqs.html#q95" class="text-brand-green font-bold underline">FAQ #95 देखें</a>'
      },
      {
        w: 4,
        k: ['rate', 'cost', '6.78', '10.17', '100', '150', 'दर', 'कुकिंग'],
        a: '<b>PM-POSHAN दरें:</b> प्राथमिक (KG–5) के लिए 100 ग्राम चावल व <b>₹6.78</b>, और उच्च प्राथमिक (6–8) के लिए 150 ग्राम चावल व <b>₹10.17</b> प्रति छात्र प्रतिदिन तय हैं।<br>👉 <a href="#calculator" class="text-brand-green font-bold underline">Calculator</a> | <a href="faqs.html#q20" class="text-brand-green font-bold underline">FAQ #20 देखें</a>'
      },
      {
        w: 5,
        k: ['beneficial', 'benefit', 'why', 'लाभ', 'फायदा'],
        a: 'PoshanKosh हर महीने 15 से अधिक घंटे बचाता है, 10 पैसे की भी कैशबुक गलती रोकता है, और 100% ऑफलाइन चलता है।<br>👉 <a href="how-beneficial.html" class="text-brand-green font-bold underline">Before vs After Benefits देखें</a>'
      },
      {
        w: 5,
        k: ['download', 'apk', 'install', 'contact', 'support', 'email', 'डाउनलोड', 'संपर्क', 'मदद'],
        a: 'लेटेस्ट Android APK नीचे डाउनलोड सेक्शन से लें या सहायता के लिए ईमेल करें: <b>anantchandraushaamallick07@gmail.com</b><br>👉 <a href="#download" class="text-brand-green font-bold underline">Download APK</a> | <a href="contact.html" class="text-brand-green font-bold underline">Contact Us</a> | <a href="faqs.html#q110" class="text-brand-green font-bold underline">FAQ #110 देखें</a>'
      }
    ];

    var freshForm = form.cloneNode(true);
    form.parentNode.replaceChild(freshForm, form);
    inp = document.getElementById('ai-input');

    // 5. ALWAYS Render Mic Button in UI (with graceful notice if in-app browser blocks SpeechRecognition)
    if (!document.getElementById('pk-mic-btn')) {
      var micBtn = document.createElement('button');
      micBtn.id = 'pk-mic-btn';
      micBtn.type = 'button';
      micBtn.title = 'बोलकर पूछें (Voice Input)';
      micBtn.className = 'px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-300 text-slate-700 font-bold text-sm shrink-0';
      micBtn.textContent = '🎤';
      var sendBtn = freshForm.querySelector('button[type="submit"]');
      if (sendBtn) freshForm.insertBefore(micBtn, sendBtn);

      var SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRec) {
        var rec = new SpeechRec();
        rec.interimResults = false;
        var listening = false;
        micBtn.addEventListener('click', function () {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          if (listening) { rec.stop(); return; }
          try {
            rec.lang = isHindiMode() ? 'hi-IN' : 'en-IN';
            listening = true;
            micBtn.textContent = '🔴';
            micBtn.classList.add('bg-red-50', 'border-red-400');
            rec.start();
          } catch (err) { listening = false; micBtn.textContent = '🎤'; }
        });
        rec.onresult = function (ev) {
          inp.value = ev.results[0][0].transcript;
          freshForm.dispatchEvent(new Event('submit'));
        };
        rec.onend = function () { listening = false; micBtn.textContent = '🎤'; micBtn.classList.remove('bg-red-50', 'border-red-400'); };
        rec.onerror = function () { listening = false; micBtn.textContent = '🎤'; micBtn.classList.remove('bg-red-50', 'border-red-400'); };
      } else {
        micBtn.addEventListener('click', function () {
          var msg = '🎤 बोलकर पूछने (Voice Mic) के लिए कृपया यह पेज <b>Chrome</b> या <b>Safari</b> ब्राउज़र में खोलें (इन-ऐप ब्राउज़र में माइक बंद रहता है), या अपने कीबोर्ड का माइक उपयोग करें।';
          box.innerHTML += '<div class="flex items-start gap-2.5"><div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div><div class="bg-white p-3 rounded-2xl text-slate-700 border border-slate-200 text-xs">' + msg + '</div></div>';
          box.scrollTop = box.scrollHeight;
          speakText(msg);
        });
      }
    }

    freshForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = inp.value.trim();
      if (!raw) return;
      inp.value = '';
      var safeUser = raw.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      box.innerHTML += '<div class="flex justify-end"><div class="bg-brand-green text-white p-3 rounded-2xl text-xs sm:text-sm max-w-[85%]">' + safeUser + '</div></div>';

      var words = norm(raw).split(/\s+/).filter(Boolean);
      var best = null, bestScore = 0;
      topics.forEach(function (t) {
        var sc = 0;
        words.forEach(function (w) {
          t.k.forEach(function (kw) {
            if (w === kw || (w.length > 3 && kw.indexOf(w) !== -1) || (kw.length > 3 && w.indexOf(kw) !== -1)) {
              sc += t.w * 2;
            } else if (w.length >= 4 && kw.length >= 4 && editDist(w, kw) <= 1) {
              sc += t.w;
            }
          });
        });
        if (sc > bestScore) { bestScore = sc; best = t; }
      });

      var reply = (best && bestScore > 0)
        ? (typeof best.a === 'function' ? best.a() : best.a)
        : (isHindiMode()
            ? 'माफ़ कीजिए, मैं केवल <b>PoshanKosh ऐप</b> (अकाउंट, स्टॉक जोड़ना, एडिट करना, कैशबुक, वाउचर, बैकअप, कहानी और 119 रुपये प्लान) से जुड़ी सहायता कर सकती हूँ। कृपया <a href="how-to-use.html" class="text-brand-green font-bold underline">How to Use</a> या <a href="faqs.html" class="text-brand-green font-bold underline">114+ FAQs</a> देखें!'
            : 'Sorry, I can only help with <b>PoshanKosh® App</b> (Account Setup, Stock Restock, Editing Entries, Cashbook, Vouchers, Backup, Story & ₹119 Plan). Please check <a href="how-to-use.html" class="text-brand-green font-bold underline">How to Use</a> or <a href="faqs.html" class="text-brand-green font-bold underline">114+ FAQs</a>!');

      setTimeout(function () {
        box.innerHTML += '<div class="flex items-start gap-2.5"><div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div><div class="bg-white p-3.5 rounded-2xl text-slate-800 border border-slate-200 shadow-2xs max-w-[85%] text-xs sm:text-sm leading-relaxed">' + reply + '</div></div>';
        box.scrollTop = box.scrollHeight;
        speakText(reply);
      }, 220);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAIAgent);
  } else {
    startAIAgent();
  }
})();
