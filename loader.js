document.addEventListener("DOMContentLoaded", () => {
  if (typeof ProductManager !== 'undefined') {
    const productManager = new ProductManager();
    productManager.init();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(function() {
      preloader.classList.add("preloader-hidden");
    }, 1000);
  }
});
