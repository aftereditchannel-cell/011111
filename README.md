# 🎤 ۰۱۱ رپ — 011 RAP

**پلتفرم رپ مازندران** — موزیک، آرتیست، بتل، رنکینگ، گنگ و میتینگ‌های رپ طبرستان.

طراحی و توسعه: **AFTER EDIT** · لیبل: **۰۱۱ فمیلی (011 Family)**

> نسخهٔ کامل — همهٔ بخش‌ها فعال‌اند. بدون سرور، بدون هزینهٔ هاست، روی **GitHub Pages** اجرا می‌شود.

---

## ✨ Project Overview

۰۱۱ رپ یک وب‌اپ موبایل‌محور (Mobile-first) برای جامعهٔ رپ زیرزمینی مازندران است:

- **موزیک و آرتیست‌ها** به‌صورت کاملاً خودکار از **SoundCloud** خوانده می‌شوند (ترک، کاور، آمار پخش، اسم، آواتار، بیو و لینک‌ها). هر تغییری در ساندکلود، خودکار روی سایت می‌آید.
- **ویدیوها** از **YouTube** (oEmbed رسمی) گرفته می‌شوند.
- **میتینگ‌ها** با ثبت‌نام و لاین‌آپ، **بتل‌ها** با رأی‌گیری زنده، **رنکینگ** امتیازی، **گنگ‌ها**، **چت**، **استوری** و **اعلان‌ها**.
- **حساب کاربری کامل**: ثبت‌نام، ورود، بازیابی رمز، حالت ناشناس، ویرایش پروفایل، لایک و دنبال‌کردن.
- هویت بصری مستقل و اختصاصی: **Dark / Black-Gold / Editorial** — نه کپی از هیچ سایت دیگری.

---

## 🧱 Technology Stack

