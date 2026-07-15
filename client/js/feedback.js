/* Reusable alert-dialog controller for confirmation and operation feedback. */
let dialog;
let elements;
let resolver = null;
let primaryAction = null;
let secondaryAction = null;

const icons = {
  confirm: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"></path><path d="M12 8v5M12 16h.01"></path></svg>',
  pending: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 12a9 9 0 1 1-2.64-6.36"></path></svg>',
  success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M20 6 9 17l-5-5"></path></svg>',
  error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m7 7 10 10M17 7 7 17"></path><circle cx="12" cy="12" r="10"></circle></svg>',
};

const ensureOpen = () => {
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("feedback-open");
};

const renderSummary = (items = []) => {
  elements.summary.replaceChildren();
  items.forEach(({ label, value }) => {
    const term = document.createElement("dt");
    const detail = document.createElement("dd");
    term.textContent = label;
    detail.textContent = value;
    elements.summary.append(term, detail);
  });
};

const configure = ({
  tone = "confirm",
  badge = "Confirmation",
  title,
  message = "",
  summary = [],
  primaryLabel = "Continue",
  secondaryLabel = "Cancel",
  showSecondary = true,
  busy = false,
}) => {
  dialog.dataset.tone = tone;
  elements.icon.innerHTML = icons[tone] ?? icons.confirm;
  elements.badge.textContent = badge;
  elements.title.textContent = title;
  elements.message.textContent = message;
  renderSummary(summary);
  elements.primary.textContent = primaryLabel;
  elements.secondary.textContent = secondaryLabel;
  elements.secondary.hidden = !showSecondary;
  elements.primary.disabled = busy;
  elements.secondary.disabled = busy;
  ensureOpen();
};

export function initFeedback() {
  dialog = document.getElementById("feedback-dialog");
  if (!dialog) return;

  elements = {
    icon: dialog.querySelector("[data-feedback-icon]"),
    badge: dialog.querySelector("[data-feedback-badge]"),
    title: dialog.querySelector("[data-feedback-title]"),
    message: dialog.querySelector("[data-feedback-message]"),
    summary: dialog.querySelector("[data-feedback-summary]"),
    primary: dialog.querySelector("[data-feedback-primary]"),
    secondary: dialog.querySelector("[data-feedback-secondary]"),
  };

  elements.primary.addEventListener("click", () => {
    if (primaryAction) {
      const action = primaryAction;
      primaryAction = null;
      action();
      return;
    }
    dialog.close("primary");
  });

  elements.secondary.addEventListener("click", () => {
    if (secondaryAction) {
      const action = secondaryAction;
      secondaryAction = null;
      action();
      return;
    }
    dialog.close("secondary");
  });

  dialog.addEventListener("cancel", (event) => {
    if (dialog.dataset.tone === "pending") event.preventDefault();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("feedback-open");
    if (resolver) {
      resolver(dialog.returnValue === "primary");
      resolver = null;
    }
    primaryAction = null;
    secondaryAction = null;
  });
}

export function confirmFeedback(options) {
  configure({
    tone: "confirm",
    badge: options.badge ?? "Confirmation",
    title: options.title,
    message: options.message,
    summary: options.summary,
    primaryLabel: options.primaryLabel ?? "Confirm & Send",
    secondaryLabel: options.secondaryLabel ?? "Cancel",
    showSecondary: true,
  });

  return new Promise((resolve) => {
    resolver = resolve;
    primaryAction = () => dialog.close("primary");
    secondaryAction = () => dialog.close("secondary");
  });
}

export function showPendingFeedback({ title, message }) {
  configure({
    tone: "pending",
    badge: "Sending",
    title,
    message,
    primaryLabel: "Sending…",
    showSecondary: false,
    busy: true,
  });
}

export function showResultFeedback({
  tone,
  badge,
  title,
  message,
  primaryLabel = "Done",
  secondaryLabel,
  onPrimary,
  onSecondary,
}) {
  configure({
    tone,
    badge,
    title,
    message,
    primaryLabel,
    secondaryLabel: secondaryLabel ?? "Close",
    showSecondary: Boolean(secondaryLabel),
  });

  primaryAction = () => {
    dialog.close("primary");
    onPrimary?.();
  };

  secondaryAction = secondaryLabel
    ? () => {
        dialog.close("secondary");
        onSecondary?.();
      }
    : null;
}
