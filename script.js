//Navigation Menu Toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Auto-Updating Year functionality
const yearSpan = document.querySelector("#current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Toggle the Highlight Class
const heroSection = document.querySelector(".hero");

if (heroSection) {
  heroSection.classList.toggle("highlight");
}

// Change Project cards
const projectCards = document.querySelectorAll(".project-card");

projectCards.forEach((card) => {
  const heading = card.querySelector("h3");

  if (!heading) return;

  if (heading.textContent.includes("App")) {
    card.classList.add("highlight");
  }
});

//Automatically close the mobile navigation menu when a link is clicked
const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach((link) => {
  link.addEventListener("click", () => {
    console.log("Link clicked");

    navLinks.classList.remove("open");
  });
});

//Form validation and feedback
const contactForm = document.querySelector("form");
const feedback = document.querySelector("#form-feedback");

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#full-name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();

    feedback.classList.remove("error", "success");

    if (name === "") {
      feedback.textContent = "Please enter your full name.";
      feedback.classList.add("error");
      return;
    }

    if (!email.includes("@")) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.classList.add("error");
      return;
    }

    if (message === "") {
      feedback.textContent =
        "Please tell us how you would like to get involved.";
      feedback.classList.add("error");
      return;
    }

    feedback.textContent =
      "Thank you for your interest! We will get back to you soon.";

    feedback.classList.add("success");

    contactForm.reset();
  });
}

//Scroll Reveal Animation
const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },

  {
    threshold: 0.15,
  },
);

revealElements.forEach((element) => {
  observer.observe(element);
});

//Hero Heading Animation
const heroTitle = document.querySelector("#hero-title");

if (heroTitle) {
  const text = "Deborah Andanje";

  let index = 0;

  function typeText() {
    if (index < text.length) {
      heroTitle.textContent += text.charAt(index);

      index++;

      setTimeout(typeText, 100);
    }
  }

  typeText();
}

//Active Navigation Highlight
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

// Time-based counter animation. Use `data-duration` (ms) on `.counter` to override.
const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target) || 0;
    const duration = Number(counter.dataset.duration) || 800; // default 800ms (faster)

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);

      counter.textContent = value;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        counter.textContent = target + "+";
      }
    };

    requestAnimationFrame(step);
  });
};

// Run animation only once when section enters the viewport
const statsSection = document.querySelector(".stats-section");

if (statsSection) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();

          observer.unobserve(statsSection);
        }
      });
    },
    { threshold: 0.4 },
  );

  observer.observe(statsSection);
}

/* ==========================================
   Image Lightbox
========================================== */

const lightbox = document.getElementById("lightbox");

const lightboxImage = document.getElementById("lightbox-image");

const closeLightbox = document.querySelector(".close-lightbox");

const galleryImages = document.querySelectorAll(".lightbox-trigger");

galleryImages.forEach((image) => {
  image.addEventListener("click", () => {
    lightbox.classList.add("show");

    lightboxImage.src = image.src;

    lightboxImage.alt = image.alt;

    document.body.style.overflow = "hidden";
  });
});

if (closeLightbox) {
  closeLightbox.addEventListener("click", () => {
    lightbox.classList.remove("show");

    document.body.style.overflow = "auto";
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      lightbox.classList.remove("show");

      document.body.style.overflow = "auto";
    }
  });
}

/* ==========================================
   Close Lightbox with Escape Key
========================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("show")) {
    lightbox.classList.remove("show");

    document.body.style.overflow = "auto";
  }
});
