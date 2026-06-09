/**
 * Вычисляет общую стоимость товаров в корзине.
 * @param {Array} cartItems - [{ productId, quantity }]
 * @param {Array} productList - [{ id, price, ... }]
 * @returns {number}
 */
export function calculateTotalPrice(cartItems, productList) {
    return cartItems.reduce((total, item) => {
        const product = productList.find(p => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);
}

/**
 * Фильтрует товары по категории.
 * @param {Array} productsArray
 * @param {string} category - 'all', 'electronics', 'clothing' и т.д.
 * @returns {Array}
 */
export function filterProductsByCategory(productsArray, category) {
    if (category === 'all') return productsArray;
    return productsArray.filter(p => p.category === category);
}