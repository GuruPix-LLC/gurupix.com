(function () {
  const root = document.querySelector("[data-account-link]");
  if (!root) return;

  const token = new URLSearchParams(window.location.search).get("token");
  const action = root.getAttribute("data-account-link");
  const button = root.querySelector("[data-open-app]");
  const status = root.querySelector("[data-link-status]");

  if (!token || !action || !(button instanceof HTMLAnchorElement)) {
    root.setAttribute("data-state", "invalid");
    if (status) {
      status.textContent = "This link is incomplete. Request a new one from the GuruPix app.";
    }
    if (button) button.setAttribute("hidden", "");
    return;
  }

  const appUrl = `gurupix://${action}?token=${encodeURIComponent(token)}`;
  button.href = appUrl;
  button.removeAttribute("hidden");
  if (status) {
    status.textContent = "GuruPix should open automatically. If it does not, use the button below.";
  }

  window.setTimeout(function () {
    window.location.assign(appUrl);
  }, 350);
})();
