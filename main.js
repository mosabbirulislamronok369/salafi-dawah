(function () {
  const c = SITE_CONTENT;

  // ---- Mobile nav toggle ----
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

  // ---- Text content ----
  document.getElementById("siteName").textContent = c.site.name;
  document.title = c.site.name;
  document.getElementById("heroTitle").textContent = c.site.heroTitle;
  document.getElementById("heroSub").textContent = c.site.heroSubtitle;
  document.getElementById("footerText").textContent = c.site.footerText;
  document.getElementById("contactText").textContent = c.site.contactText;

  const contactEmailEl = document.getElementById("contactEmail");
  contactEmailEl.href = "mailto:" + c.site.contactEmail;
  contactEmailEl.textContent = c.site.contactEmail;

  // ---- External links ----
  document.getElementById("youtubeChannelLink").href = c.youtubeChannelUrl;
  document.getElementById("telegramHeroLink").href = c.telegramUrl;

  // ---- Daily Ayat & Hadith (rotates automatically by the day of the year) ----
  function dayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diffMs = now - start;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  function renderDailyItem(list, arabicId, translationId, refId) {
    if (!list || !list.length) return;
    const item = list[dayOfYear() % list.length];
    const arabicEl = document.getElementById(arabicId);
    const translationEl = document.getElementById(translationId);
    const refEl = document.getElementById(refId);
    if (arabicEl) arabicEl.textContent = item.arabic || "";
    if (translationEl) translationEl.textContent = item.translation || "";
    if (refEl) refEl.textContent = item.reference || "";
  }

  renderDailyItem(c.dailyAyat, "dailyAyahArabic", "dailyAyahTranslation", "dailyAyahRef");
  renderDailyItem(c.dailyHadith, "dailyHadithArabic", "dailyHadithTranslation", "dailyHadithRef");

  // ---- Videos ----
  const videoGrid = document.getElementById("videoGrid");

  function renderVideos(list) {
    videoGrid.innerHTML = "";
    list.forEach(function (v) {
      const card = document.createElement("article");
      card.className = "video-card";

      const link = document.createElement("a");
      link.className = "video-thumb";
      link.href = "https://www.youtube.com/watch?v=" + v.videoId;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", v.title + " — ইউটিউবে দেখুন");

      const img = document.createElement("img");
      img.src = "https://img.youtube.com/vi/" + v.videoId + "/hqdefault.jpg";
      img.alt = v.title;
      img.loading = "lazy";

      link.appendChild(img);

      const h3 = document.createElement("h3");
      h3.textContent = v.title;

      const p = document.createElement("p");
      p.textContent = v.description || "";

      card.appendChild(link);
      card.appendChild(h3);
      card.appendChild(p);
      videoGrid.appendChild(card);
    });
  }

  // ---- YouTube auto-update (optional) ----
  // যদি content.js এ youtube.apiKey বসানো থাকে, তাহলে চ্যানেলের সাম্প্রতিক
  // ভিডিওগুলো নিজে থেকে টেনে আনবে। key না থাকলে ম্যানুয়াল c.videos দেখাবে।
  const yt = c.youtube || {};
  const hasApiKey = yt.apiKey && yt.apiKey !== "YOUR_YOUTUBE_API_KEY";

  if (!hasApiKey) {
    renderVideos(c.videos);
  } else {
    renderVideos(c.videos); // প্রথমে fallback দেখিয়ে রাখি, API আসলে বদলে যাবে
    loadYoutubeVideos(yt).then(function (autoVideos) {
      if (autoVideos && autoVideos.length) {
        renderVideos(autoVideos);
      }
      // ব্যর্থ হলে বা খালি এলে fallback (c.videos) দেখানো অবস্থাতেই থেকে যাবে
    }).catch(function (err) {
      console.warn("YouTube অটো-আপডেট ব্যর্থ হয়েছে, ম্যানুয়াল লিস্ট দেখানো হচ্ছে।", err);
    });
  }

  async function loadYoutubeVideos(cfg) {
    const CACHE_KEY = "yt_videos_cache_v1";
    const CHANNEL_ID_KEY = "yt_channel_id_v1_" + cfg.channelHandle;
    const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // ৬ ঘণ্টা

    // ১) cache আছে ও তাজা কিনা দেখো (API quota বাঁচাতে)
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && cached.handle === cfg.channelHandle && (Date.now() - cached.time) < CACHE_TTL_MS) {
        return cached.videos;
      }
    } catch (e) { /* cache পড়তে সমস্যা হলে এড়িয়ে যাও */ }

    // ২) channelHandle থেকে channelId বের করো (ID খুব একটা বদলায় না, তাই আলাদাভাবে দীর্ঘসময় cache করি)
    let channelId = null;
    try {
      channelId = localStorage.getItem(CHANNEL_ID_KEY);
    } catch (e) { /* ignore */ }

    if (!channelId) {
      const chRes = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=" +
        encodeURIComponent(cfg.channelHandle) + "&key=" + encodeURIComponent(cfg.apiKey)
      );
      const chData = await chRes.json();
      if (chData.error) throw new Error(chData.error.message || "YouTube API error (channels)");
      if (!chData.items || !chData.items.length) throw new Error("চ্যানেল খুঁজে পাওয়া যায়নি: " + cfg.channelHandle);
      channelId = chData.items[0].id;
      try { localStorage.setItem(CHANNEL_ID_KEY, channelId); } catch (e) { /* ignore */ }
    }

    // ৩) চ্যানেলের "uploads" প্লেলিস্ট আইডি বের করো
    const contentRes = await fetch(
      "https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=" +
      encodeURIComponent(channelId) + "&key=" + encodeURIComponent(cfg.apiKey)
    );
    const contentData = await contentRes.json();
    if (contentData.error) throw new Error(contentData.error.message || "YouTube API error (contentDetails)");
    const uploadsPlaylistId = contentData.items[0].contentDetails.relatedPlaylists.uploads;

    // ৪) সর্বশেষ ভিডিওগুলো আনো
    const maxResults = cfg.maxVideos || 6;
    const plRes = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=" +
      maxResults + "&playlistId=" + encodeURIComponent(uploadsPlaylistId) +
      "&key=" + encodeURIComponent(cfg.apiKey)
    );
    const plData = await plRes.json();
    if (plData.error) throw new Error(plData.error.message || "YouTube API error (playlistItems)");

    const videos = (plData.items || [])
      .filter(function (item) { return item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId; })
      .map(function (item) {
        return {
          videoId: item.snippet.resourceId.videoId,
          title: item.snippet.title,
          description: item.snippet.description ? item.snippet.description.slice(0, 140) : ""
        };
      });

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ handle: cfg.channelHandle, time: Date.now(), videos: videos }));
    } catch (e) { /* storage ভর্তি বা বন্ধ থাকলে এড়িয়ে যাও */ }

    return videos;
  }

  // ---- PDFs ----
  const pdfList = document.getElementById("pdfList");
  c.pdfs.forEach(function (item) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener";

    const icon = document.createElement("span");
    icon.className = "pdf-icon";
    icon.textContent = "PDF";

    const title = document.createElement("span");
    title.textContent = item.title;

    a.appendChild(icon);
    a.appendChild(title);

    if (item.size) {
      const size = document.createElement("span");
      size.className = "pdf-size";
      size.textContent = item.size;
      a.appendChild(size);
    }

    li.appendChild(a);
    pdfList.appendChild(li);
  });

  // ---- Community links (Facebook page/group, Telegram, extra channels, etc.) ----
  const communityGrid = document.getElementById("communityGrid");
  (c.communityLinks || []).forEach(function (item) {
    const card = document.createElement("div");
    card.className = "community-card";

    const h3 = document.createElement("h3");
    h3.textContent = item.title;

    const p = document.createElement("p");
    p.textContent = item.description || "";

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "btn btn-primary";
    link.textContent = item.buttonText || "ভিজিট করুন";

    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(link);
    communityGrid.appendChild(card);
  });
})();