| لایه | تکنولوژی |
|---|---|
| Markup | HTML5 (RTL، فارسی) |
| Styling | CSS3 (Design tokens، Glassmorphism، CSS animations) |
| Logic | Vanilla JavaScript (ES5-compatible، بدون build step) |
| Font | [Vazirmatn](https://github.com/rastikerdar/vazirmatn) |
| Media | SoundCloud Widget API · YouTube oEmbed |
| Storage | localStorage (mini-DB با seed + migration) |
| Hosting | GitHub Pages (استاتیک) |

**چرا بدون فریم‌ورک؟** پروژه روی GitHub Pages اجرا می‌شود و کل یکپارچگی
SoundCloud/YouTube سمت کلاینت است. این یعنی **صفر هزینهٔ سرور** — دقیقاً همان
محدودیتی که نسخهٔ قبلی بخش‌ها را «قفل» کرده بود. لایهٔ داده و Auth از UI جدا شده‌اند
و در آینده می‌توانند بدون تغییر در صفحات، به Supabase/PostgreSQL وصل شوند
(نگاه کنید به `.env.example`).

---

## ✅ Features

- 🎧 **کتابخانهٔ موزیک** — همهٔ ترک‌ها از ساندکلود، فیلتر بر اساس آرتیست، جستجو، پخش تصادفی
- 🎤 **آرتیست‌ها** — پروفایل کامل با آمار، بیو و دکمه‌های ساندکلود/اینستاگرام/تلگرام/یوتیوب
- 🔥 **استوری** — نمایشگر تمام‌صفحه با نوار پیشرفت، لمس و دابل‌تپ لایک
- ⚔️ **بتل‌ها** — بتل زنده/تمام‌شده/مال من، رأی‌گیری، نوار پیشرفت و کامنت
- 🏆 **رنکینگ** — امتیاز از پخش/لایک/دنبال‌کننده/برد بتل + نشان‌ها
- 👥 **گنگ‌ها** — کلکتیوهای منطقه، اعضا و درخواست عضویت
- 💬 **چت** — لیست گفتگو + اتاق چت با پیام‌های واقعی
- 📅 **میتینگ‌ها** — میتینگ پیش‌رو/آرشیو، ثبت حضور، لاین‌آپ و کامنت
- 🔐 **حساب کاربری** — ثبت‌نام، ورود، بازیابی رمز، حالت ناشناس، ویرایش پروفایل، خروج
- 🔔 **اعلان‌ها** — ساخته‌شده از فعالیت واقعی (ترک/میتینگ/ویدیو)
- 🔍 **جستجو** — در ترک، آرتیست و میتینگ
- 📜 **قوانین لیبل** — صفحهٔ مستقل، قابل چاپ
- 📡 **مدیریت خطا** — بلوک خطای شبکه + دکمهٔ تلاش مجدد + کش ۶ ساعته
- ♿ **دسترس‌پذیری** — Skip-link، فوکوس واضح، ARIA، `prefers-reduced-motion`
- 🔎 **SEO** — متادیتای اختصاصی هر صفحه، OpenGraph، JSON-LD، sitemap.xml، robots.txt

---

## 📁 Folder Structure

```
011111/
├── index.html          ← میتینگ‌ها (صفحهٔ ورودی)
├── home.html           خانه — هیرو، پیج‌ها، ویدیو، استوری، ترک، فوتر
├── music.html          کتابخانهٔ موزیک (ساندکلود)
├── artists.html        آرتیست‌ها
├── artist.html         ↪ redirect → music.html?artist=
├── stories.html        استوری‌ها
├── story-view.html     نمایشگر استوری
├── battles.html        بتل‌ها (رأی‌گیری)
├── rank.html           رنکینگ
├── gangs.html          گنگ‌ها
├── chat.html · chat-room.html   چت
├── search.html         جستجو
├── upload.html         آپلود آثار (اتصال خودکار)
├── notifications.html  اعلان‌ها
├── profile.html        پروفایل کاربری
├── auth.html           ورود / ثبت‌نام / بازیابی
├── meeting.html        جزئیات میتینگ
├── rules.html          قوانین لیبل
├── settings.html       تنظیمات
├── 404.html            صفحهٔ پیدا نشد
├── meetings.html · player.html   ↪ redirect
├── robots.txt · sitemap.xml · site.webmanifest
├── docs/
│   └── DISCOVERY.md    گزارش تحلیل سایت مرجع و معماری
└── assets/
    ├── css/style.css   توکن‌ها + کامپوننت‌ها + ریسپانسیو
    ├── js/config.js    ⚙️ دادهٔ قابل‌ویرایش سایت
    ├── js/core.js      هسته: ذخیره‌سازی، Auth، Player، SoundCloud، YouTube، پوسته
    └── img/            لوگو، کاورها، هیرو و تصویر OG
```

---

## 🚀 Installation

نیازی به نصب و بیلد نیست — سایت کاملاً استاتیک است.

```bash
git clone https://github.com/aftereditchannel-cell/011111.git
cd 011111
```

## 💻 Development

```bash
# سرور استاتیک محلی (هر کدام)
python3 -m http.server 8000
# یا
npx serve .
```

سپس `http://localhost:8000/index.html` را باز کن.

> 💡 سایت حتی با دابل‌کلیک روی `index.html` (پروتکل `file://`) هم کار می‌کند.

## 🏗️ Build & Deployment

بدون مرحلهٔ بیلد. Deploy = Push روی برنچ Pages:

```bash
git add . && git commit -m "release: ..." && git push
```

GitHub Pages را روی برنچ مربوطه فعال کن (Settings → Pages). نسخهٔ زنده:
**https://aftereditchannel-cell.github.io/011111/**

---

## 🔐 Authentication

- حساب‌ها در **localStorage** ذخیره می‌شوند (نسخهٔ بدون سرور).
- **ثبت‌نام**: نام نمایشی، یوزرنیم، ایمیل، رمز (حداقل ۶ کاراکتر) + پذیرش قوانین.
- **ورود**: ایمیل + رمز، «مرا به خاطر بسپار»، نمایش/پنهان‌کردن رمز.
- **بازیابی رمز**: ایمیل → تعیین رمز جدید (در نسخهٔ ابری به ایمیل ارسال می‌شود).
- **حالت ناشناس**: ورود بدون ایمیل/رمز.
- منطق Auth در `core.js` پشت یک آبجکت (`A.Auth`) ایزوله شده و قابل تعویض با Supabase Auth است.

---

## 🗄️ Data Architecture

| Entity | منبع داده |
|---|---|
| `Artist` / `Track` | SoundCloud (خودکار، کش ۶ ساعته) |
| `Video` | YouTube oEmbed (کش ۲۴ ساعته) |
| `Meeting` | `config.js` → `SEED.meetings` |
| `Battle` / `Gang` / `Chat` / `Message` / `Comment` / `Notification` | `SEED` + localStorage |
| `User` / `Vote` / `RSVP` / `Like` / `Follow` | localStorage (فعالیت کاربر) |

Data-access از UI جدا است: صفحات فقط از `window.APP` (`A.DB`, `A.Auth`, `A.SC`, `A.YT`)
استفاده می‌کنند، نه مستقیم از localStorage.

---

## ⚙️ Environment Variables

نسخهٔ فعلی به هیچ سِکرِتی نیاز ندارد. برای اتصال آیندهٔ Backend، نمونهٔ متغیرها در
`.env.example` آمده است. **هرگز کلید/سکرت را Commit نکن.**

---

## 🔧 سفارشی‌سازی

همهٔ دادهٔ سایت در **`assets/js/config.js`** است:

- `artists` — افزودن آرتیست (فقط لینک ساندکلود/اینستاگرام/تلگرام/یوتیوب)
- `pages` — پیج‌های رسمی
- `videos` — ویدیوهای یوتیوب
- `links` — لینک‌های ثبت‌نام میتینگ و لیبل
- `meetings` — میتینگ‌ها و لاین‌آپ

بعد از هر تغییر، `VERSION` را یکی زیاد کن تا دادهٔ کش‌شدهٔ کاربران تازه شود.

---

## 🙏 Credits

- **Brand & Design:** AFTER EDIT — استودیو تدوین، ویژوال و کاورآرت
- **Label:** ۰۱۱ فمیلی (011 Family) — میتینگ رپ طبرستان، آمل
- **Font:** Vazirmatn (Rastikerdar)
- **Media:** SoundCloud · YouTube

---

## 📄 License

کد این پروژه برای لیبل ۰۱۱ / AFTER EDIT است. تصاویر و محتوای آرتیست‌ها متعلق به
خود آن‌هاست. Assetهای بصری برند (کاورها، هیرو، OG) برای همین پروژه تولید شده‌اند.
