/* =========================================================
   Service content and modern detail-dialog rendering
========================================================= */

const serviceData = {
  dataAnnotation: {
    label: "Multimodal Training Data",
    title: "Data Annotation",
    description:
      "Accurate, scalable, and secure annotation services covering Computer Vision, Natural Language Processing, audio, speech, OCR, documents, and multimodal AI datasets.",
    meta: [
      "Image",
      "Video",
      "Text",
      "Audio",
      "OCR",
      "Multilingual",
    ],
    primaryTitle: "Annotation Capabilities",
    primary: [
      "Bounding Box and Polygon Annotation",
      "Semantic and Instance Segmentation",
      "Keypoint and Landmark Annotation",
      "Object Tracking and Video Annotation",
      "OCR and Document Annotation",
      "Text Classification and Sentiment Analysis",
      "Intent Detection and Named Entity Recognition",
      "Audio Transcription and Speaker Identification",
      "Speech-to-Text Validation",
      "Accent and Dialect Annotation",
    ],
    secondaryTitle: "Applications & Outcomes",
    secondary: [
      "Autonomous Vehicles",
      "Smart Surveillance",
      "Retail Analytics",
      "Manufacturing Quality Inspection",
      "Healthcare Imaging",
      "Agriculture Technology",
      "Conversational AI",
      "Search and Recommendation Systems",
      "Voice Assistants",
      "Multilingual Language Models",
    ],
  },

  intelligenceAI: {
    label: "Generative AI & Human Evaluation",
    title: "Intelligence with AI",
    description:
      "Human-in-the-loop AI evaluation and intelligence services that strengthen model relevance, reasoning, safety, alignment, and instruction-following performance.",
    meta: [
      "Generative AI",
      "LLM Evaluation",
      "RLHF",
      "Safety",
      "Alignment",
    ],
    primaryTitle: "AI Capabilities",
    primary: [
      "Prompt Engineering Support",
      "Response Ranking",
      "Human Preference Evaluation",
      "Hallucination Detection",
      "Safety and Alignment Review",
      "Instruction-Following Assessment",
      "Ground-Truth Dataset Creation",
      "RLHF Support",
      "Conversational AI Evaluation",
      "AI-Assisted Workflow Design",
    ],
    secondaryTitle: "Ideal For",
    secondary: [
      "AI Startups",
      "Enterprise AI Teams",
      "Foundation Model Developers",
      "Conversational AI Platforms",
      "Research Institutions",
      "Customer-Support Automation",
      "Knowledge Assistants",
      "Domain-Specific Language Models",
    ],
  },

  productDevelopment: {
    label: "Engineering & Innovation",
    title: "Product Development",
    description:
      "Strategy, design, engineering, integration, and deployment services for modern websites, platforms, AI applications, automation systems, and scalable digital products.",
    meta: [
      "Web",
      "Applications",
      "APIs",
      "Cloud",
      "Automation",
    ],
    primaryTitle: "Development Capabilities",
    primary: [
      "Product Discovery and Technical Planning",
      "MVP and Prototype Development",
      "Responsive Website Development",
      "Web Application Engineering",
      "API Design and Integration",
      "AI and Machine Learning Integration",
      "Cloud-Ready Architecture",
      "Workflow and Process Automation",
      "Performance Optimization",
      "Deployment and Release Support",
    ],
    secondaryTitle: "Business Outcomes",
    secondary: [
      "Faster Product Validation",
      "Reduced Manual Operations",
      "Scalable Application Foundations",
      "Connected Data and Services",
      "Improved Digital Delivery",
      "Production-Ready Platforms",
      "Maintainable Codebases",
      "Future Dashboard and Workspace Readiness",
    ],
  },

  uiuxExcellence: {
    label: "Experience Design",
    title: "UI/UX Excellence",
    description:
      "Research-led user experiences and modern interfaces designed around accessibility, clarity, usability, brand consistency, and meaningful interaction.",
    meta: [
      "Research",
      "UX",
      "UI",
      "Prototypes",
      "Design Systems",
    ],
    primaryTitle: "Design Capabilities",
    primary: [
      "User and Stakeholder Research",
      "Information Architecture",
      "User Journeys and Experience Flows",
      "Wireframing",
      "Interactive Prototyping",
      "Responsive Interface Design",
      "Accessibility-Aware Design",
      "Design-System Development",
      "Usability Evaluation",
      "Developer-Ready Design Handoff",
    ],
    secondaryTitle: "Experience Outcomes",
    secondary: [
      "Clearer Product Navigation",
      "Reduced User Friction",
      "Consistent Visual Language",
      "Higher Task Completion",
      "Responsive Cross-Device Experiences",
      "Accessible Interaction Patterns",
      "Faster Frontend Implementation",
      "Reusable Product Components",
    ],
  },

  qualityCommitment: {
    label: "Validation & Reliability",
    title: "Commitment to Quality",
    description:
      "Structured quality assurance, annotation validation, software testing, and refinement processes that improve the reliability of data, products, and AI systems.",
    meta: [
      "QA",
      "Validation",
      "Audits",
      "Testing",
      "Refinement",
    ],
    primaryTitle: "Quality Capabilities",
    primary: [
      "Annotation Review",
      "Data Consistency Checks",
      "Gold-Standard Verification",
      "Error Analysis",
      "Quality Audits",
      "Dataset Refinement",
      "Functional Product Testing",
      "Responsive and Cross-Browser Testing",
      "Workflow Validation",
      "Acceptance-Criteria Review",
    ],
    secondaryTitle: "Quality Outcomes",
    secondary: [
      "More Consistent Training Data",
      "Reduced Annotation Errors",
      "Reliable Product Releases",
      "Improved Model Inputs",
      "Documented Quality Findings",
      "Refined Project Guidelines",
      "Higher Delivery Confidence",
      "Secure and Confidential Data Handling",
    ],
  },

  endToEndSupport: {
    label: "Delivery & Partnership",
    title: "End-to-End Support",
    description:
      "Continuous project support from initial discovery and onboarding through execution, delivery, maintenance, scaling, optimization, and long-term collaboration.",
    meta: [
      "Discovery",
      "Onboarding",
      "Delivery",
      "Maintenance",
      "Scale",
    ],
    primaryTitle: "Support Capabilities",
    primary: [
      "Project Discovery and Requirement Analysis",
      "Data and Workflow Assessment",
      "Guideline Preparation",
      "Pilot and Calibration Support",
      "Dedicated Delivery Coordination",
      "Progress and Quality Reporting",
      "Maintenance and Issue Resolution",
      "Workflow Optimization",
      "Scalable Workforce Planning",
      "Long-Term Operational Support",
    ],
    secondaryTitle: "Engagement Benefits",
    secondary: [
      "Single Delivery Partnership",
      "Clear Project Communication",
      "Faster Project Onboarding",
      "Flexible Capacity",
      "Consistent Delivery Standards",
      "Reduced Coordination Overhead",
      "Continued Product Improvement",
      "Support Across Project Phases",
    ],
  },

  dataInsights: {
    label: "Analytics & Intelligence",
    title: "Data-Driven Insights",
    description:
      "Analytics, reporting, and decision-support services that transform project, product, quality, and operational data into measurable and actionable intelligence.",
    meta: [
      "Analytics",
      "Dashboards",
      "Reporting",
      "Performance",
      "Optimization",
    ],
    primaryTitle: "Insight Capabilities",
    primary: [
      "Operational Performance Dashboards",
      "Dataset Quality Reporting",
      "Annotation Productivity Analysis",
      "Error and Trend Analysis",
      "Model-Evaluation Summaries",
      "Project Progress Reporting",
      "User and Product Analytics",
      "KPI Definition and Monitoring",
      "Workflow Bottleneck Identification",
      "Decision-Support Reporting",
    ],
    secondaryTitle: "Business Outcomes",
    secondary: [
      "Better Operational Visibility",
      "Faster Data-Informed Decisions",
      "Improved Quality Planning",
      "Optimized Team Performance",
      "Clearer Project Reporting",
      "Reduced Workflow Bottlenecks",
      "Measurable Product Improvements",
      "Evidence-Based Scaling Decisions",
    ],
  },
};

