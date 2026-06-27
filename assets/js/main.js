const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const calculator = document.querySelector(".calculator-card");
const contactForm = document.querySelector(".contact-form");
const newsletterForm = document.querySelector(".newsletter-form");
const footerNewsletterForm = document.querySelector(".footer-newsletter");
const searchForm = document.querySelector(".property-search");
const heroMedia = document.querySelector(".hero-media");
const heroInsight = document.querySelector(".hero-insight");
const paymentOutput = document.querySelector(".payment-output");

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const setHeaderState = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const setParallax = () => {
  if (!heroMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const offset = Math.min(window.scrollY * 0.08, 42);
  heroMedia.style.transform = `scale(1.06) translate3d(0, ${offset}px, 0)`;
  if (heroInsight) heroInsight.style.transform = `translate3d(0, ${offset * -0.18}px, 0)`;
};

setParallax();
window.addEventListener("scroll", setParallax, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  header.classList.toggle("nav-active", !isOpen);
  navMenu.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("nav-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    header?.classList.remove("nav-active");
    navMenu?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  });
});

const animateCount = (element) => {
  if (element.dataset.counted) return;

  element.dataset.counted = "true";
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const duration = 1700;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);
    element.textContent = `${value.toLocaleString()}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target.toLocaleString()}${suffix}`;
    }
  };

  requestAnimationFrame(tick);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");

      if (entry.target.matches(".stat-item")) {
        const stat = entry.target.querySelector("[data-count]");
        if (stat) animateCount(stat);
      }

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.75 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const updatePayment = () => {
  if (!calculator) return;

  const priceInput = calculator.querySelector("[data-price]");
  const downInput = calculator.querySelector("[data-down]");
  const rateInput = calculator.querySelector("[data-rate]");
  const termInput = calculator.querySelector("[data-term]");
  const price = Number(priceInput?.value || 0);
  const down = Number(downInput?.value || 0);
  const rateValue = Number(rateInput?.value || 0);
  const termValue = Number(termInput?.value || 0);
  const rate = rateValue / 100 / 12;
  const term = termValue * 12;
  const principal = Math.max(price - down, 0);
  const output = calculator.querySelector("[data-payment]");

  calculator.querySelector("[data-price-label]").textContent = peso.format(price);
  calculator.querySelector("[data-down-label]").textContent = peso.format(down);
  calculator.querySelector("[data-rate-label]").textContent = `${rateValue.toFixed(2)}%`;
  calculator.querySelector("[data-term-label]").textContent = `${termValue} years`;

  if (!output || !principal || !term) {
    if (output) output.textContent = peso.format(0);
    return;
  }

  const payment = rate
    ? (principal * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
    : principal / term;

  output.textContent = peso.format(payment);
  paymentOutput?.classList.remove("is-updated");
  window.requestAnimationFrame(() => paymentOutput?.classList.add("is-updated"));
};

calculator?.addEventListener("input", updatePayment);
updatePayment();

const handleDemoForm = (form, successText) => {
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = successText;
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      form.reset();
      updatePayment();
    }, 2100);
  });
};

handleDemoForm(contactForm, "Inquiry Sent");
handleDemoForm(newsletterForm, "Subscribed");
handleDemoForm(footerNewsletterForm, "Joined");
handleDemoForm(searchForm, "Searching");

const sections = [...document.querySelectorAll("main section[id]")];

const setActiveNav = () => {
  const current = sections
    .filter((section) => section.getBoundingClientRect().top < window.innerHeight * 0.35)
    .pop();

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", Boolean(current && link.getAttribute("href") === `#${current.id}`));
  });
};

setActiveNav();
window.addEventListener("scroll", setActiveNav, { passive: true });

document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    button.append(ripple);
    window.setTimeout(() => ripple.remove(), 620);
  });
});
