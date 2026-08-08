/* =========================================================
   共通処理: ヘッダー/フッター描画・ナビ・スクロールアニメーション
   ナビ項目を変更する場合はこのファイルの NAV_ITEMS のみ編集する
   ========================================================= */

const NAV_ITEMS = [
  { href: "index.html", label: "ホーム" },
  { href: "news.html", label: "新着情報" },
  { href: "tournaments.html", label: "大会案内" },
  { href: "results.html", label: "大会結果" },
  { href: "school.html", label: "テニス教室" },
  { href: "membership.html", label: "協会登録" },
  { href: "about.html", label: "協会について" },
  { href: "contact.html", label: "お問い合わせ" },
];

const LOGO_SVG = `
<svg class="site-logo__mark" viewBox="0 0 40 40" aria-hidden="true">
  <circle cx="20" cy="20" r="18" fill="#0C7699"/>
  <path d="M8 8 Q 20 20 8 32" stroke="#D8F34E" stroke-width="2.4" fill="none"/>
  <path d="M32 8 Q 20 20 32 32" stroke="#D8F34E" stroke-width="2.4" fill="none"/>
</svg>`;

function currentPage() {
  const path = location.pathname.split("/").pop();
  return path === "" ? "index.html" : path;
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  const page = currentPage();
  const links = NAV_ITEMS.map((item) => {
    const current = item.href === page ? ' aria-current="page"' : "";
    return `<a href="${item.href}"${current}>${item.label}</a>`;
  }).join("");
  el.innerHTML = `
    <div class="site-header__inner">
      <a class="site-logo" href="index.html">
        ${LOGO_SVG}
        <span class="site-logo__text">
          <span class="site-logo__ja">鳥取市テニス協会</span>
          <span class="site-logo__en">Tottori City Tennis Association</span>
        </span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="global-nav" aria-label="メニューを開く">
        <span></span><span></span><span></span>
      </button>
      <nav class="global-nav" id="global-nav" aria-label="グローバルナビゲーション">
        ${links}
        <a class="nav-cta" href="tournaments.html">大会エントリー<span aria-hidden="true">→</span></a>
      </nav>
    </div>`;

  const toggle = el.querySelector(".nav-toggle");
  const nav = el.querySelector(".global-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    toggle.setAttribute("aria-label", open ? "メニューを開く" : "メニューを閉じる");
    nav.classList.toggle("is-open", !open);
    document.body.style.overflow = open ? "" : "hidden";
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  });
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  const year = new Date().getFullYear();
  el.innerHTML = `
    <div class="container">
      <div class="site-footer__grid">
        <div>
          <a class="site-footer__logo site-logo" href="index.html">
            ${LOGO_SVG}
            <span class="site-logo__text">
              <span class="site-logo__ja">鳥取市テニス協会</span>
              <span class="site-logo__en">Tottori City Tennis Association</span>
            </span>
          </a>
          <p class="site-footer__desc">
            鳥取市を拠点に、大会の開催・テニス教室の運営などを通じて、
            地域のテニスの普及・振興に取り組んでいます。
          </p>
        </div>
        <div>
          <p class="site-footer__head">Menu</p>
          <ul class="site-footer__nav">
            <li><a href="news.html">新着情報</a></li>
            <li><a href="tournaments.html">大会案内・エントリー</a></li>
            <li><a href="results.html">大会結果</a></li>
            <li><a href="school.html">テニス教室</a></li>
          </ul>
        </div>
        <div>
          <p class="site-footer__head">Support</p>
          <ul class="site-footer__nav">
            <li><a href="membership.html">協会登録</a></li>
            <li><a href="about.html">協会について</a></li>
            <li><a href="contact.html">お問い合わせ</a></li>
            <li><a href="contact.html#line">LINE公式アカウント</a></li>
          </ul>
        </div>
      </div>
      <div class="site-footer__bottom">
        <p>&copy; ${year} Tottori City Tennis Association</p>
        <p>鳥取市テニス協会</p>
      </div>
    </div>`;
}

function setupFadeUp() {
  const targets = document.querySelectorAll(".fade-up");
  if (!("IntersectionObserver" in window)) {
    targets.forEach((t) => t.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  targets.forEach((t) => io.observe(t));
}

/* ---------- データ読み込み・整形ユーティリティ ---------- */

async function loadJSON(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path} の読み込みに失敗しました`);
  return res.json();
}

const CATEGORY_BADGE = {
  "お知らせ": "badge--info",
  "大会案内": "badge--event",
  "大会結果": "badge--result",
  "テニス教室": "badge--school",
};

function badgeHTML(category) {
  const cls = CATEGORY_BADGE[category] || "badge--info";
  return `<span class="badge ${cls}">${category}</span>`;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`;
}

function escapeHTML(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

/* 本文中のURLをリンク化（データはCMS経由のプレーンテキスト想定） */
function linkify(str) {
  return escapeHTML(str).replace(
    /(https?:\/\/[^\s<]+)/g,
    '<a href="$1" target="_blank" rel="noopener">$1</a>'
  );
}

const STATUS_LABEL = {
  open: { label: "エントリー受付中", cls: "status-open" },
  upcoming: { label: "受付開始前", cls: "status-upcoming" },
  closed: { label: "受付終了", cls: "status-closed" },
  finished: { label: "終了", cls: "status-finished" },
};

function statusPill(status) {
  const s = STATUS_LABEL[status] || STATUS_LABEL.upcoming;
  return `<span class="status-pill ${s.cls}">${s.label}</span>`;
}

/* 大会カード（トップ・大会案内ページ共通） */
function renderEventCard(ev, i = 0) {
  const entry =
    ev.status === "open" && ev.entryUrl
      ? `<a class="btn btn--accent" href="${escapeHTML(ev.entryUrl)}" target="_blank" rel="noopener">エントリーする<span class="btn__arrow" aria-hidden="true">→</span></a>`
      : "";
  const doc = ev.docUrl
    ? `<a class="btn btn--outline" href="${escapeHTML(ev.docUrl)}" target="_blank" rel="noopener">大会要項</a>`
    : "";
  const deadline =
    ev.status === "open"
      ? `<div class="event-card__row"><dt>締切</dt><dd class="event-card__deadline">${escapeHTML(ev.deadline)}</dd></div>`
      : "";
  const note = ev.note
    ? `<div class="event-card__row"><dt>備考</dt><dd>${escapeHTML(ev.note)}</dd></div>`
    : "";
  const actions = entry || doc ? `<div class="event-card__actions">${entry}${doc}</div>` : "";
  return `
    <article class="event-card fade-up" data-delay="${i % 3}">
      <div class="event-card__head">
        <span class="event-card__status">${statusPill(ev.status)}</span>
        <h3 class="event-card__name">${escapeHTML(ev.name)}</h3>
      </div>
      <dl class="event-card__body">
        <div class="event-card__row"><dt>種目</dt><dd>${escapeHTML(ev.discipline)}</dd></div>
        <div class="event-card__row"><dt>開催日</dt><dd>${escapeHTML(ev.dateText)}</dd></div>
        <div class="event-card__row"><dt>会場</dt><dd>${escapeHTML(ev.venue)}</dd></div>
        ${deadline}
        ${note}
        ${actions}
      </dl>
    </article>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  setupFadeUp();
});
