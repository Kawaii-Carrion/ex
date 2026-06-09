import { filterProductsByCategory } from '../utils/helpers.js';
import { products, addToCart, animateFlyToCart } from './Cart.js';

/**
 * Рендерит карточки товаров в контейнере #catalogContainer.
 * @param {string} filter - категория фильтра ('all', 'electronics', ...)
 */
export function renderCatalog(filter = 'all') {
    const container = document.getElementById('catalogContainer');
    if (!container) return;

    const filtered = filterProductsByCategory(products, filter);

    container.innerHTML = filtered.map(product => `
        <div class="col">
            <div class="card product-card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-text text-success fw-bold">${product.price.toLocaleString()} ₽</p>
                    <button class="btn btn-success add-to-cart mt-auto" data-id="${product.id}">
                        ➕ В корзину
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Навешиваем обработчики
    container.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            addToCart(productId);
            animateFlyToCart(e.currentTarget);
        });
    });
}Ы