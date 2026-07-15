/**
 * ==========================================================
 * ZariyahTech Mail Configuration
 * Single source of truth for the contact backend.
 * ==========================================================
 */

export const MailConfig = Object.freeze({
  provider: "resend",

  apiKey: process.env.RESEND_API_KEY || "",

  sender: process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev",

  receiver: process.env.CONTACT_TO_EMAIL || "themazecoder21@gmail.com",

  limits: {
    maxAttachments: Number(process.env.MAX_ATTACHMENTS ?? 5),

    maxAttachmentBytes: Number(process.env.MAX_ATTACHMENT_BYTES ?? 3_500_000),

    maxTotalAttachmentBytes: Number(
      process.env.MAX_TOTAL_ATTACHMENT_BYTES ?? 8_500_000,
    ),
  },
});
