# Phase 1 — Discovery Report (AFTER EDIT · ۰۱۱ رپ)

> Reference benchmark: **iran-rap.ir** (battle-rap community platform)
> Brand: **AFTER EDIT** · Label / Project: **۰۱۱ رپ (011 RAP / 011 Family)**
> Deployment target: **GitHub Pages (static)** — `aftereditchannel-cell.github.io/011111`

---

## 1. Discovered Sitemap

### 1.1 Reference site (`iran-rap.ir`) — public routes discovered by crawling

| Route | Page Type | Purpose |
|---|---|---|
| `/` | Home | Feature hub: live duel, battle, tournament, gangs, beatcenter, radio, community, missions, prize box, new members, banners, RapGram posts, articles, gift code, app download |
| `/login.html` | Auth | Login / Register (Supabase-backed), forgot-password recovery |
| `/battlelogin` | Landing → gate | Battle arena intro, section guide, rules, CTA to enter |
| `/battles` | App (gated) | Battle arena: start battle, pending, in progress, ended |
| `/tournamentlogin` | Landing → gate | Tournament intro |
| `/ganglogin` | Landing → gate | Gangs intro |
| `/gangs` | App (gated) | Gang/collective system |
| `/beatcenter` | App | Beat center (instrumentals) |
| `/duel` | App | Live duel viewer |
| `/radio-iranrap` | Media | Streaming radio |
| `/patogh` | Community | User community / hangout |
| `/funnybox` | Gamified | Daily prize box |
| `/missions` | Gamified | Missions/quests |
| `/rapgram.html` | Feed | RapGram photo/video feed |
| `/articles` | Listing | News / release archive |
| `/article.html?id=…` | Detail | Article/release detail (album info, tracklist, download) |
| `/profile.html?user=…` | Profile | Public user/artist profile |
| `/profile` · `/membership` | Account | Profile, membership card |
| `/marketlogin` | Store | Personalization store |
| `/vip` · `/rewards` · `/download` | Monetization | VIP, gift codes, app download |
| `/kifepool` | Wallet | Wallet/finance |

### 1.2 AFTER EDIT site — full sitemap (implemented in this repo)

| Route | Page Type | Purpose | Main Components |
|---|---|---|---|
| `index.html` | Meetings (home-entry) | Upcoming/past label meetings + RSVP | hero, segmented tabs, meeting cards, RSVP CTA |
| `home.html` | Home | Brand hero, official pages, stats, videos, stories, artists, latest tracks, next meeting | hero, page cards, stats, video cards, story ring, artist chips, track rows, footer |
| `music.html` | Music library | Browse all tracks by artist, SoundCloud player | artist filter row, artist panel, search, track list, player bar |
| `artists.html` | Artist listing | All label artists with stats + socials | profile cards, platform buttons |
| `artist.html` | Artist detail | Redirect to filtered music view (`music.html?artist=`) | redirect |
| `stories.html` | Stories | Artist story grid | story rings, 9:14 tiles |
| `story-view.html` | Story viewer | Fullscreen story player | progress bars, tap nav, double-tap like |
| `battles.html` | Battles | Battle arena: live/ended/mine, vote, comments | battle cards, vote buttons, progress bars, comments |
| `rank.html` | Ranking | Artist leaderboard + tiers/badges | podium, rank rows, badges legend |
| `gangs.html` | Gangs | Collectives/labels of the region | gang cards, members, join CTA |
| `chat.html` | Chat | Conversation list | chat rows |
| `chat-room.html` | Chat room | 1:1/group conversation | messages, composer |
| `search.html` | Search | Search tracks/artists/meetings | search input, grouped results |
| `upload.html` | Upload | How releases get published (auto from SoundCloud) | highlight, steps, notes, label CTA |
| `notifications.html` | Notifications | Activity feed | notification rows, read state |
| `profile.html` | Profile | Own profile, edit, tracks/likes/following, logout | profile header, edit form, tabs |
| `auth.html` | Auth | Login / Register / Recover (local) | tabs, form, validation, anonymous |
| `meeting.html` | Meeting detail | Meeting info, lineup, RSVP, comments | hero, info rows, tags, comments |
| `rules.html` | Rules | Label rules (static, printable) | sections, rule cards, offense table |
| `settings.html` | Settings | Theme, data reset, account | switches, buttons |
| `404.html` | 404 | Not-found fallback (GitHub Pages) | empty state |
| `meetings.html` · `player.html` | Redirects | Legacy links | redirect |
| `sitemap.xml` · `robots.txt` · `site.webmanifest` | SEO/PWA | Crawler + install metadata | — |

---

## 2. Page Inventory

**Public (no login):** home, music, artists, artist, stories, story-view, search, meetings, meeting, rules, upload, notifications, auth, 404.

**Requires login (redirect to auth):** profile, battles (vote/create), gangs (create/join), chat, chat-room, meeting RSVP.

