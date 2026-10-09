(function () {
  const root = document.querySelector("[data-email-verification]");
  if (!root) return;

  const apiBaseUrl = "https://gurupix-api-yjcnxuiira-uc.a.run.app";
  const token = new URLSearchParams(window.location.search).get("token");
  const title = root.querySelector("[data-verification-title]");
  const status = root.querySelector("[data-verification-status]");
  const success = root.querySelector("[data-verification-success]");
  const error = root.querySelector("[data-verification-error]");
  const errorMessage = root.querySelector("[data-verification-error-message]");

  function showError(message) {
    if (title) title.textContent = "Verification unsuccessful";
    if (status) status.setAttribute("hidden", "");
    if (errorMessage) errorMessage.textContent = message;
    if (error) error.removeAttribute("hidden");
  }

  if (!token) {
    showError("This link is incomplete. Request a new verification email from GuruPix.");
    return;
  }

  fetch(`${apiBaseUrl}/api/v1/auth/email-verification/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: token })
  })
    .then(async function (response) {
      if (!response.ok) {
        const payload = await response.json().catch(function () { return {}; });
        throw new Error(
          typeof payload.detail === "string"
            ? payload.detail
            : "We could not verify your email. Request a new link and try again."
        );
      }
      if (title) title.textContent = "Your email is verified";
      if (status) status.setAttribute("hidden", "");
      if (success) success.removeAttribute("hidden");
      window.history.replaceState({}, document.title, window.location.pathname);
    })
    .catch(function (caught) {
      showError(
        caught instanceof Error
          ? caught.message
          : "We could not verify your email. Request a new link and try again."
      );
    });
})();
