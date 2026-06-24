// app.js - translator app logic
// sparsh shukla · pinnacle labs internship 2026



let translationHistory = [];
let lastTranslation = '';

window.onload = function() {


  let savedKey = localStorage.getItem('apiKey');
  if (savedKey) {
    document.getElementById('apiKey').value = savedKey;
  }

  
  document.getElementById('inputText').addEventListener('input', function() {
    let len = this.value.length;
    document.getElementById('charCount').textContent = len + ' / 3000';

    
    if (len > 2700) {
      document.getElementById('charCount').style.color = '#cc0000';
    } else {
      document.getElementById('charCount').style.color = '#ccc';
    }
  });

  
  document.getElementById('swapBtn').onclick = function() {
    let fromSel = document.getElementById('fromLang');
    let toSel = document.getElementById('toLang');

    let fromVal = fromSel.value;
    let toVal = toSel.value;

    
    if (fromVal === 'auto') {
      alert('Cannot swap when source is set to Auto Detect. Please select a specific language first.');
      return;
    }

    
    let inputText = document.getElementById('inputText').value;
    let outputText = lastTranslation;

    fromSel.value = toVal;
    toSel.value = fromVal;

    if (outputText) {
      document.getElementById('inputText').value = outputText;
      document.getElementById('inputText').dispatchEvent(new Event('input'));
      clearOutput();
    }
  };

  
  document.getElementById('clearBtn').onclick = function() {
    document.getElementById('inputText').value = '';
    document.getElementById('charCount').textContent = '0 / 3000';
    clearOutput();
    hideError();
  };

  
  document.getElementById('pasteBtn').onclick = async function() {
    try {
      let text = await navigator.clipboard.readText();
      document.getElementById('inputText').value = text;
      document.getElementById('inputText').dispatchEvent(new Event('input'));
    } catch(e) {
      // clipboard api might not work on all browsers
      alert('Could not access clipboard. Please paste manually with Ctrl+V / Cmd+V');
    }
  };

  
  document.getElementById('copyBtn').onclick = function() {
    if (!lastTranslation) return;

    navigator.clipboard.writeText(lastTranslation).then(function() {
      let btn = document.getElementById('copyBtn');
      btn.textContent = '✅';
      setTimeout(function() {
        btn.textContent = '📋';
      }, 2000);
    });
  };

  
  document.getElementById('listenInputBtn').onclick = function() {
    let text = document.getElementById('inputText').value.trim();
    if (!text) return;
    speakText(text);
  };

  document.getElementById('listenOutputBtn').onclick = function() {
    if (!lastTranslation) return;
    speakText(lastTranslation);
  };

  
  document.getElementById('translateBtnBottom').onclick = translate;
  document.getElementById('translateBtn').onclick = translate;

  
  document.getElementById('clearHistoryBtn').onclick = function() {
    translationHistory = [];
    renderHistory();
  };

  
  document.getElementById('inputText').addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      translate();
    }
  });

};



async function translate() {
  let inputText = document.getElementById('inputText').value.trim();
  let apiKey = document.getElementById('apiKey').value.trim();
  let fromLang = document.getElementById('fromLang').value;
  let toLang = document.getElementById('toLang').value;

  
  if (!inputText) {
    showError('Please enter some text to translate.');
    return;
  }

  if (!apiKey) {
    showError('Please enter your Anthropic API key.');
    return;
  }

  if (fromLang !== 'auto' && fromLang === toLang) {
    showError('Source and target languages are the same. Please pick different languages.');
    return;
  }

  
  localStorage.setItem('apiKey', apiKey);

  hideError();
  setLoading(true);
  lastTranslation = '';

  let sourceInfo = fromLang === 'auto'
    ? 'Detect the source language automatically.'
    : `The source language is ${fromLang}.`;

  let prompt = `You are a professional translator. Translate the text below to ${toLang}.

${sourceInfo}

Rules:
- Return ONLY the translated text. No explanations, no notes, no "Translation:" prefix.
- Keep the same tone and formatting as the original.
- If there are names or proper nouns, keep them as-is unless they have a standard translation.
- If the text is already in ${toLang}, still return it (cleaned up if needed).
- At the very end, on a new line, add: [DETECTED: <detected language name>]

Text to translate:
${inputText}`;

  try {
    let response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      let errData = await response.json().catch(function() { return {}; });
      let msg = errData?.error?.message || 'Request failed';

      if (response.status === 401) {
        throw new Error('Invalid API key. Check your key at console.anthropic.com');
      } else if (response.status === 429) {
        throw new Error('Rate limit hit. Please wait a moment and try again.');
      } else {
        throw new Error(msg);
      }
    }

    let data = await response.json();
    let fullText = '';

    for (let block of data.content) {
      if (block.type === 'text') {
        fullText += block.text;
      }
    }

    
    let detectedLang = '';
    let translatedText = fullText;

    let detectedMatch = fullText.match(/\[DETECTED:\s*(.+?)\]/i);
    if (detectedMatch) {
      detectedLang = detectedMatch[1].trim();
      // remove the detected line from the translation
      translatedText = fullText.replace(/\[DETECTED:.*?\]/i, '').trim();
    }

    lastTranslation = translatedText;

    setLoading(false);
    showOutput(translatedText, detectedLang, fromLang);

    
    addToHistory(inputText, fromLang, toLang, translatedText, detectedLang);

  } catch(err) {
    setLoading(false);
    showError('Error: ' + err.message);
    console.error(err);
  }
}