**Data-driven:** artists & tracks (SoundCloud), videos (YouTube oEmbed), meetings & lineup (config), battles/gangs/chats/comments/notifications/users (local seed + localStorage).

---

## 3. Main User Flows

1. **Discover music** — Home → Artists/Music → filter by artist → play track (SoundCloud) → open in SoundCloud / next track.
2. **Attend a meeting** — Home/Meetings → meeting detail → RSVP (requires login) or external registration form → comments.
3. **Vote in a battle** — Battles → pick side (requires login) → live progress updates → comments.
4. **Auth** — Register/Login/Recover → Profile (edit, tabs) → Logout. Anonymous mode supported.
5. **Join the label** — Upload page → label signup form (external) → auto-import from SoundCloud.
6. **Social** — Stories, chat, follow artists, like tracks, notifications.

---

## 4. UI Component Inventory

- **Layout:** topbar, bottom tabbar (5 tabs + center FAB), drawer menu, mini player bar, SoundCloud player bar, app frame (mobile-first).
- **Primitives:** buttons (gold/fire/violet/ghost/danger), chips, segmented control, switches, inputs, avatars, badges, tags.
- **Media:** track row, track card, artist card, story ring, video card, SoundCloud embed, platform buttons (IG/TG/YT/SC).
- **Content:** hero, section head, stats, cards, meeting cards, battle cards, gang cards, rank rows, notification rows, chat bubbles, comments, empty states, skeletons, network error block.
- **Overlays:** splash, drawer, fullscreen player, bottom sheet, toasts, like-burst effect, lock dialog (deprecated).

---

## 5. Design System Analysis

| Token | Reference (iran-rap.ir) | AFTER EDIT (implemented) |
|---|---|---|
| Mode | Light, colorful, "game-y" | **Dark, editorial, black & gold** |
| Primary | Purple/gold accents | Gold gradient `#ffd166→#f0a500→#b87407` |
| Surfaces | White cards | Glass surfaces on `#08080a` / `#0d0d11` |
| Typography | Vazirmatn (Persian) | Vazirmatn, tight heading weights (800–900) |
| Radius | Medium | 12 / 18 / 26 / 34px scale |
| Motion | Basic | Custom `--ease` spring, subtle micro-interactions |
| Density | Busy, banner-heavy | Calm vertical rhythm, 6→32px spacing scale |
| Identity | Battle-arena "game" | Premium underground rap label |

The AFTER EDIT identity is deliberately **not** a clone: it keeps the reference's
information architecture (battles, gangs, ranking, meetings, media, auth) but renders
it through a dark, cinematic, editorial system.

---

## 6. Visual Asset Analysis

| Reference asset | Role | AFTER EDIT solution |
|---|---|---|
| Duel/battle banners | Feature navigation | Icon+gradient feature cards (nav, not hero art) |
| New-member avatars | Social proof | Real SoundCloud avatars (auto-fetched) |
| Article/album covers | Editorial imagery | SoundCloud artwork (auto) + generated label cover art |
| RapGram posts | UGC feed | Stories (real artist covers) |
| Tournament/gang banners | Feature art | Generated brand cover art (`assets/img/cover*.jpg`, `og-cover.jpg`) |

**Policy:** no copyrighted reference assets are copied. All covers/avatars come from
each artist's own SoundCloud/YouTube; fallback covers + social images are original
AFTER EDIT assets generated for this project. No emoji is used as a substitute for a
photographic/art asset where an image belongs.

---

## 7. Recommended AFTER EDIT Architecture

- **Stack:** vanilla **HTML + CSS + JavaScript** (ES5-compatible), no build step.
  - Rationale: the project is hosted on **GitHub Pages** (static, zero server cost —
    the original constraint that motivated the locked "demo" sections). SoundCloud and
    YouTube integrations are 100% client-side. A Node/Next runtime would add hosting
    cost with no benefit for this integration model.
- **Layers (already modular, not one giant file):**
  - `assets/css/style.css` — design tokens + components
  - `assets/js/config.js` — editable site data (artists, pages, videos, links, meetings)
  - `assets/js/core.js` — store, DB, auth, player, SoundCloud/YouTube clients, shell
  - per-page `<script>` — page-specific rendering
- **Data:** localStorage-backed mini-DB with seed data + versioned migration.
- **Future backend:** `Auth`/`DB` are isolated behind one object so they can be swapped
  for Supabase/PostgreSQL without touching the UI (see `.env.example`).

---

## 8. Pages That Will Be Implemented

All pages listed in §1.2, with the "locked / coming soon" sections **unlocked and
completed**: battles, ranking, gangs, chat, profile and full authentication
(register, login, logout, password recovery, anonymous mode, validation, loading and
success/error states). SEO (meta, OG, structured data), accessibility, a 404 page,
`robots.txt` and `sitemap.xml` are included.
