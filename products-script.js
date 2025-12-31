document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryList = document.getElementById('category-list');

    let allProducts = [];

    async function fetchProducts() {
        try {
            const response = await fetch('products.json');
            allProducts = await response.json();
            displayProducts(allProducts);
            populateCategories(allProducts);
        } catch (error) {
            console.error('Ürünler yüklenirken hata oluştu:', error);
            productGrid.innerHTML = '<p>Ürünler yüklenirken bir hata oluştu.</p>';
        }
    }

    function displayProducts(products) {
        productGrid.innerHTML = '';
        if (products.length === 0) {
            productGrid.innerHTML = '<p>Ürün bulunamadı.</p>';
            return;
        }
        products.forEach(product => {
            const isDarkMode = document.body.classList.contains('dark-mode');
            let imageSrc = product.image;
            
            if (isDarkMode) {
                if (product.image2) {
                    imageSrc = product.image2;
                } else if (product.images2 && product.images2.length > 0) {
                    imageSrc = product.images2[0];
                }
            }

            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.innerHTML = `
                <img src="images/${imageSrc}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">${product.price.toFixed(2)} TL</div>
                    <button class="show-product-button" data-id="${product.id}">Ürünü Göster</button>
                </div>
            `;
            productGrid.appendChild(productCard);
        });

        document.querySelectorAll('.show-product-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.dataset.id;
                window.location.href = `product-detail.html?id=${productId}`;
            });
        });
    }

    function populateCategories(products) {
        const categories = [...new Set(products.map(product => product.category))];
        categoryList.innerHTML = '<li><button data-category="all">Tüm Ürünler</button></li>';
        categories.forEach(category => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = category;
            button.dataset.category = category;
            li.appendChild(button);
            categoryList.appendChild(li);
        });
    }

    function filterProductsByCategory(event) {
        const selectedCategory = event.target.dataset.category;
        let filteredProducts;
        if (selectedCategory === 'all') {
            filteredProducts = allProducts;
        } else {
            filteredProducts = allProducts.filter(product => product.category === selectedCategory);
        }
        displayProducts(filteredProducts);
    }

    categoryList.addEventListener('click', filterProductsByCategory);

    window.addEventListener('themeChanged', () => {
        // Re-display current filtered products or just allProducts?
        // Usually better to keep current filter.
        // But here I'll just re-display whatever was last shown?
        // Actually, displaying allProducts resets the filter if I don't track it.
        // For simplicity, let's re-trigger the current active category logic or just redisplay all if simple.
        // Checking the filter implementation: 'filterProductsByCategory' uses event.target.
        // I can just check the active button in categoryList maybe?
        // Or simpler: displayProducts(allProducts). The user didn't ask to preserve filter, but it's nice.
        // Let's just redraw allProducts for now to be safe and simple as per request.
        // If I need to support filter preservation, I'd need state.
        // Let's try to check the active category button.
        // But wait, populateCategories creates buttons. I don't see an 'active' class logic in the provided script.
        // So displayProducts(allProducts) is safe default.
        displayProducts(allProducts);
    });

    fetchProducts();
});
