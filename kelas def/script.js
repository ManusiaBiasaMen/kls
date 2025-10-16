// HAMBURGER MENU
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// SLIDER
const slider = document.getElementById("slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const dotsContainer = document.getElementById("dots");

let currentIndex = 0;

slides.forEach((_, index) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (index === 0) dot.classList.add("active");
  dot.addEventListener("click", () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll(".dot");

function updateSlider() {
  slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot) => dot.classList.remove("active"));
  dots[currentIndex].classList.add("active");
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
}

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
});

// AUTO SLIDE
setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}, 5000);

// ANIMATE ON SCROLL
const animateElements = document.querySelectorAll(".animate-on-scroll");

function checkScroll() {
  const triggerBottom = window.innerHeight * 0.85;
  animateElements.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", checkScroll);
window.addEventListener("load", checkScroll);

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyGLChBnxhlPF0-deRQIfVMYVx6j-i7omDEC8BJTJBxd4Wa-ON6U8K1snvj6arPY8VD/exec"; // Ganti dengan URL Google Apps Script Anda

document
  .getElementById("contactForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    const successMessage = document.getElementById("successMessage");
    const errorMessage = document.getElementById("errorMessage");

    // Reset messages
    successMessage.style.display = "none";
    errorMessage.style.display = "none";

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Get form data
    const formData = new FormData(this);
    const data = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      subject: formData.get("subject"),
      message: formData.get("message"),
      timestamp: new Date().toLocaleString(),
    };

    console.log("Sending data:", data);

    try {
      // Method 1: Direct fetch
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Tambahkan ini untuk bypass CORS
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response received");

      // Karena no-cors, kita anggap berhasil jika tidak error
      successMessage.style.display = "block";
      successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Pesan berhasil dikirim! Terima kasih ${data.firstName}.
        `;
      this.reset();
      successMessage.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error details:", error);

      // Jika fetch gagal, coba dengan method alternatif
      try {
        await sendWithFormData(data);
      } catch (secondError) {
        console.error("Second method failed:", secondError);
        showError(errorMessage, secondError);
      }
    } finally {
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }
  });

// Method alternatif: gunakan form submission
async function sendWithFormData(data) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = GOOGLE_SCRIPT_URL;
  form.target = "hidden_iframe";
  form.style.display = "none";

  // Create hidden iframe
  let iframe = document.getElementById("hidden_iframe");
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.name = "hidden_iframe";
    iframe.id = "hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }

  // Add data as form fields
  Object.keys(data).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);

  // Show success after delay
  setTimeout(() => {
    const successMessage = document.getElementById("successMessage");
    successMessage.style.display = "block";
    successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i> 
            Pesan berhasil dikirim menggunakan method alternatif!
        `;
    successMessage.scrollIntoView({ behavior: "smooth" });
  }, 2000);
}

function showError(errorElement, error) {
  errorElement.style.display = "block";
  errorElement.innerHTML = `
        <i class="fas fa-exclamation-circle"></i> 
        Terjadi kesalahan: ${error.message || "Silakan coba lagi nanti."}
        <br><small>Tip: Pastikan URL Google Apps Script sudah benar dan di-deploy dengan akses "Anyone"</small>
    `;
  errorElement.scrollIntoView({ behavior: "smooth" });
}

// Real-time validation
document
  .querySelectorAll(
    "#contactForm input, #contactForm textarea, #contactForm select"
  )
  .forEach((field) => {
    field.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        this.style.borderLeft = "4px solid #e74c3c";
      } else {
        this.style.borderLeft = "4px solid #27ae60";
      }
    });

    field.addEventListener("input", function () {
      if (this.style.borderLeft) {
        this.style.borderLeft = "";
      }
    });
  });

// Debug function - untuk test koneksi
function testConnection() {
  fetch(GOOGLE_SCRIPT_URL + "?test=1")
    .then((response) => {
      console.log("Connection test successful:", response);
      alert("Koneksi ke Google Apps Script berhasil!");
    })
    .catch((error) => {
      console.error("Connection test failed:", error);
      alert("Koneksi gagal: " + error.message);
    });
}
