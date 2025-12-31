document.addEventListener("DOMContentLoaded", async () => {
  const productDetailContainer = document.getElementById(
    "product-detail-container"
  );
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  let currentProduct = null;

  if (!productId) {
    productDetailContainer.innerHTML = "<p>Ürün ID'si bulunamadı.</p>";
    return;
  }

  async function renderProduct(product) {
    if (!product) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    let displayImages = product.images;
    if (isDarkMode && product.images2 && product.images2.length > 0) {
      displayImages = product.images2;
    }

    // İçeriği "Teknik Kabiliyetler:" kısmından böl
    const fullDescription = product.description2;
    const splitPoint = fullDescription.indexOf('<span class="bolder">Teknik Kabiliyetler:</span>');
    
    let topContent = "";
    let bottomContent = "";
    
    if (splitPoint !== -1) {
      topContent = fullDescription.substring(0, splitPoint).trim();
      bottomContent = fullDescription.substring(splitPoint).trim();
    } else {
      topContent = fullDescription;
    }

    const sliderHTML = displayImages
      .map(
        (img, index) => `
        <div class="mySlides fade">
          <div class="numbertext">${index + 1} / ${displayImages.length}</div>
          <img src="images/${img}" style="width:100%">
        </div>`
      )
      .join("");

    const dotsHTML = displayImages
      .map(
        (_, index) =>
          `<span class="dot" onclick="currentSlide(${index + 1})"></span>`
      )
      .join("");

    productDetailContainer.innerHTML = `
      <div class="product-top-section">
        <div class="product-left-column">
          <div class="slideshow-container">
            ${sliderHTML}
            <a class="prev" onclick="plusSlides(-1)">&#10094;</a>
            <a class="next" onclick="plusSlides(1)">&#10095;</a>
            <div class="dots-container">${dotsHTML}</div>
          </div>
          ${product.shopLink ? `<a href="${product.shopLink}" target="_blank" class="buy-button">Satın Al</a>` : ''}
        </div>

        <div class="product-detail-info">
          <h2>${product.name}</h2>
          <div class="product-detail-price">${product.price.toFixed(2)} TL</div>
          <div class="product-description">${topContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>
        </div>
      </div>
      
      ${bottomContent ? `<div class="product-bottom-section">
        <div class="product-description">${bottomContent.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>
      </div>` : ''}
    `;

    // Ensure slideIndex is valid for the new set of images
    if (slideIndex > displayImages.length) slideIndex = 1;
    showSlides(slideIndex);
  }

  try {
    const response = await fetch("products.json");
    const products = await response.json();
    currentProduct = products.find((p) => p.id === parseInt(productId));

    if (currentProduct) {
      renderProduct(currentProduct);
    } else {
      productDetailContainer.innerHTML = "<p>Ürün bulunamadı.</p>";
    }
  } catch (error) {
    console.error("Ürün detayları yüklenirken hata oluştu:", error);
    productDetailContainer.innerHTML =
      "<p>Ürün detayları yüklenirken bir hata oluştu.</p>";
  }

  window.addEventListener('themeChanged', () => {
    if (currentProduct) {
      renderProduct(currentProduct);
    }
  });
});

let slideIndex = 1;

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  if (!slides.length) return; // Guard clause if elements not yet in DOM
  
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
