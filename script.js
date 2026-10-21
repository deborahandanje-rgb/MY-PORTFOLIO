// Accessible navigation menu toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  if (!navLinks.id) navLinks.id = "primary-navigation";
  navToggle.setAttribute("aria-controls", navLinks.id);
  navToggle.setAttribute("aria-expanded", String(navLinks.classList.contains("open")));

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close the mobile menu after a link is clicked and keep its accessibility state in sync
document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (navLinks) navLinks.classList.remove("open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  });
});

// Auto-Updating Year functionality
const yearSpan = document.querySelector("#current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Do not automatically apply the global .highlight style to heroes or cards.
// This keeps each page's layout and project-card styling intentional.

// // Contact form validation and Formspree submission
// Scope this handler to the Formspree form so other forms are not intercepted.
const contactForm = document.querySelector('form[action^="https://formspree.io/f/"]');
const feedback = document.querySelector("#form-feedback");

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    // Without the feedback element, allow the browser's normal form submission.
    if (!feedback) return;

    event.preventDefault();

    const nameField = contactForm.querySelector("#full-name");
    const emailField = contactForm.querySelector("#email");
    const messageField = contactForm.querySelector("#message");
    const submitButton = contactForm.querySelector('button[type="submit"]');

    feedback.classList.remove("error", "success");
    feedback.textContent = "";

    if (!nameField || !emailField || !messageField) {
      feedback.textContent = "The contact form is temporarily unavailable. Please email me directly.";
      feedback.classList.add("error");
      return;
    }

    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (!name) {
      feedback.textContent = "Please enter your full name.";
      feedback.classList.add("error");
      nameField.focus();
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.classList.add("error");
      emailField.focus();
      return;
    }

    if (!message) {
      feedback.textContent = "Please enter a message.";
      feedback.classList.add("error");
      messageField.focus();
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.setAttribute("aria-busy", "true");
    }
    feedback.textContent = "Sending your message…";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        feedback.textContent =
          "Thank you for your message! Formspree accepted your submission. If you need a quick response, you can also email me directly.";
        feedback.classList.add("success");
        contactForm.reset();
      } else {
        let errorMessage = "Your message could not be sent. Please try again.";
        try {
          const result = await response.json();
          if (Array.isArray(result.errors) && result.errors.length) {
            errorMessage = result.errors.map((error) => error.message).join(" ");
          }
        } catch {
          // Keep the default error if Formspree does not return JSON.
        }
        feedback.textContent = errorMessage;
        feedback.classList.add("error");
      }
    } catch {
      feedback.textContent =
        "We couldn't send your message because of a connection problem. Please try again or email me directly.";
      feedback.classList.add("error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.removeAttribute("aria-busy");
      }
    }
  });
}

// Scroll reveal animation, with fallback and reduced-motion support
const revealElements = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

// // The home-page heading is already present in HTML; avoid appending duplicate text.

// //Active Navigation Highlight
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

/* ==========================================
   Back To Top Button
========================================== */

const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
  // Show or hide button while scrolling
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Scroll smoothly back to the top
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/* ==========================================
   Animated Statistics Counter
========================================== */

const counters = document.querySelectorAll(".counter");
let countersAnimated = false;

const animateCounters = () => {
  if (countersAnimated) return;
  countersAnimated = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.target) || 0;
    const duration = Number(counter.dataset.duration) || 800;

    if (prefersReducedMotion) {
      counter.textContent = target + "+";
      return;
    }

    const startTime = performance.now();
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      counter.textContent = String(Math.floor(progress * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target + "+";
      }
    };

    requestAnimationFrame(step);
  });
};

const statsSection = document.querySelector(".stats-section");

if (statsSection) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    animateCounters();
  } else {
    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    statsObserver.observe(statsSection);
  }
}

/* ==========================================
   Image Lightbox
========================================== */

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const closeLightbox = document.querySelector(".close-lightbox");
const galleryImages = document.querySelectorAll(".lightbox-trigger");

const hideLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.remove("show");
  document.body.style.overflow = "";
};

galleryImages.forEach((image) => {
  image.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "Expanded image";
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";

    if (closeLightbox) closeLightbox.focus();
  });
});

if (closeLightbox) closeLightbox.addEventListener("click", hideLightbox);

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) hideLightbox();
  });
}

/* ==========================================
   Close Lightbox with Escape Key
========================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && lightbox.classList.contains("show")) {
    hideLightbox();
  }
});