function showOutput(text, detectedLang, fromLang) {
  document.getElementById('outputText').textContent = text;

  
  let badge = document.getElementById('detectedLang');
  if (fromLang === 'auto' && detectedLang) {
    badge.textContent = 'Detected: ' + detectedLang;
    badge.style.display = 'inline-block';
  } else {
    badge.style.display = 'none';
  }

  
  let note = document.getElementById('translationNote');
  note.textContent = 'Translated by Claude AI';
  note.style.display = 'inline-block';
}



function clearOutput() {
  lastTranslation = '';
  document.getElementById('outputText').innerHTML = '<span class="output-placeholder">Translation will appear here</span>';
  document.getElementById('detectedLang').style.display = 'none';
  document.getElementById('translationNote').style.display = 'none';
}



function addToHistory(original, fromLang, toLang, translated, detectedLang) {
  let item = {
    original: original,
    translated: translated,
    from: fromLang === 'auto' ? (detectedLang || 'Auto') : fromLang,
    to: toLang,
    time: new Date().toLocaleTimeString()
  };

  // keep only last 10
  translationHistory.unshift(item);
  if (translationHistory.length > 10) {
    translationHistory.pop();
  }

  renderHistory();
}



function renderHistory() {
  let section = document.getElementById('historySection');
  let list = document.getElementById('historyList');

  if (translationHistory.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  list.innerHTML = '';

  for (let item of translationHistory) {
    
    let origDisplay = item.original.length > 80 ? item.original.slice(0, 80) + '...' : item.original;
    let transDisplay = item.translated.length > 80 ? item.translated.slice(0, 80) + '...' : item.translated;

    let div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="history-text">${safe(origDisplay)}</div>
      <div class="history-lang">${safe(item.from)} → ${safe(item.to)}</div>
      <div class="history-result">${safe(transDisplay)}</div>
    `;

    
    div.style.cursor = 'pointer';
    div.onclick = (function(i) {
      return function() {
        document.getElementById('inputText').value = i.original;
        document.getElementById('inputText').dispatchEvent(new Event('input'));

        
        let fromSel = document.getElementById('fromLang');
        let toSel = document.getElementById('toLang');

        
        for (let opt of fromSel.options) {
          if (opt.value === i.from) {
            fromSel.value = i.from;
            break;
          }
        }
        toSel.value = i.to;

        showOutput(i.translated, '', i.from);
        lastTranslation = i.translated;

        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    })(item);

    list.appendChild(div);
  }
}



function loadExample(text, from, to) {
  document.getElementById('inputText').value = text;
  document.getElementById('inputText').dispatchEvent(new Event('input'));
  document.getElementById('fromLang').value = from;
  document.getElementById('toLang').value = to;
  clearOutput();
  hideError();
  
  window.scrollTo({ top: 200, behavior: 'smooth' });
}



function speakText(text) {
  if (!window.speechSynthesis) {
    alert('Your browser does not support text-to-speech. Try Chrome or Edge.');
    return;
  }
  
  window.speechSynthesis.cancel();

  let utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}




function setLoading(on) {
  let btn = document.getElementById('translateBtnBottom');
  let btn2 = document.getElementById('translateBtn');
  let loadingDiv = document.getElementById('outputLoading');
  let outputDiv = document.getElementById('outputText');

  btn.disabled = on;
  btn2.disabled = on;
  btn.textContent = on ? '⏳ Translating...' : '✨ Translate with Claude AI';

  loadingDiv.style.display = on ? 'flex' : 'none';
  outputDiv.style.display = on ? 'none' : 'block';
}

function showError(msg) {
  let el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.style.display = 'block';
}

function hideError() {
  document.getElementById('errorMsg').style.display = 'none';
}


function safe(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
