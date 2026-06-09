import { renderCatalog } from './components/Catalog.js';
import { renderCart } from './components/Cart.js';

// ===== РОУТИНГ =====
function showPage(page) {
    // Скрываем все страницы
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    // Убираем класс active с навигационных ссылок
    document.querySelectorAll('nav .btn').forEach(b => b.classList.remove('active'));

    if (page === 'cart') {
        document.getElementById('page-cart').style.display = 'block';
        document.getElementById('link-cart').classList.add('active');
        renderCart(); // перерисовываем корзину
    } else {
        document.getElementById('page-catalog').style.display = 'block';
        document.getElementById('link-catalog').classList.add('active');
        const filter = document.getElementById('categoryFilter').value;
        renderCatalog(filter);
    }
}

function handleHashChange() {
    const hash = window.location.hash;
    if (hash === '#/cart') {
        showPage('cart');
    } else {
        showPage('catalog');
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Первый рендер в соответствии с текущим хешем
    handleHashChange();

    // Слушаем изменения хеша
    window.addEventListener('hashchange', handleHashChange);

    // Фильтр категорий
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        renderCatalog(e.target.value);
    });
});