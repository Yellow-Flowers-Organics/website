(function () {
  var key = "yfo-lang";
  var saved = localStorage.getItem(key);
  var lang = saved === "hi" ? "hi" : "en";

  function apply(next) {
    lang = next;
    document.documentElement.lang = lang;
    localStorage.setItem(key, lang);
    document.querySelectorAll(".lang button").forEach(function (button) {
      button.setAttribute("aria-pressed", button.dataset.lang === lang ? "true" : "false");
    });
  }

  document.querySelectorAll(".lang button").forEach(function (button) {
    button.addEventListener("click", function () {
      apply(button.dataset.lang);
    });
  });
  apply(lang);

  document.querySelectorAll(".filters button").forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.filter;
      document.querySelectorAll(".filters button").forEach(function (other) {
        other.setAttribute("aria-pressed", other === button ? "true" : "false");
      });
      document.querySelectorAll(".shop article").forEach(function (card) {
        var show = filter === "all" || card.dataset.cat === filter;
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  document.querySelectorAll("article.sheet").forEach(shapeSheet);

  var form = document.querySelector("form[data-mail]");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var subject = form.dataset.subject || "Yellow Flowers Organics";
      var body = Array.from(data.entries())
        .map(function (pair) { return pair[0] + ": " + pair[1]; })
        .join("\n");
      window.location.href = "mailto:yellow.flowers.organics@gmail.com?subject="
        + encodeURIComponent(subject)
        + "&body=" + encodeURIComponent(body);
    });
  }
  function kind(text) {
    var t = text.trim();
    if (/^ingredients?\b/i.test(t) && t.length < 48) return "head";
    if (/^(dose|frequency)\b/i.test(t)) return "dose";
    if (/\b(\d[\d.–-]*\s*(kg|g|ml|lit(?:er|re)s?|l)|capacity)\b/i.test(t) && t.length < 140) return "ing";
    if (/^(take|add|stir|cover|ferment|dilute|spray|apply|soak|mix|fill|pour|filter)\b/i.test(t)) return "step";
    if (/^(always|stirring|prepare|use within|do not|this is for)\b/i.test(t)) return "note";
    if (/^[^:]{3,48}:\s+\S/.test(t)) return "point";
    return "prose";
  }

  function shapeSheet(article) {
    var blocks = Array.prototype.slice.call(article.children);
    var h1 = blocks.filter(function (node) { return node.tagName === "H1"; })[0];
    var ps = blocks.filter(function (node) { return node.tagName === "P"; });
    if (!h1 || ps.length < 2) return;
    ps[0].className = "lede";
    var rest = ps.slice(1).map(function (p) {
      return { type: kind(p.textContent), text: p.textContent.trim() };
    });
    ps.slice(1).forEach(function (p) { p.remove(); });
    var i = 0;
    while (i < rest.length) {
      var type = rest[i].type;
      if (type === "head") {
        var h2 = document.createElement("h2");
        h2.textContent = rest[i].text;
        article.appendChild(h2);
        i += 1;
      } else if (type === "point" || type === "ing" || type === "step" || type === "note" || type === "dose") {
        var box = document.createElement(type === "dose" ? "div" : type === "step" ? "ol" : type === "point" ? "div" : "ul");
        box.className = type === "point" ? "points" : type === "ing" ? "mix" : type === "step" ? "steps" : type === "note" ? "notes" : "doses";
        while (i < rest.length && rest[i].type === type) {
          if (type === "point" || type === "dose") {
            var parts = rest[i].text.split(/:\s+/);
            var card = document.createElement("div");
            card.className = type === "dose" ? "dose" : "point";
            card.innerHTML = "<strong></strong><span></span>";
            card.querySelector("strong").textContent = parts[0];
            card.querySelector("span").textContent = parts.slice(1).join(": ");
            box.appendChild(card);
          } else {
            var li = document.createElement("li");
            li.textContent = rest[i].text;
            box.appendChild(li);
          }
          i += 1;
        }
        article.appendChild(box);
      } else {
        var p = document.createElement("p");
        p.textContent = rest[i].text;
        article.appendChild(p);
        i += 1;
      }
    }
  }
})();
