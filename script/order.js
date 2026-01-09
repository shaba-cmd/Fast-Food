document.addEventListener('DOMContentLoaded', function () {
    const orderData = localStorage.getItem('currentOrder');

    const order = JSON.parse(orderData);
    const orderProducts = document.getElementById('orderProducts');
    const orderTotal = document.getElementById('orderTotal');
    const orderNumber = document.getElementById('orderNumber');
    const orderDate = document.getElementById('orderDate');

    orderNumber.textContent = order.orderNumber || 'Не указан';

    if (order.date) {
        orderDate.textContent = new Date(order.date).toLocaleString('ru-RU');
    } else {
        orderDate.textContent = new Date().toLocaleString('ru-RU');
    }

    let total = 0;
    order.products.forEach(products => {
        const productTotal = products.price * products.quantity;
        total += productTotal;

        const productElement = document.createElement('div');
        productElement.className = 'order__product';
        productElement.innerHTML = `
            <div class="product__info">
                <img class="product__image" src="${products.imageUrl}" alt="${products.name}">
                <div class="product__details">
                    <h4>${products.name}</h4>
                    <p>Количество: ${products.quantity} шт.</p>
                    <p>Цена: ${products.price} руб./шт.</p>
                </div>
            </div>
            <div class="product__total">${productTotal} руб.</div>
        `;
        orderProducts.appendChild(productElement);
    });

    orderTotal.textContent = `${total} руб.`;
});