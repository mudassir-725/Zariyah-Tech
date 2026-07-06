/* Accessible single-open FAQ accordion. */
export function initFaq() {
  const container = document.getElementById("faq-container");
  if (!container) return;

  const closeItem = (item) => {
    item.classList.remove("active");
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    button?.setAttribute("aria-expanded", "false");
    if (answer) answer.style.maxHeight = "0px";
  };

  container.addEventListener("click", (event) => {
    const button = event.target.closest(".faq-question");
    if (!button) return;

    const item = button.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");
    if (!item || !answer) return;

    const shouldOpen = !item.classList.contains("active");
    container.querySelectorAll(".faq-item").forEach(closeItem);

    if (shouldOpen) {
      item.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    }
  });

  window.addEventListener("resize", () => {
    const openAnswer = container.querySelector(".faq-item.active .faq-answer");
    if (openAnswer) openAnswer.style.maxHeight = `${openAnswer.scrollHeight}px`;
  });
}