/* =========================================================
   Dialog initializer
========================================================= */

export function initServices() {
  const dialog = document.getElementById("service-dialog");

  if (!dialog || typeof dialog.showModal !== "function") {
    return;
  }

  const fields = {
    label: document.getElementById("service-dialog-label"),
    title: document.getElementById("service-dialog-title"),
    description: document.getElementById(
      "service-dialog-description",
    ),
    meta: document.getElementById("service-dialog-meta"),
    primaryTitle: document.getElementById(
      "service-dialog-primary-title",
    ),
    primary: document.getElementById(
      "service-dialog-primary",
    ),
    secondaryTitle: document.getElementById(
      "service-dialog-secondary-title",
    ),
    secondary: document.getElementById(
      "service-dialog-secondary",
    ),
  };

  const closeButton = dialog.querySelector(".dialog-close");
  const contactButton = dialog.querySelector(".dialog-contact");

  let activeTrigger = null;

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

  const renderMeta = (values) => {
    if (!fields.meta) return;

    fields.meta.replaceChildren(
      ...values.map((value) => {
        const chip = document.createElement("span");
        chip.textContent = value;
        return chip;
      }),
    );
  };

  const renderService = (service) => {
    if (fields.label) {
      fields.label.textContent = service.label;
    }

    if (fields.title) {
      fields.title.textContent = service.title;
    }

    if (fields.description) {
      fields.description.textContent = service.description;
    }

    if (fields.primaryTitle) {
      fields.primaryTitle.textContent = service.primaryTitle;
    }

    if (fields.secondaryTitle) {
      fields.secondaryTitle.textContent =
        service.secondaryTitle;
    }

    renderMeta(service.meta);
    renderList(fields.primary, service.primary);
    renderList(fields.secondary, service.secondary);
  };

  const openDialog = (trigger) => {
    const serviceKey = trigger.dataset.service;
    const service = serviceData[serviceKey];

    if (!service) {
      console.warn(
        `[services] No service data found for "${serviceKey}".`,
      );
      return;
    }

    activeTrigger = trigger;
    renderService(service);

    dialog.showModal();
    document.body.classList.add("dialog-open");

    requestAnimationFrame(() => {
      closeButton?.focus();
    });
  };

  const closeDialog = () => {
    if (dialog.open) {
      dialog.close();
    }
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".service-trigger");

    if (!trigger) return;

    openDialog(trigger);
  });

  closeButton?.addEventListener("click", closeDialog);

  contactButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    activeTrigger?.focus();
    activeTrigger = null;
  });

  dialog.addEventListener("cancel", () => {
    document.body.classList.remove("dialog-open");
  });
}