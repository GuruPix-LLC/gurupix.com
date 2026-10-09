(function () {
  const root = document.querySelector("[data-password-reset]");
  if (!root) return;

  const apiBaseUrl = "https://gurupix-api-yjcnxuiira-uc.a.run.app";
  const token = new URLSearchParams(window.location.search).get("token");
  const form = root.querySelector("[data-reset-form]");
  const password = root.querySelector("#new-password");
  const confirmation = root.querySelector("#confirm-password");
  const submit = root.querySelector("[data-reset-submit]");
  const status = root.querySelector("[data-reset-status]");
  const error = root.querySelector("[data-reset-error]");
  const success = root.querySelector("[data-reset-success]");

  if (
    !(form instanceof HTMLFormElement) ||
    !(password instanceof HTMLInputElement) ||
    !(confirmation instanceof HTMLInputElement) ||
    !(submit instanceof HTMLButtonElement) ||
    !(error instanceof HTMLElement) ||
    !(success instanceof HTMLElement)
  ) {
    return;
  }

  function showError(message) {
    error.textContent = message;
    error.removeAttribute("hidden");
  }

  if (!token) {
    form.setAttribute("hidden", "");
    if (status) {
      status.textContent = "This reset link is incomplete. Request a new one from the GuruPix sign-in screen.";
    }
    return;
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    error.setAttribute("hidden", "");

    if (password.value.length < 8) {
      showError("Your new password must contain at least 8 characters.");
      password.focus();
      return;
    }
    if (password.value !== confirmation.value) {
      showError("The passwords do not match.");
      confirmation.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Updating...";
    try {
      const response = await fetch(`${apiBaseUrl}/api/v1/auth/password-reset/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token, new_password: password.value })
      });
      if (!response.ok) {
        const payload = await response.json().catch(function () { return {}; });
        throw new Error(
          typeof payload.detail === "string"
            ? payload.detail
            : "We could not update your password. Request a new reset email and try again."
        );
      }

      password.value = "";
      confirmation.value = "";
      form.setAttribute("hidden", "");
      success.removeAttribute("hidden");
      if (status) status.setAttribute("hidden", "");
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (caught) {
      showError(
        caught instanceof Error
          ? caught.message
          : "We could not update your password. Request a new reset email and try again."
      );
    } finally {
      submit.disabled = false;
      submit.textContent = "Update password";
    }
  });
})();
