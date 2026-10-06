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
})();
