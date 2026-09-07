(function () {
  const c = SITE_CONTENT;

  /* ============================================================
     THEME (dark / light)
     Preference saved in localStorage. Falls back to the
     system preference on first visit. The <head> of every
     page also runs a tiny inline copy of this read-only
     logic BEFORE this file loads, so there's no flash of
     the wrong theme while the page is loading.
  ============================================================ */

  const THEME_KEY = "site_theme_v1";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "লাইট মোডে যান" : "ডার্ক মোডে যান"
      );
    }
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (e) {
      return null;
    }
  }

  function initTheme() {
    let theme = getStoredTheme();

    if (!theme) {
      theme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    }

    applyTheme(theme);

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", function () {
        const current =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light";
        const next = current === "dark" ? "light" : "dark";

        applyTheme(next);

        try {
          localStorage.setItem(THEME_KEY, next);
        } catch (e) {
          // storage বন্ধ/ভর্তি থাকলে এড়িয়ে যাও
        }
      });
    }
  }

  initTheme();

  /* ============================================================
     MOBILE NAV TOGGLE
  ============================================================ */

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      const isOpen = mainNav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ============================================================
     SHARED TEXT
     Every element below is optional per-page — guarded with
     `if (el)` so this file can safely run on index.html,
     blog.html and article.html without errors.
  ============================================================ */

  const siteNameEl = document.getElementById("siteName");
  if (siteNameEl) siteNameEl.textContent = c.site.name;

  const footerTextEl = document.getElementById("footerText");
  if (footerTextEl) footerTextEl.textContent = c.site.footerText;

  const contactTextEl = document.getElementById("contactText");
  if (contactTextEl) contactTextEl.textContent = c.site.contactText;

  const contactEmailEl = document.getElementById("contactEmail");
  if (contactEmailEl) {
    contactEmailEl.href = "mailto:" + c.site.contactEmail;
    contactEmailEl.textContent = c.site.contactEmail;
  }

  const youtubeChannelLinkEl = document.getElementById("youtubeChannelLink");
  if (youtubeChannelLinkEl) youtubeChannelLinkEl.href = c.youtubeChannelUrl;

  const telegramHeroLinkEl = document.getElementById("telegramHeroLink");
  if (telegramHeroLinkEl) telegramHeroLinkEl.href = c.telegramUrl;
})();