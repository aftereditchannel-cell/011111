/* ═══════════════════════════════════════════════════════════
   core.js — هستهٔ مشترک همهٔ صفحات (نسخهٔ لوکال)
   ⚠️ عمداً «اسکریپت معمولی» است، نه ES Module،
      تا با دابل‌کلیک روی فایل (file://) هم کار کند.
   شامل: داده، ذخیره‌سازی، ابزار، پلیر، پوسته (هدر/منو/تب‌بار)
   ═══════════════════════════════════════════════════════════ */
(function (window, document) {
  "use strict";

  /* ══════════ ۱) ذخیره‌سازی امن ══════════
     اگر مرورگر localStorage را ببندد، حافظهٔ موقت جایگزین می‌شود. */
  var memStore = {};
  var LS_OK = (function () {
    try {
      var k = "__t" + Date.now();
      localStorage.setItem(k, "1");
      localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  })();

  var store = {
    get: function (key, fallback) {
      try {
        var raw = LS_OK ? localStorage.getItem("rap011:" + key) : memStore[key];
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, val) {
      try {
        var raw = JSON.stringify(val);
        if (LS_OK) localStorage.setItem("rap011:" + key, raw);
        else memStore[key] = raw;
      } catch (e) { /* حافظه پر است */ }
    },
    del: function (key) {
      try {
        if (LS_OK) localStorage.removeItem("rap011:" + key);
        else delete memStore[key];
      } catch (e) {}
    },
    clearAll: function () {
      try {
        if (LS_OK) {
          Object.keys(localStorage)
            .filter(function (k) { return k.indexOf("rap011:") === 0; })
            .forEach(function (k) { localStorage.removeItem(k); });
        } else memStore = {};
      } catch (e) {}
    }
  };

  /* ══════════ ۲) ابزار ══════════ */

  var FA = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];

  function fa(v) {
    return String(v == null ? "" : v).replace(/\d/g, function (d) { return FA[+d]; });
  }

  function nFmt(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return fa((n / 1000000).toFixed(1).replace(/\.0$/, "")) + "م";
    if (n >= 1000)    return fa((n / 1000).toFixed(1).replace(/\.0$/, "")) + "هزار";
    return fa(n);
  }

  function tFmt(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0;
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return fa(m + ":" + (s < 10 ? "0" + s : s));
  }

  function ago(ts) {
    if (!ts) return "";
    var d = (Date.now() - new Date(ts).getTime()) / 1000;
    if (d < 60)      return "همین الان";
    if (d < 3600)    return fa(Math.floor(d / 60)) + " دقیقه پیش";
    if (d < 86400)   return fa(Math.floor(d / 3600)) + " ساعت پیش";
    if (d < 604800)  return fa(Math.floor(d / 86400)) + " روز پیش";
    if (d < 2592000) return fa(Math.floor(d / 604800)) + " هفته پیش";
    return fa(Math.floor(d / 2592000)) + " ماه پیش";
  }

  function jDate(iso) {
    try {
      var f = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric", month: "long" });
      var parts = f.formatToParts(new Date(iso));
      var get = function (t) {
        for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value;
        return "";
      };
      return { d: get("day"), m: get("month") };
    } catch (e) { return { d: "", m: "" }; }
  }

  function jFull(iso) {
    try {
      return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
        weekday: "long", day: "numeric", month: "long",
        hour: "2-digit", minute: "2-digit"
      }).format(new Date(iso));
    } catch (e) { return ""; }
  }

  function daysTo(iso) {
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function hash(str) {
    var h = 0, s = String(str);
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  /** آواتار SVG بدون درخواست شبکه */
  function avatarOf(name, size) {
    name = name || "؟"; size = size || 128;
    var pal = [["#ffd166","#f0a500"],["#7c5cff","#22d3ee"],["#ff8a3d","#ff4d6d"],
               ["#2ee6a8","#22d3ee"],["#f472b6","#7c5cff"],["#fbbf24","#ef4444"]];
    var c = pal[hash(name) % pal.length];
    var ch = esc(String(name).trim().charAt(0) || "؟");
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size +
      '" viewBox="0 0 100 100"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/>' +
      '</linearGradient></defs><rect width="100" height="100" fill="url(#g)"/>' +
      '<text x="50" y="50" font-family="Vazirmatn,sans-serif" font-size="46" font-weight="700"' +
      ' fill="#12121a" text-anchor="middle" dominant-baseline="central">' + ch + '</text></svg>';
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /** پارامتر آدرس: page.html?id=sayeh */
  function param(name) {
    var m = new RegExp("[?&]" + name + "=([^&#]*)").exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : null;
  }

  function debounce(fn, ms) {
    var t;
    return function () {
      var a = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, a); }, ms || 300);
    };
  }

  /* ── توست ── */
  function toast(msg, type) {
    var box = document.getElementById("toasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "toasts"; box.className = "toasts";
      document.body.appendChild(box);
    }
    var t = document.createElement("div");
    t.className = "toast" + (type ? " toast--" + type : "");
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () {
      t.style.transition = "opacity .3s, transform .3s";
      t.style.opacity = "0";
      t.style.transform = "translateY(10px)";
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 320);
    }, 2400);
  }

  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms || 12); } catch (e) {} }

  /** ❤️ لایک انفجاری */
  function heartBurst(x, y, big) {
    var fx = document.getElementById("fx");
    if (!fx) {
      fx = document.createElement("div");
      fx.id = "fx"; fx.className = "fx"; fx.setAttribute("aria-hidden", "true");
      document.body.appendChild(fx);
    }
    if (big !== false) {
      var h = document.createElement("div");
      h.className = "fx__big"; h.textContent = "❤️";
      h.style.left = x + "px"; h.style.top = y + "px";
      fx.appendChild(h);
      setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 900);
    }
    var emo = ["❤️","🔥","💛","✨","💥"];
    for (var i = 0; i < 9; i++) {
      (function (i) {
        var p = document.createElement("div");
        p.className = "fx__heart"; p.textContent = emo[i % emo.length];
        var ang = (Math.PI * 2 * i) / 9 + Math.random();
        var dist = 55 + Math.random() * 75;
        p.style.left = x + "px"; p.style.top = y + "px";
        p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        p.style.setProperty("--dy", (Math.sin(ang) * dist - 30) + "px");
        p.style.setProperty("--rot", (Math.random() * 90 - 45) + "deg");
        p.style.animationDelay = (i * 18) + "ms";
        fx.appendChild(p);
        setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1000 + i * 20);
      })(i);
    }
    buzz(18);
  }

  /** دابل‌تپ */
  function onDoubleTap(node, cb) {
    var last = 0, lx = 0, ly = 0;
    node.addEventListener("pointerup", function (e) {
      var now = Date.now();
      var near = Math.abs(e.clientX - lx) < 40 && Math.abs(e.clientY - ly) < 40;
      if (now - last < 320 && near) { cb(e.clientX, e.clientY); last = 0; }
      else { last = now; lx = e.clientX; ly = e.clientY; }
    });
    node.addEventListener("dblclick", function (e) { e.preventDefault(); });
  }

  /* ══════════ ۳) دادهٔ اولیه ══════════ */

  var DAY = 86400000;
  function iso(offDays) { return new Date(Date.now() + offDays * DAY).toISOString(); }

  var SEED = {
    /* آرتیست‌ها و ترک‌ها دستی وارد نمی‌شوند —
       همه خودکار از ساندکلود خوانده می‌شوند (بخش SC پایین‌تر). */
    artists: [],
    tracks: [],

    battles: [],

    /* میتینگ‌ها از فایل تنظیمات (assets/js/config.js) */
    meetings: (window.CONFIG && window.CONFIG.meetings) || [],

    stories: [
      { id:"s1", artistId:"farhan", name:"Farhan Ganji",
        cover:"https://i1.sndcdn.com/artworks-h7rlvLeCUOHPC4NK-wBOnKQ-t500x500.jpg",
        text:"ترک جدید روی ساندکلود 🔥", createdAt:iso(-0.3) }
    ],
    gangs: [
      { id:"011family", name:"۰۱۱ فمیلی", emoji:"👑", members:1, city:"آمل",
        desc:"لِیبل رپ مازندران — پایگاه: آمل." }
    ],
    chats: [
      { id:"c1", name:"گروه میتینگ آمل", emoji:"⚔️", last:"کی برای راند ۵ هست؟", at:iso(-0.05) },
      { id:"c2", name:"سایه",            emoji:"🎤", last:"ورس رو فرستادم ببین", at:iso(-0.3) },
      { id:"c3", name:"۰۱۱ فمیلی",       emoji:"👑", last:"پوستر آماده شد ✅",    at:iso(-1.1) }
    ],
    messages: [
      { id:"g1", chatId:"c1", from:"سایه",      me:false, text:"سلام بچه‌ها، راند ۵ جمعه قطعیه", at:iso(-0.12) },
      { id:"g2", chatId:"c1", from:"امیرال",    me:false, text:"من هستم 🔥",                    at:iso(-0.10) },
      { id:"g3", chatId:"c1", from:"you",       me:true,  text:"منم میام، بلیت چطوریه؟",        at:iso(-0.07) },
      { id:"g4", chatId:"c1", from:"امیر مطلق", me:false, text:"کی برای راند ۵ هست؟",           at:iso(-0.05) },
      { id:"h1", chatId:"c2", from:"سایه",      me:false, text:"ورس رو فرستادم ببین",           at:iso(-0.3) },
      { id:"k1", chatId:"c3", from:"AFTER EDIT",me:false, text:"پوستر آماده شد ✅",              at:iso(-1.1) }
    ],
    comments: [],

    notifications: [
      { id:"n1", type:"battle", icon:"⚔️", text:"بتل «سایه VS امیر مطلق» شروع شد — رأی بده!", at:iso(-0.05), read:false, link:"battles.html" },
      { id:"n2", type:"like",   icon:"❤️", text:"سایه ترک «کد ۰۱۱» را لایک کرد.",             at:iso(-0.3),  read:false, link:"music.html" },
      { id:"n3", type:"event",  icon:"📅", text:"میتینگ رپ آمل — ۶ روز مانده. ثبت حضور کن.",  at:iso(-1),    read:true,  link:"meetings.html" },
      { id:"n4", type:"follow", icon:"👤", text:"امیرال شما را دنبال کرد.",                    at:iso(-2),    read:true,  link:"artists.html" }
    ]
  };

  /* ══════════ ۴) دیتابیس محلی ══════════ */

  /* نسخهٔ دادهٔ اولیه.
     هر وقت SEED را عوض کردی این عدد را یکی زیاد کن تا دادهٔ
     ذخیره‌شده در مرورگر کاربر با نسخهٔ جدید جایگزین شود.
     (وگرنه کاربر همچنان دادهٔ قدیمیِ کش‌شده را می‌بیند) */
  var SEED_VERSION = (window.CONFIG && window.CONFIG.VERSION) || 1;

  (function migrateSeed() {
    var v = store.get("seedVersion", 0);
    if (v === SEED_VERSION) return;
    // جدول‌هایی که محتوای رسمی‌اند و باید تازه‌سازی شوند
    ["meetings", "artists", "tracks", "battles", "stories", "gangs", "chats", "messages"]
      .forEach(function (t) { store.del("db:" + t); });
    store.set("seedVersion", SEED_VERSION);
  })();

  var DB = {
    _cache: {},

    /** خواندن کل یک جدول (اولین بار از SEED پر می‌شود) */
    all: function (name) {
      if (this._cache[name]) return this._cache[name];
      var rows = store.get("db:" + name, null);
      if (!rows) {
        rows = JSON.parse(JSON.stringify(SEED[name] || []));
        store.set("db:" + name, rows);
      }
      this._cache[name] = rows;
      return rows;
    },

    save: function (name, rows) {
      this._cache[name] = rows;
      store.set("db:" + name, rows);
    },

    get: function (name, id) {
      var rows = this.all(name);
      for (var i = 0; i < rows.length; i++) if (rows[i].id === id) return rows[i];
      return null;
    },

    add: function (name, row) {
      var rows = this.all(name);
      if (!row.id) row.id = uid();
      if (!row.createdAt) row.createdAt = new Date().toISOString();
      rows.unshift(row);
      this.save(name, rows);
      return row;
    },

    update: function (name, id, patch) {
      var rows = this.all(name), out = null;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].id === id) {
          for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) rows[i][k] = patch[k];
          out = rows[i];
        }
      }
      this.save(name, rows);
      return out;
    },

    remove: function (name, id) {
      var rows = this.all(name).filter(function (r) { return r.id !== id; });
      this.save(name, rows);
    },

    where: function (name, fn) { return this.all(name).filter(fn); },

    reset: function () { store.clearAll(); this._cache = {}; }
  };

  /* ══════════ ۵) کاربر ══════════ */

  var Auth = {
    get user() { return store.get("user", null); },

    _set: function (u) {
      u ? store.set("user", u) : store.del("user");
    },

    signUp: function (email, password, name, handle) {
      var users = DB.all("users") || [];
      for (var i = 0; i < users.length; i++)
        if (users[i].email === email) throw new Error("این ایمیل قبلاً ثبت شده است.");
      var u = {
        uid: uid(), name: name || "رپر", email: email,
        handle: handle || "@" + email.split("@")[0],
        photo: avatarOf(name), city: "آمل", bio: "",
        anonymous: false, likes: [], following: [],
        createdAt: new Date().toISOString()
      };
      DB.add("users", { id: u.uid, email: email, pw: btoa(password), profile: u });
      this._set(u);
      return u;
    },

    signIn: function (email, password) {
      var users = DB.all("users") || [];
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          if (users[i].pw !== btoa(password)) throw new Error("رمز عبور اشتباه است.");
          this._set(users[i].profile);
          return users[i].profile;
        }
      }
      throw new Error("کاربری با این ایمیل پیدا نشد.");
    },

    signInAnon: function () {
      var nick = "ناشناس‌" + fa(Math.floor(1000 + Math.random() * 9000));
      var u = {
        uid: uid(), name: nick, email: "", handle: "@anon",
        photo: avatarOf(nick), city: "—", bio: "",
        anonymous: true, likes: [], following: [],
        createdAt: new Date().toISOString()
      };
      this._set(u);
      return u;
    },

    signOut: function () { this._set(null); },

    update: function (patch) {
      var u = this.user;
      if (!u) throw new Error("ابتدا وارد شوید.");
      for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) u[k] = patch[k];
      this._set(u);
      // همگام‌سازی با رکورد ثبت‌نام
      var users = DB.all("users") || [];
      for (var i = 0; i < users.length; i++)
        if (users[i].id === u.uid) { users[i].profile = u; DB.save("users", users); }
      return u;
    },

    get isIn() { return !!this.user; }
  };

  /* ══════════ ۶) منطق هوشمند ══════════ */

  var RANK_W = { play:0.05, like:1.2, follow:2.0, win:18, loss:-6, fresh:25 };

  function tierOf(score) {
    if (score >= 850) return { label:"لجند",      emoji:"👑" };
    if (score >= 650) return { label:"الیت",      emoji:"💎" };
    if (score >= 420) return { label:"حرفه‌ای",   emoji:"🔥" };
    if (score >= 200) return { label:"در حال رشد", emoji:"⚡" };
    return               { label:"تازه‌کار",     emoji:"🌱" };
  }

  /** رتبه‌بندی — استودیو/لِیبل وارد جدول رپرها نمی‌شود */
  function rankArtists() {
    var tracks = DB.all("tracks");
    var list = DB.all("artists").filter(function (a) {
      return !a.type || a.type === "artist";
    });

    var scored = list.map(function (a) {
      var mine = tracks.filter(function (t) { return t.artistId === a.id; });
      var plays = 0, likes = 0, recent = false;
      mine.forEach(function (t) {
        plays += t.plays || 0;
        likes += t.likes || 0;
        if (Date.now() - new Date(t.createdAt).getTime() < 14 * DAY) recent = true;
      });
      var raw = plays * RANK_W.play + likes * RANK_W.like +
                (a.followers || 0) * RANK_W.follow +
                (a.wins || 0) * RANK_W.win + (a.losses || 0) * RANK_W.loss +
                (recent ? RANK_W.fresh : 0);
      var o = JSON.parse(JSON.stringify(a));
      o.plays = plays; o.likes = likes; o._raw = Math.max(0, raw);
      return o;
    });

    var max = 1;
    scored.forEach(function (s) { if (s._raw > max) max = s._raw; });
    scored.forEach(function (s) {
      s.score = Math.round((s._raw / max) * 1000);
      s.tier = tierOf(s.score);
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    scored.forEach(function (s, i) { s.rank = i + 1; });
    return scored;
  }

  /** ترندینگ با میرایی زمانی */
  function trending(limit) {
    var rows = DB.all("tracks").map(function (t) {
      var hrs = Math.max(1, (Date.now() - new Date(t.createdAt).getTime()) / 3600000);
      var o = JSON.parse(JSON.stringify(t));
      o._heat = ((t.plays || 0) * 0.3 + (t.likes || 0) * 2) / Math.pow(hrs + 2, 0.55);
      return o;
    });
    rows.sort(function (a, b) { return b._heat - a._heat; });
    return limit ? rows.slice(0, limit) : rows;
  }

  /** پیشنهاد شخصی */
  function recommend(limit) {
    var hist = store.get("history", []);
    var u = Auth.user || {};
    var liked = u.likes || [], follow = u.following || [];

    var aw = {}, tw = {};
    hist.slice(0, 30).forEach(function (h, i) {
      var w = 1 / (1 + i * 0.12);
      if (h.artistId) aw[h.artistId] = (aw[h.artistId] || 0) + w;
      (h.tags || []).forEach(function (g) { tw[g] = (tw[g] || 0) + w * 0.6; });
    });
    var played = hist.slice(0, 12).map(function (h) { return h.id; });

    var rows = DB.all("tracks").map(function (t) {
      var ageD = (Date.now() - new Date(t.createdAt).getTime()) / DAY;
      var s = 0;
      s += (aw[t.artistId] || 0) * 30;
      (t.tags || []).forEach(function (g) { s += (tw[g] || 0) * 12; });
      if (follow.indexOf(t.artistId) >= 0) s += 24;
      s += Math.log(( t.plays || 0) + 10) / Math.LN10 * 8;
      s += Math.log((t.likes || 0) + 5) / Math.LN10 * 6;
      s += Math.max(0, 20 - ageD * 1.4);
      s += Math.random() * 9;
      if (liked.indexOf(t.id) >= 0) s -= 14;
      if (played.indexOf(t.id) >= 0) s -= 30;
      var o = JSON.parse(JSON.stringify(t));
      o._score = s;
      return o;
    });
    rows.sort(function (a, b) { return b._score - a._score; });
    return limit ? rows.slice(0, limit) : rows;
  }

  /* ── کنش‌های اجتماعی ── */
  var Social = {
    isLiked: function (id) {
      var u = Auth.user;
      return !!u && (u.likes || []).indexOf(id) >= 0;
    },

    toggleLike: function (trackId) {
      var u = Auth.user;
      if (!u) throw new Error("برای لایک باید وارد شوی.");
      var likes = u.likes || [], i = likes.indexOf(trackId), on;
      if (i >= 0) { likes.splice(i, 1); on = false; } else { likes.push(trackId); on = true; }
      Auth.update({ likes: likes });
      var t = DB.get("tracks", trackId);
      if (t) DB.update("tracks", trackId, { likes: Math.max(0, (t.likes || 0) + (on ? 1 : -1)) });
      if (on && t) notify("like", "❤️", "ترک «" + t.title + "» را لایک کردی.", "music.html");
      var nt = DB.get("tracks", trackId);
      return { liked: on, likes: nt ? nt.likes : 0 };
    },

    isFollowing: function (id) {
      var u = Auth.user;
      return !!u && (u.following || []).indexOf(id) >= 0;
    },

    toggleFollow: function (artistId) {
      var u = Auth.user;
      if (!u) throw new Error("برای دنبال کردن باید وارد شوی.");
      var f = u.following || [], i = f.indexOf(artistId), on;
      if (i >= 0) { f.splice(i, 1); on = false; } else { f.push(artistId); on = true; }
      Auth.update({ following: f });
      var a = DB.get("artists", artistId);
      if (a) DB.update("artists", artistId, { followers: Math.max(0, (a.followers || 0) + (on ? 1 : -1)) });
      if (on && a) notify("follow", "👤", a.name + " را دنبال کردی.", "artist.html?id=" + artistId);
      return on;
    },

    myVote: function (battleId) {
      var u = Auth.user;
      if (!u) return null;
      var v = DB.where("votes", function (x) {
        return x.battleId === battleId && x.userId === u.uid;
      });
      return v.length ? v[0].side : null;
    },

    vote: function (battleId, side) {
      var u = Auth.user;
      if (!u) throw new Error("برای رأی دادن باید وارد شوی.");
      if (this.myVote(battleId)) throw new Error("قبلاً به این بتل رأی داده‌ای.");
      DB.add("votes", { battleId: battleId, userId: u.uid, side: side });
      var b = DB.get("battles", battleId);
      if (b) {
        var k = side === "a" ? "aVotes" : "bVotes";
        var p = {}; p[k] = (b[k] || 0) + 1;
        DB.update("battles", battleId, p);
        notify("battle", "⚔️", "رأی تو در بتل «" + b.title + "» ثبت شد.", "battles.html");
      }
      return DB.get("battles", battleId);
    },

    hasRsvp: function (meetingId) {
      var u = Auth.user;
      if (!u) return false;
      return DB.where("rsvps", function (x) {
        return x.meetingId === meetingId && x.userId === u.uid;
      }).length > 0;
    },

    rsvp: function (meetingId) {
      var u = Auth.user;
      if (!u) throw new Error("برای ثبت حضور باید وارد شوی.");
      var m = DB.get("meetings", meetingId);
      var prior = DB.where("rsvps", function (x) {
        return x.meetingId === meetingId && x.userId === u.uid;
      });
      if (prior.length) {
        DB.remove("rsvps", prior[0].id);
        if (m) DB.update("meetings", meetingId, { going: Math.max(0, (m.going || 0) - 1) });
        return false;
      }
      DB.add("rsvps", { meetingId: meetingId, userId: u.uid });
      if (m) {
        DB.update("meetings", meetingId, { going: (m.going || 0) + 1 });
        notify("event", "📅", "حضور تو در «" + m.title + "» ثبت شد.", "meetings.html");
      }
      return true;
    },

    commentsOf: function (target) {
      return DB.where("comments", function (c) { return c.target === target; })
               .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    },

    comment: function (target, text) {
      var u = Auth.user;
      if (!u) throw new Error("برای نظر دادن باید وارد شوی.");
      var clean = String(text || "").trim().slice(0, 500);
      if (!clean) throw new Error("متن نظر خالی است.");
      return DB.add("comments", {
        target: target, text: clean,
        user: u.anonymous ? "ناشناس" : u.name,
        userId: u.uid, photo: u.photo
      });
    }
  };

  function notify(type, icon, text, link) {
    DB.add("notifications", {
      type: type, icon: icon, text: text, link: link || "",
      at: new Date().toISOString(), read: false
    });
  }

  function unreadCount() {
    return DB.all("notifications").filter(function (n) { return !n.read; }).length;
  }

  /* ══════════ ۷) پلیر سراسری ══════════
     وضعیت پخش بین صفحات در storage نگه داشته می‌شود؛
     هنگام بارگذاری صفحهٔ بعد، ترک از همان‌جا ادامه می‌یابد. */

  var Player = {
    audio: null,
    queue: [],
    index: -1,
    shuffle: false,
    repeat: "off",
    _counted: false,

    init: function () {
      this.audio = document.getElementById("audio");
      if (!this.audio) {
        this.audio = document.createElement("audio");
        this.audio.id = "audio";
        this.audio.preload = "metadata";
        document.body.appendChild(this.audio);
      }
      var self = this;

      var st = store.get("player", null);
      if (st && st.queue && st.queue.length) {
        this.queue = st.queue;
        this.index = st.index || 0;
        this.shuffle = !!st.shuffle;
        this.repeat = st.repeat || "off";
        var t = this.track();
        if (t) {
          this.audio.src = t.src;
          var seekTo = st.time || 0;
          this.audio.addEventListener("loadedmetadata", function once() {
            try { self.audio.currentTime = seekTo; } catch (e) {}
            self.audio.removeEventListener("loadedmetadata", once);
          });
          // اگر هنگام ترک صفحه در حال پخش بود، ادامه بده
          if (st.playing) {
            var tryPlay = function () {
              self.audio.play()["catch"](function () {
                // مرورگر بدون تعامل اجازه نمی‌دهد؛ با اولین کلیک ادامه بده
                var resume = function () {
                  self.audio.play()["catch"](function () {});
                  document.removeEventListener("pointerdown", resume);
                };
                document.addEventListener("pointerdown", resume, { once: true });
              });
            };
            tryPlay();
          }
        }
      }

      this.audio.addEventListener("timeupdate", function () {
        self._save();
        self._paint();
        var a = self.audio;
        if (!self._counted && a.duration && a.currentTime / a.duration > 0.2) {
          self._counted = true;
          self._countPlay();
        }
      });
      this.audio.addEventListener("play",  function () { self._paint(); });
      this.audio.addEventListener("pause", function () { self._paint(); self._save(); });
      this.audio.addEventListener("ended", function () { self.next(true); });
      this.audio.addEventListener("error", function () {
        if (self.track()) toast("پخش این ترک ممکن نشد.", "err");
      });
      window.addEventListener("beforeunload", function () { self._save(); });

      this._paint();
    },

    track: function () { return this.queue[this.index] || null; },
    isPlaying: function () { return this.audio && !this.audio.paused && !this.audio.ended; },

    play: function (list, i) {
      if (list && list.length) {
        this.queue = list;
        this.index = Math.max(0, Math.min(i || 0, list.length - 1));
        this._load(true);
      } else if (this.track()) {
        this.audio.play()["catch"](function () {});
      }
    },

    _load: function (autoplay) {
      var t = this.track();
      if (!t) return;
      this._counted = false;
      this.audio.src = t.src;
      this.audio.load();
      if (autoplay) {
        this.audio.play()["catch"](function () {
          toast("برای شروع پخش، دکمهٔ پخش را بزن.");
        });
      }
      this._media();
      this._paint();
      this._save();
    },

    toggle: function () {
      if (!this.track()) return;
      this.isPlaying() ? this.audio.pause() : this.audio.play()["catch"](function () {});
    },

    next: function (auto) {
      if (!this.queue.length) return;
      if (this.repeat === "one" && auto) {
        this.audio.currentTime = 0; this.audio.play(); return;
      }
      if (this.shuffle) {
        var n;
        do { n = Math.floor(Math.random() * this.queue.length); }
        while (this.queue.length > 1 && n === this.index);
        this.index = n;
      } else if (this.index < this.queue.length - 1) {
        this.index++;
      } else if (this.repeat === "all") {
        this.index = 0;
      } else {
        if (auto) { this.audio.pause(); this._paint(); return; }
        this.index = 0;
      }
      this._load(true);
    },

    prev: function () {
      if (!this.queue.length) return;
      if (this.audio.currentTime > 3) { this.audio.currentTime = 0; return; }
      this.index = this.index > 0 ? this.index - 1 : this.queue.length - 1;
      this._load(true);
    },

    seekRatio: function (r) {
      if (this.audio && this.audio.duration)
        this.audio.currentTime = Math.max(0, Math.min(1, r)) * this.audio.duration;
    },

    toggleShuffle: function () { this.shuffle = !this.shuffle; this._save(); return this.shuffle; },

    cycleRepeat: function () {
      this.repeat = this.repeat === "off" ? "all" : this.repeat === "all" ? "one" : "off";
      this._save();
      return this.repeat;
    },

    _countPlay: function () {
      var t = this.track();
      if (!t) return;
      var row = DB.get("tracks", t.id);
      if (row) DB.update("tracks", t.id, { plays: (row.plays || 0) + 1 });
      var h = store.get("history", []);
      h.unshift({ id: t.id, artistId: t.artistId, tags: t.tags || [], at: Date.now() });
      store.set("history", h.slice(0, 60));
    },

    _save: function () {
      store.set("player", {
        queue: this.queue, index: this.index,
        shuffle: this.shuffle, repeat: this.repeat,
        time: this.audio ? this.audio.currentTime : 0,
        playing: this.isPlaying()
      });
    },

    _media: function () {
      if (!("mediaSession" in navigator) || !this.track()) return;
      var t = this.track();
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: t.title, artist: t.artist, album: "۰۱۱ رپ",
          artwork: [{ src: new URL(t.cover, location.href).href, sizes: "512x512", type: "image/jpeg" }]
        });
        var self = this;
        navigator.mediaSession.setActionHandler("play",  function () { self.audio.play(); });
        navigator.mediaSession.setActionHandler("pause", function () { self.audio.pause(); });
        navigator.mediaSession.setActionHandler("nexttrack",     function () { self.next(); });
        navigator.mediaSession.setActionHandler("previoustrack", function () { self.prev(); });
      } catch (e) {}
    },

    /** به‌روزرسانی مینی‌پلیر */
    _paint: function () {
      var mini = document.getElementById("miniplayer");
      if (!mini) return;
      var t = this.track();
      if (!t) { mini.hidden = true; return; }
      mini.hidden = false;

      var playing = this.isPlaying();
      var icon = playing
        ? '<rect x="6" y="4" width="4.4" height="16" rx="1.4" fill="currentColor" stroke="none"/>' +
          '<rect x="13.6" y="4" width="4.4" height="16" rx="1.4" fill="currentColor" stroke="none"/>'
        : '<path d="M7 4l13 8-13 8V4z" fill="currentColor" stroke="none"/>';

      var set = function (id, fn) { var e = document.getElementById(id); if (e) fn(e); };
      set("mpIcon",   function (e) { e.innerHTML = icon; });
      set("mpCover",  function (e) { if (e.getAttribute("src") !== t.cover) e.src = t.cover; });
      set("mpTitle",  function (e) { e.textContent = t.title; });
      set("mpArtist", function (e) { e.textContent = t.artist; });
      set("mpBar",    function (e) {
        var d = Player.audio.duration;
        e.style.width = (d ? (Player.audio.currentTime / d * 100) : 0) + "%";
      });

      // اگر صفحه پلیر کامل دارد
      if (typeof window.onPlayerPaint === "function") window.onPlayerPaint(t, playing);
    }
  };

  /* ══════════ ۸) پوستهٔ صفحه ══════════ */

  /* میتینگ در وسط (دکمهٔ برجسته) چون بخش اصلی و فعال است.
     صفحهٔ ورود سایت هم index.html است که همان میتینگ‌هاست.
     خانه به home.html منتقل شد (قفل). */
  var NAV = [
    { href: "home.html",     key: "home",     label: "خانه",    icon: '<path d="M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z"/>' },
    { href: "music.html",    key: "music",    label: "آهنگ‌ها", icon: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>' },
    { href: "index.html",    key: "meetings", label: "میتینگ",  icon: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 11h18"/>', fab: true },
    { href: "battles.html",  key: "battles",  label: "بتل",     icon: '<path d="M14.5 3.5l6 6M17 3h4v4M9.5 20.5l-6-6M7 21H3v-4M20.5 14.5l-6 6M21 17v4h-4M3.5 9.5l6-6M3 7V3h4"/>' },
    { href: "profile.html",  key: "profile",  label: "پروفایل", icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>' }
  ];

  /* میتینگ‌ها اول فهرست چون بخش اصلی است */
  var MENU = [
    ["index.html","📅","میتینگ‌ها"], ["home.html","🏠","خانه"], ["music.html","🎧","آهنگ‌ها"],
    ["artists.html","🎤","آرتیست‌ها"], ["rank.html","🏆","جدول رنکینگ"], ["battles.html","⚔️","بتل‌ها"],
    ["stories.html","🔥","استوری رپی"], ["gangs.html","👥","گنگ‌ها"], ["chat.html","💬","چت"],
    ["notifications.html","🔔","اعلان‌ها"], ["upload.html","⬆️","آپلود آثار"],
    ["rules.html","📜","قوانین لیبل"], ["settings.html","⚙️","تنظیمات"]
  ];

  /**
   * ساخت پوستهٔ کامل صفحه.
   * @param {string} active کلید تب فعال
   */
  function buildShell(active) {
    var u = Auth.user;

    /* ── هدر ── */
    var top = document.createElement("header");
    top.className = "topbar";
    top.innerHTML =
      '<button class="topbar__icon" id="btnMenu" aria-label="منو">' +
        '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>' +
      '<a class="brand" href="index.html">' +
        '<img src="assets/img/logo.png" alt="۰۱۱" class="brand__logo"/>' +
        '<span class="brand__txt">۰۱۱ <b>RAP</b></span></a>' +
      '<div class="topbar__actions">' +
        '<a class="topbar__icon' + (isLocked("search") ? " is-locked-tab" : "") +
          '" href="search.html" aria-label="جستجو">' +
          '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></a>' +
        '<a class="topbar__icon" href="notifications.html" aria-label="اعلان‌ها">' +
          '<svg viewBox="0 0 24 24"><path d="M18 16v-5a6 6 0 10-12 0v5l-2 2h16l-2-2z"/><path d="M10 21h4"/></svg>' +
          '<span class="badge" id="bellBadge" hidden>0</span></a>' +
      '</div>';
    document.body.insertBefore(top, document.body.firstChild);

    /* ── تب‌بار ── */
    var nav = document.createElement("nav");
    nav.className = "tabbar";
    nav.innerHTML = NAV.map(function (n) {
      var on = n.key === active ? " is-active" : "";
      if (n.fab) {
        return '<a class="tab tab--fab' + on + '" href="' + n.href + '" aria-label="' + n.label + '">' +
          '<span class="fab"><svg viewBox="0 0 24 24">' + n.icon + '</svg></span>' +
          '<span class="tab--fab__lbl">' + n.label + '</span></a>';
      }
      return '<a class="tab' + on + '" href="' + n.href + '">' +
        '<svg viewBox="0 0 24 24">' + n.icon + '</svg><span>' + n.label + '</span></a>';
    }).join("");
    document.body.appendChild(nav);

    /* ── مینی‌پلیر ── */
    var mini = document.createElement("div");
    mini.className = "miniplayer";
    mini.id = "miniplayer";
    mini.hidden = true;
    mini.innerHTML =
      '<div class="miniplayer__progress"><span id="mpBar"></span></div>' +
      '<img id="mpCover" class="miniplayer__cover" src="" alt=""/>' +
      '<a class="miniplayer__meta" id="mpOpen" href="player.html">' +
        '<strong id="mpTitle">—</strong><small id="mpArtist">—</small></a>' +
      '<button class="miniplayer__btn" id="mpPrev" aria-label="قبلی">' +
        '<svg viewBox="0 0 24 24"><path d="M9 12l10-7v14L9 12z" fill="currentColor" stroke="none"/>' +
        '<rect x="4" y="5" width="2.5" height="14" rx="1" fill="currentColor" stroke="none"/></svg></button>' +
      '<button class="miniplayer__btn miniplayer__btn--main" id="mpToggle" aria-label="پخش">' +
        '<svg id="mpIcon" viewBox="0 0 24 24"><path d="M7 4l13 8-13 8V4z" fill="currentColor" stroke="none"/></svg></button>' +
      '<button class="miniplayer__btn" id="mpNext" aria-label="بعدی">' +
        '<svg viewBox="0 0 24 24"><path d="M15 12L5 5v14l10-7z" fill="currentColor" stroke="none"/>' +
        '<rect x="17.5" y="5" width="2.5" height="14" rx="1" fill="currentColor" stroke="none"/></svg></button>';
    document.body.appendChild(mini);

    /* ── کشوی منو ── */
    var dr = document.createElement("div");
    dr.className = "drawer"; dr.id = "drawer"; dr.hidden = true;
    dr.innerHTML =
      '<div class="drawer__scrim" data-close></div>' +
      '<aside class="drawer__panel">' +
        '<div class="drawer__head">' +
          '<img class="avatar avatar--lg" src="' + (u ? u.photo : avatarOf("مهمان")) + '" alt=""/>' +
          '<div><strong>' + esc(u ? u.name : "مهمان") + '</strong>' +
          '<small>' + esc(u ? u.handle : "وارد نشده‌اید") + '</small></div>' +
          '<button class="topbar__icon" data-close aria-label="بستن">' +
            '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '</div>' +
        '<nav class="drawer__nav">' +
          MENU.map(function (m) {
            return '<a href="' + m[0] + '"><span>' + m[1] + '</span> ' + m[2] + '</a>';
          }).join("") +
        '</nav>' +
        '<div class="drawer__foot">' +
          /* ثبت‌نام داخلی غیرفعال است؛ دکمهٔ اصلی = ثبت‌نام میتینگ (لینک بیرونی) */
          '<a class="btn btn--gold btn--block" href="' + LINKS.rsvp.url + '"' +
            ' target="_blank" rel="noopener noreferrer">✅ ' + esc(LINKS.rsvp.label) + ' ↗</a>' +
          '<a class="btn btn--ghost btn--block" href="upload.html"' +
            ' style="margin-top:8px">👑 ' + esc(LINKS.label.label) + '</a>' +
          '<p class="muted xs" style="margin-top:10px">ثبت‌نام داخل سایت به‌زودی فعال می‌شود</p>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(dr);

    /* ── لایه‌های افکت و توست ── */
    if (!document.getElementById("toasts")) {
      var tb = document.createElement("div");
      tb.className = "toasts"; tb.id = "toasts"; tb.setAttribute("aria-live", "polite");
      document.body.appendChild(tb);
    }
    if (!document.getElementById("fx")) {
      var fx = document.createElement("div");
      fx.className = "fx"; fx.id = "fx"; fx.setAttribute("aria-hidden", "true");
      document.body.appendChild(fx);
    }
    if (!document.getElementById("audio")) {
      var au = document.createElement("audio");
      au.id = "audio"; au.preload = "metadata";
      document.body.appendChild(au);
    }

    /* ── رویدادها ── */
    var open  = function () { dr.hidden = false; document.body.style.overflow = "hidden"; };
    var close = function () {
      var p = dr.querySelector(".drawer__panel");
      p.style.animation = "slideInRtl .25s var(--ease) reverse both";
      setTimeout(function () {
        dr.hidden = true; p.style.animation = "";
        document.body.style.overflow = "";
      }, 230);
    };
    document.getElementById("btnMenu").addEventListener("click", open);
    $$("#drawer [data-close]").forEach(function (b) { b.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dr.hidden) close();
    });

    /* دکمهٔ ورود/خروج حذف شد — ثبت‌نام داخلی فعلاً غیرفعال است */

    document.getElementById("mpToggle").addEventListener("click", function (e) {
      e.preventDefault(); Player.toggle();
    });
    document.getElementById("mpNext").addEventListener("click", function (e) {
      e.preventDefault(); Player.next();
    });
    document.getElementById("mpPrev").addEventListener("click", function (e) {
      e.preventDefault(); Player.prev();
    });

    /* نشان اعلان */
    var n = unreadCount();
    var badge = document.getElementById("bellBadge");
    if (n > 0) { badge.hidden = false; badge.textContent = fa(n > 9 ? "9+" : n); }

    Player.init();
    markLockedNav();     // نشان 🔒 روی تب‌ها و منوی بخش‌های غیرفعال

    if (!LS_OK) toast("مرورگر حافظهٔ محلی را بسته؛ داده‌ها موقت‌اند.", "err");
  }

  /* ══════════ ۹) کامپوننت‌های HTML ══════════ */

  var UI = {
    trackRow: function (t, playing) {
      return '<div class="trow' + (playing ? " is-playing" : "") + '" data-id="' + t.id + '">' +
        '<img class="trow__art" src="' + t.cover + '" alt="" loading="lazy"/>' +
        '<div class="trow__meta"><strong>' + esc(t.title) + '</strong>' +
        '<small>' + esc(t.artist) + ' · ' + nFmt(t.plays) + ' پخش</small></div>' +
        '<div class="trow__side">' +
          (playing ? '<span class="eq"><i></i><i></i><i></i></span>'
                   : '<span>❤ ' + nFmt(t.likes || 0) + '</span>') +
        '</div></div>';
    },

    trackCard: function (t, rank) {
      return '<div class="tcard" data-id="' + t.id + '">' +
        '<div class="tcard__art"><img src="' + t.cover + '" alt="" loading="lazy"/>' +
        (rank ? '<span class="tcard__rank">#' + fa(rank) + '</span>' : '') +
        '<span class="tcard__play"><svg viewBox="0 0 24 24">' +
        '<path d="M7 4l13 8-13 8V4z" fill="currentColor" stroke="none"/></svg></span></div>' +
        '<h4>' + esc(t.title) + '</h4><small>' + esc(t.artist) + '</small></div>';
    },

    artistCard: function (a) {
      return '<a class="acard" href="artist.html?id=' + a.id + '">' +
        '<img class="acard__img" src="' + (a.photo || avatarOf(a.name)) + '" alt="" loading="lazy"/>' +
        '<h4>' + esc(a.name) + '</h4><small>' +
        (a.tier ? a.tier.emoji + " " + a.tier.label : nFmt(a.followers) + " دنبال‌کننده") +
        '</small></a>';
    },

    empty: function (icon, text, btnLabel, btnHref) {
      return '<div class="empty"><div class="empty__ic">' + icon + '</div><p>' + esc(text) + '</p>' +
        (btnLabel ? '<a class="btn btn--gold" href="' + (btnHref || "#") + '">' + esc(btnLabel) + '</a>' : '') +
        '</div>';
    },

    sectionHead: function (title, href, linkText) {
      return '<div class="sec"><h2>' + esc(title) + '</h2>' +
        (href ? '<a href="' + href + '">' + (linkText || "همه") + '</a>' : '') + '</div>';
    },

    meetingCard: function (m) {
      var d = jDate(m.date), days = daysTo(m.date), past = days < 0;
      return '<a class="ecard" href="meeting.html?id=' + m.id + '">' +
        '<div class="edate"><b>' + fa(d.d) + '</b><small>' + d.m + '</small></div>' +
        '<div class="ecard__body"><h4>' + esc(m.title) + '</h4><p>' + esc(m.venue) + '</p>' +
        '<div class="ecard__tags">' +
          (past ? '<span class="tag">برگزار شده</span>'
                : m.soon
                  /* تاریخ هنوز قطعی نشده */
                  ? '<span class="tag tag--soon">به‌زودی · ' + esc(m.whenLabel || "") + '</span>'
                  : '<span class="tag tag--soon">' + (days === 0 ? "امروز!" : fa(days) + " روز مانده") + '</span>') +
          /* در رویداد گذشته «تعداد حاضران» معنا دارد، نه ظرفیت */
          (past ? '<span class="tag">' + fa(m.going || 0) + ' نفر</span>'
                : '<span class="tag">ظرفیت ' + fa(m.cap || 0) + ' نفر</span>') +
        '</div></div></a>';
    },

    comment: function (c) {
      return '<div class="cmt">' +
        '<img class="avatar" style="width:34px;height:34px" src="' +
          (c.photo || avatarOf(c.user)) + '" alt=""/>' +
        '<div class="cmt__b"><strong>' + esc(c.user) + '</strong>' +
        '<p>' + esc(c.text) + '</p><time>' + ago(c.createdAt) + '</time></div></div>';
    }
  };

  /** پنل کامنت قابل استفاده در همهٔ صفحات */
  function mountComments(container, target) {
    function render() {
      var rows = Social.commentsOf(target);
      container.innerHTML =
        '<div id="cmtList">' +
          (rows.length ? rows.map(UI.comment).join("")
                       : UI.empty("💬", "هنوز نظری ثبت نشده. اولین نفر باش!")) +
        '</div>' +
        '<div class="cmt-form">' +
          '<textarea class="input" id="cmtText" rows="1" placeholder="نظرت رو بنویس…" style="min-height:44px"></textarea>' +
          '<button class="btn btn--gold btn--sm" id="cmtSend">ارسال</button>' +
        '</div>';

      var send = function () {
        var box = document.getElementById("cmtText");
        var txt = box.value.trim();
        if (!txt) return;
        try {
          Social.comment(target, txt);
          box.value = "";
          render();
          toast("نظرت ثبت شد ✅", "ok");
        } catch (e) { toast(e.message, "err"); }
      };
      document.getElementById("cmtSend").addEventListener("click", send);
      document.getElementById("cmtText").addEventListener("keydown", function (e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
      });
    }
    render();
  }

  /** دکمهٔ نیازمند ورود */
  /**
   * قبلاً کاربر را به صفحهٔ ثبت‌نام می‌فرستاد؛ اما حالا حساب کاربری
   * غیرفعال است. پس فقط پیام می‌دهد و به لینک بیرونی راهنمایی می‌کند.
   */
  function needAuth(msg) {
    toast("ثبت‌نام هنوز فعال نشده — از دکمهٔ ثبت‌نام میتینگ استفاده کن.", "err");
  }

  /* ══════════ ۱۰) بخش‌های قفل‌شده ══════════
     صفحه‌هایی که هنوز فعال نشده‌اند: محتوا بلور می‌شود و
     یک دیالوگ توضیح روی آن می‌نشیند. هدر و نویگیشن سالم
     می‌مانند تا کاربر بتواند به بخش‌های فعال برود. */

  /** بخش‌های غیرفعال — باز: میتینگ، تنظیمات، آهنگ‌ها، آرتیست‌ها
   *  برای فعال کردن یک بخش، کلیدش را از این آرایه حذف کن. */
  var LOCKED = ["battles", "profile", "auth", "rank", "gangs", "chat"];

  /* ═══════════════════════════════════════════════════════════
     🔗 لینک‌های بیرونی  ←←←  اینجا را با آدرس واقعی خودت عوض کن
     ═══════════════════════════════════════════════════════════
     چون ثبت‌نام داخل سایت فعلاً غیرفعال است، دکمه‌های میتینگ
     کاربر را به این آدرس‌ها می‌فرستند.
     (فعلاً نمونه است — فقط مقدار url را عوض کن)                */
  /* لینک‌ها از فایل تنظیمات (assets/js/config.js) خوانده می‌شوند */
  var LINKS = (window.CONFIG && window.CONFIG.links) || {
    rsvp:  { url:"#", label:"ثبت‌نام در میتینگ", hint:"" },
    label: { url:"#", label:"عضویت در لیبل", hint:"" }
  };

  /**
   * دو دکمهٔ لینک‌دار میتینگ (ثبت‌نام + عضویت در لیبل)
   * @param {boolean} stacked اگر true، زیر هم؛ وگرنه کنار هم
   */
  function meetingLinks(stacked) {
    var wrap = stacked
      ? 'display:flex;flex-direction:column;gap:8px'
      : 'display:flex;gap:8px;flex-wrap:wrap';
    return '<div style="' + wrap + '">' +
      '<a class="btn btn--gold" href="' + LINKS.rsvp.url + '"' +
        ' target="_blank" rel="noopener noreferrer">✅ ' + esc(LINKS.rsvp.label) + ' ↗</a>' +
      '<a class="btn btn--violet" href="' + LINKS.label.url + '"' +
        ' target="_blank" rel="noopener noreferrer">👑 ' + esc(LINKS.label.label) + ' ↗</a>' +
    '</div>';
  }

  /** آیا این بخش قفل است؟ */
  function isLocked(key) { return LOCKED.indexOf(key) >= 0; }

  /**
   * قفل کردن صفحهٔ جاری.
   * @param {object} opt {title, text, icon}
   */
  function lockPage(opt) {
    opt = opt || {};
    var view = document.getElementById("view");
    if (view) view.classList.add("is-locked");

    // مینی‌پلیر در بخش قفل‌شده معنا ندارد
    var mini = document.getElementById("miniplayer");
    if (mini) mini.hidden = true;

    // آیکن قفل به‌صورت SVG (نه ایموجی) تا روی همهٔ سیستم‌ها قطعاً رندر شود
    var lockSvg =
      '<svg viewBox="0 0 24 24" style="width:32px;height:32px;stroke-width:2">' +
        '<rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/>' +
        '<path d="M8 10.5V7.5a4 4 0 018 0v3"/>' +
        '<circle cx="12" cy="15.5" r="1.4" fill="currentColor" stroke="none"/>' +
      '</svg>';

    var wrap = document.createElement("div");
    wrap.className = "lockwrap";
    wrap.innerHTML =
      '<div class="lockcard" role="dialog" aria-modal="true" aria-labelledby="lockTitle">' +
        '<div class="lockcard__ic">' + lockSvg + '</div>' +
        '<span class="lockcard__tag"><i></i> به‌زودی</span>' +
        '<h2 id="lockTitle">' + (opt.icon ? opt.icon + " " : "") +
          esc(opt.title || "این بخش هنوز فعال نشده") + '</h2>' +
        '<p>' + esc(opt.text ||
          "این بخش به دلیل هزینهٔ سرورها هنوز فعال نشده است.") + '</p>' +
        '<div class="lockcard__note"><span>💡</span>' +
          '<span>به‌محض تأمین هزینهٔ سرور، این بخش برای همه باز می‌شود. ' +
          'تا آن موقع می‌توانی از بخش‌های فعال استفاده کنی.</span></div>' +
        '<div class="lockcard__actions">' +
          (opt.links
            /* دیالوگ ثبت‌نام: دکمه‌های لینک بیرونی */
            ? '<a class="btn btn--gold btn--block" href="' + LINKS.rsvp.url + '"' +
                ' target="_blank" rel="noopener noreferrer">✅ ' + esc(LINKS.rsvp.label) + ' ↗</a>' +
              '<a class="btn btn--violet btn--block" href="' + LINKS.label.url + '"' +
                ' target="_blank" rel="noopener noreferrer">👑 ' + esc(LINKS.label.label) + ' ↗</a>' +
              '<a class="btn btn--ghost btn--block" href="index.html">📅 دیدن میتینگ‌ها</a>'
            /* بقیهٔ دیالوگ‌ها: راه خروج به تنها بخش فعال */
            : '<a class="btn btn--gold btn--block" href="index.html">📅 دیدن میتینگ‌ها</a>' +
              '<a class="btn btn--ghost btn--block" href="' + LINKS.rsvp.url + '"' +
                ' target="_blank" rel="noopener noreferrer">✅ ' + esc(LINKS.rsvp.label) + ' ↗</a>') +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    // اسکرول صفحه قفل شود
    document.body.style.overflow = "hidden";
  }

  /** نشان قفل روی تب‌ها و منو */
  function markLockedNav() {
    var map = {
      "home.html": "home", "music.html": "music", "battles.html": "battles",
      "profile.html": "profile", "notifications.html": "notifications",
      "auth.html": "auth", "artists.html": "artists", "artist.html": "artists",
      "rank.html": "rank", "stories.html": "stories", "story-view.html": "stories",
      "gangs.html": "gangs", "chat.html": "chat", "chat-room.html": "chat",
      "search.html": "search", "upload.html": "upload", "player.html": "music"
      // باز: index.html (میتینگ) · meeting.html · settings.html
    };
    $$(".tab, .drawer__nav a").forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop();
      if (map[href] && isLocked(map[href])) a.classList.add("is-locked-tab");
    });
  }

  /* ══════════════════════════════════════════════════════════
     SoundCloud — چند آرتیست، کاملاً خودکار
     ══════════════════════════════════════════════════════════
     هیچ ترکی دستی وارد نشده. برای هر آرتیست یک ویجت مخفی به
     پروفایلش وصل می‌شود و همهٔ ترک‌هایش خوانده می‌شود.

     هر تغییری در ساندکلود (ترک جدید، حذف، تغییر اسم/کاور/آواتار)
     خودکار در سایت اعمال می‌شود. ✅

     برای افزودن آرتیست جدید: یک سطر به ARTISTS اضافه کن.
     ══════════════════════════════════════════════════════════ */

  /* آرتیست‌ها از فایل تنظیمات (assets/js/config.js) خوانده می‌شوند */
  var ARTISTS = (window.CONFIG && window.CONFIG.artists) || [];

  var SC = {
    list: ARTISTS,
    artists: [],           // خودکار پر می‌شود
    tracks: [],            // ترک‌های همهٔ آرتیست‌ها
    online: false,         // آیا حداقل یک پاسخ واقعی از ساندکلود گرفتیم؟
    current: null,
    ready: false,
    _api: null,
    _waiting: [],
    _busy: false,

    /** Embed رسمی ساندکلود (برای نمایش قاب ترک) */
    embedUrl: function (trackUrl) {
      var narrow = (typeof window !== "undefined" && window.innerWidth < 560);
      return "https://w.soundcloud.com/player/?url=" + encodeURIComponent(trackUrl) +
        "&color=%23f0a500&auto_play=false&hide_related=true" +
        "&show_comments=true&show_user=true&show_reposts=false&show_teaser=false" +
        "&visual=false" + (narrow ? "&show_artwork=false" : "");
    },

    /** آدرس ویجت (پخش یا لودر) */
    url: function (target, autoplay) {
      return "https://w.soundcloud.com/player/?url=" + encodeURIComponent(target) +
        "&color=%23f0a500&auto_play=" + (autoplay ? "true" : "false") +
        "&hide_related=true&show_comments=false&show_user=true" +
        "&show_reposts=false&show_teaser=false&visual=false";
    },

    /**
     * خواندن خودکار همهٔ آرتیست‌ها و ترک‌هایشان.
     * @param {Function} cb  cb(tracks, artists)
     */
    load: function (cb) {
      if (this.ready) { cb(this.tracks, this.artists); return; }
      this._waiting.push(cb);
      if (this._busy) return;
      this._busy = true;

      var self = this;
      var cached = store.get("scCache2", null);

      /* کش ۶ ساعته. تازه‌سازی پس‌زمینه فقط وقتی کش «کهنه» شده
         (بیش از ۲ ساعت) و آن هم با تأخیر زیاد و پشت‌سرهم انجام
         می‌شود — وگرنه چند iframe همزمان، GPU گوشی را اشباع
         می‌کند و صفحه چند ثانیه سیاه می‌شود. */
      if (cached && cached.at && (Date.now() - cached.at < 6 * 60 * 60 * 1000) &&
          cached.sig === this._sig() && cached.artists && cached.artists.length) {
        this.tracks = cached.tracks || [];
        this.artists = cached.artists;
        this.online = true;          // کش فقط وقتی ذخیره می‌شود که آنلاین بوده
        this.ready = true;
        this._busy = false;
        this._flush();

        var age = Date.now() - cached.at;
        if (age > 2 * 60 * 60 * 1000) {
          // فقط وقتی کاربر بی‌کار است و صفحه دیده می‌شود
          setTimeout(function () {
            if (document.hidden) return;
            self._busy = true;
            self._fetchAll(true);
          }, 8000);
        }
        return;
      }
      this._fetchAll(false);
    },

    /** امضای لیست آرتیست‌ها (اگر عوض شود کش باطل می‌شود) */
    _sig: function () {
      return this.list.map(function (a) { return a.id + ":" + a.url; }).join("|");
    },

    /** آیا اسکریپت ویجت ساندکلود اصلاً لود شد؟ */
    apiReady: function (cb) {
      if (window.SC && window.SC.Widget) { cb(true); return; }
      var waited = 0;
      var t = setInterval(function () {
        if (window.SC && window.SC.Widget) { clearInterval(t); cb(true); }
        else if ((waited += 150) > 8000) { clearInterval(t); cb(false); }
      }, 150);
    },

    /** واکشی همهٔ آرتیست‌ها (پشت‌سرهم) */
    _fetchAll: function (silent) {
      var self = this;
      var left = this.list.length;
      var artists = [], tracks = [];

      /* اگر api.js ساندکلود لود نشده (فیلترینگ / نت ضعیف)،
         بی‌درنگ اعلام آفلاین کن — نه اینکه برای هر آرتیست صبر کنیم. */
      this.apiReady(function (ok) {
        if (ok) { begin(); return; }
        self.online = false;
        self.ready = true;
        self._busy = false;
        if (!silent) self._flush();
      });

      function begin() {

      var settle = function () {
        if (--left > 0) return;

        // مرتب‌سازی: به ترتیب همان لیست ARTISTS
        var orderMap = {};
        self.list.forEach(function (a, i) { orderMap[a.id] = i; });
        artists.sort(function (x, y) { return orderMap[x.id] - orderMap[y.id]; });

        // ترک‌ها: جدیدترین اول
        tracks.sort(function (x, y) {
          return new Date(y.createdAt) - new Date(x.createdAt);
        });

        /* «آنلاین» یعنی حداقل یک آرتیستِ دارای ساندکلود واقعاً
           پاسخ داده باشد. اگر همه خالی برگشتند، یعنی سرور در
           دسترس نیست (نت ضعیف یا فیلترینگ). */
        var needSC = self.list.filter(function (x) { return !!x.url; }).length;
        var gotSC  = artists.filter(function (a) { return a._real; }).length;
        self.online = (needSC === 0) || (gotSC > 0);

        if (artists.length && self.online) {
          self.artists = artists;
          self.tracks = tracks;
          store.set("scCache2", { at: Date.now(), sig: self._sig(),
                                  artists: artists, tracks: tracks,
                                  online: true });
        } else if (artists.length) {
          /* آفلاین: داده را نمایش می‌دهیم ولی کش نمی‌کنیم */
          self.artists = artists;
          self.tracks = tracks;
        }
        self.ready = true;
        self._busy = false;
        if (!silent) self._flush();
      };

      /* صف: آرتیست‌ها یکی‌یکی واکشی می‌شوند تا هیچ‌وقت بیش از
         یک iframe همزمان وجود نداشته باشد. */
      var queue = self.list.slice();
      var runNext = function () {
        var entry = queue.shift();
        if (!entry) return;
        step(entry, runNext);
      };

      var step = function (entry, next) {
        /* آرتیستی که اصلاً ساندکلود ندارد → بدون هیچ iframe،
           مستقیم از fallback ساخته می‌شود. */
        if (!entry.url) {
          var a0 = shapeArtist(entry, null);
          a0.instagram = entry.instagram || "";
          a0.telegram  = entry.telegram || "";
          a0.youtube   = entry.youtube || "";
          a0.url       = "";
          a0.trackCount = 0;
          a0.plays = 0;
          artists.push(a0);
          settle();
          next();
          return;
        }

        /* هر آرتیست می‌تواند چند اکانت ساندکلود داشته باشد
           (اکانت دوم / ریپست‌ها) — همه با هم ادغام می‌شوند. */
        var urls = [entry.url].concat(entry.extraSoundcloud || []);
        var pending = urls.length;
        var merged = [], mainArtist = null;

        /* اکانت‌های یک آرتیست هم پشت‌سرهم واکشی می‌شوند
           تا هیچ‌وقت بیش از یک iframe همزمان نباشد. */
        var uq = urls.slice(), uIdx = -1;
        var nextUrl = function () {
          var u = uq.shift();
          if (u === undefined) return;
          uIdx++;
          fetchUrl(u, uIdx);
        };

        var fetchUrl = function (u, idx) {
          self._fetchOne({ id: entry.id, url: u, fallback: entry.fallback,
                           instagram: entry.instagram, telegram: entry.telegram,
                           youtube: entry.youtube },
            function (artist, list) {
              /* هویت آرتیست (نام، عکس، بیو) فقط از اکانت اصلی یا fallback
                 گرفته می‌شود — نه از اکانت دوم، وگرنه نام عوض می‌شود. */
              if (idx === 0 && artist) mainArtist = artist;
              else if (!mainArtist && artist) mainArtist = artist;
              list.forEach(function (t) { merged.push(t); });

              if (--pending > 0) { nextUrl(); return; }

              if (mainArtist) {
                // اگر fallback داده شده، نام/عکس آن اولویت دارد
                var fbk = entry.fallback || {};
                if (fbk.name)  mainArtist.name  = fbk.name;
                if (fbk.photo) mainArtist.photo = fbk.photo;
                if (fbk.bio)   mainArtist.bio   = fbk.bio;
                if (fbk.city)  mainArtist.city  = fbk.city;

                // اطلاعات تماس همیشه از config
                mainArtist.instagram = entry.instagram || mainArtist.instagram || "";
                mainArtist.telegram  = entry.telegram || "";
                mainArtist.youtube   = entry.youtube || "";
                mainArtist.url       = entry.url;

                // حذف ترک‌های تکراری
                var seen = {}, uniq = [];
                merged.forEach(function (t) {
                  if (seen[t.id]) return;
                  seen[t.id] = 1; uniq.push(t);
                });
                uniq.sort(function (a, b) {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                });

                mainArtist.trackCount = uniq.length;
                var pl = 0;
                uniq.forEach(function (t) { pl += t.plays || 0; });
                mainArtist.plays = pl;

                artists.push(mainArtist);
                uniq.forEach(function (t) {
                  t.artistId = entry.id;
                  t.artist = mainArtist.name;
                  tracks.push(t);
                });
              }
              settle();
              next();               // آرتیست بعدی
            });
        };

        nextUrl();                  // شروع اکانت‌های این آرتیست
      };

      runNext();                    // شروع صف
      }                             // پایان begin()
    },

    /** واکشی یک آرتیست */
    _fetchOne: function (entry, done) {
      var self = this;
      var f = document.createElement("iframe");
      f.width = "1"; f.height = "1";
      f.setAttribute("aria-hidden", "true");
      f.setAttribute("tabindex", "-1");
      f.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;" +
                        "pointer-events:none;border:0;left:-9999px;top:-9999px;" +
                        "visibility:hidden";
      /* هیچ مجوزی لازم نیست — فقط لیست ترک‌ها خوانده می‌شود.
         این جلوی راه‌اندازی موتور صوتی/گرافیکی ویجت را می‌گیرد. */
      f.src = this.url(entry.url, false);
      document.body.appendChild(f);

      var finished = false;
      var finish = function (artist, list) {
        if (finished) return;
        finished = true;
        try { f.remove(); } catch (e) {}
        done(artist, list || []);
      };

      var read = function () {
        try {
          var w = window.SC.Widget(f);
          w.bind(window.SC.Widget.Events.READY, function () {
            w.getSounds(function (sounds) {
              var user = null, out = [];
              (sounds || []).forEach(function (t) {
                if (!t || !t.permalink_url) return;
                if (!user && t.user) user = shapeArtist(entry, t.user);
                out.push({
                  id: "sc" + t.id,
                  title: cleanTitle(t.title),
                  artist: (t.user && t.user.username) || "",
                  artistId: entry.id,
                  cover: hiRes(t.artwork_url) || hiRes(t.user && t.user.avatar_url) ||
                         "assets/img/cover1.jpg",
                  scUrl: t.permalink_url,
                  plays: t.playback_count || 0,
                  likes: t.likes_count || 0,
                  duration: t.duration || 0,
                  tags: t.genre ? [t.genre] : [],
                  note: (t.description || "").split("\n")[0].slice(0, 80),
                  createdAt: t.created_at || t.display_date || new Date().toISOString()
                });
              });
              // آرتیستی که هنوز ترکی ندارد هم باید نمایش داده شود
              if (!user) user = shapeArtist(entry, null);
              finish(user, out);
            });
          });
        } catch (e) { finish(shapeArtist(entry, null), []); }
      };

      var waited = 0;
      var poll = setInterval(function () {
        if (window.SC && window.SC.Widget) { clearInterval(poll); read(); }
        else if ((waited += 120) > 9000) { clearInterval(poll); finish(shapeArtist(entry, null), []); }
      }, 120);

      setTimeout(function () { finish(shapeArtist(entry, null), []); }, 11000);
    },

    _flush: function () {
      var self = this;
      var cbs = this._waiting.slice();
      this._waiting = [];
      cbs.forEach(function (cb) {
        try { cb(self.tracks, self.artists); } catch (e) { console.error(e); }
      });
    },

    /** ترک‌های یک آرتیست */
    byArtist: function (id) {
      return this.tracks.filter(function (t) { return t.artistId === id; });
    },

    /** پیدا کردن آرتیست */
    artist: function (id) {
      for (var i = 0; i < this.artists.length; i++)
        if (this.artists[i].id === id) return this.artists[i];
      return null;
    },

    /* ───── پلیر ───── */

    play: function (track) {
      if (!track || !track.scUrl) return;
      this.current = track;

      var bar = document.getElementById("scbar") || this._buildBar();
      document.getElementById("scframe").src = this.url(track.scUrl, true);
      document.getElementById("scTitle").textContent  = track.title;
      document.getElementById("scArtist").textContent = track.artist;
      var img = document.getElementById("scCover");
      img.src = track.cover; img.alt = track.title;
      document.getElementById("scOpen").href = track.scUrl;

      bar.hidden = false;
      document.body.classList.add("has-sc");

      var h = store.get("history", []);
      h.unshift({ id: track.id, artistId: track.artistId, tags: track.tags || [], at: Date.now() });
      store.set("history", h.slice(0, 60));

      this._connect();
      if (typeof window.onScPlay === "function") window.onScPlay(track);
    },

    _buildBar: function () {
      var bar = document.createElement("div");
      bar.className = "scbar"; bar.id = "scbar"; bar.hidden = true;
      bar.innerHTML =
        '<div class="scbar__head">' +
          '<img id="scCover" class="scbar__cover" src="" alt=""/>' +
          '<div class="scbar__meta"><strong id="scTitle">—</strong>' +
            '<small id="scArtist">—</small></div>' +
          '<a id="scOpen" class="scbar__btn" href="#" target="_blank"' +
            ' rel="noopener noreferrer" title="باز کردن در ساندکلود">↗</a>' +
          '<button id="scClose" class="scbar__btn" title="بستن">✕</button>' +
        '</div>' +
        '<iframe id="scframe" title="پخش‌کنندهٔ ساندکلود" width="100%" height="110"' +
          ' frameborder="no" scrolling="no"' +
          ' allow="autoplay; encrypted-media; clipboard-write; picture-in-picture"' +
          ' src="about:blank"></iframe>';
      document.body.appendChild(bar);
      document.getElementById("scClose").addEventListener("click", function () { SC.stop(); });
      return bar;
    },

    stop: function () {
      var bar = document.getElementById("scbar");
      if (bar) { bar.hidden = true; document.getElementById("scframe").src = "about:blank"; }
      document.body.classList.remove("has-sc");
      this.current = null;
      if (typeof window.onScPlay === "function") window.onScPlay(null);
    },

    _connect: function () {
      if (!window.SC || !window.SC.Widget) return;
      try {
        this._api = window.SC.Widget(document.getElementById("scframe"));
        this._api.bind(window.SC.Widget.Events.FINISH, function () {
          if (typeof window.onScFinish === "function") window.onScFinish();
        });
      } catch (e) {}
    },

    /** پاک کردن کش */
    refresh: function () {
      store.del("scCache2");
      this.ready = false; this._busy = false;
      this.tracks = []; this.artists = [];
    }
  };

  /* پاک‌سازی آی‌فریم‌های لودر هنگام ترک صفحه — جلوگیری از
     باقی ماندن ویجت‌های سنگین در حافظه */
  window.addEventListener("pagehide", function () {
    var n = document.querySelectorAll('iframe[aria-hidden="true"]');
    for (var i = 0; i < n.length; i++) {
      try { n[i].src = "about:blank"; n[i].remove(); } catch (e) {}
    }
  });

  /** ساخت شیء آرتیست از دادهٔ ساندکلود */
  function shapeArtist(entry, u) {
    u = u || {};
    var fb = entry.fallback || {};
    var bio = u.description || fb.bio || "";
    return {
      id: entry.id,
      name: u.username || fb.name || entry.id,
      city: u.city || fb.city || "",
      country: u.country_code || "",
      followers: u.followers_count || fb.followers || 0,
      bio: bio,
      _real: Boolean(u.username),        // آیا از ساندکلود داده گرفت؟
      photo: hiRes(u.avatar_url) || fb.photo || avatarOf(u.username || fb.name || entry.id),
      url: u.permalink_url || entry.url,
      /* اینستاگرام: اول از لیست، وگرنه از بیوی ساندکلود استخراج می‌شود */
      instagram: entry.instagram || instaFrom(bio),
      trackCount: 0,
      plays: 0
    };
  }

  /** استخراج خودکار لینک اینستاگرام از متن بیو */
  function instaFrom(text) {
    if (!text) return "";
    var m = String(text).match(/instagram\.com\/([A-Za-z0-9_.]+)/i);
    if (m) return "https://www.instagram.com/" + m[1] + "/";
    m = String(text).match(/instagram\s*[:：]\s*@?([A-Za-z0-9_.]+)/i);
    return m ? "https://www.instagram.com/" + m[1] + "/" : "";
  }

  /* ═══ لوگوی رسمی پلتفرم‌ها (SVG) ═══ */

  var IG_SVG =
    '<svg viewBox="0 0 24 24" class="picon">' +
      '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/>' +
      '<circle cx="12" cy="12" r="4.2"/>' +
      '<circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" stroke="none"/>' +
    '</svg>';

  var TG_SVG =
    '<svg viewBox="0 0 24 24" class="picon">' +
      '<path d="M21.6 4.3 2.9 11.5c-.9.35-.88 1.63.03 1.95l4.6 1.6 1.75 5.3c.24.72 1.17.9 1.66.33l2.5-2.9 4.6 3.4c.6.44 1.45.11 1.6-.62l3-14.2c.17-.8-.62-1.47-1.4-1.15Z"/>' +
      '<path d="m7.6 15.1 9.9-7.3-7.9 8.4"/>' +
    '</svg>';

  var YT_SVG =
    '<svg viewBox="0 0 24 24" class="picon">' +
      '<rect x="1.8" y="5" width="20.4" height="14" rx="4.6"/>' +
      '<path d="M10 9.2v5.6l4.9-2.8z" fill="currentColor" stroke="none"/>' +
    '</svg>';

  /* لوگوی رسمی ساندکلود: میله‌های موج + ابر سمت راست (یک‌تکه، توپر) */
  var SC_SVG =
    '<svg viewBox="0 0 26 16" class="picon picon--sc">' +
      '<g fill="currentColor" stroke="none">' +
        '<rect x="0"   y="8"   width="1.5" height="5"   rx=".75"/>' +
        '<rect x="2.6" y="6"   width="1.5" height="7"   rx=".75"/>' +
        '<rect x="5.2" y="3.6" width="1.5" height="9.4" rx=".75"/>' +
        '<rect x="7.8" y="5"   width="1.5" height="8"   rx=".75"/>' +
        '<rect x="10.4" y="2"  width="1.5" height="11"  rx=".75"/>' +
        '<rect x="13"  y="4.2" width="1.5" height="8.8" rx=".75"/>' +
      '</g>' +
      '<path d="M16.2 13V4.1a4.4 4.4 0 0 1 6.1 3.1 3 3 0 0 1-.6 5.9h-5.5z"' +
        ' fill="currentColor" stroke="none"/>' +
    '</svg>';

  /**
   * ساخت دکمهٔ پلتفرم.
   * اگر لینک خالی باشد، دکمه غیرفعال می‌شود و با کلیک پیام می‌دهد.
   */
  function platBtn(kind, url, label) {
    var ic = { instagram: IG_SVG, telegram: TG_SVG,
               youtube: YT_SVG, soundcloud: SC_SVG }[kind] || "";
    var cls = { instagram: "pbtn--ig", telegram: "pbtn--tg",
                youtube: "pbtn--yt", soundcloud: "pbtn--sc" }[kind] || "";
    if (url) {
      return '<a class="pbtn ' + cls + '" href="' + url + '" target="_blank"' +
        ' rel="noopener noreferrer">' + ic + '<span>' + esc(label) + '</span></a>';
    }
    return '<button class="pbtn pbtn--off" data-plat="' + esc(label) + '">' +
      ic + '<span>' + esc(label) + '</span></button>';
  }

  /* پیام دکمه‌های غیرفعال */
  document.addEventListener("click", function (e) {
    var b = e.target.closest(".pbtn--off");
    if (!b) return;
    e.preventDefault();
    toast("این آرتیست هنوز " + b.getAttribute("data-plat") + " ثبت نکرده.", "err");
  });

  /** کاور با کیفیت بالا */
  function hiRes(u) {
    return u ? String(u).replace("-large.", "-t500x500.") : "";
  }

  /** حذف پسوند فایل از عنوان */
  function cleanTitle(t) {
    return String(t || "").replace(/\.(mp3|wav|m4a|flac|ogg)$/i, "").trim();
  }

  /** بارگذاری Widget API ساندکلود (یک‌بار) */
  (function loadSCApi() {
    if (document.getElementById("sc-api")) return;
    var sc = document.createElement("script");
    sc.id = "sc-api";
    sc.src = "https://w.soundcloud.com/player/api.js";
    sc.async = true;
    document.head.appendChild(sc);
  })();

  /* ══════════════════════════════════════════════════════════
     YouTube — جدیدترین ویدیوها
     ══════════════════════════════════════════════════════════
     فقط لینک ویدیو در config.js داده می‌شود؛ عنوان و تصویر
     خودکار از oEmbed رسمی یوتیوب گرفته می‌شود (CORS دارد ✅).
     ══════════════════════════════════════════════════════════ */

  var YT = {

    /** استخراج شناسهٔ ویدیو از هر شکل لینک یوتیوب */
    id: function (url) {
      var u = String(url || "");
      var m = u.match(/[?&]v=([\w-]{11})/) ||
              u.match(/youtu\.be\/([\w-]{11})/) ||
              u.match(/\/shorts\/([\w-]{11})/) ||
              u.match(/\/embed\/([\w-]{11})/) ||
              u.match(/^([\w-]{11})$/);
      return m ? m[1] : null;
    },

    thumb: function (id) { return "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; },
    watch: function (id) { return "https://www.youtube.com/watch?v=" + id; },

    /**
     * گرفتن عنوان و اطلاعات ویدیوها.
     * @param {Array} list  آرایهٔ {url, artist} از config
     * @param {Function} cb cb(videos)
     */
    load: function (list, cb) {
      list = list || [];
      var out = [], left = list.length;
      if (!left) { cb([]); return; }

      var cache = store.get("ytCache", {}) || {};
      var fresh = {};

      list.forEach(function (item, i) {
        var vid = YT.id(item.url);
        if (!vid) { if (--left === 0) finish(); return; }

        var base = {
          id: vid, order: i,
          url: YT.watch(vid),
          thumb: YT.thumb(vid),
          artist: item.artist || "",
          title: item.title || ""
        };

        // از کش (۲۴ ساعت)
        var c = cache[vid];
        if (c && c.t && (Date.now() - c.t < 86400000)) {
          base.title = item.title || c.title;
          base.author = c.author;
          fresh[vid] = c;
          out.push(base);
          if (--left === 0) finish();
          return;
        }

        // oEmbed رسمی یوتیوب
        fetch("https://www.youtube.com/oembed?format=json&url=" +
              encodeURIComponent(YT.watch(vid)))
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (j) {
            if (j) {
              base.title = item.title || j.title || "";
              base.author = j.author_name || "";
              fresh[vid] = { t: Date.now(), title: j.title, author: j.author_name };
            }
          })
          .catch(function () {})
          .then(function () {
            out.push(base);
            if (--left === 0) finish();
          });
      });

      function finish() {
        out.sort(function (a, b) { return a.order - b.order; });
        store.set("ytCache", fresh);
        cb(out);
      }
    }
  };

  /**
   * بلوک خطای شبکه + دکمهٔ تلاش مجدد.
   * وقتی سرور ساندکلود پاسخ ندهد (نت ضعیف یا فیلترینگ) نمایش داده می‌شود.
   * @param {string} what  اسم بخش (مثلاً «آهنگ‌ها»)
   */
  function netError(what) {
    return '<div class="neterr">' +
      '<div class="neterr__ic">📡</div>' +
      '<strong>' + esc(what || "اطلاعات") + ' بارگذاری نشد</strong>' +
      '<p>ارتباط با سرور ساندکلود برقرار نشد.</p>' +
      '<div class="neterr__hint">' +
        '<span>⚠️</span>' +
        '<span>در بعضی مواقع سرور ساندکلود <b>بدون VPN</b> پاسخ نمی‌دهد. ' +
        'اگر مشکل ادامه داشت، با <b>VPN</b> تلاش کنید.</span>' +
      '</div>' +
      '<button class="btn btn--gold" data-retry>↻ تلاش مجدد</button>' +
    '</div>';
  }

  /* دکمهٔ تلاش مجدد: کش را پاک و صفحه را دوباره بارگذاری می‌کند */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-retry]");
    if (!b) return;
    e.preventDefault();
    b.disabled = true;
    b.textContent = "در حال تلاش…";
    try { store.del("scCache2"); store.del("ytCache"); } catch (err) {}
    setTimeout(function () { location.reload(); }, 250);
  });

  /* ══════════ ۱۱) خروجی سراسری ══════════ */

  window.APP = {
    store: store, DB: DB, Auth: Auth, Player: Player, Social: Social, UI: UI,
    SEED: SEED,
    fa: fa, nFmt: nFmt, tFmt: tFmt, ago: ago, jDate: jDate, jFull: jFull,
    daysTo: daysTo, uid: uid, esc: esc, avatarOf: avatarOf,
    $: $, $$: $$, param: param, debounce: debounce,
    toast: toast, buzz: buzz, heartBurst: heartBurst, onDoubleTap: onDoubleTap,
    rankArtists: rankArtists, tierOf: tierOf, trending: trending, recommend: recommend,
    notify: notify, unreadCount: unreadCount,
    buildShell: buildShell, mountComments: mountComments, needAuth: needAuth,
    SC: SC,
    LOCKED: LOCKED, isLocked: isLocked, lockPage: lockPage,
    LINKS: LINKS, meetingLinks: meetingLinks,
    IG_SVG: IG_SVG, TG_SVG: TG_SVG, YT_SVG: YT_SVG, SC_SVG: SC_SVG,
    platBtn: platBtn, YT: YT, netError: netError,
    hasStorage: LS_OK
  };

  /* تم ذخیره‌شده */
  var th = store.get("theme", null);
  if (th) document.documentElement.setAttribute("data-theme", th);

})(window, document);
