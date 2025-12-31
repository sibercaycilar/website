class ProductManager {
    constructor() {
        this.products = [];
        this.selectors = {
            productList: '.product-list',
            errorContainer: '.error-container'
        };
        this.config = {
            jsonUrl: '../products.json', 
            currency: 'TL' 
        };
    }

    async init() {
        try {
            await this.loadProducts();
            this.filterBestSellers(); 
            this.renderProducts();
            
            window.addEventListener('themeChanged', () => {
                this.renderProducts();
            });
        } catch (error) {
            this.handleError('Ürünler yüklenirken bir hata oluştu:', error);
        }
    }

    async loadProducts() {
        const response = await fetch(this.config.jsonUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: JSON dosyası bulunamadı`);
        }
        
        this.products = await response.json(); 
        console.log(`✅ ${this.products.length} ürün başarıyla yüklendi (ham veri).`);
    }

    filterBestSellers() {
        const filteredProducts = this.products.filter(product => product.is_best_seller === true);
        this.products = filteredProducts;

        console.log(`⭐ ${this.products.length} ürün "Çok Satanlar" olarak filtrelendi.`);
    }

    renderProducts() {
        const container = document.querySelector(this.selectors.productList);
        
        if (!container) {
            throw new Error('Ürün listesi konteynırı bulunamadı');
        }

        if (this.products.length === 0) {
            container.innerHTML = this.createEmptyState();
            return;
        }

        container.innerHTML = this.products.map(product => 
            this.createProductCard(product)
        ).join('');
    }

    createProductCard(product) {
        const {
            id, 
            image,          
            name,
            category,
            price,          
            description,
            image2,
            images2
        } = product;

        const isDarkMode = document.body.classList.contains('dark-mode');
        let imageSrc = image;

        if (isDarkMode) {
            if (image2) {
                imageSrc = image2;
            } else if (images2 && images2.length > 0) {
                imageSrc = images2[0];
            }
        }

        const detailUrl = `product-detail.html?id=${id}`; 
        
        return `
            <article class="product-card" data-product="${this.slugify(name)}">
                <img src="${imageSrc}" 
                    alt="${name} görseli" 
                    loading="lazy"
                    class="product-image">
                
                <div class="price-tags">
                    <span class="category-tag">${category}</span>
                    <span class="price-new">${this.formatPrice(price)}</span>
                </div>
                
                <h3 class="product-title">${name}</h3>
                
                <p class="product-description">${description}</p>
                
                <a href="${detailUrl}" class="btn-detail" aria-label="${name} detaylarını gör">
                    Detayları Gör →
                </a>
            </article>
        `;
    }

    formatPrice(price) {
        const formattedPrice = price.toFixed(2); 
        const [lira, kurus] = formattedPrice.split('.');
        
        return `${lira}.<small>${kurus || '00'}</small> ${this.config.currency}`;
    }

    slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    createEmptyState() {
        return `
            <div class="empty-state">
                <p>Aradığınız kriterlere uygun ürün bulunmamaktadır.</p>
            </div>
        `;
    }

    handleError(message, error) {
        console.error(message, error);
        this.showErrorMessage('Ürünler şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.');
    }

    showErrorMessage(message) {
        let errorContainer = document.querySelector(this.selectors.errorContainer);
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'error-container';
            document.body.prepend(errorContainer); 
        }
        
        errorContainer.innerHTML = `
            <div class="error-message">
                <p>${message}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const manager = new ProductManager();
    manager.init();
});