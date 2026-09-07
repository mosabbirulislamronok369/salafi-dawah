(function () {
  const c = SITE_CONTENT;
  const grid = document.getElementById("articleGrid");

  const articles = (c.articles || []).slice().sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });

  if (!articles.length) {
    grid.innerHTML =
      '<p style="color: var(--text-muted);">এখনো কোনো নিবন্ধ যোগ করা হয়নি।</p>';
    return;
  }

  articles.forEach(function (article) {
    const card = document.createElement("a");
    card.className = "article-card";
    card.href = "article.html?slug=" + encodeURIComponent(article.slug);

    const date = document.createElement("p");
    date.className = "article-date";
    date.textContent = article.date || "";

    const h3 = document.createElement("h3");
    h3.textContent = article.title;

    const p = document.createElement("p");
    p.textContent = article.excerpt || "";

    card.appendChild(date);
    card.appendChild(h3);
    card.appendChild(p);
    grid.appendChild(card);
  });
})();