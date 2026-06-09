import { calculateTotalPrice } from '../utils/helpers.js';

// ===== ДАННЫЕ ТОВАРОВ (общие для всего приложения) =====
export const products = [
    { id: 1, title: "Смартфон", price: 15000, category: "electronics", image: "https://via.placeholder.com/300x200?text=Phone" },
    { id: 2, title: "Ноутбук", price: 55000, category: "electronics", image: "https://via.placeholder.com/300x200?text=Laptop" },
    { id: 3, title: "Футболка", price: 1200, category: "clothing", image: "https://via.placeholder.com/300x200?text=T-Shirt" },
    { id: 4, title: "Джинсы", price: 3200, category: "clothing", image: "https://via.placeholder.com/300x200?text=Jeans" },
    { id: 5, title: "Наушники", price: 4500, category: "electronics", image: "https://via.placeholder.com/300x200?text=Headphones" },
    { id: 6, title: "Куртка", price: 7000, category: "clothing", image: "https://via.placeholder.com/300x200?text=Jacket" }
];

// Состояние корзины
export let cartItems = []; // { productId, quantity }

// ===== ФУНКЦИИ РАБОТЫ С КОРЗИНОЙ =====
export function addToCart(productId) {
    const existing = cartItems.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cartItems.push({ productId, quantity: 1 });
    }
    updateCartUI();
}

export function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.productId !== productId);
    updateCartUI();
}

export function updateCartItemQuantity(productId, newQuantity) {
    if (newQuantity < 1) newQuantity = 1; // защита от отрицательных
    const item = cartItems.find(item => item.productId === productId);
    if (item) item.quantity = newQuantity;
    updateCartUI();
}

function updateCartUI() {
    renderCart();
    // Обновить бейдж количества товаров
    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-badge').textContent = totalQty;
}

export function renderCart() {
    const container = document.getElementById('cartContainer');
    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = '<div class="text-center text-muted py-5">Корзина пуста</div>';
        document.getElementById('totalPrice').textContent = 'Итого: 0 ₽';
        return;
    }

    container.innerHTML = cartItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return '';
        return `
            <div class="list-group-item d-flex align-items-center gap-3">
                <img src="${product.image}" class="cart-item-img" alt="${product.title}">
                <div class="flex-grow-1">
                    <div class="fw-bold">${product.title}</div>
                    <div class="text-muted">${product.price} ₽ × ${item.quantity} = ${product.price * item.quantity} ₽</div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <input type="number" min="1" value="${item.quantity}" class="form-control cart-qty-input"
                           style="width:70px" data-id="${product.id}">
                    <button class="btn btn-outline-danger btn-sm delete-item" data-id="${product.id}">✕</button>
                </div>
            </div>
        `;
    }).join('');

    // Обработчики изменения количества
    container.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            const val = parseInt(e.target.value);
            if (!isNaN(val)) updateCartItemQuantity(id, val);
            else e.target.value = 1;
        });
    });

    // Обработчики удаления
    container.querySelectorAll('.delete-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            removeFromCart(id);
        });
    });

    document.getElementById('totalPrice').textContent =
        `Итого: ${calculateTotalPrice(cartItems, products).toLocaleString()} ₽`;
}

// ===== АНИМАЦИЯ ПОЛЁТА ТОВАРА В КОРЗИНУ =====
export function animateFlyToCart(sourceButton) {
    // sourceButton – кнопка "В корзину", внутри карточки товара
    const card = sourceButton.closest('.product-card');
    if (!card) return;

    const img = card.querySelector('img');
    if (!img) return;

    const targetBadge = document.getElementById('cart-badge');
    if (!targetBadge) return;

    const btnRect = sourceButton.getBoundingClientRect();
    const badgeRect = targetBadge.getBoundingClientRect();

    const flyEl = document.createElement('img');
    flyEl.src = img.src;
    flyEl.className = 'fly-item';
    flyEl.style.left = btnRect.left + (btnRect.width / 2 - 25) + 'px';
    flyEl.style.top = btnRect.top + (btnRect.height / 2 - 25) + 'px';
    document.body.appendChild(flyEl);

    requestAnimationFrame(() => {
        flyEl.style.transform = 'scale(0.4)';
        flyEl.style.left = badgeRect.left + (badgeRect.width / 2 - 15) + 'px';
        flyEl.style.top = badgeRect.top + (badgeRect.height / 2 - 15) + 'px';
        flyEl.style.opacity = '0.7';
    });

    setTimeout(() => {
        if (flyEl.parentNode) flyEl.parentNode.removeChild(flyEl);
    }, 600);
}