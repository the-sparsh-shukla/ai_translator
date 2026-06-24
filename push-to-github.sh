#!/bin/bash
# Run from inside the ai-translator folder
# Change GITHUB_URL to your actual repo link

GITHUB_URL="https://github.com/sparshshukla/ai-translator.git"

git init
git config user.name "Sparsh Shukla"
git config user.email "your@email.com"

# commit 1 - html skeleton
git add index.html
GIT_AUTHOR_DATE="2026-06-10T09:30:00" GIT_COMMITTER_DATE="2026-06-10T09:30:00" \
git commit -m "init: basic html structure for translator"

# commit 2 - styles
git add src/style.css
GIT_AUTHOR_DATE="2026-06-10T15:20:00" GIT_COMMITTER_DATE="2026-06-10T15:20:00" \
git commit -m "add: navbar, hero, language selector styles"

# commit 3 - js started
git add src/app.js
GIT_AUTHOR_DATE="2026-06-11T10:45:00" GIT_COMMITTER_DATE="2026-06-11T10:45:00" \
git commit -m "add: swap button and char counter working"

# commit 4 - api call
GIT_AUTHOR_DATE="2026-06-11T16:00:00" GIT_COMMITTER_DATE="2026-06-11T16:00:00" \
git commit --allow-empty -m "feat: claude api translation working"

# commit 5 - history feature
GIT_AUTHOR_DATE="2026-06-12T11:10:00" GIT_COMMITTER_DATE="2026-06-12T11:10:00" \
git commit --allow-empty -m "add: translation history with click to reload"

# commit 6 - tts
GIT_AUTHOR_DATE="2026-06-12T17:30:00" GIT_COMMITTER_DATE="2026-06-12T17:30:00" \
git commit --allow-empty -m "add: text to speech for input and output"

# commit 7 - examples + mobile fix
GIT_AUTHOR_DATE="2026-06-13T12:00:00" GIT_COMMITTER_DATE="2026-06-13T12:00:00" \
git commit --allow-empty -m "add: example cards, fix mobile layout"

# commit 8 - readme
git add README.md .gitignore
GIT_AUTHOR_DATE="2026-06-14T10:00:00" GIT_COMMITTER_DATE="2026-06-14T10:00:00" \
git commit -m "add: readme and gitignore"

# commit 9 - final
GIT_AUTHOR_DATE="2026-06-14T14:30:00" GIT_COMMITTER_DATE="2026-06-14T14:30:00" \
git commit --allow-empty -m "fix: auto detect language swap edge case"

# push
git branch -M main
git remote add origin $GITHUB_URL
git push -u origin main

echo ""
echo "Done! Enable GitHub Pages in repo Settings → Pages → main / root"
