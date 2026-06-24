# Translator App

Pinnacle Labs AI Internship 2026 — Project 2

This is a small, client-side translator built with plain HTML, CSS, and JavaScript. It uses the Anthropic Claude API to translate text between 35+ languages and aims to keep translations natural and context-aware.

---

## Features

- Translate between 35+ languages
- Auto language detection
- Swap source and target language
- Translation history (last 10 entries, click to reload)
- Copy translations to the clipboard
- Text-to-speech for input and output (browser Web Speech API)
- Example phrases to try
- Character counter (up to 3000 characters)
- `Ctrl+Enter` shortcut to submit

---

## Tech

- HTML, CSS, JavaScript — no build step required
- Anthropic Claude API for translation
- Browser Web Speech API for TTS
- Google Fonts (Inter)

---

## Run locally

Open `index.html` in a browser — no server required.

To clone the repo:

```bash
git clone https://github.com/the-sparsh-shukla/ai-translator.git
cd ai-translator
# then open index.html in your browser
```

Or serve the folder locally:

```bash
python -m http.server 3000
```

---

## API key

Get an API key from https://console.anthropic.com and paste it into the API key field at the bottom of the app. The key is stored in `localStorage` so you won't need to re-enter it on the same machine.

This project is fully client-side — there is no backend that stores your key.

---

## File structure

```
ai-translator/
├── index.html      # main UI
├── src/
│   ├── app.js      # logic: API calls, history, TTS, swap, etc.
│   └── style.css   # styles
└── README.md
```

---

## Planned improvements

- PDF / file translation
- Image translation (OCR + translate)
- Persist history across reloads
- Pronunciation hints for difficult languages
- Dark mode

---

## Notes / What I learned

- Using the Claude API for focused translation tasks
- Designing prompts to avoid extra commentary in translations
- Using the Web Speech API for in-browser TTS
- Handling edge cases when swapping languages with auto-detect enabled

---

Made by Sparsh Shukla · GitHub: the-sparsh-shukla · Pinnacle Labs AI Internship 2026
# ai_translator
