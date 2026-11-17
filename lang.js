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

// PoshanKosh® Complete Voice + Message AI Agent (Paste ONLY this block at the end of lang.js)
(function () {
  function startAIAgent() {
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

    function detectUserHindi(txt) {
      if (/[\u0900-\u097F]/.test(txt)) return true;
      if (/\b(kya|ky|kaise|krna|karna|kaha|kitna|chahiye|batao|btaiye|samjhao|smjhao|paisa|paise|rupya|rupaye|chawal|anda|pani|chhutti|chutti|nahi|ni|haan|hn|accha|achha|bhai|boss|sir|madam|aur|or|mein|me|se|ko|ka|ki|ke|hai|h|ho|kar|kro|karo|dalo|dikhao|bata|sarkari|galti|galat|madad|sahayta)\b/i.test(txt)) return true;
      if (/^[a-z0-9\s.,?!₹-]+$/i.test(txt) && txt.split(/\s+/).length >= 3) return false;
      return isHindiMode();
    }

    // Natural Fast Voice Output (Gemini-style responsive Indian voice)
    var voiceOn = true;
    var hiVoice = null, enVoice = null;
    function pickBestVoice(voices, langRegex) {
      var list = voices.filter(function (v) { return langRegex.test(v.lang); });
      return list.find(function (v) { return /google|natural|online|neural|rishi|lekha|swara|madhur/i.test(v.name); }) || list[0] || null;
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
          .replace(/[®™•⋮→🙏☀️🌤️🌆🌙🎤🔴🔊🔇✓🚀📲✉️]/g, ' ')
          .replace(/₹(\d+)/g, '$1 rupees ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!clean) return;
        var hasHindi = /[\u0900-\u097F]/.test(clean);
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = hasHindi ? 'hi-IN' : 'en-IN';
        if (hasHindi && hiVoice) u.voice = hiVoice;
        if (!hasHindi && enVoice) u.voice = enVoice;
        u.rate = 1.06;
        u.pitch = 1.02;
        window.speechSynthesis.speak(u);
      } catch (_) {}
    }

    function getGreeting(hi) {
      var hr = new Date().getHours();
      if (hi) {
        if (hr < 12) return 'सुप्रभात! 🙏';
        if (hr < 17) return 'नमस्कार! 🙏';
        return 'शुभ संध्या! 🙏';
      }
      if (hr < 12) return 'Good Morning! 🙏';
      if (hr < 17) return 'Good Afternoon! 🙏';
      return 'Good Evening! 🙏';
    }

    function norm(s) {
      return (s || '').toLowerCase()
        .replace(/[^\w\s\u0900-\u097F.₹-]/g, ' ')
        .replace(/\b(poshankosh|poshan\s*kosh|poshan|kosh|app|apk)\b/g, 'poshankosh')
        .replace(/\b(paisa|paise|rupya|rupaye|cost|charge|charges|rate|fees|fee)\b/g, 'price')
        .replace(/\b(hajiri|haziri|present|attendence|atendance)\b/g, 'attendance')
        .replace(/\b(chawal|ricee|raice)\b/g, 'rice')
        .replace(/\b(anda|ande|eggs)\b/g, 'egg')
        .replace(/\b(chakhna|chakna|chkhna|tasting)\b/g, 'chakhna')
        .replace(/\b(naam|name|names|roster|bachhe|bachcho|students|student)\b/g, 'student')
        .replace(/\b(sarkari|goverment|gov|govt)\b/g, 'government')
        .replace(/\b(galat|galti|mistake|sudhar|badalna|change)\b/g, 'edit')
        .replace(/\b(bina\s*net|offline|internet)\b/g, 'offline')
        .replace(/\b(chhutti|chutti|holiday|off)\b/g, 'holiday')
        .replace(/\s+/g, ' ').trim();
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

    // Conversation Context for Humanoid Multitasking & Clarification
    var ctx = { pendingClarify: null, lastTopic: null };

    var topics = [
      {
        id: 'greet', w: 5,
        k: ['hello', 'hi', 'hey', 'hii', 'namaste', 'hlo', 'good morning', 'good afternoon', 'good evening', 'नमस्ते', 'हेलो', 'सुप्रभात', 'kaise ho', 'kaisa hai'],
        a: function (hi) {
          return hi
            ? '<b>' + getGreeting(true) + '</b> मैं <b>PoshanKosh AI Sahayak</b> हूँ! आप मुझसे बोलकर या लिखकर कुछ भी पूछ सकते हैं — जैसे <b>₹119 vs ₹149 प्लान</b>, <b>AI हाजिरी</b>, <b>3-Way नाम एंट्री</b>, <b>चखना पंजी</b>, या <b>चावल/अंडा/रागी स्टॉक</b>। बताइए, क्या मदद करूँ?'
            : '<b>' + getGreeting(false) + '</b> I am <b>PoshanKosh AI Sahayak</b>! Ask me anything by voice or text — like <b>₹119 vs ₹149 plans</b>, <b>AI Attendance</b>, <b>3-Way Student Name Entry</b>, <b>Chakhna Panji</b>, or <b>Rice/Egg/Ragi Stock</b>. How can I help you?';
        }
      },
      {
        id: 'done', w: 6,
        k: ['ho gaya', 'done', 'bas', 'thank', 'thanks', 'dhanyawad', 'shukriya', 'bye', 'ok', 'theek', 'thik', 'धन्यवाद', 'शुक्रिया', 'हो गया'],
        a: function (hi) {
          ctx.pendingClarify = null;
          return hi
            ? 'बहुत बढ़िया! 🙏 क्या किसी और काम या दूसरे रजिस्टर (जैसे हाजिरी, स्टॉक, चखना पंजी या प्लान) में आपकी सहायता करूँ?'
            : 'All set! 🙏 Is there anything else I can help you with — like attendance, stock, Chakhna Panji, or pricing?';
        }
      },
      {
        id: 'pricing', w: 7,
        k: ['119', '149', 'price', 'plan', 'trial', 'free', 'difference', 'pro', 'standard', 'प्लान', 'अंतर', 'ट्रायल', 'फ्री'],
        a: function (hi) {
          return hi
            ? '<b>PoshanKosh प्लान और अंतर:</b><br>• <b>30-Day Free Trial (₹0):</b> सभी Manual रजिस्टर + पूरा Offline AI फ्री।<br>• <b>₹119/वर्ष (Standard):</b> सभी 12+ पंजियाँ, MPR/Form-II PDF, और 1st AI रिपोर्ट फ्री (अतिरिक्त AI रिपोर्ट ₹30)।<br>• <b>₹149/वर्ष (AI Pro):</b> ₹119 के सभी फीचर्स + <b>Unlimited Offline Voice/Text AI</b>, AI हाजिरी, 3-Way नाम एंट्री, Bill OCR, Smart Audit, Ration Forecast व BRC WhatsApp रिपोर्ट!<br>👉 <a href="#pricing" class="text-brand-green font-bold underline">₹119 vs ₹149 तुलना देखें</a>'
            : '<b>PoshanKosh Plans & Difference:</b><br>• <b>30-Day Free Trial (₹0):</b> Full Manual Registers + Full Offline AI Free.<br>• <b>₹119/year (Standard):</b> All 12+ registers, MPR/Form-II PDFs, and 1st AI report free (₹30 per extra AI report).<br>• <b>₹149/year (AI Pro):</b> Everything in ₹119 + <b>Unlimited Offline Voice & Text AI</b>, AI Attendance, 3-Way Student Name Entry, Bill OCR, Smart Audit, Ration Forecast & 1-Tap BRC WhatsApp Report!<br>👉 <a href="#pricing" class="text-brand-green font-bold underline">See ₹119 vs ₹149 Comparison</a>';
        }
      },
      {
        id: 'ai_features', w: 7,
        k: ['ai', 'voice', 'ocr', 'audit', 'forecast', 'brc', 'whatsapp', 'undo', 'assistant', 'humanoid', 'multitask', 'एआई', 'वॉइस', 'ऑडिट'],
        a: function (hi) {
          return hi
            ? '<b>PoshanKosh — भारत का पहला AI-Powered MDM Assistant:</b><br>• <b>AI हाजिरी:</b> क्लास-वाइज बोलकर हाजिरी दर्ज करें और एक साथ कई काम (multitask) करें।<br>• <b>3-Way नाम एंट्री:</b> Class+Roll, Old→New, या तुरंत "X नहीं Y" बोलकर छात्र का नाम बदलें।<br>• <b>5 ऑफलाइन पावर टूल्स:</b> Bill Photo OCR, Smart Audit, Ration Forecast, 1-Tap BRC WhatsApp रिपोर्ट और Voice Undo!<br>👉 <a href="#previews" class="text-brand-green font-bold underline">Live AI Demo देखें</a>'
            : '<b>PoshanKosh — India\'s First AI-Powered MDM Assistant:</b><br>• <b>AI Attendance:</b> Class-by-class voice attendance with seamless task switching.<br>• <b>3-Way Student Name Entry:</b> Update names via Class+Roll, Old→New, or instant "X not Y" correction.<br>• <b>5 Offline Power Tools:</b> Bill Photo OCR, Smart Audit, Ration Forecast, 1-Tap BRC WhatsApp Report & Voice Undo!<br>👉 <a href="#previews" class="text-brand-green font-bold underline">Try Live AI Demo</a>';
        }
      },
      {
        id: 'student_name', w: 7,
        k: ['student', 'roll', 'caste', 'st', 'sc', 'obc', 'general', 'boy', 'girl', 'रोल', 'जाति', 'लड़का', 'लड़की'],
        a: function (hi) {
          return hi
            ? '<b>3-Way छात्र नाम व जाति एंट्री:</b><br>1. <b>Class + Roll:</b> <i>"कक्षा 2 रोल 1 नितेश कुमार ST Boy"</i> बोलें।<br>2. <b>Old → New:</b> पुराना नाम बदलकर नया नाम बोलें।<br>3. <b>तुरंत सुधार:</b> गलत नाम आने पर सीधे <i>"नीत नहीं नितेश कुमार"</i> बोल दें — AI तुरंत सुधार देगा!'
            : '<b>3-Way Student Name & Category Entry:</b><br>1. <b>Class + Roll:</b> Say <i>"Class 2 Roll 1 Nitesh Kumar ST Boy"</i>.<br>2. <b>Old → New:</b> Replace an existing student name directly.<br>3. <b>Instant Fix:</b> Just say <i>"Not Neet, Nitesh Kumar"</i> and the AI fixes it immediately!';
        }
      },
      {
        id: 'attendance', w: 6,
        k: ['attendance', 'daily', 'class', 'हाजिरी', 'दैनिक', 'क्लास'],
        a: function (hi) {
          return hi
            ? '<b>AI व मैनुअल दैनिक हाजिरी:</b><br>आप एक-एक क्लास (Class-by-Class) की हाजिरी भी सेव कर सकते हैं। हाजिरी सेव होते ही <b>दैनिक व्यय, चावल, अंडा, रागी और आयरन टैबलेट</b> पंजियाँ अपने आप अपडेट हो जाती हैं!<br>👉 <a href="faqs.html#q13" class="text-brand-green font-bold underline">FAQ #13 देखें</a>'
            : '<b>AI & Manual Daily Attendance:</b><br>You can save attendance class-by-class. As soon as you save, <b>Daily Expenditure, Rice, Egg, Ragi, and Iron Tablet</b> registers auto-sync!<br>👉 <a href="faqs.html#q13" class="text-brand-green font-bold underline">See FAQ #13</a>';
        }
      },
      {
        id: 'chakhna', w: 7,
        k: ['chakhna', 'cook', 'menu', 'remarks', 'holiday', 'calendar', 'चखना', 'रसोइया', 'मेनू', 'छुट्टी'],
        a: function (hi) {
          return hi
            ? '<b>नया 4-कॉलम चखना पंजी:</b><br>फ़ॉर्मेट: <b>दिनांक | रसोइया का नाम | मेनू | अभियुक्ति (Remarks)</b>। इसमें महीने की सभी तारीखें पहले से भरी रहती हैं और <b>School Calendar</b> की छुट्टियाँ अपने आप सिंक हो जाती हैं — आप AI या मैनुअल दोनों से एंट्री कर सकते हैं!'
            : '<b>New 4-Column Chakhna Panji:</b><br>Format: <b>Date | Cook Name | Menu | Remarks</b>. All dates are pre-filled and automatically synced with your <b>School Calendar</b> holidays, supporting both AI voice and manual entry!';
        }
      },
      {
        id: 'egg_ragi_ifa', w: 7,
        k: ['egg', 'ragi', 'iron', 'ifa', 'monday', 'friday', 'tuesday', 'saturday', 'wednesday', 'thursday', 'रागी', 'आयरन', 'गोली'],
        a: function (hi) {
          return hi
            ? '<b>अंडा, रागी व आयरन टैबलेट नियम:</b><br>• <b>अंडा/फल:</b> सोमवार व शुक्रवार (छुट्टी होने पर अपने आप मंगलवार व शनिवार को शिफ्ट)।<br>• <b>रागी:</b> दैनिक/नियमानुसार ऑटो-सिंक।<br>• <b>आयरन टैबलेट (IFA):</b> कक्षा 1 से 12 के लिए बुधवार/गुरुवार को ऑटो-सिंक!'
            : '<b>Egg, Ragi & Iron Tablet Rules:</b><br>• <b>Egg/Fruit:</b> Monday & Friday (automatically shifts to Tuesday & Saturday on holidays).<br>• <b>Ragi:</b> Auto-synced with attendance.<br>• <b>Iron Tablet (IFA):</b> Auto-synced for Classes 1–12 on Wednesday/Thursday!';
        }
      },
      {
        id: 'stock_rice', w: 6,
        k: ['stock', 'restock', 'rice', 'opening', 'edit', 'delete', 'स्टॉक', 'जोड़', 'ओपनिंग', 'डिलीट'],
        a: function (hi) {
          return hi
            ? '<b>चावल व स्टॉक एंट्री:</b><br>Registers → Rice Stock में ऊपर <b>3-डॉट (⋮) → Quick Restock</b> से KG–5 और 6–8 जोड़ें। किसी भी गलत एंट्री पर सीधे <b>Edit</b> या <b>Delete</b> कर सकते हैं — या AI से बोलकर सीधे अपडेट करें!'
            : '<b>Rice & Stock Entry:</b><br>Open Registers → Rice Stock → <b>3-dot (⋮) → Quick Restock</b> for KG–5 & 6–8, or edit/delete any entry directly in-place — or just speak to the AI Assistant!';
        }
      },
      {
        id: 'cash_scheme_wd', w: 6,
        k: ['cashbook', 'bank', 'withdrawal', 'cheque', 'scheme', 'other', 'reconcile', 'कैशबुक', 'बैंक', 'निकासी', 'चेक', 'योजना'],
        a: function (hi) {
          return hi
            ? '<b>रोकड़ बही, बैंक निकासी व अन्य योजना:</b><br>• <b>Withdrawal:</b> Cheque No. सहित बैंक निकासी डालें — Cashbook में अपने आप कॉन्ट्रा एंट्री होगी।<br>• <b>Other Scheme Amount:</b> विशेष योजना की राशि व खर्च अलग से ट्रैक व Settle करें।<br>• <b>Cashbook:</b> दैनिक व्यय अपने आप Cash-in-Hand से घटता है और 100% बैंक मिलान होता है!'
            : '<b>Cashbook, Withdrawal & Other Schemes:</b><br>• <b>Withdrawal:</b> Enter bank withdrawals with Cheque No. for automatic contra entries.<br>• <b>Other Scheme Amount:</b> Track & settle special scheme grants separately.<br>• <b>Cashbook:</b> Daily expenditure auto-deducts from Cash-in-Hand for 100% bank reconciliation!';
        }
      },
      {
        id: 'rates', w: 6,
        k: ['6.78', '10.17', 'cooking', '100', '150', 'दर', 'कुकिंग'],
        a: function (hi) {
          return hi
            ? '<b>PM-POSHAN मानक:</b> प्राथमिक (1–5) के लिए <b>₹6.78</b> व 100 ग्राम चावल, तथा उच्च प्राथमिक (6–8) के लिए <b>₹10.17</b> व 150 ग्राम चावल प्रति छात्र प्रतिदिन इनबिल्ट हैं।<br>👉 <a href="#calculator" class="text-brand-green font-bold underline">Live Calculator देखें</a>'
            : '<b>PM-POSHAN Norms:</b> Primary (1–5) uses <b>₹6.78</b> & 100g rice, and Upper Primary (6–8) uses <b>₹10.17</b> & 150g rice per student daily.<br>👉 <a href="#calculator" class="text-brand-green font-bold underline">Try Live Calculator</a>';
        }
      },
      {
        id: 'privacy_govt', w: 6,
        k: ['government', 'privacy', 'offline', 'data', 'server', 'secure', 'drive', 'बैकअप', 'प्राइवेसी', 'सरकारी'],
        a: function (hi) {
          return hi
            ? '<b>PoshanKosh एक स्वतंत्र शिक्षक ऐप है (सरकारी ऐप नहीं)</b>। यह 100% ऑफलाइन चलता है — आपका सारा स्कूल व वित्तीय डेटा सिर्फ आपके फोन और आपके अपने Google Drive में रहता है, हमारे सर्वर पर नहीं।'
            : '<b>PoshanKosh is an independent teacher utility app (not a government app)</b>. It works 100% offline — all financial and school data stays strictly on your device and your own Google Drive.';
        }
      },
      {
        id: 'download_support', w: 6,
        k: ['download', 'install', 'support', 'email', 'contact', 'डाउनलोड', 'इंस्टॉल', 'संपर्क', 'मदद'],
        a: function (hi) {
          return hi
            ? 'लेटेस्ट Android APK आप सीधे <a href="#download" class="text-brand-green font-bold underline">Download Section</a> से बिना किसी नए टैब के डाउनलोड कर सकते हैं। किसी भी सहायता के लिए लिखें: <b>support@poshankosh.com</b>'
            : 'You can download the latest Android APK directly from the <a href="#download" class="text-brand-green font-bold underline">Download Section</a> without leaving this page. For help, email <b>support@poshankosh.com</b>.';
        }
      },
      {
        id: 'report_card', w: 6,
        k: ['report card', 'marksheet', 'percentage', 'marks', 'future', 'रिपोर्ट कार्ड', 'प्रतिशत'],
        a: function (hi) {
          return hi
            ? '🚀 <b>Student Report Card & Percentage Generator</b> जल्द ही अगले अपडेट में आने वाला है — जिससे छात्रों का रिजल्ट और प्रतिशत भी ऐप के अंदर बन सकेगा!'
            : '🚀 <b>Student Report Card & Percentage Generator</b> is coming soon in an upcoming update so you can generate student marksheets and percentages right inside PoshanKosh!';
        }
      }
    ];

    var FAQ_KB = [{"id": "q1", "q": "How do I create a school account in PoshanKosh®?", "a": "Open the app and tap 'Sign in with Google' using your school or personal Gmail, tick the Google Drive permission box, select your State/UT (28 States & 8 UTs), and enter your School Name, UDISE code, and Opening Balances."}, {"id": "q2", "q": "Which states and union territories are supported in PoshanKosh®?", "a": "PoshanKosh® supports schools across all 28 States and 8 Union Territories of India."}, {"id": "q3", "q": "Why should I tick the Google Drive permission box during login?", "a": "Ticking the Google Drive permission allows PoshanKosh® to store encrypted backups inside your school's private drive.appdata folder so you never lose data if you change phones."}, {"id": "q4", "q": "Can I use PoshanKosh® without a desktop computer?", "a": "Yes, PoshanKosh® is designed for standard Android smartphones and tablets—no desktop or laptop is required."}, {"id": "q5", "q": "What Opening Balances do I need when starting?", "a": "Enter your verified month-start Opening Cash Balance, Opening Bank Balance, and Opening Rice Stock (for KG–5 and 6–8)."}, {"id": "q6", "q": "Can I change my School Name or UDISE details later?", "a": "Yes, go to Home → Top-Right Settings / Profile to review or update school profile details."}, {"id": "q7", "q": "Does PoshanKosh® work for both Primary (KG–5) and Upper Primary (6–8)?", "a": "Yes, both KG–5 and 6–8 sections are supported together with separate rice norms (100g/150g) and cooking cost norms (₹6.78/₹10.17)."}, {"id": "q8", "q": "Can an Upgraded +2 or Middle School with classes 1 to 8 use one account?", "a": "Yes, classes 1–5 and 6–8 are managed seamlessly inside a single school profile."}, {"id": "q9", "q": "Do I need to create a password separately?", "a": "No, Google Sign-In handles authentication securely without needing a separate password."}, {"id": "q10", "q": "Is registration open for teachers across rural and urban schools?", "a": "Yes, any teacher, headmaster, or MDM nodal teacher can set up their school in under 2 minutes."}, {"id": "q11", "q": "What happens immediately after I register my school?", "a": "Your school receives an instant 30-day active free trial with full offline access to all registers and PDFs."}, {"id": "q12", "q": "Can multiple teachers in the same school view backups?", "a": "If the school signs in with the school's shared Google account, encrypted Drive backups can be restored on the authorized device."}, {"id": "q13", "q": "Where do I mark daily student attendance?", "a": "Open Home → Daily Attendance (or the Attendance tab at the bottom), select the date, enter present counts, and tap Save."}, {"id": "q14", "q": "Does attendance calculate rice and cooking cost automatically?", "a": "Yes, saving daily attendance automatically deducts 100g (Primary) and 150g (Upper Primary) rice and posts ₹6.78 / ₹10.17 cooking costs."}, {"id": "q15", "q": "Does PoshanKosh® track SC, ST, OBC, General, Boys, and Girls counts?", "a": "Yes, daily attendance supports category-wise (SC/ST/OBC/Gen) and gender-wise (Boys/Girls) counts required for MPR reporting."}, {"id": "q16", "q": "How do I mark Egg, Fruit, or Ragi served on a specific day?", "a": "Inside Daily Attendance for that date, select Egg, Fruit, or Ragi options before tapping Save."}, {"id": "q17", "q": "What if school was closed on a holiday or Sunday?", "a": "You do not mark meal attendance on holidays; the monthly calendar in MPR automatically reflects active serving days."}, {"id": "q18", "q": "Can I mark attendance for a past date if I forgot yesterday?", "a": "Yes, select the past date in Daily Attendance, enter the counts, and Save—totals recalculate automatically."}, {"id": "q19", "q": "Does daily attendance update Chakhna (Tasting) and Daily Expenditure together?", "a": "Yes, saving attendance updates Daily Expenditure, Rice consumption, Egg/Fruit, Ragi, and Chakhna registers."}, {"id": "q20", "q": "What is the rice norm for Primary (KG–5) students?", "a": "100 grams (0.100 kg) per present student per day."}, {"id": "q21", "q": "What is the rice norm for Upper Primary (6–8) students?", "a": "150 grams (0.150 kg) per present student per day."}, {"id": "q22", "q": "What are the current cooking cost norms in PoshanKosh®?", "a": "₹6.78 per student per day for Primary (KG–5) and ₹10.17 per student per day for Upper Primary (6–8)."}, {"id": "q23", "q": "Can I enter 0 present students in one section if only Primary attended?", "a": "Yes, you can enter 0 for 6–8 and actual counts for KG–5 (or vice versa)."}, {"id": "q24", "q": "How fast does daily entry take once set up?", "a": "Less than 30 seconds a day."}, {"id": "q25", "q": "Where do I add new Rice stock in PoshanKosh®?", "a": "Go to Registers → Rice Stock Register → tap the top-right 3-dot (⋮) menu → Quick Restock, enter KG–5 and 6–8 quantities, and Save."}, {"id": "q26", "q": "Where do I add Cooking Cost, Egg, or Ragi funds received?", "a": "Open Daily Expenditure, Egg/Fruit, or Ragi register → tap the top-right 3-dot (⋮) menu → Quick Restock, enter KG–5 and 6–8 amounts, and Save."}, {"id": "q27", "q": "Do I have to manually add KG–5 and 6–8 totals in Quick Restock?", "a": "No, PoshanKosh® automatically calculates and displays the combined Total at the bottom as you type KG–5 and 6–8 shares."}, {"id": "q28", "q": "Does adding physical Rice stock change my Cashbook bank balance?", "a": "No, physical Rice restock only updates rice quantity (KG) and never alters Cashbook bank entries."}, {"id": "q29", "q": "Do Cooking Cost, Egg, or Ragi fund receipts auto-post to Cashbook?", "a": "Yes, fund receipts entered via Quick Restock automatically post to Cashbook bank receipts under their respective particulars."}, {"id": "q30", "q": "Can I add stock from inside Cashbook?", "a": "No, stock should be added inside the specific register's 3-dot (⋮) Quick Restock menu so both stock and bank records stay synchronized."}, {"id": "q31", "q": "What if my school only received rice for KG–5 and not 6–8?", "a": "Enter the KG–5 quantity and leave 6–8 as 0; the total updates cleanly."}, {"id": "q32", "q": "Can I enter rice stock in kilograms with decimals?", "a": "Yes, fractional quantities are supported accurately."}, {"id": "q33", "q": "Where can I see my remaining rice balance after adding stock?", "a": "Inside Registers → Rice Stock Register, closing balances update immediately after every restock and daily attendance entry."}, {"id": "q34", "q": "Why is Quick Restock placed under the 3-dot (⋮) menu?", "a": "Keeping Quick Restock in the top-right 3-dot menu keeps the main register table clean and readable like a printed ledger."}, {"id": "q35", "q": "Can I record multiple restocks in the same month?", "a": "Yes, every restock entry is dated and added chronologically to your stock balance."}, {"id": "q36", "q": "Does Quick Restock work offline?", "a": "Yes, all stock additions work 100% offline."}, {"id": "q37", "q": "How do I edit or correct a past Attendance entry?", "a": "Open Attendance, select that exact date, tap Edit (✏️) or update the student counts, and tap Save—all downstream registers recalculate automatically."}, {"id": "q38", "q": "How do I fix a mistake in Rice or Fund stock?", "a": "Open the respective Register, tap the row you want to correct, tap Edit (✏️), update the figure, and Save."}, {"id": "q39", "q": "When I update an old date, do closing balances for later dates update automatically?", "a": "Yes, PoshanKosh® automatically recalculates all subsequent daily totals and closing balances."}, {"id": "q40", "q": "Can I edit a Cheque Withdrawal entry if I typed the wrong Cheque No.?", "a": "Yes, open Withdrawal Register, select the entry, update the Cheque No. or amount, and Save."}, {"id": "q41", "q": "Can I fix a Cashbook entry date or narration?", "a": "Yes, open Cashbook, tap the entry to edit, and save—Cashbook sorts automatically by DD-MM-YYYY and time."}, {"id": "q42", "q": "Can I delete a duplicate test entry?", "a": "Yes, open that entry row and use the delete/edit option to remove duplicates cleanly."}, {"id": "q43", "q": "Will editing a register entry break my Bank Statement match?", "a": "If a reconciled entry is modified, Cashbook recalculates the balance so you can verify the match immediately."}, {"id": "q44", "q": "Can I update Opening Balances after starting?", "a": "Yes, Opening Balances can be adjusted from the setup/opening balance editor if an audit correction is required."}, {"id": "q45", "q": "Do I need internet to edit or update entries?", "a": "No, all edits and recalculations happen instantaneously offline on your device."}, {"id": "q46", "q": "Is there a separate 'Edit' tab in the bottom bar?", "a": "No, editing is done directly on any date or row inside Attendance, Registers, or Cashbook."}, {"id": "q47", "q": "How does Cashbook sort entries after I edit a date?", "a": "Cashbook sorts entries chronologically by DD-MM-YYYY, creation timestamp, and ID while preserving accurate cash positions."}, {"id": "q48", "q": "Are previous months protected when I add a new month?", "a": "Yes, October's verified closing balance carries forward smoothly as November's Opening Balance."}, {"id": "q49", "q": "Which 12+ statutory registers are included in PoshanKosh®?", "a": "Daily Expenditure, Cashbook, Rice Stock, Ragi/Millet, Egg/Fruit, IFA Iron, Chakhna (Tasting), Daily Attendance, Weekly, Monthly MPR, Quarterly UC, Half-Yearly, and Annual Audit (+ Withdrawal & Scheme Registers)."}, {"id": "q50", "q": "What is the Chakhna Panji (Food Tasting Register)?", "a": "A daily register certifying that food was tasted for quality, hygiene, and taste by a teacher, cook, or SMC member before serving students."}, {"id": "q51", "q": "What is the Ragi (Millet) Register?", "a": "Tracks Shree Anna / Ragi laddoo distribution, daily gram consumption, receipts, and closing stock."}, {"id": "q52", "q": "What is the IFA Iron & Folic Acid Register?", "a": "Tracks weekly distribution and monthly stock of Pink (Primary) and Blue (Upper Primary) IFA tablets under WIFS."}, {"id": "q53", "q": "What is the Egg / Fruit Register?", "a": "Records present counts on distribution days, total cost, and fund receipts/balances."}, {"id": "q54", "q": "Where do I record special grants like Kitchen Utensils or Gas?", "a": "Go to Registers → Scheme Register to add the grant, log split expenses, and mark the scheme as Settled."}, {"id": "q55", "q": "Does Scheme Register support split expenses across items?", "a": "Yes, the Scheme Register uses a clean 3-field form and a 9-column split-expense table."}, {"id": "q56", "q": "How does the Withdrawal Register work?", "a": "Go to Home → Withdrawal (or Registers → Withdrawal Register), enter Date, Amount, and Cheque No.; it automatically posts a Bank-to-Cash contra entry in Cashbook."}, {"id": "q57", "q": "Why does Withdrawal Register ask for Cheque No.?", "a": "Including Cheque No. creates proper audit-ready contra narration in your Cashbook without duplicate reference lines."}, {"id": "q58", "q": "Where is the Register tab located?", "a": "It is the 4th tab ('Registers') in the bottom navigation bar."}, {"id": "q59", "q": "Can I view month-wise registers using a Month Picker?", "a": "Yes, the Enterprise Month Picker lets you switch cleanly between any month and year."}, {"id": "q60", "q": "Do all 12+ registers stay synced with Daily Attendance?", "a": "Yes, entering attendance once automatically updates all dependent registers."}, {"id": "q61", "q": "Where is the Cashbook located in the app?", "a": "Tap Home → Cashbook (or Registers → Cashbook)."}, {"id": "q62", "q": "What date format does the Cashbook use?", "a": "Standard Indian DD-MM-YYYY format, sorted chronologically and time-wise."}, {"id": "q63", "q": "How do I match my Bank Statement with Cashbook?", "a": "Inside Cashbook, upload your monthly Bank Statement (PDF, CSV, or Photo) and match entries one-to-one."}, {"id": "q64", "q": "Can PoshanKosh® auto-fill missed bank entries?", "a": "Yes, 1-to-1 statement auto-fill lets you pull missed bank receipts, interest, or charges directly into Cashbook."}, {"id": "q65", "q": "How do I add Bank Interest or Bank Charges?", "a": "Inside Cashbook, use the Bank Interest / Bank Charge entry option (or auto-fill directly from your uploaded bank statement)."}, {"id": "q66", "q": "What is the Royal Blue POSHANKOSH VERIFIED seal?", "a": "When your Cashbook and Bank Statement reconcile 100%, Cashbook displays the Royal Blue CA-style 'POSHANKOSH VERIFIED' stamp."}, {"id": "q67", "q": "Are Closing Balance C/F and Total rows clearly formatted in Cashbook?", "a": "Yes, Closing Balance C/F and Total rows are bold and cleanly aligned for easy audit review."}, {"id": "q68", "q": "What if my Bank Statement is a photo instead of a PDF?", "a": "PoshanKosh® supports PDF, CSV, and Photo bank statements."}, {"id": "q69", "q": "What is the 7-Day Low Cash Alert?", "a": "PoshanKosh® monitors your available cooking cash and alerts you locally 7 days before funds run low."}, {"id": "q70", "q": "Does Cashbook separate Bank balance and Cash-in-hand?", "a": "Yes, Bank and Cash columns are tracked separately with proper contra entries for withdrawals."}, {"id": "q71", "q": "Can I generate an MPR PDF before finishing Bank Statement matching?", "a": "Yes, Draft Mode lets you generate the MPR PDF immediately even before complete bank reconciliation."}, {"id": "q72", "q": "Does PoshanKosh® upload my bank statement to any server?", "a": "No—bank statement parsing and matching happen locally, and zero financial records are stored on our servers."}, {"id": "q73", "q": "Where do I generate Monthly Vouchers and MPR PDFs?", "a": "Open the 5th bottom tab ('Reports')."}, {"id": "q74", "q": "Which 4 Monthly Vouchers does PoshanKosh® generate?", "a": "Vr 1: Ration & Dry Groceries, Vr 2: Egg & Fruit, Vr 3: Fresh Vegetables, and Vr 4: Cooking Fuel & LPG."}, {"id": "q75", "q": "Do Monthly Vouchers auto-post to Cashbook expenses?", "a": "Yes, all 4 monthly vouchers automatically post into your Cashbook expense column."}, {"id": "q76", "q": "What does the 2-page MPR PDF contain?", "a": "Page 1 & 2 include the monthly calendar, plates served, class 1–8 breakdown, stock tables 3A–3D, bank reconciliation summary, and 3 signature blocks."}, {"id": "q77", "q": "Can I print MPR PDFs in Hindi or English?", "a": "Yes, PoshanKosh® supports bilingual Hindi and English MPR PDF output."}, {"id": "q78", "q": "What is MPR Draft Mode?", "a": "Draft Mode allows you to preview and generate the MPR PDF immediately without blocking on complete bank reconciliation or caste breakdown."}, {"id": "q79", "q": "Can I share the generated PDF via WhatsApp or print it directly?", "a": "Yes, exported PDFs save cleanly to your device so you can print or share them with your BRC/office."}, {"id": "q80", "q": "Are voucher numbers formatted automatically (e.g., Vr 1/2026)?", "a": "Yes, voucher sequences and month/year references format automatically."}, {"id": "q81", "q": "Do I need to re-type attendance numbers for MPR?", "a": "No, every table in the MPR pulls directly from your daily attendance and register entries."}, {"id": "q82", "q": "How long does it take to export all 4 vouchers and MPR?", "a": "Under 2 minutes at the end of the month."}, {"id": "q83", "q": "Can I regenerate an old month's MPR PDF anytime?", "a": "Yes, select any past month in the Month Picker and export its PDF anytime."}, {"id": "q84", "q": "Are signature blocks included at the bottom of the MPR PDF?", "a": "Yes, 3 signature blocks are included for Headmaster, SMC, and official verification."}, {"id": "q85", "q": "Does PoshanKosh® work without internet in rural schools?", "a": "Yes, 100% of daily attendance, registers, cashbook, vouchers, and PDF generation work completely offline."}, {"id": "q86", "q": "Where is my school data stored when offline?", "a": "In an encrypted local SQLite database (sqlite3mc) right on your Android phone."}, {"id": "q87", "q": "How do I back up my data to Google Drive?", "a": "Go to Home → Top-Right Settings → Google Drive Backup → Backup Now when internet is available."}, {"id": "q88", "q": "Where in Google Drive are my backups saved?", "a": "Inside your Google account's hidden, app-private drive.appdata folder—not visible to other apps or our servers."}, {"id": "q89", "q": "How do I restore my data on a new phone?", "a": "Install PoshanKosh® on your new phone and sign in with the exact same Google account used for backup."}, {"id": "q90", "q": "What happens if I update the APK to a newer version?", "a": "Because releases use a permanent upload keystore, updating the APK installs cleanly in-place without uninstalling or losing your data."}, {"id": "q91", "q": "Does my 30-day trial or paid license work offline?", "a": "Yes, verified license entitlements are cached securely offline on your device so you are never blocked in zero-network zones."}, {"id": "q92", "q": "How often should I tap Backup Now?", "a": "Once a week or at the end of every month after completing your vouchers and MPR."}, {"id": "q93", "q": "Can another school see my Google Drive backup?", "a": "No, each backup lives inside your own private Google account."}, {"id": "q94", "q": "What if I forget to back up for a few days?", "a": "Your data remains safely stored in your phone's encrypted local database until you sync."}, {"id": "q95", "q": "Is PoshanKosh® a government app?", "a": "No. PoshanKosh® is an independent, individual utility built for teachers—it is NOT a government app and makes no claim to represent any ministry or department."}, {"id": "q96", "q": "Does PoshanKosh® store any financial transaction data on its servers?", "a": "Zero. PoshanKosh® never stores your cashbook, bank statements, vouchers, scheme grants, or stock data on its servers."}, {"id": "q97", "q": "What minimal data does PoshanKosh® use to run?", "a": "Only minimal account identity (name, email, school UDISE/state) and subscription/trial status—never your school's financial ledger."}, {"id": "q98", "q": "Does PoshanKosh® show advertisements?", "a": "No, PoshanKosh® is 100% ad-free."}, {"id": "q99", "q": "Does PoshanKosh® sell teacher or student data?", "a": "Never. We do not sell, rent, or share user data with third-party advertisers or brokers."}, {"id": "q100", "q": "Is PoshanKosh® compliant with India's DPDP Act 2023?", "a": "Yes, our Privacy Policy and data minimization architecture are aligned with the Digital Personal Data Protection (DPDP) Act, 2023."}, {"id": "q101", "q": "Does PoshanKosh® follow Google API Services User Data Policy?", "a": "Yes, Google Drive access is strictly limited to app-private drive.appdata backups under Google's Limited Use policy."}, {"id": "q102", "q": "How is my local database protected on my phone?", "a": "Using SQLite encryption (sqlite3mc) inside private app storage."}, {"id": "q103", "q": "Can I read the full Privacy Policy and Terms?", "a": "Yes, visit poshankosh.com/privacy.html and poshankosh.com/terms.html anytime."}, {"id": "q104", "q": "Who do I contact for privacy or data deletion requests?", "a": "Email anantchandraushaamallick07@gmail.com or visit poshankosh.com/contact.html."}, {"id": "q105", "q": "Is there a free trial before paying?", "a": "Yes, every newly registered school gets a full 30-day free trial with offline access."}, {"id": "q106", "q": "Why does PoshanKosh® charge ₹119 per year?", "a": "There is no corporate funding or ads; ₹119 covers cloud server hosting, deployment, domain maintenance, and modest support for the developer."}, {"id": "q107", "q": "Are there any hidden monthly fees after ₹119?", "a": "No, ₹119 covers the full annual license with zero ads."}, {"id": "q108", "q": "Which payment methods are supported?", "a": "UPI and standard digital payment options (such as PhonePe/UPI) inside the app."}, {"id": "q109", "q": "What is the refund policy?", "a": "Please review Section 9 of Terms & Conditions at poshankosh.com/terms.html for full refund eligibility and grievance timelines."}, {"id": "q110", "q": "Where can I download the official PoshanKosh® APK?", "a": "From poshankosh.com/#download or the official GitHub Releases link on the website."}, {"id": "q111", "q": "Which Android version is required?", "a": "Works smoothly on standard Android smartphones (ARM64 release APK v0.16.4)."}, {"id": "q112", "q": "What if I face an issue or have a feature request?", "a": "Email anantchandraushaamallick07@gmail.com with your school UDISE and screenshot for fast support."}, {"id": "q113", "q": "Where can I read the founder's story behind PoshanKosh®?", "a": "Visit poshankosh.com/journey.html to read how a teacher father's late-night register struggle inspired PoshanKosh®."}, {"id": "q114", "q": "Which courts have jurisdiction over legal disputes?", "a": "Courts in Ranchi, Jharkhand, India, as stated in Terms & Conditions."}];

    var freshForm = form.cloneNode(true);
    form.parentNode.replaceChild(freshForm, form);
    inp = document.getElementById('ai-input');
    var defaultPlaceholder = inp.getAttribute('placeholder') || 'Type or speak your query...';

    // Always render Mic (🎤) + Voice Toggle (🔊) in UI
    if (!document.getElementById('pk-mic-btn')) {
      var micBtn = document.createElement('button');
      micBtn.id = 'pk-mic-btn';
      micBtn.type = 'button';
      micBtn.title = 'बोलकर पूछें (Voice Input)';
      micBtn.className = 'px-3 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 border border-slate-300 text-slate-700 font-bold text-sm shrink-0';
      micBtn.textContent = '🎤';

      var spkBtn = document.createElement('button');
      spkBtn.id = 'pk-spk-btn';
      spkBtn.type = 'button';
      spkBtn.title = 'Voice Output On/Off';
      spkBtn.className = 'px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold text-sm shrink-0';
      spkBtn.textContent = '🔊';
      spkBtn.addEventListener('click', function () {
        voiceOn = !voiceOn;
        spkBtn.textContent = voiceOn ? '🔊' : '🔇';
        if (!voiceOn && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      });

      var sendBtn = freshForm.querySelector('button[type="submit"]');
      if (sendBtn) {
        freshForm.insertBefore(micBtn, sendBtn);
        freshForm.insertBefore(spkBtn, sendBtn);
      }

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
            inp.placeholder = 'सुन रही हूँ... बोलिए (Listening...)';
            rec.start();
          } catch (_) { listening = false; }
        });
        rec.onresult = function (ev) {
          var transcript = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : '';
          if (transcript) {
            inp.value = transcript;
            freshForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          }
        };
        rec.onend = function () {
          listening = false;
          micBtn.textContent = '🎤';
          micBtn.classList.remove('bg-red-50', 'border-red-400');
          inp.placeholder = defaultPlaceholder;
        };
        rec.onerror = function () {
          listening = false;
          micBtn.textContent = '🎤';
          micBtn.classList.remove('bg-red-50', 'border-red-400');
          inp.placeholder = defaultPlaceholder;
        };
      } else {
        micBtn.addEventListener('click', function () {
          var msg = '🎤 बोलकर पूछने के लिए कृपया पेज को <b>Chrome / Safari</b> में खोलें या मोबाइल कीबोर्ड का माइक उपयोग करें।';
          box.innerHTML += '<div class="flex items-start gap-2.5"><div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div><div class="bg-white p-3 rounded-2xl text-slate-700 border border-slate-200 text-xs">' + msg + '</div></div>';
          box.scrollTop = box.scrollHeight;
          speakText(msg);
        });
      }
    }

    // Wire Quick Chips & Clear Button cleanly to new form
    document.querySelectorAll('.quick-chip').forEach(function (c) {
      var nc = c.cloneNode(true);
      c.parentNode.replaceChild(nc, c);
      nc.addEventListener('click', function () {
        inp.value = nc.dataset.q || nc.textContent;
        freshForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
    });

    freshForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = inp.value.trim();
      if (!raw) return;
      inp.value = '';
      var hi = detectUserHindi(raw);
      var safeUser = raw.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      box.innerHTML += '<div class="flex justify-end"><div class="bg-brand-green text-white p-3 rounded-2xl text-xs sm:text-sm max-w-[85%]">' + safeUser + '</div></div>';

      var nRaw = norm(raw);
      var words = nRaw.split(/\s+/).filter(Boolean);

      // Handle short/ambiguous follow-ups or clarifying questions
      var reply = null;
      if (ctx.pendingClarify === 'entry_type') {
        if (/attendance|हाजिरी/.test(nRaw)) reply = topics.find(function (t) { return t.id === 'attendance'; }).a(hi);
        else if (/student|रोल|नाम/.test(nRaw)) reply = topics.find(function (t) { return t.id === 'student_name'; }).a(hi);
        else if (/rice|egg|ragi|stock|स्टॉक/.test(nRaw)) reply = topics.find(function (t) { return t.id === 'stock_rice'; }).a(hi);
        else if (/chakhna|चखना/.test(nRaw)) reply = topics.find(function (t) { return t.id === 'chakhna'; }).a(hi);
        if (reply) ctx.pendingClarify = null;
      }

      if (!reply && /^(entry|help|madad|problem|dikkat|register|samasya|kya hai|batao)$/i.test(nRaw)) {
        ctx.pendingClarify = 'entry_type';
        reply = hi
          ? 'ज़रूर! थोड़ा स्पष्ट बताइए — आप किस बारे में जानना चाहते हैं: <b>(1) AI हाजिरी</b>, <b>(2) छात्र नाम एंट्री</b>, <b>(3) चावल/अंडा/रागी स्टॉक</b>, या <b>(4) चखना पंजी / ₹119–₹149 प्लान</b>?'
          : 'Sure! Could you clarify which topic you want help with: <b>(1) AI Attendance</b>, <b>(2) Student Name Entry</b>, <b>(3) Rice/Egg/Ragi Stock</b>, or <b>(4) Chakhna Panji / ₹119–₹149 Plans</b>?';
      }

      if (!reply) {
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

        var faqBest = null, faqScore = 0;
        if (bestScore < 12) {
          var stop = {the:1,is:1,in:1,to:1,of:1,and:1,for:1,how:1,what:1,can:1,do:1,does:1,my:1,me:1,a:1,an:1,or:1,kya:1,kaise:1,hai:1,ko:1,me:1,ke:1,ki:1,ka:1,poshankosh:1};
          var qWords = words.filter(function (w) { return w.length > 2 && !stop[w]; });
          FAQ_KB.forEach(function (item) {
            var hay = (item.q + ' ' + item.a).toLowerCase();
            var qLow = item.q.toLowerCase();
            var sc = 0;
            qWords.forEach(function (w) {
              if (qLow.indexOf(w) !== -1) sc += 4;
              else if (hay.indexOf(w) !== -1) sc += 2;
            });
            if (sc > faqScore) { faqScore = sc; faqBest = item; }
          });
        }

        if (best && bestScore >= 12) {
          ctx.lastTopic = best.id;
          reply = typeof best.a === 'function' ? best.a(hi) : best.a;
        } else if (faqBest && faqScore >= 4) {
          reply = '<b>' + faqBest.q + '</b><br>' + faqBest.a + '<br>👉 <a href="faqs.html#' + faqBest.id + '" class="text-brand-green font-bold underline">' + faqBest.id.toUpperCase() + ' देखें</a>';
        } else if (best && bestScore > 0) {
          ctx.lastTopic = best.id;
          reply = typeof best.a === 'function' ? best.a(hi) : best.a;
        } else {
          ctx.pendingClarify = 'entry_type';
          reply = hi
            ? 'मैं आपकी पूरी बात समझना चाहती हूँ — क्या आप <b>AI हाजिरी</b>, <b>छात्र नाम एंट्री</b>, <b>चावल/अंडा/रागी स्टॉक</b>, <b>चखना पंजी</b>, या <b>₹119 vs ₹149 प्लान</b> के बारे में पूछ रहे हैं?'
            : 'I want to make sure I answer accurately — are you asking about <b>AI Attendance</b>, <b>Student Name Entry</b>, <b>Rice/Egg/Ragi Stock</b>, <b>Chakhna Panji</b>, or <b>₹119 vs ₹149 Pricing</b>?';
        }
      }

      setTimeout(function () {
        box.innerHTML += '<div class="flex items-start gap-2.5"><div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div><div class="bg-white p-3.5 rounded-2xl text-slate-800 border border-slate-200 shadow-2xs max-w-[85%] text-xs sm:text-sm leading-relaxed">' + reply + '</div></div>';
        box.scrollTop = box.scrollHeight;
        speakText(reply);
      }, 150);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAIAgent);
  } else {
    startAIAgent();
  }
})();
