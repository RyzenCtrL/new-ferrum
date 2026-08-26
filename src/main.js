import "./style.css";

// Sticky header: add a hairline shadow once the page has scrolled past the hero edge.
const header = document.querySelector("[data-header]");
const onScroll = () => {
  if (window.scrollY > 8) header?.classList.add("shadow-sm", "border-line");
  else header?.classList.remove("shadow-sm", "border-line");
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Mobile nav
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
navToggle?.addEventListener("click", () => {
  const isOpen = mobileNav?.classList.toggle("flex");
  mobileNav?.classList.toggle("hidden");
  navToggle.setAttribute("aria-expanded", String(!!isOpen));
});
mobileNav?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileNav.classList.add("hidden");
    mobileNav.classList.remove("flex");
    navToggle?.setAttribute("aria-expanded", "false");
  })
);

// Scroll-reveal
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Lead form: front-end validation + local success state.
// TODO(integration): wire submission to email/Telegram per client instruction before going live.
const form = document.querySelector("[data-lead-form]");
if (form) {
  const nameInput = form.querySelector("#name");
  const phoneInput = form.querySelector("#phone");
  const successEl = document.querySelector("[data-form-success]");

  const phonePattern = /^[+]?[\d\s()-]{10,18}$/;

  const setError = (input, message) => {
    const errorEl = form.querySelector(`[data-error-for="${input.id}"]`);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      input.classList.add("border-accent");
      if (errorEl) errorEl.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      input.classList.remove("border-accent");
      if (errorEl) errorEl.textContent = "";
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim()) {
      setError(nameInput, "Укажите имя");
      valid = false;
    } else {
      setError(nameInput, "");
    }

    if (!phonePattern.test(phoneInput.value.trim())) {
      setError(phoneInput, "Проверьте номер телефона");
      valid = false;
    } else {
      setError(phoneInput, "");
    }

    if (!valid) return;

    form.classList.add("hidden");
    successEl?.classList.remove("hidden");
  });
}

// Footer year
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
