// PoshanKosh® S+ Tier Voice + Message AI Agent (125 Master Q&As + 114 FAQs + Deep Follow-Up)
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
      if (/\b(kya|ky|kaise|krna|karna|kaha|kitna|chahiye|batao|btaiye|samjhao|smjhao|paisa|paise|rupya|rupaye|chawal|anda|pani|chhutti|chutti|nahi|ni|haan|hn|accha|achha|bhai|boss|sir|madam|aur|or|mein|me|se|ko|ka|ki|ke|hai|h|ho|kar|kro|karo|dalo|dikhao|bata|sarkari|galti|galat|madad|sahayta|samay|bachat|farzi|nakli|chhed|bypass|bina|mila|milega)\b/i.test(txt)) return true;
      if (/^[a-z0-9\s.,?!₹-]+$/i.test(txt) && txt.split(/\s+/).length >= 3) return false;
      return isHindiMode();
    }

    var voiceOn = true, handsFree = false, listening = false, isSpeaking = false;
    var rec = null, micBtn = null;
    var defaultPlaceholder = inp.getAttribute('placeholder') || 'Type or speak...';
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

    function updateMicUi(active) {
      if (!micBtn || !micBtn.classList) return;
      if (active) {
        micBtn.textContent = '🔴';
        micBtn.classList.add('bg-red-50', 'border-red-400');
        inp.placeholder = 'सुन रही हूँ... (बोलें या "धन्यवाद" कहें)';
      } else {
        micBtn.textContent = '🎤';
        micBtn.classList.remove('bg-red-50', 'border-red-400');
        inp.placeholder = defaultPlaceholder;
      }
    }

    function startMicLoop() {
      if (!rec || !handsFree || listening || isSpeaking) return;
      try {
        rec.lang = isHindiMode() ? 'hi-IN' : 'en-IN';
        listening = true;
        updateMicUi(true);
        rec.start();
      } catch (_) { listening = false; }
    }

    function stopMicLoop() {
      handsFree = false;
      listening = false;
      updateMicUi(false);
      if (rec) { try { rec.stop(); } catch (_) {} }
    }

    function speakText(html) {
      if (!voiceOn || !('speechSynthesis' in window)) {
        if (handsFree) setTimeout(startMicLoop, 250);
        return;
      }
      try {
        window.speechSynthesis.cancel();
        var clean = html
          .replace(/<[^>]+>/g, ' ')
          .replace(/👉.*$/g, '')
          .replace(/[®™•⋮→🙏☀️🌤️🌆🌙🎤🔴🔊🔇✓🚀📲✉️]/g, ' ')
          .replace(/₹(\d+)/g, '$1 rupees ')
          .replace(/\s+/g, ' ')
          .trim();
        if (!clean) {
          if (handsFree) setTimeout(startMicLoop, 250);
          return;
        }
        var hasHindi = /[\u0900-\u097F]/.test(clean);
        var u = new SpeechSynthesisUtterance(clean);
        u.lang = hasHindi ? 'hi-IN' : 'en-IN';
        if (hasHindi && hiVoice) u.voice = hiVoice;
        if (!hasHindi && enVoice) u.voice = enVoice;
        u.rate = 0.92;
        u.pitch = 1.0;
        isSpeaking = true;
        if (listening && rec) { try { rec.abort(); } catch (_) {} listening = false; }
        u.onend = function () { isSpeaking = false; if (handsFree) setTimeout(startMicLoop, 250); };
        u.onerror = function () { isSpeaking = false; if (handsFree) setTimeout(startMicLoop, 250); };
        window.speechSynthesis.speak(u);
      } catch (_) {
        isSpeaking = false;
        if (handsFree) setTimeout(startMicLoop, 250);
      }
    }

    function getGreeting(hi) {
      var hr = new Date().getHours();
      if (hi) {
        if (hr >= 5 && hr < 12) return 'सुप्रभात!';
        if (hr >= 12 && hr < 17) return 'नमस्कार!';
        return 'नमस्ते!';
      }
      if (hr >= 5 && hr < 12) return 'Good morning!';
      if (hr >= 12 && hr < 17) return 'Good afternoon!';
      return 'Hello!';
    }

    function norm(s) {
      return (s || '').toLowerCase()
        .replace(/[^\w\s\u0900-\u097F.₹]/g, ' ')
        .replace(/\b(poshankosh|poshan\s*kosh|poshan|kosh|apk)\b/g, 'poshankosh')
        .replace(/(?:^|\s)(ए\s+से|एआई|ऐ\s+से|a\s+se)(?=\s|$)/g, ' ai')
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
        .replace(/\b(featur|feture|ficher|khasiyat|visheshta)\b/g, 'feature')
        .replace(/(?:^|\s)(समय|बचत|बचता|बचाता|time|save|hours)(?=\s|$)/g, ' timesave')
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

    var ctx = { pendingClarify: null, lastTopic: null, lastDeep: null };

    var topics = [
      {
        id: 'greet', w: 5,
        k: ['hello', 'hi', 'hey', 'hii', 'namaste', 'hlo', 'good morning', 'good afternoon', 'good evening', 'नमस्ते', 'हेलो', 'सुप्रभात', 'kaise ho', 'kaisa hai'],
        a: function (hi) { return hi ? getGreeting(true) + ' बताइए, PoshanKosh में क्या मदद करूँ?' : getGreeting(false) + ' How can I help you with PoshanKosh?'; }
      },
      {
        id: 'done', w: 8,
        k: ['ho gaya', 'done', 'bas', 'thank', 'thanks', 'thank you', 'dhanyawad', 'shukriya', 'bye', 'stop', 'band karo', 'धन्यवाद', 'शुक्रिया', 'हो गया', 'थैंक्स', 'बंद'],
        a: function (hi) {
          ctx.pendingClarify = null;
          stopMicLoop();
          return hi ? 'आपका बहुत-बहुत धन्यवाद! 🙏 माइक बंद कर दिया गया है, ज़रूरत पड़ने पर फिर टैप कीजिएगा।' : 'You are welcome! 🙏 Mic turned off — tap anytime if you need help again.';
        }
      },
      {
        id: 'school_email_farzi', w: 9,
        k: ['personal', 'farzi', 'fake', 'gmail', 'email', 'registered', 'फ़र्ज़ी', 'फर्जी', 'पर्सनल', 'ईमेल'],
        deep: 'यह नियम इसलिए है ताकि प्रधानाध्यापक बदलने पर भी स्कूल का डेटा व Google Drive बैकअप आधिकारिक स्कूल ईमेल ID पर ही सुरक्षित रहे।',
        a: function (hi) {
          return hi
            ? 'स्कूल का रजिस्ट्रेशन <b>केवल पंजीकृत आधिकारिक स्कूल ईमेल ID</b> से ही होगा (Personal email से नहीं)। यदि कोई फ़र्ज़ी ईमेल से किसी स्कूल की फ़र्ज़ी ID बनाता है, तो उस पर <b>सख्त कानूनी कार्रवाई (FIR व स्थायी ब्लॉक)</b> की जाएगी।'
            : 'School registration is allowed <b>only with the official registered school email ID</b> (not personal email). Creating a fake school ID will result in <b>strict legal action (FIR & permanent ban)</b>.';
        }
      },
      {
        id: 'tamper_fir', w: 9,
        k: ['bypass', 'crack', 'mod', 'tamper', 'fir', 'legal', 'cheating', 'छेडछाड', 'छेड़छाड़', 'बायपास', 'तारीख बदल', 'फ्री ट्रिक'],
        deep: 'ऐप में क्रिप्टोग्राफ़िक Ed25519 सिग्नेचर व ऐप-इंटीग्रिटी चेक लगा है; छेड़छाड़ की किसी भी कोशिश पर लाइसेंस स्वतः रद्द हो जाता है।',
        a: function (hi) {
          return hi
            ? 'सब्सक्रिप्शन में छेड़छाड़, तारीख बदलकर या बायपास करके बिना भुगतान रिपोर्ट निकालने पर <b>आप पर FIR दर्ज हो सकती है</b> और अकाउंट स्थायी रूप से ब्लॉक हो जाएगा।'
            : 'Tampering with or bypassing the subscription to generate reports without payment can lead to an <b>FIR / legal action</b> and permanent account suspension.';
        }
      },
      {
        id: 'bug_bounty', w: 9,
        k: ['bug', 'loophole', 'vulnerability', 'kamjori', 'reward', 'inam', 'बग', 'लूपहोल', 'इनाम', 'खामी'],
        deep: 'ईमानदार यूज़र्स को प्रोत्साहित करने के लिए सही सुरक्षा खामी की रिपोर्ट करने पर 1 साल का पूरा प्रो सब्सक्रिप्शन मुफ्त और नए फीचर्स का अर्ली एक्सेस दिया जाता है।',
        a: function (hi) {
          return hi
            ? 'यदि कोई बग या लूपहोल मिले तो उसका गलत उपयोग न करें — तुरंत <b>support@poshankosh.com</b> पर मेल करें। सही बग बताने वाले को <b>1 साल का सब्सक्रिप्शन FREE</b> और आने वाले एडवांस फीचर्स सबसे पहले मिलेंगे!'
            : 'If you find a bug or loophole, do not exploit it — email <b>support@poshankosh.com</b>. Valid reporters get a <b>1-Year FREE subscription</b> plus early access to upcoming advanced features!';
        }
      },
      {
        id: 'approval', w: 8,
        k: ['approval', 'approve', 'pending', 'verify', 'verification', 'admin', 'मंजूरी', 'अप्रूवल', 'पेंडिंग', 'वेरीफाई'],
        deep: 'हर 11-अंकीय UDISE पर एक ही अधिकृत स्कूल अकाउंट जुड़ता है। 24 घंटे से ज़्यादा pending रहे तो support@poshankosh.com पर UDISE भेजें।',
        a: function (hi) {
          return hi
            ? 'नए स्कूल रजिस्ट्रेशन के बाद असली प्रधानाध्यापक की पुष्टि के लिए Admin वेरिफिकेशन (<code>pending → approved</code>) होता है — मंजूरी मिलते ही सभी फीचर्स चालू हो जाते हैं।'
            : 'New school registrations undergo Admin verification (<code>pending → approved</code>) to verify Principal authority before full access unlocks.';
        }
      },
      {
        id: 'zero_data', w: 8,
        k: ['privacy', 'server', 'data', 'leak', 'chori', 'dekhta', 'government', 'डेटा', 'प्राइवेसी', 'सर्वर', 'सरकारी', 'चोरी'],
        deep: 'आपका बैंक बैलेंस, पासबुक, कैशबुक, छात्र नाम और स्टॉक 100% ऑफलाइन एन्क्रिप्टेड SQLite में रहते हैं; सर्वर पर केवल लॉगिन व प्लान स्टेटस जाँचा जाता है।',
        a: function (hi) {
          return hi
            ? '<b>PoshanKosh आपके स्कूल का कोई भी डेटा नहीं लेता है</b> और यह एक स्वतंत्र ऐप है (सरकारी नहीं)। आपका सारा डेटा केवल आपके फोन और Google Drive में रहता है, PoshanKosh के पास नहीं।'
            : '<b>PoshanKosh collects zero school financial data</b> and is an independent app (not a government portal). All records stay strictly on your device and your Google Drive.';
        }
      },
      {
        id: 'timesave', w: 7,
        k: ['timesave', 'beneficial', 'benefit', 'benefits', 'fayda', 'labh', 'फायदा', 'फायदे', 'लाभ'],
        a: function (hi) {
          return hi
            ? 'हाजिरी भरते ही <b>चावल, कुकिंग कॉस्ट, अंडा, रागी, चखना व कैशबुक</b> अपने आप अपडेट हो जाते हैं — जिससे हर महीने <b>15+ घंटे</b> बचते हैं।'
            : 'Saving attendance auto-updates <b>Rice, Cooking Cost, Egg, Ragi, Chakhna & Cashbook</b>, saving <b>15+ hours</b> every month.';
        }
      },
      {
        id: 'features', w: 7,
        k: ['feature', 'features', 'use', 'uses', 'usage', 'kaam', 'karta', 'special', 'विशेषता', 'फीचर', 'फीचर्स', 'उपयोग', 'खासियत', 'सुविधा', 'सुविधाएं'],
        a: function (hi) {
          return hi
            ? '<b>मुख्य फीचर्स:</b> 100% ऑफलाइन Voice/Text AI, AI हाजिरी व 3-Way छात्र नाम एंट्री, 12+ पंजियाँ (चखना, चावल, अंडा/रागी/IFA), कैशबुक मिलान, Bill OCR व 1-क्लिक MPR PDF।'
            : '<b>Key Features:</b> 100% offline Voice/Text AI, AI Attendance & 3-Way Name Entry, 12+ registers (Chakhna, Rice, Egg/Ragi/IFA), Cashbook sync, Bill OCR & 1-click MPR PDFs.';
        }
      },
      {
        id: 'pricing', w: 7,
        k: ['119', '149', 'price', 'plan', 'trial', 'free', 'difference', 'pro', 'standard', 'प्लान', 'अंतर', 'ट्रायल', 'फ्री'],
        deep: '₹119 प्लान में 1st AI रिपोर्ट फ्री मिलती है (अतिरिक्त पर ₹30), जबकि ₹149 प्लान में पूरे महीने अनलिमिटेड Voice AI, Bill OCR, Smart Audit व BRC WhatsApp रिपोर्ट शामिल हैं।',
        a: function (hi) {
          return hi
            ? '<b>30 दिन Free Trial</b> के बाद दो प्लान हैं: <b>₹119/माह</b> (सिर्फ Manual रजिस्टर, 1st AI रिपोर्ट फ्री) और <b>₹149/माह</b> (Manual + Unlimited Offline Voice/Text AI, OCR, Smart Audit व BRC रिपोर्ट)। <a href="#pricing" class="text-brand-green font-bold underline">तुलना देखें</a>'
            : 'After the <b>30-day Free Trial</b>: <b>₹119/mo</b> covers all manual registers (1st AI report free; ₹30/extra), while <b>₹149/mo</b> adds <b>Unlimited Offline AI</b>, OCR, Smart Audit & BRC reports. <a href="#pricing" class="text-brand-green font-bold underline">Compare</a>';
        }
      },
      {
        id: 'ai_features', w: 7,
        k: ['ai', 'voice', 'ocr', 'audit', 'forecast', 'brc', 'whatsapp', 'undo', 'assistant', 'humanoid', 'multitask', 'karwa', 'karva', 'एआई', 'वॉइस', 'ऑडिट', 'करवा'],
        a: function (hi) {
          return hi
            ? 'AI से आप बोलकर <b>हाजिरी, छात्र नाम एंट्री, स्टॉक, चखना पंजी</b> करवा सकते हैं — साथ ही <b>Bill OCR, Smart Audit, Ration Forecast, 1-Tap BRC रिपोर्ट और Voice Undo</b> भी ऑफलाइन चलते हैं।'
            : 'With PoshanKosh AI you can do voice <b>attendance, student names, stock & Chakhna Panji</b> offline — plus <b>Bill OCR, Smart Audit, Ration Forecast, BRC WhatsApp Report & Voice Undo</b>.';
        }
      },
      {
        id: 'student_name', w: 7,
        k: ['student', 'roll', 'caste', 'st', 'sc', 'obc', 'general', 'boy', 'girl', 'रोल', 'जाति', 'लड़का', 'लड़की'],
        a: function (hi) {
          return hi
            ? 'नाम एंट्री के 3 तरीके हैं: <b>Class+Roll</b> बोलकर, <b>Old→New</b> बदलकर, या गलत नाम पर तुरंत <i>"X नहीं Y"</i> बोलकर।'
            : '3 ways to update student names: speak <b>Class+Roll</b>, replace <b>Old→New</b>, or say <i>"Not X, Y"</i> to fix immediately.';
        }
      },
      {
        id: 'chakhna', w: 7,
        k: ['chakhna', 'cook', 'menu', 'remarks', 'holiday', 'calendar', 'चखना', 'रसोइया', 'मेनू', 'छुट्टी'],
        a: function (hi) {
          return hi
            ? '<b>4-कॉलम चखना पंजी:</b> दिनांक, रसोइया का नाम, मेनू और अभियुक्ति। तारीखें पहले से भरी रहती हैं और कैलेंडर की छुट्टियाँ अपने आप सिंक होती हैं।'
            : '<b>4-Column Chakhna Panji:</b> Date, Cook Name, Menu, and Remarks — pre-filled with dates and synced with school calendar holidays.';
        }
      },
      {
        id: 'egg_ragi_ifa', w: 7,
        k: ['egg', 'ragi', 'iron', 'ifa', 'monday', 'friday', 'tuesday', 'saturday', 'wednesday', 'thursday', 'अंडा', 'अंडे', 'रागी', 'आयरन', 'गोली'],
        a: function (hi) {
          return hi
            ? '<b>अंडा</b> सोम/शुक्र को (छुट्टी पर मंगल/शनि शिफ्ट), <b>रागी</b> रोज़ाना/नियमानुसार, और <b>आयरन टैबलेट</b> कक्षा 1–12 के लिए बुध/गुरु को हाजिरी से ऑटो-सिंक होता है।'
            : '<b>Egg</b> syncs Mon/Fri (shifts to Tue/Sat on holidays), <b>Ragi</b> syncs per rule, and <b>Iron Tablet</b> syncs Wed/Thu for Classes 1–12.';
        }
      },
      {
        id: 'report_card', w: 6,
        k: ['report card', 'marksheet', 'percentage', 'marks', 'future', 'रिपोर्ट कार्ड', 'प्रतिशत'],
        a: function (hi) {
          return hi ? '<b>Student Report Card & Percentage</b> फीचर अगले अपडेट में आने वाला है।' : '<b>Student Report Card & Percentage</b> generation is coming in an upcoming update.';
        }
      }
    ];

    var MASTER_KB = [{"id": 1, "q": "Naya school account kaise banaye?", "kw": "naya school account kaise banaye? shuru kaise kare register kaise hoga sign up", "a": "<b>Sign in with Google</b> दबाएँ (Drive बॉक्स टिक करें), फिर राज्य, स्कूल नाम, UDISE, कक्षा श्रेणी व 6-digit PIN सेट करें।", "deep": "हर 11-अंकीय UDISE पर केवल एक अधिकृत स्कूल Google अकाउंट जुड़ता है।"}, {"id": 2, "q": "Account pending kyun dikha raha hai / Approval kab milega?", "kw": "account pending kyun dikha raha hai / approval kab milega? approval system verify kab hoga chalu kyun nahi ho raha", "a": "फर्जी UDISE रोकने के लिए Admin पहले प्रधानाध्यापक की पुष्टि (`pending → approved`) करता है; स्वीकृति मिलते ही ऐप चालू हो जाता है।", "deep": "यदि 24 घंटे से ज़्यादा `pending` रहे तो UDISE व रजिस्टर्ड Gmail <b>support@poshankosh.com</b> पर भेजें।"}, {"id": 3, "q": "UDISE already claimed error aa raha hai?", "kw": "udise already claimed error aa raha hai? udise pehle se juda hai kisi aur ne le liya", "a": "वह UDISE पहले किसी और Gmail से जुड़ चुका है — <b>support@poshankosh.com</b> पर स्कूल पत्र भेजकर Admin Transfer करवाएँ।", "deep": ""}, {"id": 4, "q": "Principal transfer ya retirement par account kaise badle?", "kw": "principal transfer ya retirement par account kaise badle? sir badal gaye dusre teacher ko dena hai", "a": "नए प्रधानाध्यापक का Gmail व स्कूल प्रमाण <b>support@poshankosh.com</b> पर भेजें; Admin पुराने से नए Gmail पर ट्रांसफर कर देगा।", "deep": ""}, {"id": 5, "q": "6-digit PIN bhul gaye toh kya karein?", "kw": "6-digit pin bhul gaye toh kya karein? pin yaad nahi pin reset lock khulega kaise", "a": "लॉगिन स्क्रीन पर <b>PIN Reset</b> दबाकर अपने पंजीकृत Google अकाउंट से नया 6-digit PIN सेट करें (ऑनलाइन)।", "deep": ""}, {"id": 6, "q": "PIN dalne par \"Incomplete demographic attendance\" ya \"पूर्ण संख्या भरें\" error aaye toh?", "kw": "pin dalne par \"incomplete demographic attendance\" ya \"पूर्ण संख्या भरें\" error aaye toh? pin ke baad error login nahi ho raha", "a": "यह पुराने अधूरे हाजिरी डेटा से होता था — लेटेस्ट APK अपडेट करते ही ऐप खुलते समय यह त्रुटि अपने आप ठीक हो जाती है।", "deep": ""}, {"id": 7, "q": "Biometric / Fingerprint se login chalega kya?", "kw": "biometric / fingerprint se login chalega kya? angutha se khulega face lock", "a": "हाँ, लॉगिन स्क्रीन पर <b>बायोमेट्रिक / फोन लॉक</b> से भी तुरंत अनलॉक कर सकते हैं।", "deep": ""}, {"id": 8, "q": "Offline kitne din tak bina internet login chalega?", "kw": "offline kitne din tak bina internet login chalega? 7 din offline net na ho toh login", "a": "सुरक्षित ऑफलाइन अनुमति 7 दिन तक रहती है; बीच में एक बार इंटरनेट मिलने पर सर्वर से स्टेटस अपने आप रीफ्रेश हो जाता है।", "deep": ""}, {"id": 9, "q": "Ek school me 2 phone par ek sath chala sakte hain?", "kw": "ek school me 2 phone par ek sath chala sakte hain? do mobile me assistant teacher bhi chalaye", "a": "सुरक्षा व डेटा टकराव से बचने के लिए एक स्कूल एक ही अधिकृत डिवाइस/अकाउंट से चलाना सुरक्षित है; नया फोन लेने पर Drive Backup से रीस्टोर करें।", "deep": ""}, {"id": 10, "q": "Galat state ya class range (1–5 / 1–8 / 1–12) bhar gaya toh?", "kw": "galat state ya class range (1–5 / 1–8 / 1–12) bhar gaya toh? class galat select ho gaya school category change", "a": "<b>Settings → School Profile</b> में जाकर स्कूल का नाम, प्रारंभिक कक्षा (`start_class`) और अंतिम कक्षा (`end_class`) कभी भी अपडेट करें।", "deep": ""}, {"id": 11, "q": "Kya PoshanKosh mera school data ya bank balance dekhta hai?", "kw": "kya poshankosh mera school data ya bank balance dekhta hai? data chori app wale hisab dekh lenge server pe kya jata hai", "a": "<b>बिल्कुल नहीं!</b> ऐप आपके स्कूल का कोई भी वित्तीय या रजिस्टर डेटा नहीं लेता — सारा डेटा केवल आपके फोन और आपके अपने Google Drive में रहता है।", "deep": "बैंक बैलेंस, पासबुक, कैशबुक, छात्र नाम और स्टॉक एन्क्रिप्टेड SQLite में रहते हैं; सर्वर पर केवल लॉगिन व प्लान स्टेटस जाँचा जाता है।"}, {"id": 12, "q": "Kya yeh sarkari app hai / BRC me valid hai?", "kw": "kya yeh sarkari app hai / brc me valid hai? government app hai kya sarkari portal se juda hai? valid hoga?", "a": "यह एक स्वतंत्र शिक्षक सहायक ऐप है (सरकारी नहीं), लेकिन इसके सभी रजिस्टर, दरें व MPR भारत सरकार के PM-POSHAN मानकों पर आधारित हैं।", "deep": ""}, {"id": 13, "q": "Subscription bypass / mod APK / phone ki date badal kar free chalayein toh?", "kw": "subscription bypass / mod apk / phone ki date badal kar free chalayein toh? free trick crack apk bina paise ke report date piche karke", "a": "सब्सक्रिप्शन में छेड़छाड़ या बायपास करके रिपोर्ट निकालने पर <b>कानूनी कार्रवाई / FIR दर्ज हो सकती है</b> और आपका अकाउंट स्थायी रूप से ब्लॉक हो जाएगा।", "deep": "ऐप में क्रिप्टोग्राफ़िक Ed25519 सिग्नेचर व ऐप-इंटीग्रिटी चेक लगा है; छेड़छाड़ पर लाइसेंस तुरंत रद्द हो जाता है।"}, {"id": 14, "q": "App me koi bug ya loophole dikh jaye toh kya karein?", "kw": "app me koi bug ya loophole dikh jaye toh kya karein? kamjori mili free trick mil gayi bug bounty kya inam milega", "a": "लूपहोल का गलत इस्तेमाल न करें — तुरंत <b>support@poshankosh.com</b> पर मेल करें। सही बग बताने वाले को <b>1 साल का सब्सक्रिप्शन FREE</b> व <b>एडवांस फीचर्स सबसे पहले</b> मिलेंगे!", "deep": ""}, {"id": 15, "q": "Google Drive permission kyun maangta hai?", "kw": "google drive permission kyun maangta hai? drive access kyun gmail box tick", "a": "केवल आपके अपने Google Drive के छिपे `appdata` फ़ोल्डर में स्कूल बैकअप सुरक्षित रखने के लिए — यह आपकी बाकी Drive फाइलें नहीं पढ़ता।", "deep": ""}, {"id": 16, "q": "Agar mobile kho jaye ya kharab ho jaye toh?", "kw": "agar mobile kho jaye ya kharab ho jaye toh? phone toot gaya naya mobile liya", "a": "नए फोन में उसी Google अकाउंट से लॉगिन करें — Google Drive से आपका पूरा स्कूल डेटा वापस आ जाएगा।", "deep": ""}, {"id": 17, "q": "App bina internet ke kaun-kaun se kaam karta hai?", "kw": "app bina internet ke kaun-kaun se kaam karta hai? bina net ke kya chalega offline mode", "a": "दैनिक हाजिरी, सभी 12+ पंजियाँ, Voice/Text AI, Bill OCR, Smart Audit, कैशबुक व MPR PDF — सब कुछ 100% ऑफलाइन चलता है।", "deep": ""}, {"id": 18, "q": "Online kab chahiye hota hai?", "kw": "online kab chahiye hota hai? net kab lagega", "a": "केवल पहली बार लॉगिन, Drive बैकअप, नया सब्सक्रिप्शन पेमेंट व 7-दिन के ऑफलाइन सेशन रीफ्रेश के लिए।", "deep": ""}, {"id": 19, "q": "Free Trial kitne din ka hai aur usme kya milta hai?", "kw": "free trial kitne din ka hai aur usme kya milta hai? trial me ai milega? muft kitne din", "a": "नए स्कूल को <b>30 दिन का Free Trial (₹0)</b> मिलता है जिसमें Manual रजिस्टर और पूरा AI Assistant दोनों फ्री रहते हैं।", "deep": ""}, {"id": 20, "q": "₹119 aur ₹149 plan me kya antar hai?", "kw": "₹119 aur ₹149 plan me kya antar hai? sasta aur mahanga plan 119 vs 149 kaun sa lein", "a": "<b>₹119/माह</b> में सभी Manual रजिस्टर + 1st AI रिपोर्ट फ्री (अतिरिक्त ₹30), जबकि <b>₹149/माह</b> में <b>Unlimited Offline Voice/Text AI, OCR, Smart Audit व BRC रिपोर्ट</b> भी अनलिमिटेड हैं।", "deep": ""}, {"id": 21, "q": "₹119 lene ke baad AI use karna ho toh?", "kw": "₹119 lene ke baad ai use karna ho toh? upgrade kaise hoga 119 me ai chalega?", "a": "₹119 में 1st AI रिपोर्ट फ्री मिलती है; उसके बाद हर AI रिपोर्ट पर ₹30 लगेगा, या सीधे ₹149 AI Pro पर अपग्रेड करें।", "deep": ""}, {"id": 22, "q": "Payment kaise karein?", "kw": "payment kaise karein? phonepe se hoga? gpay paytm", "a": "ऐप के <b>Plan / Subscription</b> स्क्रीन से UPI (PhonePe, GPay, Paytm) द्वारा सुरक्षित पेमेंट करें।", "deep": ""}, {"id": 23, "q": "Paise kat gaye par plan active nahi hua?", "kw": "paise kat gaye par plan active nahi hua? payment failed pending payment", "a": "5 मिनट रुककर ऐप रीस्टार्ट करें; फिर भी न दिखे तो UTR/ट्रांज़ैक्शन ID <b>support@poshankosh.com</b> पर मेल करें।", "deep": ""}, {"id": 24, "q": "Do baar payment kat jaye toh refund kaise milega?", "kw": "do baar payment kat jaye toh refund kaise milega? double deduction paise wapas", "a": "एक ही बिल के दो भुगतान होने पर ट्रांज़ैक्शन स्क्रीनशॉट <b>support@poshankosh.com</b> पर भेजें — 7–10 कार्य-दिवस में रिफंड हो जाएगा।", "deep": ""}, {"id": 25, "q": "Kya MDM ke sarkari khate se subscription pay kar sakte hain?", "kw": "kya mdm ke sarkari khate se subscription pay kar sakte hain? school fund se pay kare", "a": "नहीं, सॉफ्टवेयर शुल्क को स्कूल के सरकारी MDM फंड से अलग अपने व्यक्तिगत/संस्थागत खाते से ही भुगतान करें।", "deep": ""}, {"id": 26, "q": "AI Assistant se kya-kya karwa sakte hain?", "kw": "ai assistant se kya-kya karwa sakte hain? ए से क्या-क्या करवा सकते हैं ai kya karta hai", "a": "बोलकर <b>हाजिरी, 3-Way छात्र नाम, स्टॉक, चखना पंजी</b> कर सकते हैं — साथ ही <b>Bill OCR, Smart Audit, Ration Forecast, BRC WhatsApp रिपोर्ट और Voice Undo</b> भी ऑफलाइन चलते हैं।", "deep": ""}, {"id": 27, "q": "Ek hi baat me do alag kaam bol sakte hain?", "kw": "ek hi baat me do alag kaam bol sakte hain? multitasking ek sath attendance aur stock", "a": "हाँ! जैसे <i>\"आज क्लास 1 से 5 में 40 बच्चे हैं और 50 किलो चावल जोड़ दो\"</i> — AI दोनों काम एक साथ कर देगा।", "deep": ""}, {"id": 28, "q": "Baat karte-karte beech me dusra topic shuru kar sakte hain?", "kw": "baat karte-karte beech me dusra topic shuru kar sakte hain? beech me badal sakte hain? switch", "a": "बिल्कुल, किसी भी समय दूसरा काम बोल दें — AI तुरंत पुराने काम को छोड़कर नया काम समझ लेगा।", "deep": ""}, {"id": 29, "q": "English me bolne par Hindi me jawab dega ya English me?", "kw": "english me bolne par hindi me jawab dega ya english me? bhasha kaun si hogi hinglish", "a": "आप English में कमांड देंगे तो जवाब English में आएगा, और हिंदी/Hinglish में बोलने पर हिंदी या Hinglish में जवाब मिलेगा।", "deep": ""}, {"id": 30, "q": "\"Ho gaya\" ya \"Dhanyawad\" bolne par kya hoga?", "kw": "\"ho gaya\" ya \"dhanyawad\" bolne par kya hoga? band kaise karein end", "a": "<i>\"हो गया / Done / धन्यवाद\"</i> बोलते ही AI काम समेटकर पूछेगा <i>\"क्या किसी और काम में सहायता करूँ?\"</i> (और वेबसाइट पर माइक बंद कर देगा)।", "deep": ""}, {"id": 31, "q": "Bill / Parchi Photo OCR kaise kaam karta hai?", "kw": "bill / parchi photo ocr kaise kaam karta hai? rasid photo bill scan", "a": "AI शीट में कैमरा/गैलरी आइकन दबाकर बिल की फोटो लें — ऑफलाइन OCR राशि व आइटम पढ़कर खर्च जोड़ने के लिए तैयार कर देगा।", "deep": ""}, {"id": 32, "q": "Smart Audit kya check karta hai?", "kw": "smart audit kya check karta hai? audit kaise karein galti kaise pakde", "a": "<i>\"Smart Audit करो\"</i> बोलने पर AI आपके सभी रजिस्टर जाँचकर मिसिंग एंट्री, नेगेटिव स्टॉक या कैशबुक अंतर बता देता है।", "deep": ""}, {"id": 33, "q": "Ration Forecast kya batata hai?", "kw": "ration forecast kya batata hai? chawal kitne din chalega stock prediction", "a": "<i>\"Ration Forecast बताओ\"</i> बोलने पर AI औसत दैनिक खपत के हिसाब से बताता है कि मौजूदा चावल कितने कार्य-दिवस चलेगा।", "deep": ""}, {"id": 34, "q": "Voice Undo kaise kaam karta hai?", "kw": "voice undo kaise kaam karta hai? galti se galat bol diya wapas kaise kare", "a": "कोई भी गलत एंट्री हो जाए तो तुरंत <b>\"Undo\"</b> बोलें — AI पिछली एंट्री को सुरक्षित रूप से वापस हटा देगा।", "deep": ""}, {"id": 35, "q": "1-Tap BRC WhatsApp Report kya hai?", "kw": "1-tap brc whatsapp report kya hai? brc ko report kaise bheje", "a": "<i>\"BRC रिपोर्ट बनाओ\"</i> बोलते ही दिन/माह का सारांश तैयार होकर 1 टैप में WhatsApp पर भेजने के लिए कॉपी हो जाता है।", "deep": ""}, {"id": 36, "q": "Agar AI ko koi sawal samajh na aaye ya galat bole toh?", "kw": "agar ai ko koi sawal samajh na aaye ya galat bole toh? galat samjha samajh nahi aaya", "a": "आप <i>\"X नहीं Y\"</i> बोलकर तुरंत सुधार सकते हैं, या किसी भी तकनीकी समस्या पर <b>support@poshankosh.com</b> पर मेल कर सकते हैं।", "deep": ""}, {"id": 37, "q": "Kya har roz sabhi class ki attendance ek sath bharna zaruri hai?", "kw": "kya har roz sabhi class ki attendance ek sath bharna zaruri hai? ek ek class partial attendance", "a": "हर रोज़ सभी कक्षाओं की हाजिरी ज़रूरी है, लेकिन आप <b>एक-एक क्लास करके भी सेव</b> कर सकते हैं (बाकी क्लास 0/0 से भरकर)।", "deep": ""}, {"id": 38, "q": "Attendance bharne ke baad bhi Dainik Vyay me entry kyun nahi dikhti thi?", "kw": "attendance bharne ke baad bhi dainik vyay me entry kyun nahi dikhti thi? attendance ke baad register khali auto sync", "a": "अब हाजिरी सेव करते ही <b>दैनिक व्यय, चावल, अंडा, रागी और आयरन टैबलेट</b> पंजियाँ अपने आप अपडेट हो जाती हैं।", "deep": ""}, {"id": 39, "q": "Attendance ki pichli date edit kar sakte hain?", "kw": "attendance ki pichli date edit kar sakte hain? kal ki haziri galat ho gayi purani date sudhar", "a": "हाँ, Attendance में पुरानी तारीख चुनकर सही संख्या Update करें — आगे के सभी स्टॉक व खर्च अपने आप ठीक हो जाएँगे।", "deep": ""}, {"id": 40, "q": "Student ka naam aur caste kaise store karein?", "kw": "student ka naam aur caste kaise store karein? naam entry st sc obc general hindi ya english", "a": "आप नाम हिंदी या English में स्टोर कर सकते हैं — बोलें <i>\"कक्षा 2 रोल 1 नितेश ST Boy\"</i> या मैनुअल रोस्टर से जोड़ें।", "deep": ""}, {"id": 41, "q": "Galti se \"नीत\" ya galat naam sun le toh?", "kw": "galti se \"नीत\" ya galat naam sun le toh? stt galat suna naam sudhar", "a": "तुरंत बोलें <i>\"नीत नहीं नितेश कुमार\"</i> या <i>\"Old Name से New Name बदल दो\"</i> — AI तुरंत सुधार देगा।", "deep": ""}, {"id": 42, "q": "AI voice me \"सेंट बाय\" (ST Boy) samajhta hai?", "kw": "ai voice me \"सेंट बाय\" (st boy) samajhta hai? st boy sc girl", "a": "हाँ, <i>\"सेंट बाय / एसटी बॉय\"</i>, <i>\"एससी गर्ल\"</i>, और हिंदी/English नंबर (<i>एक–दस, 1st–8th</i>) सब ऑटो-मैप हैं।", "deep": ""}, {"id": 43, "q": "Attendance me 0 bache ya chutti ho toh kya karein?", "kw": "attendance me 0 bache ya chutti ho toh kya karein? aaj khana nahi bana holiday", "a": "उस दिन <b>Holiday / No Meal</b> चुनें या कैलेंडर में छुट्टी मार्क करें — चावल व कुकिंग कॉस्ट ₹0 रहेगा।", "deep": ""}, {"id": 44, "q": "Opening Balance AI se bolkar bhar sakte hain?", "kw": "opening balance ai se bolkar bhar sakte hain? prambhik shesh opening balance ai", "a": "हाँ, <i>\"Opening balance सेट करो\"</i> बोलने पर AI आपके स्कूल की कक्षाओं के अनुसार स्टेप-बाय-स्टेप चावल व कैश बैलेंस भरवा देता है।", "deep": ""}, {"id": 45, "q": "Primary aur Upper Primary ki cooking cost aur rice norm kya hai?", "kw": "primary aur upper primary ki cooking cost aur rice norm kya hai? 6.78 10.17 100g 150g", "a": "प्राथमिक (1–5) में <b>₹6.78 + 100g चावल</b> और उच्च प्राथमिक (6–8) में <b>₹10.17 + 150g चावल</b> प्रति छात्र प्रतिदिन।", "deep": ""}, {"id": 46, "q": "Rice Stock me galat entry edit ya delete kaise karein?", "kw": "rice stock me galat entry edit ya delete kaise karein? negative stock ho gaya stock hatana hai", "a": "<b>Registers → Rice Stock</b> में किसी भी लाइन पर सीधे <b>Edit</b> या <b>Delete</b> बटन दबाएँ — बिना किसी नेगेटिव लूप के तुरंत सुधर जाएगा।", "deep": ""}, {"id": 47, "q": "Low Rice Alert kab aata hai?", "kw": "low rice alert kab aata hai? 125 din me bhi alert alert kab aayega", "a": "जब अनुमानित चावल स्टॉक <b>5 कार्य-दिवस से कम</b> बचता है, तभी लो-स्टॉक अलर्ट दिखता है।", "deep": ""}, {"id": 48, "q": "Chakhna Panji ka naya format kya hai?", "kw": "chakhna panji ka naya format kya hai? चखना पंछी tasting register 4 column", "a": "<b>4 कॉलम:</b> <b>दिनांक | रसोइया का नाम | मेनू | अभियुक्ति</b> — तारीखें पहले से भरी रहती हैं और स्कूल कैलेंडर की छुट्टियाँ ऑटो-सिंक होती हैं।", "deep": ""}, {"id": 49, "q": "Egg Monday ya Friday ko chutti hone par kya hota hai?", "kw": "egg monday ya friday ko chutti hone par kya hota hai? somwar off toh anda egg shift", "a": "सोमवार को छुट्टी होने पर अंडा <b>मंगलवार</b> को और शुक्रवार को छुट्टी होने पर <b>शनिवार</b> को अपने आप शिफ्ट हो जाता है।", "deep": ""}, {"id": 50, "q": "Iron Tablet (IFA) kis-kis class ke liye hai?", "kw": "iron tablet (ifa) kis-kis class ke liye hai? ifa goli gulabi neeli goli", "a": "कक्षा <b>1 से 12</b> तक के विद्यार्थियों के लिए बुधवार/गुरुवार को हाजिरी से ऑटो-सिंक होता है (1–5 गुलाबी, 6–8+ नीली)।", "deep": ""}, {"id": 51, "q": "Ragi Panji kaise update hoti hai?", "kw": "ragi panji kaise update hoti hai? ragi madua shri anna", "a": "हाजिरी सेव करते ही रागी खपत व स्टॉक अपने आप जुड़ जाते हैं, या Registers में जाकर Quick Restock से आवक जोड़ें।", "deep": ""}, {"id": 52, "q": "Other Scheme Amount aur Bank Withdrawal kaise darj karein?", "kw": "other scheme amount aur bank withdrawal kaise darj karein? bartan rashi cheque number contra entry", "a": "<b>Other Scheme</b> में विशेष अनुदान व खर्च अलग ट्रैक/Settle होते हैं; <b>Withdrawal</b> में Cheque No. डालने पर Cashbook में कॉन्ट्रा एंट्री अपने आप बनती है।", "deep": ""}, {"id": 53, "q": "Cashbook me Cash-in-Hand se Dainik Vyay kaise ghatta hai?", "kw": "cashbook me cash-in-hand se dainik vyay kaise ghatta hai? cash balance galat vyay nahi ghat raha", "a": "अब लाइव MDM Cash-in-Hand में से <b>Dainik Vyay</b> अपने आप घटकर सटीक शेष राशि दिखाता है।", "deep": ""}, {"id": 54, "q": "Bank Passbook ke sath 100% milan kaise karein?", "kw": "bank passbook ke sath 100% milan kaise karein? reconciliation byaj aur charge verified seal", "a": "<b>Home → Cashbook</b> में बैंक स्टेटमेंट से 1-क्लिक में ब्याज/चार्ज Auto-Fill करें — 100% मिलान पर <b>Verified Seal</b> मिल जाएगी।", "deep": ""}, {"id": 55, "q": "MPR, Form-II aur 4 Monthly Vouchers kaise nikalein?", "kw": "mpr, form-ii aur 4 monthly vouchers kaise nikalein? pdf excel draft mode vr 1 to 4", "a": "<b>Reports</b> टैब से चारों वाउचर (राशन, अंडा, सब्जी, ईंधन) व हिंदी/अंग्रेज़ी <b>MPR / Form-II PDF व Excel</b> (Draft Mode सहित) 1 क्लिक में डाउनलोड करें।", "deep": ""}, {"id": 56, "q": "Student Report Card aur Percentage feature kab aayega?", "kw": "student report card aur percentage feature kab aayega? marksheet result future features", "a": "<b>Student Report Card & Percentage Generator</b> आगामी अपडेट में जुड़ने वाला है — अभी वर्तमान वर्ज़न में सभी MDM व AI फीचर्स उपलब्ध हैं।", "deep": ""}, {"id": 57, "q": "APK download karte waqt blank screen ya error aaye toh?", "kw": "apk download karte waqt blank screen ya error aaye toh? download nahi ho raha github khul gaya", "a": "वेबसाइट के <b>Download APK Direct</b> बटन से फाइल बिना नया टैब खोले सीधे डाउनलोड होती है; ऊपर नोटिफिकेशन बार में प्रगति देखें।", "deep": ""}, {"id": 58, "q": "APK install karne par \"Blocked / Unsafe\" warning aaye toh?", "kw": "apk install karne par \"blocked / unsafe\" warning aaye toh? install nahi ho raha play protect", "a": "<b>Settings → Allow from this source</b> चालू करें और <b>Install anyway</b> पर टैप करें।", "deep": ""}, {"id": 59, "q": "Samay kaise bachta hai is app se?", "kw": "samay kaise bachta hai is app se? यह कैसे समय बचता है fayda kya hai", "a": "एक बार हाजिरी भरने से सभी 12+ पंजियाँ, कैशबुक व वाउचर अपने आप तैयार हो जाते हैं — हर महीने <b>15+ घंटे</b> बचते हैं।", "deep": ""}, {"id": 60, "q": "Koi alag samasya ya sujhav ho toh kahan sampark karein?", "kw": "koi alag samasya ya sujhav ho toh kahan sampark karein? madad chahiye contact email", "a": "असुविधा के लिए खेद है! कृपया अपना सवाल या स्क्रीनशॉट <b>support@poshankosh.com</b> पर मेल करें — हमारी टीम जल्द सहायता करेगी।", "deep": ""}, {"id": 61, "q": "Mahine ke beech me naya charge (Prabhar) liya hai toh opening balance kaise dalein?", "kw": "mahine ke beech me naya charge (prabhar) liya hai toh opening balance kaise dalein? beech mahine me join kiya purana hisab nahi hai", "a": "जिस दिन से आप ऐप शुरू कर रहे हैं, उस दिन का हाथ में बचा चावल (KG–5, 6–8) और कैश बैलेंस <b>Opening Balance</b> में डालें — आगे का सारा हिसाब अपने आप जुड़ेगा।", "deep": ""}, {"id": 62, "q": "Garmi ki chutti, election duty ya bandh me school band ho toh kya karein?", "kw": "garmi ki chutti, election duty ya bandh me school band ho toh kya karein? summer vacation election bina khana", "a": "<b>Calendar</b> में छुट्टी/अवकाश मार्क कर दें — उन दिनों में चखना पंजी में स्वतः <i>अवकाश</i> दिखेगा और चावल/खर्च ₹0 रहेगा।", "deep": ""}, {"id": 63, "q": "Agar kisi din gas khatam hone ya barish se khana nahi bana toh?", "kw": "agar kisi din gas khatam hone ya barish se khana nahi bana toh? aaj mdm nahi bana no meal day", "a": "उस दिन हाजिरी की जगह <b>No Meal / Closed</b> चुनें और कारण लिख दें — स्टॉक से एक भी ग्राम नहीं कटेगा।", "deep": ""}, {"id": 64, "q": "Ek hi school me KG se 5, 1–8 ya 1–12 classes hon toh kaise set karein?", "kw": "ek hi school me kg se 5, 1–8 ya 1–12 classes hon toh kaise set karein? bal vatika pre primary high school", "a": "<b>Settings → School Profile</b> में `start_class` (0=KG से 8) और `end_class` (5 से 12) चुनें — पूरा ऐप व AI आपकी उन्हीं कक्षाओं के हिसाब से काम करेगा।", "deep": ""}, {"id": 65, "q": "PDS dealer se chawal kam mile ya bori ka wajan kam ho toh?", "kw": "pds dealer se chawal kam mile ya bori ka wajan kam ho toh? chawal kam mila dealer ne kam diya", "a": "<b>Rice Stock → Quick Restock</b> में वास्तव में प्राप्त हुआ शुद्ध वजन (KG) ही दर्ज करें और रिमार्क में नोट लिख दें।", "deep": ""}, {"id": 66, "q": "Rasoiya (Cook) badal jaye ya us din koi aur rasoiya aaye toh Chakhna Panji me kaise badlein?", "kw": "rasoiya (cook) badal jaye ya us din koi aur rasoiya aaye toh chakhna panji me kaise badlein? cook change dusra rasoiya", "a": "Chakhna Panji की उस तारीख वाली पंक्ति पर टैप करके (या AI को बोलकर) रसोइया का नाम तुरंत बदल सकते हैं।", "deep": ""}, {"id": 67, "q": "Ek hi mahine me 2 baar bank interest aaye ya SMS charge kate toh?", "kw": "ek hi mahine me 2 baar bank interest aaye ya sms charge kate toh? bank charge interest entry", "a": "<b>Cashbook</b> में जितनी बार चाहें बैंक ब्याज (Receipt) और बैंक चार्ज (Payment) की अलग-अलग तारीखों पर एंट्री जोड़ सकते हैं।", "deep": ""}, {"id": 68, "q": "Cashbook me pichle mahine ka closing balance agle mahine carry-forward hota hai?", "kw": "cashbook me pichle mahine ka closing balance agle mahine carry-forward hota hai? opening b/f november balance", "a": "हाँ, पिछले महीने का <b>Closing Balance</b> अगले महीने के पहले दिन <b>Opening Balance (B/F)</b> में अपने आप आ जाता है।", "deep": ""}, {"id": 69, "q": "Naya Financial Year (April–March) shuru hone par purane saal ka record safe rahega?", "kw": "naya financial year (april–march) shuru hone par purane saal ka record safe rahega? new session purana saal", "a": "हाँ, ऐप में <b>FY-aware Month Picker</b> है — आप पुराने किसी भी वित्तीय वर्ष व महीने की रिपोर्ट कभी भी देख सकते हैं।", "deep": ""}, {"id": 70, "q": "Ek hi cheque se ration aur sabji dono ka paisa nikala toh kaise darj karein?", "kw": "ek hi cheque se ration aur sabji dono ka paisa nikala toh kaise darj karein? ek cheque se do kharch", "a": "<b>Withdrawal</b> में कुल चेक राशि डालें (जिससे पूरा पैसा Cash-in-Hand में आ जाए), फिर वाउचर/खर्च में अलग-अलग मद में खर्च दिखाएँ।", "deep": ""}, {"id": 71, "q": "Fund late aaya aur teacher ne apne paise (udhar) se khana banwaya toh?", "kw": "fund late aaya aur teacher ne apne paise (udhar) se khana banwaya toh? udhar se khana minus balance", "a": "आप रोज़ाना हाजिरी व व्यय दर्ज करते रहें — फंड आने पर <b>Receipt</b> जोड़ते ही कैशबुक बैलेंस अपने आप बराबर हो जाएगा।", "deep": ""}, {"id": 72, "q": "BRC / DEO inspection me turant kaun-si report dikhani hoti hai?", "kw": "brc / deo inspection me turant kaun-si report dikhani hoti hai? inspection officer aaye hain", "a": "<b>Reports → MPR / Form-II PDF</b> और <b>Registers</b> में <b>चखना पंजी, दैनिक व्यय व कैशबुक</b> 1 टैप में तुरंत दिखा सकते हैं।", "deep": ""}, {"id": 73, "q": "Draft Mode aur Final MPR me kya farq hai?", "kw": "draft mode aur final mpr me kya farq hai? draft pdf final report", "a": "<b>Draft Mode</b> महीने के बीच में जाँचने के लिए है (जिस पर <i>DRAFT</i> वॉटरमार्क रहता है), जबकि <b>Final MPR</b> महीने के अंत में जमा करने के लिए निकलता है।", "deep": ""}, {"id": 74, "q": "App me 7-day low-cash ya low-rice alert kab aata hai?", "kw": "app me 7-day low-cash ya low-rice alert kab aata hai? alert nahi dikh raha warning", "a": "जब नकद राशि 7 दिन से कम या चावल स्टॉक <b>5 कार्य-दिवस से कम</b> बचता है, तभी होम स्क्रीन पर चेतावनी दिखती है।", "deep": ""}, {"id": 75, "q": "Minority, SC, ST, OBC, General count me mismatch ho toh?", "kw": "minority, sc, st, obc, general count me mismatch ho toh? total match nahi", "a": "हर कक्षा में लड़के-लड़कियों का जातिवार योग कुल उपस्थिति के बराबर होना ज़रूरी है; ऐप सेव करते समय ही गलती पकड़ लेता है।", "deep": ""}, {"id": 76, "q": "Phone ka cache clear karne ya app update karne par data delete hoga?", "kw": "phone ka cache clear karne ya app update karne par data delete hoga? update me data udega? cache clear", "a": "<b>App Update</b> करने या Cache clear करने से डेटा डिलीट नहीं होता — लेकिन <b>Clear All Data</b> या Uninstall करने से पहले Google Drive Backup ज़रूर लें।", "deep": ""}, {"id": 77, "q": "Purane Android phone ya Tablet / Fold screen par app chalega?", "kw": "purane android phone ya tablet / fold screen par app chalega? tablet me android 8", "a": "हाँ, यह Android 7.0+ से 14+ तक के सभी फोन, टैबलेट और फोल्ड स्क्रीन पर स्मूथ चलता है।", "deep": ""}, {"id": 78, "q": "School me shor ho aur AI mic galat shabd sune toh?", "kw": "school me shor ho aur ai mic galat shabd sune toh? noise galat sun raha hai", "a": "गलत नाम या संख्या पर तुरंत बोलें <i>\"X नहीं Y\"</i> या माइक बंद करके कीबोर्ड से टाइप कर दें।", "deep": ""}, {"id": 79, "q": "Kya ek hi Gmail se 2 alag schools (additional charge) chala sakte hain?", "kw": "kya ek hi gmail se 2 alag schools (additional charge) chala sakte hain? do school ka charge", "a": "सुरक्षा नियम के तहत 1 Google अकाउंट पर 1 UDISE ही जुड़ता है — दूसरे स्कूल के लिए दूसरे अधिकृत स्कूल Gmail का उपयोग करें।", "deep": ""}, {"id": 80, "q": "Google Play Store par app kyun nahi hai / Website APK safe hai?", "kw": "google play store par app kyun nahi hai / website apk safe hai? play store apk virus toh nahi", "a": "वेबसाइट पर उपलब्ध APK डिजिटल सिग्नेचर (`Signed ✓`) से सुरक्षित है — केवल आधिकारिक `poshankosh.com` से ही डाउनलोड करें।", "deep": ""}, {"id": 81, "q": "Excel (.xlsx) aur PDF report dono nikalte hain kya?", "kw": "excel (.xlsx) aur pdf report dono nikalte hain kya? excel milega?", "a": "हाँ, <b>Reports</b> टैब से आप प्रिंट के लिए <b>PDF</b> और एडिट/रिकॉर्ड के लिए <b>Excel</b> दोनों निकाल सकते हैं।", "deep": ""}, {"id": 82, "q": "Agar 7 din se zyada gaon me internet bilkul na ho toh?", "kw": "agar 7 din se zyada gaon me internet bilkul na ho toh? 10 din net nahi", "a": "7 दिन बाद केवल एक बार कुछ सेकंड के लिए मोबाइल डेटा/हॉटस्पॉट से ऐप खोलें — ऑफलाइन अनुमति तुरंत अगले 7 दिन के लिए रीफ्रेश हो जाएगी।", "deep": ""}, {"id": 83, "q": "AI voice Hindi ke bajaye English me bole ya fast bole toh?", "kw": "ai voice hindi ke bajaye english me bole ya fast bole toh? awaaz slow language change", "a": "वेबसाइट व ऐप AI आपकी भाषा (Hindi/English) के अनुसार ही जवाब देता है; आप स्पीकर आइकन (`🔊/🔇`) से आवाज़ बंद/चालू कर सकते हैं।", "deep": ""}, {"id": 84, "q": "Google Drive Backup bina internet ke ho jayega?", "kw": "google drive backup bina internet ke ho jayega? offline backup", "a": "नहीं, Google Drive में फाइल अपलोड करने के लिए केवल बैकअप के समय इंटरनेट चाहिए — बाकी पूरा काम ऑफलाइन चलता है।", "deep": ""}, {"id": 85, "q": "Kisi purani entry ko delete karna ho toh kya poora mahina bigad jayega?", "kw": "kisi purani entry ko delete karna ho toh kya poora mahina bigad jayega? ek entry delete", "a": "नहीं, किसी भी तारीख की एंट्री Edit या Delete करने पर आगे के सभी टोटल व बैलेंस अपने आप री-कैलकुलेट हो जाते हैं।", "deep": ""}, {"id": 86, "q": "App me koi advertisement (Ads) aata hai kya?", "kw": "app me koi advertisement (ads) aata hai kya? vigyapan ads", "a": "बिल्कुल नहीं — PoshanKosh 100% <b>Ad-Free</b> है ताकि काम के समय कोई रुकावट न हो।", "deep": ""}, {"id": 87, "q": "SMC member ya Headmaster Chakhna Panji kaise verify karein?", "kw": "smc member ya headmaster chakhna panji kaise verify karein? smc sign", "a": "ऐप से महीने के अंत में 4-कॉलम चखना पंजी प्रिंट करके उस पर रसोइया, शिक्षक व SMC सदस्य के हस्ताक्षर करवाए जा सकते हैं।", "deep": ""}, {"id": 88, "q": "Kya is app me Teacher Salary / Form 16 bhi banta hai?", "kw": "kya is app me teacher salary / form 16 bhi banta hai? vetan salary form 16", "a": "शिक्षक वेतन, एरियर व Form 16 के लिए अलग प्लेटफॉर्म <b>VetanKosh</b> है; <b>PoshanKosh</b> विशेष रूप से स्कूल MDM व छात्र पंजियों के लिए है।", "deep": ""}, {"id": 89, "q": "App me naya feature judwana ho toh kahan bolen?", "kw": "app me naya feature judwana ho toh kahan bolen? sujhav naya feature", "a": "आप अपना सुझाव <b>support@poshankosh.com</b> पर मेल कर सकते हैं — शिक्षकों की मांग के अनुसार हर अपडेट में नए फीचर्स जोड़े जाते हैं।", "deep": ""}, {"id": 90, "q": "Agar galti se app uninstall ho gaya aur backup nahi liya tha toh?", "kw": "agar galti se app uninstall ho gaya aur backup nahi liya tha toh? bina backup delete", "a": "चूँकि हम आपका वित्तीय डेटा सर्वर पर नहीं रखते, इसलिए बिना Drive बैकअप के लोकल डेटा वापस नहीं आ सकता — इसलिए सप्ताह में एक बार <b>Backup Now</b> ज़रूर दबाएँ।", "deep": ""}, {"id": 91, "q": "30-Day Free Trial khatam hone par mera purana data delete ho jayega?", "kw": "30-day free trial khatam hone par mera purana data delete ho jayega? trial khatam data lock", "a": "नहीं! आपका सारा डेटा सुरक्षित रहेगा — बस नई एंट्री व रिपोर्ट जारी रखने के लिए ₹119 या ₹149 प्लान चुनना होगा।", "deep": ""}, {"id": 92, "q": "Kya har mahine bank se paisa apne aap (Autopay) katega?", "kw": "kya har mahine bank se paisa apne aap (autopay) katega? auto debit", "a": "नहीं, जब आप खुद प्लान चुनकर UPI से पेमेंट करेंगे तभी सब्सक्रिप्शन बढ़ेगा — बिना आपकी अनुमति पैसा नहीं कटता।", "deep": ""}, {"id": 93, "q": "₹119 plan me 1st AI report free ka kya matlab hai?", "kw": "₹119 plan me 1st ai report free ka kya matlab hai? 1st ai report free", "a": "₹119/माह वाले प्लान में आप महीने में 1 बार AI से रिपोर्ट/एंट्री फ्री टेस्ट कर सकते हैं; उसके बाद अतिरिक्त AI उपयोग पर ₹30 प्रति रिपोर्ट लगता है (₹149 में सब अनलिमिटेड है)।", "deep": ""}, {"id": 94, "q": "Kya BRC / CRP ke liye alag login hai?", "kw": "kya brc / crp ke liye alag login hai? brc login", "a": "नहीं, हर स्कूल का अपना स्वतंत्र अकाउंट होता है; आप 1-Tap BRC WhatsApp Report या PDF सीधे BRC को भेज सकते हैं।", "deep": ""}, {"id": 95, "q": "Kya Student Report Card feature ke liye alag paisa dena hoga?", "kw": "kya student report card feature ke liye alag paisa dena hoga? report card free hoga?", "a": "नहीं, आगामी <b>Student Report Card & Percentage Generator</b> अपडेट के साथ ऐप के अंदर ही जुड़ेगा (बग रिपोर्ट करने वालों को यह सबसे पहले मिलेगा!)।", "deep": ""}, {"id": 96, "q": "Kya app offline chalte waqt battery ya storage zyada leta hai?", "kw": "kya app offline chalte waqt battery ya storage zyada leta hai? storage heavy app", "a": "ऐप का साइज लगभग 73 MB है (ऑफलाइन AI व OCR सहित) और यह बहुत कम बैटरी व डेटा खर्च करता है।", "deep": ""}, {"id": 97, "q": "Kya website par bhi live calculator se kharch jod sakte hain?", "kw": "kya website par bhi live calculator se kharch jod sakte hain? website calculator", "a": "हाँ, <b>poshankosh.com</b> पर ही ऊपर <b>Daily MDM Calculator</b> में प्राथमिक व उच्च प्राथमिक छात्र भरकर तुरंत ₹6.78 / ₹10.17 व चावल देख सकते हैं।", "deep": ""}, {"id": 98, "q": "Agar kisi sawal ka jawab yahan bhi na mile toh?", "kw": "agar kisi sawal ka jawab yahan bhi na mile toh? kuch samajh nahi aaya help", "a": "असुविधा के लिए खेद है! कृपया अपना सवाल <b>support@poshankosh.com</b> पर मेल कर दें — हमारी टीम जल्द से जल्द आपकी मदद करेगी।", "deep": ""}, {"id": 99, "q": "PoshanKosh ka mukhya uddeshya kya hai?", "kw": "poshankosh ka mukhya uddeshya kya hai? moto mission", "a": "<i>“विद्यालय का पोषण, उज्ज्वल कल”</i> — शिक्षकों को देर रात तक रजिस्टर जोड़ने की थकान से मुक्त कर हर महीने 15+ घंटे बचाना।", "deep": ""}, {"id": 100, "q": "Kya isme offline voice AI bina kisi API/internet kharch ke chalta hai?", "kw": "kya isme offline voice ai bina kisi api/internet kharch ke chalta hai? ai bina net", "a": "हाँ! PoshanKosh का AI पूरी तरह डिवाइस के अंदर ऑफलाइन चलता है, इसलिए गाँव-देहात में बिना नेटवर्क के भी सेकंडों में काम करता है।", "deep": ""}, {"id": 101, "q": "Kya personal Gmail ID se school register kar sakte hain?", "kw": "kya personal gmail id se school register kar sakte hain? apne personal gmail se school email zaruri hai?", "a": "<b>नहीं!</b> स्कूल का रजिस्ट्रेशन <b>केवल पंजीकृत आधिकारिक स्कूल ईमेल ID</b> से ही होगा, व्यक्तिगत (Personal) ईमेल से नहीं।", "deep": "ऐसा इसलिए किया गया है ताकि प्रधानाध्यापक बदलने पर भी स्कूल का डेटा व Google Drive बैकअप स्कूल की आधिकारिक ईमेल ID पर सुरक्षित रहे।"}, {"id": 102, "q": "Koi farji email id se kisi dusre school ka farzi account banaye toh kya hoga?", "kw": "koi farji email id se kisi dusre school ka farzi account banaye toh kya hoga? fake id farzi registration dusre ka udise", "a": "यदि कोई व्यक्ति फ़र्ज़ी ईमेल ID से किसी स्कूल की फ़र्ज़ी ID बनाकर उपयोग करता है, तो उस पर <b>सख्त कानूनी कार्रवाई (FIR व स्थायी प्रतिबंध)</b> की जाएगी।", "deep": ""}, {"id": 103, "q": "Subah school pahunchte hi PoshanKosh me pehla kaam kya karna chahiye?", "kw": "subah school pahunchte hi poshankosh me pehla kaam kya karna chahiye? subah kya karein daily routine har roz ka step", "a": "बस 1 मिनट में <b>Attendance</b> (या Voice AI से <i>\"आज क्लास 1 से 5 में इतने बच्चे हैं\"</i>) सेव करें — बाकी 12+ पंजियाँ अपने आप भर जाएँगी।", "deep": ""}, {"id": 104, "q": "Khana banne ke baad Chakhna Panji kab aur kaise bharni hai?", "kw": "khana banne ke baad chakhna panji kab aur kaise bharni hai? dopahar me chakhna tasting time", "a": "भोजन परोसने से ठीक पहले रसोइया/शिक्षक चखकर <b>Chakhna Panji</b> में आज की तारीख पर रसोइया नाम, मेनू और अभियुक्ति (या AI से बोलकर) दर्ज करें।", "deep": ""}, {"id": 105, "q": "Shaam ko ghar jane se pehle kya check karein?", "kw": "shaam ko ghar jane se pehle kya check karein? shaam ko kya kare daily check", "a": "होम स्क्रीन पर <b>Dainik Vyay, Rice Stock और Cash-in-Hand</b> की एक नज़र पुष्टि कर लें और इंटरनेट होने पर सप्ताह में 1 बार <b>Backup Now</b> दबा दें।", "deep": ""}, {"id": 106, "q": "Mahine ki 1 tarikh ko naye mahine ke liye kya alag se karna padta hai?", "kw": "mahine ki 1 tarikh ko naye mahine ke liye kya alag se karna padta hai? naya mahina 1st date", "a": "कुछ नहीं! पिछले महीने का <b>Closing Cash व Rice Balance</b> नए महीने की 1 तारीख को <b>Opening Balance (B/F)</b> में अपने आप आ जाता है।", "deep": ""}, {"id": 107, "q": "Mahine ke ant (30/31 tarikh) me BRC report kaise taiyar karein?", "kw": "mahine ke ant (30/31 tarikh) me brc report kaise taiyar karein? month end closing kaise kare", "a": "<b>Home → Cashbook</b> में बैंक स्टेटमेंट मिलाएँ, <b>Reports</b> से 4 वाउचर (Vr 1–4) व <b>MPR/Form-II PDF</b> डाउनलोड करें — पूरा महीना 2 मिनट में बंद!", "deep": ""}, {"id": 108, "q": "4 Monthly Vouchers (Vr 1 se Vr 4) me kya-kya aata hai?", "kw": "4 monthly vouchers (vr 1 se vr 4) me kya-kya aata hai? vr 1 2 3 4 voucher breakdown", "a": "<b>Vr 1:</b> राशन/चावल, <b>Vr 2:</b> अंडा/फल, <b>Vr 3:</b> हरी सब्जी व मसाले, <b>Vr 4:</b> ईंधन/गैस — चारों वाउचर सीधे Cashbook खर्च में जुड़ते हैं।", "deep": ""}, {"id": 109, "q": "Other Scheme Amount me \"Settled\" mark karne ka kya matlab hai?", "kw": "other scheme amount me \"settled\" mark karne ka kya matlab hai? scheme settle shesh rashi", "a": "जब किसी विशेष योजना (जैसे बर्तन/किचन) का पूरा खर्च दर्ज हो जाए, तो रिमार्क लिखकर <b>Settled</b> दबा दें ताकि वह राशि अलग से बंद दिखे।", "deep": ""}, {"id": 110, "q": "Bank Passbook Statement OCR kaise kaam karta hai?", "kw": "bank passbook statement ocr kaise kaam karta hai? passbook photo statement upload", "a": "<b>Cashbook</b> में पासबुक/स्टेटमेंट अपलोड करने पर ब्याज और बैंक चार्ज एक क्लिक में Auto-Fill होकर मिलान हो जाते हैं।", "deep": ""}, {"id": 111, "q": "Royal Blue \"POSHANKOSH VERIFIED\" seal kab milti hai?", "kw": "royal blue \"poshankosh verified\" seal kab milti hai? verified muhar blue seal", "a": "जब आपकी Cashbook का हर लेन-देन बैंक पासबुक से 100% मैच हो जाता है, तब रिपोर्ट पर आधिकारिक <b>Verified Seal</b> लग जाती है।", "deep": ""}, {"id": 112, "q": "Annual Holiday Calendar OCR kya hai?", "kw": "annual holiday calendar ocr kya hai? chutti list photo holiday upload", "a": "विभाग की वार्षिक छुट्टी सूची की फोटो अपलोड करते ही पूरे साल की छुट्टियाँ ऐप कैलेंडर व चखना पंजी में अपने आप जुड़ जाती हैं।", "deep": ""}, {"id": 113, "q": "Cooking Cost ka exact calculation formula kya hai?", "kw": "cooking cost ka exact calculation formula kya hai? hisab kaise lagta hai", "a": "`(प्राथमिक उपस्थित छात्र × ₹6.78) + (उच्च प्राथमिक उपस्थित छात्र × ₹10.17)` = कुल दैनिक कुकिंग कॉस्ट।", "deep": ""}, {"id": 114, "q": "Chawal kharch (Rice Consumption) ka exact formula kya hai?", "kw": "chawal kharch (rice consumption) ka exact formula kya hai? chawal hisab", "a": "`(प्राथमिक छात्र × 0.100 kg) + (उच्च प्राथमिक छात्र × 0.150 kg)` = कुल दैनिक चावल खपत।", "deep": ""}, {"id": 115, "q": "Egg / Fruit budget kaise calculate hota hai?", "kw": "egg / fruit budget kaise calculate hota hai? anda hisab", "a": "सोमवार व शुक्रवार (छुट्टी होने पर मंगल/शनि) को उपस्थित कुल छात्र × राज्य दर (जैसे ₹5.00/अंडा) अपने आप अंडा पंजी व वाउचर में जुड़ता है।", "deep": ""}, {"id": 116, "q": "Agar kisi din sirf Primary khana khaye aur Upper Primary nahi, toh kya karein?", "kw": "agar kisi din sirf primary khana khaye aur upper primary nahi, toh kya karein? alag alag class khana", "a": "आप Class-by-Class हाजिरी में सिर्फ उसी कक्षा की संख्या भरें जिसने भोजन किया — बाकी को 0 रखें, हिसाब बिल्कुल सटीक बनेगा।", "deep": ""}, {"id": 117, "q": "AI ko \"पिछले महीने के तीसरे बुधवार\" jaisi purani date bol sakte hain?", "kw": "ai ko \"पिछले महीने के तीसरे बुधवार\" jaisi purani date bol sakte hain? purani tarikh ai pichle mahine", "a": "हाँ! AI <i>\"कल\"</i>, <i>\"परसों\"</i>, <i>\"पिछले सोमवार\"</i> या <i>\"पिछले महीने के तीसरे बुधवार\"</i> जैसी जटिल तारीखें भी समझ लेता है।", "deep": ""}, {"id": 118, "q": "AI me \"half\" ya \"double\" bolkar stock/kharch badal sakte hain?", "kw": "ai me \"half\" ya \"double\" bolkar stock/kharch badal sakte hain? aadha dugna", "a": "हाँ, आप बोलकर किसी प्रविष्टि को आधा (`half`) या दोगुना (`double`) करने का आदेश भी दे सकते हैं।", "deep": ""}, {"id": 119, "q": "AI kisi entry ko delete karne se pehle confirmation maangta hai?", "kw": "ai kisi entry ko delete karne se pehle confirmation maangta hai? galti se delete", "a": "जी हाँ! एक से ज़्यादा मैच होने पर AI <b>दिनांक + श्रेणी + राशि</b> दिखाकर आपसे <i>\"हाँ डिलीट कर दो\"</i> की पुष्टि लेता है।", "deep": ""}, {"id": 120, "q": "Voice AI me Cheque Number bolte waqt space aa jaye toh?", "kw": "voice ai me cheque number bolte waqt space aa jaye toh? cheque number voice", "a": "यदि आप <i>\"15 11 20 1917\"</i> बोलें तो AI उसे अपने आप जोड़कर सही चेक नंबर `1511201917` बना लेता है।", "deep": ""}, {"id": 121, "q": "Kya website par bhi awaaz aur mic se saare sawal puch sakte hain?", "kw": "kya website par bhi awaaz aur mic se saare sawal puch sakte hain? website mic bolkar", "a": "हाँ! <b>poshankosh.com</b> पर माइक (`🎤`) एक बार दबाने पर लगातार सुनता है, शांत व स्पष्ट आवाज़ (`0.92x`) में जवाब देता है, और <i>\"धन्यवाद\"</i> बोलते ही बंद हो जाता है।", "deep": ""}, {"id": 122, "q": "Agar website AI ko koi sawal bilkul samajh na aaye toh?", "kw": "agar website ai ko koi sawal bilkul samajh na aaye toh? jawab na mile", "a": "असुविधा के लिए खेद है! कृपया अपना सवाल <b>support@poshankosh.com</b> पर मेल कर दें — हमारी टीम जल्द सहायता करेगी।", "deep": ""}, {"id": 123, "q": "PoshanKosh se bahar ke sawal (jaise mausam ya cricket) puchne par kya bolega?", "kw": "poshankosh se bahar ke sawal (jaise mausam ya cricket) puchne par kya bolega? out of scope", "a": "<i>\"माफ़ कीजिए, मैं केवल PoshanKosh ऐप (हाजिरी, रजिस्टर, AI फीचर्स, प्लान व रिपोर्ट) से जुड़े सवालों के ही जवाब दे सकती हूँ।\"</i>", "deep": ""}, {"id": 124, "q": "Kya app me 10 paise ka bhi rounding antar aata hai?", "kw": "kya app me 10 paise ka bhi rounding antar aata hai? rounding mismatch", "a": "नहीं, पूरा हिसाब <b>पैसे (exact paise integers)</b> में होता है, इसलिए कभी भी 10 पैसे या ₹1 का कैशबुक अंतर नहीं आता।", "deep": ""}, {"id": 125, "q": "PoshanKosh kis-kis rajya aur bhasha me kaam karta hai?", "kw": "poshankosh kis-kis rajya aur bhasha me kaam karta hai? all india state support", "a": "यह भारत के सभी <b>28 राज्यों और 8 केंद्र शासित प्रदेशों</b> में <b>हिंदी, English और Hinglish</b> तीनों में काम करता है।", "deep": ""}];
    var FAQ_KB = [{"id": "q1", "q": "How do I create a school account in PoshanKosh®?", "a": "Open the app and tap 'Sign in with Google' using your school or personal Gmail, tick the Google Drive permission box, select your State/UT (28 States & 8 UTs), and enter your School Name, UDISE code, and Opening Balances."}, {"id": "q2", "q": "Which states and union territories are supported in PoshanKosh®?", "a": "PoshanKosh® supports schools across all 28 States and 8 Union Territories of India."}, {"id": "q3", "q": "Why should I tick the Google Drive permission box during login?", "a": "Ticking the Google Drive permission allows PoshanKosh® to store encrypted backups inside your school's private drive.appdata folder so you never lose data if you change phones."}, {"id": "q4", "q": "Can I use PoshanKosh® without a desktop computer?", "a": "Yes, PoshanKosh® is designed for standard Android smartphones and tablets—no desktop or laptop is required."}, {"id": "q5", "q": "What Opening Balances do I need when starting?", "a": "Enter your verified month-start Opening Cash Balance, Opening Bank Balance, and Opening Rice Stock (for KG–5 and 6–8)."}, {"id": "q6", "q": "Can I change my School Name or UDISE details later?", "a": "Yes, go to Home → Top-Right Settings / Profile to review or update school profile details."}, {"id": "q7", "q": "Does PoshanKosh® work for both Primary (KG–5) and Upper Primary (6–8)?", "a": "Yes, both KG–5 and 6–8 sections are supported together with separate rice norms (100g/150g) and cooking cost norms (₹6.78/₹10.17)."}, {"id": "q8", "q": "Can an Upgraded +2 or Middle School with classes 1 to 8 use one account?", "a": "Yes, classes 1–5 and 6–8 are managed seamlessly inside a single school profile."}, {"id": "q9", "q": "Do I need to create a password separately?", "a": "No, Google Sign-In handles authentication securely without needing a separate password."}, {"id": "q10", "q": "Is registration open for teachers across rural and urban schools?", "a": "Yes, any teacher, headmaster, or MDM nodal teacher can set up their school in under 2 minutes."}, {"id": "q11", "q": "What happens immediately after I register my school?", "a": "Your school receives an instant 30-day active free trial with full offline access to all registers and PDFs."}, {"id": "q12", "q": "Can multiple teachers in the same school view backups?", "a": "If the school signs in with the school's shared Google account, encrypted Drive backups can be restored on the authorized device."}, {"id": "q13", "q": "Where do I mark daily student attendance?", "a": "Open Home → Daily Attendance (or the Attendance tab at the bottom), select the date, enter present counts, and tap Save."}, {"id": "q14", "q": "Does attendance calculate rice and cooking cost automatically?", "a": "Yes, saving daily attendance automatically deducts 100g (Primary) and 150g (Upper Primary) rice and posts ₹6.78 / ₹10.17 cooking costs."}, {"id": "q15", "q": "Does PoshanKosh® track SC, ST, OBC, General, Boys, and Girls counts?", "a": "Yes, daily attendance supports category-wise (SC/ST/OBC/Gen) and gender-wise (Boys/Girls) counts required for MPR reporting."}, {"id": "q16", "q": "How do I mark Egg, Fruit, or Ragi served on a specific day?", "a": "Inside Daily Attendance for that date, select Egg, Fruit, or Ragi options before tapping Save."}, {"id": "q17", "q": "What if school was closed on a holiday or Sunday?", "a": "You do not mark meal attendance on holidays; the monthly calendar in MPR automatically reflects active serving days."}, {"id": "q18", "q": "Can I mark attendance for a past date if I forgot yesterday?", "a": "Yes, select the past date in Daily Attendance, enter the counts, and Save—totals recalculate automatically."}, {"id": "q19", "q": "Does daily attendance update Chakhna (Tasting) and Daily Expenditure together?", "a": "Yes, saving attendance updates Daily Expenditure, Rice consumption, Egg/Fruit, Ragi, and Chakhna registers."}, {"id": "q20", "q": "What is the rice norm for Primary (KG–5) students?", "a": "100 grams (0.100 kg) per present student per day."}, {"id": "q21", "q": "What is the rice norm for Upper Primary (6–8) students?", "a": "150 grams (0.150 kg) per present student per day."}, {"id": "q22", "q": "What are the current cooking cost norms in PoshanKosh®?", "a": "₹6.78 per student per day for Primary (KG–5) and ₹10.17 per student per day for Upper Primary (6–8)."}, {"id": "q23", "q": "Can I enter 0 present students in one section if only Primary attended?", "a": "Yes, you can enter 0 for 6–8 and actual counts for KG–5 (or vice versa)."}, {"id": "q24", "q": "How fast does daily entry take once set up?", "a": "Less than 30 seconds a day."}, {"id": "q25", "q": "Where do I add new Rice stock in PoshanKosh®?", "a": "Go to Registers → Rice Stock Register → tap the top-right 3-dot (⋮) menu → Quick Restock, enter KG–5 and 6–8 quantities, and Save."}, {"id": "q26", "q": "Where do I add Cooking Cost, Egg, or Ragi funds received?", "a": "Open Daily Expenditure, Egg/Fruit, or Ragi register → tap the top-right 3-dot (⋮) menu → Quick Restock, enter KG–5 and 6–8 amounts, and Save."}, {"id": "q27", "q": "Do I have to manually add KG–5 and 6–8 totals in Quick Restock?", "a": "No, PoshanKosh® automatically calculates and displays the combined Total at the bottom as you type KG–5 and 6–8 shares."}, {"id": "q28", "q": "Does adding physical Rice stock change my Cashbook bank balance?", "a": "No, physical Rice restock only updates rice quantity (KG) and never alters Cashbook bank entries."}, {"id": "q29", "q": "Do Cooking Cost, Egg, or Ragi fund receipts auto-post to Cashbook?", "a": "Yes, fund receipts entered via Quick Restock automatically post to Cashbook bank receipts under their respective particulars."}, {"id": "q30", "q": "Can I add stock from inside Cashbook?", "a": "No, stock should be added inside the specific register's 3-dot (⋮) Quick Restock menu so both stock and bank records stay synchronized."}, {"id": "q31", "q": "What if my school only received rice for KG–5 and not 6–8?", "a": "Enter the KG–5 quantity and leave 6–8 as 0; the total updates cleanly."}, {"id": "q32", "q": "Can I enter rice stock in kilograms with decimals?", "a": "Yes, fractional quantities are supported accurately."}, {"id": "q33", "q": "Where can I see my remaining rice balance after adding stock?", "a": "Inside Registers → Rice Stock Register, closing balances update immediately after every restock and daily attendance entry."}, {"id": "q34", "q": "Why is Quick Restock placed under the 3-dot (⋮) menu?", "a": "Keeping Quick Restock in the top-right 3-dot menu keeps the main register table clean and readable like a printed ledger."}, {"id": "q35", "q": "Can I record multiple restocks in the same month?", "a": "Yes, every restock entry is dated and added chronologically to your stock balance."}, {"id": "q36", "q": "Does Quick Restock work offline?", "a": "Yes, all stock additions work 100% offline."}, {"id": "q37", "q": "How do I edit or correct a past Attendance entry?", "a": "Open Attendance, select that exact date, tap Edit (✏️) or update the student counts, and tap Save—all downstream registers recalculate automatically."}, {"id": "q38", "q": "How do I fix a mistake in Rice or Fund stock?", "a": "Open the respective Register, tap the row you want to correct, tap Edit (✏️), update the figure, and Save."}, {"id": "q39", "q": "When I update an old date, do closing balances for later dates update automatically?", "a": "Yes, PoshanKosh® automatically recalculates all subsequent daily totals and closing balances."}, {"id": "q40", "q": "Can I edit a Cheque Withdrawal entry if I typed the wrong Cheque No.?", "a": "Yes, open Withdrawal Register, select the entry, update the Cheque No. or amount, and Save."}, {"id": "q41", "q": "Can I fix a Cashbook entry date or narration?", "a": "Yes, open Cashbook, tap the entry to edit, and save—Cashbook sorts automatically by DD-MM-YYYY and time."}, {"id": "q42", "q": "Can I delete a duplicate test entry?", "a": "Yes, open that entry row and use the delete/edit option to remove duplicates cleanly."}, {"id": "q43", "q": "Will editing a register entry break my Bank Statement match?", "a": "If a reconciled entry is modified, Cashbook recalculates the balance so you can verify the match immediately."}, {"id": "q44", "q": "Can I update Opening Balances after starting?", "a": "Yes, Opening Balances can be adjusted from the setup/opening balance editor if an audit correction is required."}, {"id": "q45", "q": "Do I need internet to edit or update entries?", "a": "No, all edits and recalculations happen instantaneously offline on your device."}, {"id": "q46", "q": "Is there a separate 'Edit' tab in the bottom bar?", "a": "No, editing is done directly on any date or row inside Attendance, Registers, or Cashbook."}, {"id": "q47", "q": "How does Cashbook sort entries after I edit a date?", "a": "Cashbook sorts entries chronologically by DD-MM-YYYY, creation timestamp, and ID while preserving accurate cash positions."}, {"id": "q48", "q": "Are previous months protected when I add a new month?", "a": "Yes, October's verified closing balance carries forward smoothly as November's Opening Balance."}, {"id": "q49", "q": "Which 12+ statutory registers are included in PoshanKosh®?", "a": "Daily Expenditure, Cashbook, Rice Stock, Ragi/Millet, Egg/Fruit, IFA Iron, Chakhna (Tasting), Daily Attendance, Weekly, Monthly MPR, Quarterly UC, Half-Yearly, and Annual Audit (+ Withdrawal & Scheme Registers)."}, {"id": "q50", "q": "What is the Chakhna Panji (Food Tasting Register)?", "a": "A daily register certifying that food was tasted for quality, hygiene, and taste by a teacher, cook, or SMC member before serving students."}, {"id": "q51", "q": "What is the Ragi (Millet) Register?", "a": "Tracks Shree Anna / Ragi laddoo distribution, daily gram consumption, receipts, and closing stock."}, {"id": "q52", "q": "What is the IFA Iron & Folic Acid Register?", "a": "Tracks weekly distribution and monthly stock of Pink (Primary) and Blue (Upper Primary) IFA tablets under WIFS."}, {"id": "q53", "q": "What is the Egg / Fruit Register?", "a": "Records present counts on distribution days, total cost, and fund receipts/balances."}, {"id": "q54", "q": "Where do I record special grants like Kitchen Utensils or Gas?", "a": "Go to Registers → Scheme Register to add the grant, log split expenses, and mark the scheme as Settled."}, {"id": "q55", "q": "Does Scheme Register support split expenses across items?", "a": "Yes, the Scheme Register uses a clean 3-field form and a 9-column split-expense table."}, {"id": "q56", "q": "How does the Withdrawal Register work?", "a": "Go to Home → Withdrawal (or Registers → Withdrawal Register), enter Date, Amount, and Cheque No.; it automatically posts a Bank-to-Cash contra entry in Cashbook."}, {"id": "q57", "q": "Why does Withdrawal Register ask for Cheque No.?", "a": "Including Cheque No. creates proper audit-ready contra narration in your Cashbook without duplicate reference lines."}, {"id": "q58", "q": "Where is the Register tab located?", "a": "It is the 4th tab ('Registers') in the bottom navigation bar."}, {"id": "q59", "q": "Can I view month-wise registers using a Month Picker?", "a": "Yes, the Enterprise Month Picker lets you switch cleanly between any month and year."}, {"id": "q60", "q": "Do all 12+ registers stay synced with Daily Attendance?", "a": "Yes, entering attendance once automatically updates all dependent registers."}, {"id": "q61", "q": "Where is the Cashbook located in the app?", "a": "Tap Home → Cashbook (or Registers → Cashbook)."}, {"id": "q62", "q": "What date format does the Cashbook use?", "a": "Standard Indian DD-MM-YYYY format, sorted chronologically and time-wise."}, {"id": "q63", "q": "How do I match my Bank Statement with Cashbook?", "a": "Inside Cashbook, upload your monthly Bank Statement (PDF, CSV, or Photo) and match entries one-to-one."}, {"id": "q64", "q": "Can PoshanKosh® auto-fill missed bank entries?", "a": "Yes, 1-to-1 statement auto-fill lets you pull missed bank receipts, interest, or charges directly into Cashbook."}, {"id": "q65", "q": "How do I add Bank Interest or Bank Charges?", "a": "Inside Cashbook, use the Bank Interest / Bank Charge entry option (or auto-fill directly from your uploaded bank statement)."}, {"id": "q66", "q": "What is the Royal Blue POSHANKOSH VERIFIED seal?", "a": "When your Cashbook and Bank Statement reconcile 100%, Cashbook displays the Royal Blue CA-style 'POSHANKOSH VERIFIED' stamp."}, {"id": "q67", "q": "Are Closing Balance C/F and Total rows clearly formatted in Cashbook?", "a": "Yes, Closing Balance C/F and Total rows are bold and cleanly aligned for easy audit review."}, {"id": "q68", "q": "What if my Bank Statement is a photo instead of a PDF?", "a": "PoshanKosh® supports PDF, CSV, and Photo bank statements."}, {"id": "q69", "q": "What is the 7-Day Low Cash Alert?", "a": "PoshanKosh® monitors your available cooking cash and alerts you locally 7 days before funds run low."}, {"id": "q70", "q": "Does Cashbook separate Bank balance and Cash-in-hand?", "a": "Yes, Bank and Cash columns are tracked separately with proper contra entries for withdrawals."}, {"id": "q71", "q": "Can I generate an MPR PDF before finishing Bank Statement matching?", "a": "Yes, Draft Mode lets you generate the MPR PDF immediately even before complete bank reconciliation."}, {"id": "q72", "q": "Does PoshanKosh® upload my bank statement to any server?", "a": "No—bank statement parsing and matching happen locally, and zero financial records are stored on our servers."}, {"id": "q73", "q": "Where do I generate Monthly Vouchers and MPR PDFs?", "a": "Open the 5th bottom tab ('Reports')."}, {"id": "q74", "q": "Which 4 Monthly Vouchers does PoshanKosh® generate?", "a": "Vr 1: Ration & Dry Groceries, Vr 2: Egg & Fruit, Vr 3: Fresh Vegetables, and Vr 4: Cooking Fuel & LPG."}, {"id": "q75", "q": "Do Monthly Vouchers auto-post to Cashbook expenses?", "a": "Yes, all 4 monthly vouchers automatically post into your Cashbook expense column."}, {"id": "q76", "q": "What does the 2-page MPR PDF contain?", "a": "Page 1 & 2 include the monthly calendar, plates served, class 1–8 breakdown, stock tables 3A–3D, bank reconciliation summary, and 3 signature blocks."}, {"id": "q77", "q": "Can I print MPR PDFs in Hindi or English?", "a": "Yes, PoshanKosh® supports bilingual Hindi and English MPR PDF output."}, {"id": "q78", "q": "What is MPR Draft Mode?", "a": "Draft Mode allows you to preview and generate the MPR PDF immediately without blocking on complete bank reconciliation or caste breakdown."}, {"id": "q79", "q": "Can I share the generated PDF via WhatsApp or print it directly?", "a": "Yes, exported PDFs save cleanly to your device so you can print or share them with your BRC/office."}, {"id": "q80", "q": "Are voucher numbers formatted automatically (e.g., Vr 1/2026)?", "a": "Yes, voucher sequences and month/year references format automatically."}, {"id": "q81", "q": "Do I need to re-type attendance numbers for MPR?", "a": "No, every table in the MPR pulls directly from your daily attendance and register entries."}, {"id": "q82", "q": "How long does it take to export all 4 vouchers and MPR?", "a": "Under 2 minutes at the end of the month."}, {"id": "q83", "q": "Can I regenerate an old month's MPR PDF anytime?", "a": "Yes, select any past month in the Month Picker and export its PDF anytime."}, {"id": "q84", "q": "Are signature blocks included at the bottom of the MPR PDF?", "a": "Yes, 3 signature blocks are included for Headmaster, SMC, and official verification."}, {"id": "q85", "q": "Does PoshanKosh® work without internet in rural schools?", "a": "Yes, 100% of daily attendance, registers, cashbook, vouchers, and PDF generation work completely offline."}, {"id": "q86", "q": "Where is my school data stored when offline?", "a": "In an encrypted local SQLite database (sqlite3mc) right on your Android phone."}, {"id": "q87", "q": "How do I back up my data to Google Drive?", "a": "Go to Home → Top-Right Settings → Google Drive Backup → Backup Now when internet is available."}, {"id": "q88", "q": "Where in Google Drive are my backups saved?", "a": "Inside your Google account's hidden, app-private drive.appdata folder—not visible to other apps or our servers."}, {"id": "q89", "q": "How do I restore my data on a new phone?", "a": "Install PoshanKosh® on your new phone and sign in with the exact same Google account used for backup."}, {"id": "q90", "q": "What happens if I update the APK to a newer version?", "a": "Because releases use a permanent upload keystore, updating the APK installs cleanly in-place without uninstalling or losing your data."}, {"id": "q91", "q": "Does my 30-day trial or paid license work offline?", "a": "Yes, verified license entitlements are cached securely offline on your device so you are never blocked in zero-network zones."}, {"id": "q92", "q": "How often should I tap Backup Now?", "a": "Once a week or at the end of every month after completing your vouchers and MPR."}, {"id": "q93", "q": "Can another school see my Google Drive backup?", "a": "No, each backup lives inside your own private Google account."}, {"id": "q94", "q": "What if I forget to back up for a few days?", "a": "Your data remains safely stored in your phone's encrypted local database until you sync."}, {"id": "q95", "q": "Is PoshanKosh® a government app?", "a": "No. PoshanKosh® is an independent, individual utility built for teachers—it is NOT a government app and makes no claim to represent any ministry or department."}, {"id": "q96", "q": "Does PoshanKosh® store any financial transaction data on its servers?", "a": "Zero. PoshanKosh® never stores your cashbook, bank statements, vouchers, scheme grants, or stock data on its servers."}, {"id": "q97", "q": "What minimal data does PoshanKosh® use to run?", "a": "Only minimal account identity (name, email, school UDISE/state) and subscription/trial status—never your school's financial ledger."}, {"id": "q98", "q": "Does PoshanKosh® show advertisements?", "a": "No, PoshanKosh® is 100% ad-free."}, {"id": "q99", "q": "Does PoshanKosh® sell teacher or student data?", "a": "Never. We do not sell, rent, or share user data with third-party advertisers or brokers."}, {"id": "q100", "q": "Is PoshanKosh® compliant with India's DPDP Act 2023?", "a": "Yes, our Privacy Policy and data minimization architecture are aligned with the Digital Personal Data Protection (DPDP) Act, 2023."}, {"id": "q101", "q": "Does PoshanKosh® follow Google API Services User Data Policy?", "a": "Yes, Google Drive access is strictly limited to app-private drive.appdata backups under Google's Limited Use policy."}, {"id": "q102", "q": "How is my local database protected on my phone?", "a": "Using SQLite encryption (sqlite3mc) inside private app storage."}, {"id": "q103", "q": "Can I read the full Privacy Policy and Terms?", "a": "Yes, visit poshankosh.com/privacy.html and poshankosh.com/terms.html anytime."}, {"id": "q104", "q": "Who do I contact for privacy or data deletion requests?", "a": "Email anantchandraushaamallick07@gmail.com or visit poshankosh.com/contact.html."}, {"id": "q105", "q": "Is there a free trial before paying?", "a": "Yes, every newly registered school gets a full 30-day free trial with offline access."}, {"id": "q106", "q": "Why does PoshanKosh® charge ₹119 per year?", "a": "There is no corporate funding or ads; ₹119 covers cloud server hosting, deployment, domain maintenance, and modest support for the developer."}, {"id": "q107", "q": "Are there any hidden monthly fees after ₹119?", "a": "No, ₹119 covers the full annual license with zero ads."}, {"id": "q108", "q": "Which payment methods are supported?", "a": "UPI and standard digital payment options (such as PhonePe/UPI) inside the app."}, {"id": "q109", "q": "What is the refund policy?", "a": "Please review Section 9 of Terms & Conditions at poshankosh.com/terms.html for full refund eligibility and grievance timelines."}, {"id": "q110", "q": "Where can I download the official PoshanKosh® APK?", "a": "From poshankosh.com/#download or the official GitHub Releases link on the website."}, {"id": "q111", "q": "Which Android version is required?", "a": "Works smoothly on standard Android smartphones (ARM64 release APK v0.16.4)."}, {"id": "q112", "q": "What if I face an issue or have a feature request?", "a": "Email anantchandraushaamallick07@gmail.com with your school UDISE and screenshot for fast support."}, {"id": "q113", "q": "Where can I read the founder's story behind PoshanKosh®?", "a": "Visit poshankosh.com/journey.html to read how a teacher father's late-night register struggle inspired PoshanKosh®."}, {"id": "q114", "q": "Which courts have jurisdiction over legal disputes?", "a": "Courts in Ranchi, Jharkhand, India, as stated in Terms & Conditions."}];

    var freshForm = form.cloneNode(true);
    form.parentNode.replaceChild(freshForm, form);
    inp = document.getElementById('ai-input');
    defaultPlaceholder = inp.getAttribute('placeholder') || 'Type or speak...';

    if (!document.getElementById('pk-mic-btn')) {
      micBtn = document.createElement('button');
      micBtn.id = 'pk-mic-btn';
      micBtn.type = 'button';
      micBtn.title = 'बोलकर पूछें (Continuous Voice)';
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
        rec = new SpeechRec();
        rec.interimResults = false;
        micBtn.addEventListener('click', function () {
          if ('speechSynthesis' in window) window.speechSynthesis.cancel();
          isSpeaking = false;
          if (handsFree) { stopMicLoop(); } else { handsFree = true; startMicLoop(); }
        });
        rec.onresult = function (ev) {
          var transcript = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : '';
          listening = false;
          if (transcript) {
            inp.value = transcript;
            freshForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
          } else if (handsFree && !isSpeaking) {
            setTimeout(startMicLoop, 250);
          }
        };
        rec.onend = function () {
          listening = false;
          if (handsFree && !isSpeaking) setTimeout(startMicLoop, 250);
          else if (!handsFree) updateMicUi(false);
        };
        rec.onerror = function (ev) {
          listening = false;
          if (ev && (ev.error === 'not-allowed' || ev.error === 'service-not-allowed')) stopMicLoop();
          else if (handsFree && !isSpeaking) setTimeout(startMicLoop, 450);
          else if (!handsFree) updateMicUi(false);
        };
      } else {
        micBtn.addEventListener('click', function () {
          var msg = '🎤 बोलकर पूछने के लिए कृपया Chrome या Safari में खोलें।';
          box.innerHTML += '<div class="flex items-start gap-2.5"><div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div><div class="bg-white p-3 rounded-2xl text-slate-700 border border-slate-200 text-xs">' + msg + '</div></div>';
          box.scrollTop = box.scrollHeight;
          speakText(msg);
        });
      }
    }

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
      var reply = null;

      // Deep Follow-Up Knowledge trigger ("kyun", "kaise", "detail me", "aur samjhao")
      if (ctx.lastDeep && /^(kyun|kyu|kaise|why|how|detail|details|more|aur batao|samjhao|explain|क्यों|कैसे|विस्तार|समझाओ)$/i.test(nRaw)) {
        reply = ctx.lastDeep;
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

        var mBest = null, mScore = 0;
        var stop = {the:1,is:1,in:1,to:1,of:1,and:1,for:1,how:1,what:1,can:1,do:1,does:1,my:1,me:1,a:1,an:1,or:1,kya:1,ky:1,kaise:1,hai:1,h:1,ko:1,ke:1,ki:1,ka:1,toh:1,se:1,poshankosh:1};
        var qWords = words.filter(function (w) { return w.length > 2 && !stop[w]; });
        if (bestScore < 14 && qWords.length > 0) {
          MASTER_KB.forEach(function (item) {
            var sc = 0;
            qWords.forEach(function (w) {
              if (item.kw.indexOf(w) !== -1) sc += 4;
              else if (item.a.toLowerCase().indexOf(w) !== -1) sc += 1;
            });
            if (sc > mScore) { mScore = sc; mBest = item; }
          });
        }

        var faqBest = null, faqScore = 0;
        if (bestScore < 12 && mScore < 4 && qWords.length > 0) {
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

        if (best && bestScore >= 14) {
          ctx.lastTopic = best.id;
          ctx.lastDeep = best.deep || null;
          reply = typeof best.a === 'function' ? best.a(hi) : best.a;
        } else if (mBest && mScore >= 4) {
          ctx.lastDeep = mBest.deep || null;
          reply = mBest.a;
        } else if (best && bestScore > 0) {
          ctx.lastTopic = best.id;
          ctx.lastDeep = best.deep || null;
          reply = typeof best.a === 'function' ? best.a(hi) : best.a;
        } else if (faqBest && faqScore >= 4) {
          ctx.lastDeep = null;
          reply = '<b>' + faqBest.q + '</b><br>' + faqBest.a + ' <a href="faqs.html#' + faqBest.id + '" class="text-brand-green font-bold underline">' + faqBest.id.toUpperCase() + '</a>';
        } else if (/weather|mausam|cricket|ipl|movie|song|gaana|pm|modi|virat|news|joke|मौसम|क्रिकेट|गाना|समाचार/.test(nRaw)) {
          reply = hi
            ? 'माफ़ कीजिए, मैं केवल <b>PoshanKosh ऐप</b> (हाजिरी, रजिस्टर, AI फीचर्स, प्लान व रिपोर्ट) से जुड़े सवालों के ही जवाब दे सकती हूँ।'
            : 'Sorry, I can only answer questions related to the <b>PoshanKosh® app</b> (attendance, registers, AI features, plans & reports).';
        } else {
          reply = hi
            ? 'असुविधा के लिए खेद है! कृपया अपना सवाल <b>support@poshankosh.com</b> पर मेल कर दें — हमारी टीम जल्द सहायता करेगी।'
            : 'Sorry for the inconvenience! Please email your question to <b>support@poshankosh.com</b> — our team will assist you shortly.';
        }
      }

      setTimeout(function () {
        box.innerHTML += '<div class="flex items-start gap-2.5"><div class="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 border border-slate-200 shrink-0 mt-1"><img src="logo-256x256.png" class="w-full h-full object-contain"></div><div class="bg-white p-3.5 rounded-2xl text-slate-800 border border-slate-200 shadow-2xs max-w-[85%] text-xs sm:text-sm leading-relaxed">' + reply + '</div></div>';
        box.scrollTop = box.scrollHeight;
        speakText(reply);
      }, 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAIAgent);
  } else {
    startAIAgent();
  }
})();
