document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");
  const themeSwitch = document.querySelector(".theme-switch-wrapper");

  if (!header) return;

  const rightControls = document.createElement("div");
  rightControls.className = "header-right-controls";
  rightControls.style.display = "flex";
  rightControls.style.alignItems = "center";
  rightControls.style.gap = "10px";

  const hamburgerBtn = document.createElement("button");
  hamburgerBtn.className = "hamburger-btn";
  hamburgerBtn.innerHTML = "☰";
  hamburgerBtn.setAttribute("aria-label", "Menüyü Aç/Kapat");

  if (themeSwitch) {
    themeSwitch.parentNode.insertBefore(rightControls, themeSwitch);
    rightControls.appendChild(themeSwitch);
  }
  rightControls.appendChild(hamburgerBtn);

  hamburgerBtn.addEventListener("click", () => {
    header.classList.toggle("menu-open");
    document.body.classList.toggle("menu-open-body");
    document.documentElement.classList.toggle("menu-open-html");
    hamburgerBtn.innerHTML = header.classList.contains("menu-open") ? "✕" : "☰";
  });

  document.querySelectorAll("header nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      document.body.classList.remove("menu-open-body");
      document.documentElement.classList.remove("menu-open-html");
      hamburgerBtn.innerHTML = "☰";
    });
  });
});
