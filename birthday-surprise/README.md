# 💗 Birthday Surprise Website

A romantic, mobile-first birthday surprise made with plain HTML, CSS and JavaScript — no build step, no frameworks, no installs.

```
birthday-surprise/
├── index.html          ← page structure (you don't need to edit this)
├── css/style.css       ← design & animations
├── js/
│   ├── config.js       ← ✨ EDIT THIS: all names, text, photos, music, colors
│   └── script.js       ← behaviour (you don't need to edit this)
├── assets/
│   ├── images/         ← put your photos here
│   └── audio/          ← put your song here
└── README.md
```

---

## 1. Personalize it (one file only)

Open **`js/config.js`** in any text editor (Notepad, VS Code…). Everything you need to change is in there, with comments.

| What | Where in `config.js` |
|---|---|
| Her name / your name | `herName`, `yourName` (use `{herName}` / `{yourName}` inside any text) |
| Birthday letter | `yourBirthdayMessage` (replace `[YOUR_BIRTHDAY_MESSAGE]`; blank line = new paragraph). Leave the placeholder to keep the starter letter in `letter.paragraphs` |
| Timeline dates & stories | `story.milestones` — replace every `[DATE]` and `[text in brackets]` |
| Photos & captions | `photos` |
| Music file & title | `music.file`, `music.title` |
| Theme colors | `theme` |
| Cake message, candle count | `cake` |
| Final surprise message | `final.paragraphs` |

> Open the browser console (F12) and you'll see a list of any `[PLACEHOLDERS]` still left to replace. Nothing in the site is invented — the starter letter and captions are the only pre-written text, and you can change them.

### Photos
1. Resize photos to about **1200 px wide, under 300 KB** (squoosh.app is a free tool for this).
2. Copy them into `assets/images/` (e.g. `us-1.jpg`).
3. In `config.js`, change each `src` to `"assets/images/us-1.jpg"` and edit the caption.
4. Add or remove entries freely — the gallery adapts (4–8 photos look best). A missing photo shows a soft pink "Add your photo" card instead of a broken image.

### Music
1. Use a song you have **permission** to use (your own recording, royalty-free or licensed music).
2. Put it in `assets/audio/` (MP3 works everywhere) and set `music.file` to `"assets/audio/your-song.mp3"`.
3. The included `birthday-melody.mp3` is a short original music-box loop so the player works out of the box.
4. Music never autoplays — she taps the ♪ button. Set `music.file` to `""` to hide the player. If the file is missing, the player politely hides itself.

---

## 2. Run it locally

**Quickest:** double-click `index.html`. Everything works that way.

**Recommended (behaves exactly like the real website):**
```bash
cd birthday-surprise
python3 -m http.server 8000
```
Then open <http://localhost:8000>. To test on your phone, connect it to the same Wi-Fi and open `http://<your-computer's-IP>:8000`.

---

## 3. Publish it (free) and get a shareable link

### Option A — GitHub Pages (free)
1. Create a free account at github.com → **New repository** (e.g. `birthday-surprise`).
2. Click **Add file → Upload files**, drag in the *contents* of the folder (`index.html`, `css`, `js`, `assets`, `README.md`), then **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After a minute or two your link appears at the top of that page:
   `https://YOUR-USERNAME.github.io/birthday-surprise/`

*Note: on a free GitHub account the repository must be public, so anyone with the link could find your photos. Use a hard-to-guess repository name, or choose Vercel with a private repository.*

### Option B — Vercel (free, works with private repos)
1. Push the folder to a GitHub repository (as above — it can be **private**).
2. Sign in at vercel.com with GitHub → **Add New → Project** → import the repository.
3. Framework preset: **Other**. Leave build settings empty and click **Deploy**.
4. You get a link like `https://birthday-surprise-xyz.vercel.app`. In *Project → Settings → Domains* you can change the name to something sweeter.

*(Also handy: Netlify Drop at app.netlify.com/drop — drag the whole folder onto the page and get a link instantly.)*

### Send it on WhatsApp
Copy the link and paste it into the chat. It opens straight in her phone's browser. Tip: open it on your own phone first, tap through everything once, and tap ♪ to check the music.

---

## 4. Update it after publishing

- **On GitHub:** open the repository → click `js/config.js` → ✏️ edit → **Commit changes**. To swap photos/music: **Add file → Upload files** into `assets/images` or `assets/audio` (same name replaces the old one).
- GitHub Pages/Vercel republish automatically within ~1–2 minutes. The link stays the same.
- If she sees old content, ask her to refresh (or open the link in a private tab).

---

## 5. Behaviour notes

- **Replay Our Little Story** scrolls back to the top and resets the letter, cake and animations. Music keeps playing (pause it with the ♪ button).
- **Reduced motion:** if a visitor's device is set to reduce motion, animations are switched off, the letter appears instantly and the site stays fully usable.
- **Letter:** the typewriter plays when she reaches it; "Show the whole letter" skips ahead.
- **Cake:** "Make a Wish ✨" blows out the candles with confetti and hearts; the button then offers to light them again.
- **Photos:** tap any photo to view it larger (arrow keys / swipe-buttons to browse, Esc to close).
- The page is marked `noindex`, so search engines won't list it.

---

## 6. Pre-send checklist

- [ ] All `[PLACEHOLDERS]` replaced in `js/config.js`
- [ ] Your photos are in `assets/images/` and referenced in `config.js`
- [ ] Music file is in `assets/audio/` and you have permission to use it
- [ ] Opened the published link on your phone; tapped every button once
- [ ] Sent her the link 💗
