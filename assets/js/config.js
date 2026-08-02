/* ═══════════════════════════════════════════════════════════════
   ⚙️  تنظیمات سایت ۰۱۱ — تنها فایلی که باید ویرایش کنی
   ═══════════════════════════════════════════════════════════════

   روی گیت‌هاب:
     ریپو → assets → js → config.js → مداد ✏️ → Commit changes

   ⚠️ بعد از هر تغییر، عدد VERSION آخر فایل را یکی زیاد کن.

   ═══════════════════════════════════════════════════════════════ */

var CONFIG = {

  /* ─────────────────────────────────────────────────────────────
     ۱️⃣  آرتیست‌ها
     ─────────────────────────────────────────────────────────────
     فقط لینک‌ها را بده — اسم، عکس، بیو، ترک‌ها و آمار
     خودکار از ساندکلود می‌آید. ✅

     url        = پروفایل ساندکلود  (اجباری)
     instagram  = لینک اینستاگرام   (خالی بگذار اگر ندارد)
     telegram   = لینک تلگرام       (خالی بگذار اگر ندارد)
     youtube    = لینک یوتیوب       (خالی بگذار اگر ندارد)

     💡 پلتفرمی که خالی باشد، دکمه‌اش نمایش داده می‌شود ولی
        غیرفعال است و با کلیک پیام می‌دهد.

     💡 extraSoundcloud = اکانت دوم ساندکلود. ترک‌های آن هم
        به همین آرتیست اضافه می‌شود (برای ریپست‌ها / اکانت قدیمی).
     ───────────────────────────────────────────────────────────── */

  artists: [

    {
      id: "farhan",
      url: "https://soundcloud.com/farhan1361380",
      instagram: "https://www.instagram.com/farhangangi/",
      telegram: "https://t.me/feriyogangi",
      youtube: "https://www.youtube.com/@Farhangangi"
    },

    {
      id: "leader",
      url: "https://soundcloud.com/amir-najafpoor",
      instagram: "https://www.instagram.com/amir__leader/",
      telegram: "https://t.me/amirleader_official",
      youtube: "https://www.youtube.com/@amir__leader"
    },

    {
      id: "lilrijo",
      url: "https://soundcloud.com/rayan-najii",
      instagram: "https://www.instagram.com/lilrijo/",
      telegram: "",                       // ندارد
      youtube: ""                         // ندارد
    },

    {
      id: "aedan",
      url: "https://soundcloud.com/mohamad-ahmadi-504303012",
      instagram: "https://www.instagram.com/aedanine/",
      telegram: "https://t.me/aedanine",
      youtube: ""                         // ندارد
    },

    {
      id: "alborz",
      url: "https://soundcloud.com/alborz-zaheri-550771736",

      /* اکانت دوم — ترک‌های واقعی و بازنشرشده اینجاست */
      extraSoundcloud: ["https://soundcloud.com/alborz-zaheri-2789338"],

      instagram: "https://www.instagram.com/allborrzzz/",
      telegram: "https://t.me/young_savagee",
      youtube: "",                        // ندارد

      /* چون اکانت اصلی ترکی ندارد، اطلاعات پایه دستی داده می‌شود */
      fallback: {
        name: "ALBORZ",
        city: "آمل",
        bio: "NORTH SIDE RAPPER📍🏔",
        followers: 3,
        photo: "https://i1.sndcdn.com/avatars-yVqL0gL5HLHEZwfl-2kAELA-t500x500.jpg"
      }
    }

    ,{
      id: "shadii",
      url: "https://soundcloud.com/shadii-khatir",
      instagram: "https://www.instagram.com/slimshadiiiiii/",
      telegram: "https://t.me/slimshadiiii666",
      youtube: "https://www.youtube.com/@slimshadiii666"
    },

    {
      /* سایه — ساندکلود و یوتیوب ندارد؛ فقط اینستاگرام و تلگرام.
         چون ساندکلود ندارد، url خالی است و اطلاعات از fallback می‌آید. */
      id: "sayeh",
      url: "",
      instagram: "https://www.instagram.com/sayeh11387/",
      telegram: "https://t.me/+WRcUJxi-fU42YTZk",
      youtube: "",
      fallback: {
        name: "سایه",
        city: "آمل",
        bio: "رپر زیرزمینی طبرستان",
        followers: 0
      }
    }

    ,{
      /* NJ — فقط اینستاگرام و تلگرام */
      id: "nj",
      url: "",
      instagram: "https://www.instagram.com/nj.__.official/",
      telegram: "https://t.me/nj_011official",
      youtube: "",
      fallback: { name: "NJ", city: "آمل", bio: "", followers: 0 }
    }

    /* ← آرتیست جدید را اینجا اضافه کن (بالاتر ویرگول بگذار) */

  ],


  /* ─────────────────────────────────────────────────────────────
     ۲️⃣  پیج‌های رسمی  (بخش بالای صفحهٔ خانه)
     ─────────────────────────────────────────────────────────────
     ترتیب همین‌طور که هست نمایش داده می‌شود.
     ───────────────────────────────────────────────────────────── */

  pages: [
    {
      title: "پیج رسمی لیبل",
      handle: "@011familyy",
      url: "https://www.instagram.com/011familyy/",
      desc: "لیبل رسمی رپ مازندران",
      icon: "👑",
      main: true                           // برجسته نمایش داده می‌شود
    },
    {
      title: "کانال رسمی تلگرام",
      handle: "@ch_011family",
      url: "https://t.me/ch_011family",
      desc: "اطلاع‌رسانی میتینگ‌ها و آثار",
      kind: "telegram"
    },
    {
      title: "آرشیو ویدیوهای میتینگ",
      handle: "@011meeting",
      url: "https://www.instagram.com/011meeting/",
      desc: "کلیپ اجراهای زندهٔ میتینگ‌ها"
    },
    {
      title: "AFTER EDIT",
      handle: "@afteredit.official",
      url: "https://www.instagram.com/afteredit.official/",
      desc: "استودیو تدوین، ویژوال و کاورآرت"
    }
  ],


  /* ─────────────────────────────────────────────────────────────
     ۳️⃣  جدیدترین ویدیوها  (یوتیوب — بخش صفحهٔ خانه)
     ─────────────────────────────────────────────────────────────
     فقط لینک ویدیو را بگذار — عنوان و تصویر خودکار از یوتیوب
     گرفته می‌شود. ✅

     برای اضافه کردن ویدیو، یک سطر مثل زیر بنویس:
         { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },

     می‌توانی artist هم بدهی تا زیر عنوان نمایش داده شود.
     ───────────────────────────────────────────────────────────── */

  videos: [
    { url: "https://www.youtube.com/watch?v=pyN7uWMv0bc", artist: "LEADER" },
    { url: "https://www.youtube.com/watch?v=ei0vtzQaG2Y", artist: "LEADER" },
    { url: "https://www.youtube.com/watch?v=OlT6X7r6Itc", artist: "Farhangangi" }

    /* ← ویدیوی جدید را اینجا اضافه کن (بالاتر ویرگول بگذار):
       , { url: "https://www.youtube.com/watch?v=XXXXXXXXXXX", artist: "اسم آرتیست" }

       عنوان و تصویر خودکار از یوتیوب گرفته می‌شود. */
  ],


  /* ─────────────────────────────────────────────────────────────
     ۴️⃣  لینک‌های ثبت‌نام
     ───────────────────────────────────────────────────────────── */

  links: {
    rsvp: {
      url:   "https://survey.porsline.ir/s/vYdf0Q4P",
      label: "ثبت‌نام در میتینگ",
      hint:  "ثبت‌نام از طریق فرم آنلاین انجام می‌شود"
    },
    label: {
      url:   "https://survey.porsline.ir/s/oyBxeh6u",
      label: "ثبت‌نام در لیبل ۰۱۱",
      hint:  "فرم عضویت — بعد از ثبت‌نام، آثارت خودکار روی سایت می‌آید"
    }
  },


  /* ─────────────────────────────────────────────────────────────
     ۵️⃣  میتینگ‌ها
     ─────────────────────────────────────────────────────────────
     going = تعداد ثبت‌نامی    cap = ظرفیت
     ───────────────────────────────────────────────────────────── */

  meetings: [
    {
      id: "m1",
      title: "میتینگ رپ آمل",
      venue: "آمل، مازندران",
      date: "2026-08-14T20:00:00",
      soon: true,
      whenLabel: "۲۳ یا ۲۴ مرداد ۱۴۰۵",
      going: 9,
      cap:   200,
      lineup: ["سایه", "امیرال", "امیر مطلق"],
      desc: "میتینگ بعدی ۰۱۱ — به‌زودی، ۲۳ یا ۲۴ مرداد در آمل. ظرفیت ۲۰۰ نفر."
    },
    {
      id: "m2",
      title: "میتینگ جنگل، بیرون آمل",
      venue: "جنگل، حومهٔ آمل",
      date: "2026-07-06T19:00:00",
      going: 52,
      cap:   52,
      lineup: ["سایه", "امیرال", "امیر مطلق", "تیرداد"],
      desc: "آرشیو: میتینگ جنگلی بیرون آمل با حضور ۵۲ نفر — تیرماه ۱۴۰۵."
    }
  ],


  /* ─────────────────────────────────────────────────────────────
     ۶️⃣  نسخهٔ داده — بعد از هر تغییر یکی زیاد کن
     ───────────────────────────────────────────────────────────── */

  VERSION: 10

};
