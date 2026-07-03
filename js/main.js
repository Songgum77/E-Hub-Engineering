const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const loader = document.querySelector("[data-loader]");
const year = document.querySelector("[data-year]");
const contactForm = document.querySelector("[data-contact-form]");
const statusMessage = document.querySelector("[data-form-status]");

const closeMenu = () => {
  navToggle?.setAttribute("aria-expanded", "false");
  navMenu?.classList.remove("is-open");
  body.classList.remove("nav-open");
};

window.addEventListener("load", () => {
  loader?.classList.add("is-hidden");
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}, { passive: true });

year.textContent = new Date().getFullYear();

navToggle?.addEventListener("click", () => {
  const expanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!expanded));
  navMenu.classList.toggle("is-open", !expanded);
  body.classList.toggle("nav-open", !expanded);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px" });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const end = Number(element.dataset.count);
    const suffix = end === 100 ? "%" : "+";
    const startTime = performance.now();
    const duration = 900;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.round(end * progress);
      element.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(element);
  });
}, { threshold: 0.7 });

document.querySelectorAll("[data-count]").forEach((counter) => countObserver.observe(counter));

const validationMessages = {
  valueMissing: "This field is required.",
  typeMismatch: "Enter a valid email address.",
  tooShort: "Please add a little more detail."
};

const setFieldState = (field) => {
  const message = field.parentElement.querySelector(".error-message");
  field.classList.toggle("is-invalid", !field.validity.valid);

  if (field.validity.valid) {
    message.textContent = "";
    return true;
  }

  const errorType = Object.keys(validationMessages).find((key) => field.validity[key]);
  message.textContent = validationMessages[errorType] || "Please check this field.";
  return false;
};

contactForm?.addEventListener("input", (event) => {
  if (event.target.matches("input, select, textarea")) {
    setFieldState(event.target);
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = Array.from(contactForm.querySelectorAll("input, select, textarea"));
  const isValid = fields.every(setFieldState);

  if (!isValid) {
    statusMessage.textContent = "Please fix the highlighted fields.";
    return;
  }

  const data = new FormData(contactForm);
  const subject = encodeURIComponent(`Website enquiry: ${data.get("service")}`);
  const bodyLines = [
    `Name: ${data.get("name")}`,
    `Phone: ${data.get("phone")}`,
    `Email: ${data.get("email")}`,
    `Service: ${data.get("service")}`,
    "",
    data.get("message")
  ];

  statusMessage.textContent = "Opening your email app with the enquiry details.";
  window.location.href = `mailto:engghub10@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
});
