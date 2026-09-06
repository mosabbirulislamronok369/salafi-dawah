(function () {
  const c = SITE_CONTENT;

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
  document.getElementById("telegramLink").href = c.telegramUrl;
  document.getElementById("telegramHeroLink").href = c.telegramUrl;

  // ---- Videos ----
  const videoGrid = document.getElementById("videoGrid");
  c.videos.forEach(function (v) {
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

  // ---- Facebook Page Plugin (loaded only if a real URL is set) ----
  const fbContainer = document.getElementById("fbPageContainer");
  if (c.facebookPageUrl && c.facebookPageUrl.indexOf("your-page") === -1) {
    const fbRoot = document.createElement("div");
    fbRoot.id = "fb-root";
    document.body.appendChild(fbRoot);

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/bn_BD/sdk.js#xfbml=1&version=v19.0";
    document.body.appendChild(script);

    const fbDiv = document.createElement("div");
    fbDiv.className = "fb-page";
    fbDiv.setAttribute("data-href", c.facebookPageUrl);
    fbDiv.setAttribute("data-tabs", "timeline");
    fbDiv.setAttribute("data-width", "");
    fbDiv.setAttribute("data-height", "300");
    fbDiv.setAttribute("data-small-header", "true");
    fbDiv.setAttribute("data-adapt-container-width", "true");
    fbContainer.appendChild(fbDiv);
  } else {
    const fallback = document.createElement("a");
    fallback.href = c.facebookPageUrl;
    fallback.target = "_blank";
    fallback.rel = "noopener";
    fallback.className = "btn btn-primary";
    fallback.textContent = "পেইজ ভিজিট করুন";
    fbContainer.appendChild(fallback);
  }
})();