(function () {
  const c = SITE_CONTENT;
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const titleEl = document.getElementById("articleTitle");
  const dateEl = document.getElementById("articleDate");
  const bodyEl = document.getElementById("articleBody");
  const pageTitleEl = document.getElementById("pageTitle");

  const article = (c.articles || []).find(function (a) {
    return a.slug === slug;
  });

  if (!article) {
    titleEl.textContent = "নিবন্ধ খুঁজে পাওয়া যায়নি";
    dateEl.textContent = "";
    bodyEl.innerHTML =
      '<p>দুঃখিত, এই লিংকে কোনো নিবন্ধ নেই। <a href="blog.html">ব্লগে ফিরে যান</a>।</p>';
    if (pageTitleEl) pageTitleEl.textContent = "নিবন্ধ খুঁজে পাওয়া যায়নি";
    return;
  }

  titleEl.textContent = article.title;
  dateEl.textContent = article.date || "";
  if (pageTitleEl) pageTitleEl.textContent = article.title + " | " + c.site.name;

  bodyEl.innerHTML = "";
  (article.content || []).forEach(function (block) {
    if (typeof block === "string") {
      const p = document.createElement("p");
      p.textContent = block;
      bodyEl.appendChild(p);
    } else if (block && block.heading) {
      const h2 = document.createElement("h2");
      h2.textContent = block.heading;
      bodyEl.appendChild(h2);
    }
  });
})();