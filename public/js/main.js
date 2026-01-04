document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  // Generate floating particles
  const particles = document.querySelector(".particles");
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDelay = Math.random() * 20 + "s";
    p.style.animationDuration = 15 + Math.random() * 20 + "s";
    particles.appendChild(p);
  }
});
