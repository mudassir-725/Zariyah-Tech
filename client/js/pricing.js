/* Pricing dialog, category tabs, billing selection, and plan events. */
export function initPricing() {
  const dialog = document.getElementById("pricing-dialog");
  const openers = [...document.querySelectorAll("[data-pricing-open]")];
  const closeButton = dialog?.querySelector("[data-pricing-close]");
  const tabs = [...(dialog?.querySelectorAll("[data-pricing-tab]") ?? [])];
  const cards = [...(dialog?.querySelectorAll("[data-plan-group]") ?? [])];
  const billingInputs = [
    ...(dialog?.querySelectorAll('input[name="pricing-billing"]') ?? []),
  ];
  const planButtons = [
    ...(dialog?.querySelectorAll("[data-pricing-plan]") ?? []),
  ];
  const grid = dialog?.querySelector("[data-pricing-grid]");
  const pill = dialog?.querySelector(".pricing-tab-pill");

  if (!dialog || openers.length === 0) return;

  let lastFocused = null;
  let activeGroup = "personal";
  let billingCycle = "monthly";
  let transitionTimer = null;

  const positionPill = () => {
    const activeTab = tabs.find((tab) => tab.dataset.pricingTab === activeGroup);
    if (!pill || !activeTab) return;

    pill.style.width = `${activeTab.offsetWidth}px`;
    pill.style.transform = `translateX(${activeTab.offsetLeft}px)`;
  };

  const updateTabState = () => {
    tabs.forEach((tab) => {
      const active = tab.dataset.pricingTab === activeGroup;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    if (grid) grid.dataset.pricingGroup = activeGroup;
    positionPill();
  };

  const showGroup = (group, animate = true) => {
    if (!group || group === activeGroup && animate) return;

    activeGroup = group;
    updateTabState();
    window.clearTimeout(transitionTimer);

    const outgoing = cards.filter(
      (card) => !card.hidden && card.dataset.planGroup !== activeGroup,
    );
    const incoming = cards.filter(
      (card) => card.dataset.planGroup === activeGroup,
    );

    outgoing.forEach((card) => card.classList.add("is-leaving"));

    const swap = () => {
      outgoing.forEach((card) => {
        card.hidden = true;
        card.classList.remove("is-leaving");
      });

      incoming.forEach((card) => {
        card.hidden = false;
        card.classList.add("is-entering");
      });

      requestAnimationFrame(() => {
        incoming.forEach((card) => card.classList.remove("is-entering"));
      });
    };

    if (animate) transitionTimer = window.setTimeout(swap, 150);
    else swap();
  };

  const updateBilling = (cycle) => {
    billingCycle = cycle;

    billingInputs.forEach((input) => {
      const selected = input.value === billingCycle;
      input.checked = selected;
      input.closest(".billing-option")?.classList.toggle("active", selected);
    });

    dialog.querySelectorAll("[data-price]").forEach((node) => {
      node.textContent = node.dataset[billingCycle] ?? "";
    });

    dialog.querySelectorAll("[data-price-cycle]").forEach((node) => {
      node.textContent = node.dataset[billingCycle] ?? "";
    });
  };

  const close = () => {
    if (dialog.open) dialog.close();
  };

  const open = (event) => {
    event?.preventDefault();
    lastFocused = event?.currentTarget ?? document.activeElement;

    const authDialog = document.getElementById("auth-dialog");
    if (authDialog?.open) authDialog.close();

    if (!dialog.open) dialog.showModal();
    document.body.classList.add("pricing-open");

    requestAnimationFrame(() => {
      updateTabState();
      updateBilling(billingCycle);
      closeButton?.focus();
    });
  };

  openers.forEach((opener) => opener.addEventListener("click", open));
  closeButton?.addEventListener("click", close);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => showGroup(tab.dataset.pricingTab));
  });

  billingInputs.forEach((input) => {
    input.addEventListener("change", () => updateBilling(input.value));
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("pricing-open");
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  });

  window.addEventListener("resize", positionPill);

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const plan = button.dataset.pricingPlan;
      const priceNode = button
        .closest(".price-card")
        ?.querySelector("[data-price]");

      document.dispatchEvent(
        new CustomEvent("pricing:select", {
          detail: {
            plan,
            billingCycle,
            price: priceNode?.textContent?.trim() ?? null,
            source: "pricing-dialog",
          },
        }),
      );

      close();
      window.setTimeout(() => {
        document.getElementById("footer")?.scrollIntoView({ behavior: "smooth" });
      }, 120);
    });
  });

  showGroup(activeGroup, false);
  updateBilling(billingCycle);
}
