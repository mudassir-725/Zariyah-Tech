/* Service content and detail dialog. Centralized for later dynamic rendering. */
const serviceData = {
  computerVision: {
    label: "Image & Video Data",
    title: "Computer Vision Data Annotation",
    description:
      "Precise image and video annotation services for training and validating visual AI models.",
    primaryTitle: "Annotation Types",
    primary: [
      "Bounding Box Annotation",
      "Polygon Annotation",
      "Semantic Segmentation",
      "Instance Segmentation",
      "Keypoint Annotation",
      "Landmark Annotation",
      "Object Tracking",
      "OCR & Document Annotation",
    ],
    secondaryTitle: "Industry Applications",
    secondary: [
      "Autonomous Vehicles",
      "Smart Surveillance",
      "Retail Analytics",
      "Manufacturing Quality Inspection",
      "Healthcare Imaging",
      "Agriculture Technology",
    ],
  },
  nlp: {
    label: "Text & Language Data",
    title: "Natural Language Processing Annotation",
    description:
      "Expertly labeled text data for language understanding, classification, moderation, and conversational AI.",
    primaryTitle: "Services",
    primary: [
      "Text Classification",
      "Sentiment Analysis",
      "Intent Detection",
      "Named Entity Recognition (NER)",
      "Topic Categorization",
      "Entity Linking",
      "Content Moderation",
      "Question & Answer Dataset Creation",
    ],
    secondaryTitle: "Supported Languages",
    secondary: [
      "English",
      "Hindi",
      "Telugu",
      "Tamil",
      "Urdu",
      "Kannada",
      "Malayalam",
      "Marathi",
      "Bengali",
      "Custom Language Requirements",
    ],
  },
  generativeAI: {
    label: "Human Model Evaluation",
    title: "Generative AI & LLM Evaluation Services",
    description:
      "Human-in-the-loop evaluation that helps improve response quality, safety, alignment, and instruction following.",
    primaryTitle: "Services",
    primary: [
      "Prompt Engineering Support",
      "Response Ranking",
      "Human Preference Evaluation",
      "Hallucination Detection",
      "Safety & Alignment Review",
      "Instruction Following Assessment",
      "Ground Truth Dataset Creation",
      "RLHF Support",
    ],
    secondaryTitle: "Ideal For",
    secondary: [
      "AI Startups",
      "Enterprise AI Teams",
      "Foundation Model Developers",
      "Conversational AI Platforms",
    ],
  },
  audioSpeech: {
    label: "Voice & Speech Data",
    title: "Audio & Speech Annotation",
    description:
      "Structured audio and speech datasets for transcription, voice recognition, conversational systems, and speech model validation.",
    primaryTitle: "Services",
    primary: [
      "Audio Transcription",
      "Speaker Identification",
      "Speech-to-Text Validation",
      "Intent Classification",
      "Accent & Dialect Annotation",
      "Voice Quality Assessment",
    ],
    secondaryTitle: "Language Coverage",
    secondary: [
      "Multiple Indian Languages",
      "International Languages",
      "Custom Language Requirements",
    ],
  },
  dataQuality: {
    label: "Dataset Reliability",
    title: "Data Validation & Quality Assurance",
    description:
      "Review, verification, error analysis, and refinement services designed to improve dataset consistency and reliability.",
    primaryTitle: "Validation Services",
    primary: [
      "Annotation Review",
      "Data Consistency Checks",
      "Gold Standard Verification",
      "Error Analysis",
      "Quality Audits",
      "Dataset Refinement",
    ],
    secondaryTitle: "Quality Focus",
    secondary: [
      "Defined Acceptance Criteria",
      "Multi-Level Review",
      "Guideline Alignment",
      "Dataset Refinement",
    ],
  },
};

export function initServices() {
  const dialog = document.getElementById("service-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const fields = {
    label: document.getElementById("service-dialog-label"),
    title: document.getElementById("service-dialog-title"),
    description: document.getElementById("service-dialog-description"),
    primaryTitle: document.getElementById("service-dialog-primary-title"),
    primary: document.getElementById("service-dialog-primary"),
    secondaryTitle: document.getElementById("service-dialog-secondary-title"),
    secondary: document.getElementById("service-dialog-secondary"),
  };

  const renderList = (target, values) => {
    if (!target) return;
    target.replaceChildren(
      ...values.map((value) => {
        const item = document.createElement("li");
        item.textContent = value;
        return item;
      }),
    );
  };

  const openDialog = (key) => {
    const service = serviceData[key];
    if (!service) return;

    if (fields.label) fields.label.textContent = service.label;
    if (fields.title) fields.title.textContent = service.title;
    if (fields.description) fields.description.textContent = service.description;
    if (fields.primaryTitle) fields.primaryTitle.textContent = service.primaryTitle;
    if (fields.secondaryTitle) fields.secondaryTitle.textContent = service.secondaryTitle;
    renderList(fields.primary, service.primary);
    renderList(fields.secondary, service.secondary);

    dialog.showModal();
    document.body.classList.add("dialog-open");
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".service-trigger");
    if (trigger) openDialog(trigger.dataset.service);
  });

  dialog.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
  dialog.querySelector(".dialog-contact")?.addEventListener("click", () => dialog.close());

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
  });
}
