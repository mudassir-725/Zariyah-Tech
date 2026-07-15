import { siteConfig } from "./site-config.js";
import {
  confirmFeedback,
  showPendingFeedback,
  showResultFeedback,
} from "./feedback.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedExtensions = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "csv", "txt",
  "png", "jpg", "jpeg", "webp", "zip",
]);

const modes = {
  project: {
    badge: "Project/Service Enquiry",
    title: "Discuss Your Project",
    intro: "Tell us what you are building, the outcome you need, and where our team can help.",
    tags: ["Project planning", "Service matching", "Delivery discussion"],
    subjectPlaceholder: "Project requirement or collaboration",
    confirmTitle: "Send this project request?",
    pendingTitle: "Sending your project request…",
    successTitle: "Request sent",
    successMessage: "We received your project enquiry and will review the supplied details.",
  },
  mail: {
    badge: "General Contact",
    title: "Write to ZariyahTech",
    intro: "Share your question, requirement, partnership idea, or general enquiry.",
    tags: ["General enquiry", "Partnerships", "Human response"],
    subjectPlaceholder: "How can we help?",
    confirmTitle: "Send this mail?",
    pendingTitle: "Sending your mail…",
    successTitle: "Mail sent",
    successMessage: "Your message was delivered to ZariyahTech.",
  },
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
};

const fileToPayload = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.onload = () => {
      const base64 = String(reader.result).split(",")[1] ?? "";
      resolve({ name: file.name, type: file.type, size: file.size, content: base64 });
    };
    reader.readAsDataURL(file);
  });

