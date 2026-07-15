import { MailConfig } from "./mail-config";

const {
  apiKey: RESEND_API_KEY,
  sender: CONTACT_FROM_EMAIL,
  receiver: CONTACT_TO_EMAIL,
  limits: { maxAttachments, maxAttachmentBytes, maxTotalAttachmentBytes },
} = MailConfig;

export const ErrorCode = Object.freeze({
  INVALID_API_KEY: "INVALID_API_KEY",

  INVALID_EMAIL: "INVALID_EMAIL",

  INVALID_SUBJECT: "INVALID_SUBJECT",

  INVALID_CONTEXT: "INVALID_CONTEXT",

  INVALID_ATTACHMENT: "INVALID_ATTACHMENT",

  ATTACHMENT_LIMIT: "ATTACHMENT_LIMIT",

  PROVIDER_ERROR: "PROVIDER_ERROR",

  INTERNAL_ERROR: "INTERNAL_ERROR",
});

const allowedExtensions = new Set([
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "png",
  "jpg",
  "jpeg",
  "webp",
  "zip",
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const sendJson = (response, status, body) => {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(body));
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { message: "Method not allowed." });
  }

  if (!RESEND_API_KEY.trim()) {
    return sendJson(response, 503, {
      message:
        "Email delivery is not configured yet. Set RESEND_API_KEY in Vercel.",
    });
  }

  const body = request.body || {};
  const {
    mode,
    userEmail,
    subject,
    services,
    context,
    attachments = [],
    website,
  } = body;

  if (website) return sendJson(response, 200, { ok: true });
  if (!emailPattern.test(String(userEmail || ""))) {
    return sendJson(response, 400, {
      message: "A valid reply email is required.",
    });
  }
  if (String(subject || "").trim().length < 3 || String(subject).length > 120) {
    return sendJson(response, 400, { message: "The subject is invalid." });
  }
  if (!Array.isArray(services) || services.length < 1 || services.length > 7) {
    return sendJson(response, 400, {
      message: "Select at least one valid service.",
    });
  }
  if (
    String(context || "").trim().length < 20 ||
    String(context).length > 3000
  ) {
    return sendJson(response, 400, {
      message: "The enquiry context is invalid.",
    });
  }
  if (
    !Array.isArray(attachments) ||
    attachments.length < 0 ||
    attachments.length > maxAttachments
  ) {
    return sendJson(response, 400, { message: "Too many attachments." });
  }

  let totalBytes = 0;
  const safeAttachments = [];
  for (const file of attachments) {
    const extension =
      String(file.name || "")
        .split(".")
        .pop()
        ?.toLowerCase() || "";
    const size = Number(file.size || 0);
    if (
      !allowedExtensions.has(extension) ||
      size <= 0 ||
      size > maxAttachmentBytes
    ) {
      return sendJson(response, 400, {
        message: `Invalid attachment: ${file.name || "unnamed file"}.`,
      });
    }
    totalBytes += size;
    if (totalBytes > maxTotalAttachmentBytes) {
      return sendJson(response, 400, {
        message: "Combined attachments are too large.",
      });
    }
    safeAttachments.push({
      filename: String(file.name),
      content: String(file.content || ""),
    });
  }

  const safeMode = mode === "project" ? "Service enquiry" : "General contact";
  const safeServices = services
    .map((service) => escapeHtml(service))
    .join(", ");
  const text = [
    `Type: ${safeMode}`,
    `Reply email: ${userEmail}`,
    `Services: ${services.join(", ")}`,
    "",
    String(context).trim(),
  ].join("\n");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONTACT_FROM_EMAIL,
      to: [CONTACT_TO_EMAIL],
      reply_to: userEmail,
      subject: `[ZariyahTech] ${String(subject).trim()}`,
      text,
      html: `
        <h2>${escapeHtml(safeMode)}</h2>
        <p><strong>Reply email:</strong> ${escapeHtml(userEmail)}</p>
        <p><strong>Services:</strong> ${safeServices}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(context)}</p>
      `,
      attachments: safeAttachments,
    }),
  });

  const result = await emailResponse.json().catch(() => ({}));
  if (!emailResponse.ok) {
    console.error("Contact email failed", result);
    return sendJson(response, emailResponse.status, {
      ok: false,
      code: result.name || "EMAIL_PROVIDER_ERROR",
      message: result.message || "The email provider rejected the request.",
    });
  }

  return sendJson(response, 200, { ok: true, id: result.id || null });
}
