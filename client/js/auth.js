/* Split authentication UI with validation and backend integration events. */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9._-]{3,24}$/;
const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function initAuth() {
  const dialog = document.getElementById("auth-dialog");
  const openers = [...document.querySelectorAll("[data-auth-open]")];

  if (!dialog || openers.length === 0) return;

  const closeButton = dialog.querySelector("[data-auth-close]");
  const tabs = [...dialog.querySelectorAll("[data-auth-tab]")];
  const panes = [...dialog.querySelectorAll("[data-auth-pane]")];
  const forms = [...dialog.querySelectorAll("[data-auth-form]")];
  let lastOpener = null;

  const getPane = (mode) =>
    panes.find((pane) => pane.dataset.authPane === mode);

  const setMode = (mode, focusField = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.authTab === mode;

      tab.classList.toggle("active", active);

      tab.setAttribute("aria-selected", String(active));

      tab.tabIndex = active ? 0 : -1;
    });

    panes.forEach((pane) => {
      pane.classList.toggle("active", pane.dataset.authPane === mode);
    });

    const pill = dialog.querySelector(".auth-tab-pill");

    const activeTab = tabs.find((tab) => tab.dataset.authTab === mode);

    if (pill && activeTab) {
      pill.style.width = `${activeTab.offsetWidth}px`;

      pill.style.transform = `translateX(${activeTab.offsetLeft}px)`;
    }

    /* ------------------------------ */
    if (focusField) {
      getPane(mode)?.querySelector("input")?.focus();
    }
  };

  const openDialog = (event) => {
    event?.preventDefault();
    lastOpener = event?.currentTarget ?? document.activeElement;

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    document.body.classList.add("auth-open");
    requestAnimationFrame(() => {
      setMode("login");
      getPane("login")?.querySelector("input")?.focus();
    });
  };

  const closeDialog = () => {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  };

  const findError = (form, name) =>
    form.querySelector(`[data-error-for="${name}"]`);

  const clearFieldError = (input) => {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    const error = findError(input.form, input.name);
    if (error) error.textContent = "";
  };

  const setFieldError = (input, message) => {
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    const error = findError(input.form, input.name);
    if (error) error.textContent = message;
  };

  const setStatus = (form, message, type = "") => {
    const status = form.querySelector("[data-form-status]");
    if (!status) return;
    status.textContent = message;
    status.className = `form-status${type ? ` ${type}` : ""}`;
  };

  const clearFormState = (form) => {
    form.querySelectorAll("input").forEach(clearFieldError);
    setStatus(form, "");
  };

  const validateLogin = (form) => {
    const email = form.elements.email;
    const password = form.elements.password;
    let valid = true;

    if (!email.value.trim()) {
      setFieldError(email, "Enter the email address linked to your account.");
      valid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      setFieldError(
        email,
        "Enter a valid email address, such as name@company.com.",
      );
      valid = false;
    }

    if (!password.value) {
      setFieldError(password, "Enter your password to continue.");
      valid = false;
    } else if (password.value.length < 8) {
      setFieldError(password, "Password must contain at least 8 characters.");
      valid = false;
    }

    return valid;
  };

  const validateSignup = (form) => {
    const username = form.elements.username;
    const fullName = form.elements.fullName;
    const email = form.elements.email;
    const password = form.elements.password;
    const confirmPassword = form.elements.confirmPassword;
    const terms = form.elements.termsAccepted;
    let valid = true;

    if (!username.value.trim()) {
      setFieldError(username, "Choose a username for your profile.");
      valid = false;
    } else if (!usernamePattern.test(username.value.trim())) {
      setFieldError(
        username,
        "Use 3–24 letters, numbers, underscores, or hyphens.",
      );
      valid = false;
    }

    if (!fullName.value.trim()) {
      setFieldError(fullName, "Enter your full name.");
      valid = false;
    } else if (fullName.value.trim().length < 2) {
      setFieldError(fullName, "Full name must contain at least 2 characters.");
      valid = false;
    }

    if (!email.value.trim()) {
      setFieldError(email, "Enter an email address for account verification.");
      valid = false;
    } else if (!emailPattern.test(email.value.trim())) {
      setFieldError(
        email,
        "Enter a valid email address, such as example@gmail.com.",
      );
      valid = false;
    }

    if (!password.value) {
      setFieldError(password, "Create a password for your account.");
      valid = false;
    } else if (!strongPasswordPattern.test(password.value)) {
      setFieldError(
        password,
        "Use 8+ characters with uppercase, lowercase, and a number.",
      );
      valid = false;
    }

    if (!confirmPassword.value) {
      setFieldError(confirmPassword, "Confirm your password.");
      valid = false;
    } else if (confirmPassword.value !== password.value) {
      setFieldError(confirmPassword, "Passwords do not match.");
      valid = false;
    }

    if (!terms.checked) {
      setFieldError(terms, "Accept the terms before creating an account.");
      valid = false;
    }

    return valid;
  };

  const buildPayload = (form, mode) => {
    const data = Object.fromEntries(new FormData(form).entries());

    if (mode === "signup") {
      delete data.confirmPassword;
      data.termsAccepted = form.elements.termsAccepted.checked;
    }

    if (mode === "login") {
      data.remember = form.elements.remember.checked;
    }

    return data;
  };

  openers.forEach((opener) => opener.addEventListener("click", openDialog));
  closeButton?.addEventListener("click", closeDialog);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.authTab, true));
  });

  panes.forEach((pane) => {
    pane.addEventListener("pointerdown", () => setMode(pane.dataset.authPane));
    pane.addEventListener("focusin", () => setMode(pane.dataset.authPane));
  });

  forms.forEach((form) => {
    form.addEventListener("input", (event) => {
      if (event.target instanceof HTMLInputElement)
        clearFieldError(event.target);
      setStatus(form, "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const mode = form.dataset.authForm;
      setMode(mode);
      clearFormState(form);

      const valid =
        mode === "login" ? validateLogin(form) : validateSignup(form);

      if (!valid) {
        setStatus(form, "Please correct the highlighted fields.", "error");
        form.querySelector(".invalid")?.focus();
        return;
      }

      const payload = buildPayload(form, mode);

      /*
       * Backend integration point:
       * listen for "auth:submit" and send detail.payload to the form action,
       * then replace this frontend status with the API response state.
       */
      dialog.dispatchEvent(
        new CustomEvent("auth:submit", {
          bubbles: true,
          detail: { mode, endpoint: form.action, payload, form },
        }),
      );

      setStatus(
        form,
        "Details validated. Backend authentication can now receive this request.",
        "success",
      );
    });
  });

  dialog.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.closest(".password-field")?.querySelector("input");
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      button.textContent = showing ? "Show" : "Hide";
      button.setAttribute(
        "aria-label",
        showing ? "Show password" : "Hide password",
      );
    });
  });

  dialog.querySelectorAll("[data-provider]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.mode;
      const provider = button.dataset.provider;
      const form = dialog.querySelector(`[data-auth-form="${mode}"]`);
      setMode(mode);

      /* Connect this event to the matching OAuth authorization route. */
      dialog.dispatchEvent(
        new CustomEvent("auth:provider", {
          bubbles: true,
          detail: { mode, provider },
        }),
      );

      if (form) {
        setStatus(
          form,
          `${provider[0].toUpperCase()}${provider.slice(1)} authentication is ready for OAuth wiring.`,
        );
      }
    });
  });

  dialog
    .querySelector("[data-auth-action='forgot']")
    ?.addEventListener("click", () => {
      const form = dialog.querySelector('[data-auth-form="login"]');
      const email = form?.elements.email?.value.trim() ?? "";

      /* Connect this event to the password-reset request endpoint. */
      dialog.dispatchEvent(
        new CustomEvent("auth:forgot", {
          bubbles: true,
          detail: { email },
        }),
      );

      if (form) {
        setStatus(
          form,
          email && emailPattern.test(email)
            ? "Password recovery is ready to send for this email."
            : "Enter a valid email first, then request password recovery.",
          email && emailPattern.test(email) ? "" : "error",
        );
      }
    });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("cancel", () => {
    document.body.classList.remove("auth-open");
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("auth-open");
    lastOpener?.focus?.();
  });

  window.addEventListener("resize", () => {
    const active = tabs.find((tab) => tab.classList.contains("active"));

    if (!active) return;

    const pill = dialog.querySelector(".auth-tab-pill");

    pill.style.width = `${active.offsetWidth}px`;

    pill.style.transform = `translateX(${active.offsetLeft}px)`;
  });
}