export function initContact() {
  const dialog = document.getElementById("contact-dialog");
  const form = document.getElementById("contact-form");
  const openers = [...document.querySelectorAll("[data-contact-open]")];
  if (!dialog || !form || openers.length === 0) return;

  const fields = {
    mode: form.elements.mode,
    email: form.elements.userEmail,
    subject: form.elements.subject,
    context: form.elements.context,
    trap: form.elements.website,
  };
  const closeButton = dialog.querySelector("[data-contact-close]");
  const clearButton = dialog.querySelector("[data-contact-clear]");
  const badge = dialog.querySelector("[data-contact-badge]");
  const title = dialog.querySelector("[data-contact-title]");
  const intro = dialog.querySelector("[data-contact-intro]");
  const tags = dialog.querySelector("[data-contact-tags]");
  const serviceToggle = dialog.querySelector("[data-service-select-toggle]");
  const serviceMenu = dialog.querySelector("[data-service-select-menu]");
  const serviceText = dialog.querySelector("[data-service-select-text]");
  const serviceDone = dialog.querySelector("[data-service-select-done]");
  const selectedServices = dialog.querySelector("[data-selected-services]");
  const serviceInputs = [...form.querySelectorAll('input[name="services"]')];
  const fileButton = dialog.querySelector("[data-file-upload]");
  const fileInput = dialog.querySelector("[data-file-input]");
  const fileCount = dialog.querySelector("[data-file-count]");
  const attachmentList = dialog.querySelector("[data-attachment-list]");
  const characterCount = dialog.querySelector("[data-character-count]");
  let files = [];
  let currentMode = "mail";
  let lastOpener = null;

  const getError = (name) => form.querySelector(`[data-contact-error="${name}"]`);

  const clearError = (name, control) => {
    getError(name).textContent = "";
    control?.classList.remove("invalid");
    control?.removeAttribute("aria-invalid");
  };

  const setError = (name, control, message) => {
    getError(name).textContent = message;
    control?.classList.add("invalid");
    control?.setAttribute("aria-invalid", "true");
  };

  const selectedServiceValues = () =>
    serviceInputs.filter((input) => input.checked).map((input) => input.value);

  const updateServiceSelection = () => {
    const selected = selectedServiceValues();
    serviceText.textContent = selected.length
      ? `${selected.length} service${selected.length === 1 ? "" : "s"} selected`
      : "Select one or more services";
    selectedServices.replaceChildren();

    selected.forEach((value) => {
      const chip = document.createElement("span");
      chip.className = "selected-service";
      chip.append(value);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${value}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        const input = serviceInputs.find((item) => item.value === value);
        if (input) input.checked = false;
        updateServiceSelection();
      });
      chip.append(remove);
      selectedServices.append(chip);
    });

    if (selected.length) clearError("services", serviceToggle);
  };

  const renderFiles = () => {
    attachmentList.replaceChildren();
    fileCount.textContent = String(files.length);
    fileCount.hidden = files.length === 0;

    files.forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "attachment-item";
      item.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="m20.5 11.5-8.9 8.9a6 6 0 0 1-8.5-8.5l9.6-9.6a4 4 0 0 1 5.7 5.7l-9.7 9.7a2 2 0 0 1-2.8-2.8l8.9-8.9"></path></svg>';
      const name = document.createElement("span");
      name.textContent = `${file.name} · ${formatBytes(file.size)}`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.setAttribute("aria-label", `Remove ${file.name}`);
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        files.splice(index, 1);
        renderFiles();
      });
      item.append(name, remove);
      attachmentList.append(item);
    });
  };

  const clearForm = () => {
    form.reset();
    files = [];
    fileInput.value = "";
    characterCount.textContent = "0";
    form.querySelectorAll(".contact-error").forEach((node) => { node.textContent = ""; });
    form.querySelectorAll(".invalid").forEach((node) => node.classList.remove("invalid"));
    updateServiceSelection();
    renderFiles();
    fields.mode.value = currentMode;
  };

  const applyMode = (mode) => {
    currentMode = modes[mode] ? mode : "mail";
    const copy = modes[currentMode];
    fields.mode.value = currentMode;
    badge.textContent = copy.badge;
    title.textContent = copy.title;
    intro.textContent = copy.intro;
    fields.subject.placeholder = copy.subjectPlaceholder;
    tags.replaceChildren(...copy.tags.map((value) => {
      const chip = document.createElement("span");
      chip.textContent = value;
      return chip;
    }));
  };

  const openDialog = (event) => {
    event.preventDefault();
    lastOpener = event.currentTarget;
    applyMode(event.currentTarget.dataset.contactMode);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("contact-open");
    document.dispatchEvent(new CustomEvent("contact:open"));
    requestAnimationFrame(() => fields.email.focus());
  };

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  const validateFiles = (incoming) => {
    const next = [...files];
    for (const file of incoming) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!allowedExtensions.has(extension)) {
        throw new Error(`${file.name} is not an accepted file type.`);
      }
      if (file.size > siteConfig.maxFileBytes) {
        throw new Error(`${file.name} exceeds ${formatBytes(siteConfig.maxFileBytes)}.`);
      }
      if (next.length >= siteConfig.maxFiles) {
        throw new Error(`Attach no more than ${siteConfig.maxFiles} files.`);
      }
      next.push(file);
    }
    const total = next.reduce((sum, file) => sum + file.size, 0);
    if (total > siteConfig.maxTotalFileBytes) {
      throw new Error(`Combined files exceed ${formatBytes(siteConfig.maxTotalFileBytes)}.`);
    }
    return next;
  };

  const validate = () => {
    let valid = true;
    const services = selectedServiceValues();

    clearError("userEmail", fields.email);
    clearError("subject", fields.subject);
    clearError("services", serviceToggle);
    clearError("context", dialog.querySelector(".contact-composer"));

    if (!fields.email.value.trim()) {
      setError("userEmail", fields.email, "Enter the email address we should reply to.");
      valid = false;
    } else if (!emailPattern.test(fields.email.value.trim())) {
      setError("userEmail", fields.email, "Enter a valid email address.");
      valid = false;
    }

    if (fields.subject.value.trim().length < 3) {
      setError("subject", fields.subject, "Add a clear subject with at least 3 characters.");
      valid = false;
    }

    if (services.length === 0) {
      setError("services", serviceToggle, "Select at least one relevant service.");
      valid = false;
    }

    if (fields.context.value.trim().length < 20) {
      setError("context", dialog.querySelector(".contact-composer"), "Provide at least 20 characters of useful context.");
      valid = false;
    }

    if (!valid) form.querySelector("[aria-invalid='true']")?.focus();
    return valid;
  };

  const buildMailto = (payload) => {
    const body = [
      `From: ${payload.userEmail}`,
      `Mode: ${payload.mode}`,
      `Services: ${payload.services.join(", ")}`,
      "",
      payload.context,
      "",
      payload.attachments.length
        ? `Attachments selected but not included in mail-app fallback: ${payload.attachments.map((file) => file.name).join(", ")}`
        : "",
    ].filter(Boolean).join("\n");
    return `mailto:${siteConfig.contactMail}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
  };

  const send = async (payload) => {
    const response = await fetch(siteConfig.contactEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "The contact request could not be sent.");
    return result;
  };

  openers.forEach((opener) => opener.addEventListener("click", openDialog));
  closeButton.addEventListener("click", closeDialog);
  clearButton.addEventListener("click", clearForm);

  serviceToggle.addEventListener("click", () => {
    const open = serviceMenu.hidden;
    serviceMenu.hidden = !open;
    serviceToggle.setAttribute("aria-expanded", String(open));
  });

  serviceInputs.forEach((input) => input.addEventListener("change", updateServiceSelection));
  serviceDone?.addEventListener("click", () => {
    serviceMenu.hidden = true;
    serviceToggle.setAttribute("aria-expanded", "false");
    serviceToggle.focus();
  });

  document.addEventListener("click", (event) => {
    if (!dialog.open || serviceMenu.hidden) return;
    if (serviceMenu.contains(event.target) || serviceToggle.contains(event.target)) return;
    serviceMenu.hidden = true;
    serviceToggle.setAttribute("aria-expanded", "false");
  });

  fileButton.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    try {
      files = validateFiles([...fileInput.files]);
      renderFiles();
      getError("context").textContent = "";
    } catch (error) {
      getError("context").textContent = error.message;
    } finally {
      fileInput.value = "";
    }
  });

  fields.context.addEventListener("input", () => {
    characterCount.textContent = String(fields.context.value.length);
    clearError("context", dialog.querySelector(".contact-composer"));
  });
  fields.email.addEventListener("input", () => clearError("userEmail", fields.email));
  fields.subject.addEventListener("input", () => clearError("subject", fields.subject));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (fields.trap.value || !validate()) return;

    const services = selectedServiceValues();
    const summary = [
      { label: "Type", value: currentMode === "project" ? "Project request" : "General mail" },
      { label: "Email", value: fields.email.value.trim() },
      { label: "Subject", value: fields.subject.value.trim() },
      { label: "Services", value: services.join(", ") },
      { label: "Files", value: files.length ? `${files.length} attached` : "No attachments" },
    ];

    const confirmed = await confirmFeedback({
      title: modes[currentMode].confirmTitle,
      message: "Review the details below before sending them to ZariyahTech.",
      summary,
    });
    if (!confirmed) return;

    showPendingFeedback({
      title: modes[currentMode].pendingTitle,
      message: "Please keep this window open while the request is delivered.",
    });

    try {
      const attachments = await Promise.all(files.map(fileToPayload));
      const payload = {
        mode: currentMode,
        userEmail: fields.email.value.trim(),
        subject: fields.subject.value.trim(),
        services,
        context: fields.context.value.trim(),
        attachments,
        website: fields.trap.value,
      };
      await send(payload);
      closeDialog();
      clearForm();
      showResultFeedback({
        tone: "success",
        badge: currentMode === "project" ? "Request sent" : "Mail sent",
        title: modes[currentMode].successTitle,
        message: `${modes[currentMode].successMessage} we will reach back soon!`,
        primaryLabel: "Done",
      });
    } catch (error) {
      const payload = {
        mode: currentMode,
        userEmail: fields.email.value.trim(),
        subject: fields.subject.value.trim(),
        services,
        context: fields.context.value.trim(),
        attachments: files.map((file) => ({ name: file.name })),
      };
      showResultFeedback({
        tone: "error",
        badge: "Not sent",
        title: "Message not sent",
        message: `${error.message} Your form data has been preserved.`,
        primaryLabel: "Open email app",
        secondaryLabel: "Return to form",
        onPrimary: () => { window.location.href = buildMailto(payload); },
      });
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("contact-open");
    document.dispatchEvent(new CustomEvent("contact:close"));
    serviceMenu.hidden = true;
    serviceToggle.setAttribute("aria-expanded", "false");
    lastOpener?.focus?.();
  });

  updateServiceSelection();
  renderFiles();
}
