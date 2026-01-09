function addToCart(products) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProductIndex = cart.findIndex(item => item.name === products.name);

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        products.quantity = 1;
        cart.push(products);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartHeader();
}

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartProducts = document.getElementById('cartProducts');
    const totalPriceElement = document.getElementById('totalPrice');

    cartProducts.innerHTML = '';

    if (cart.length === 0) {
        cartProducts.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        if (totalPriceElement) totalPriceElement.textContent = '0 руб.';
        updateCartHeader();
        return;
    }

    let totalPrice = 0;

    cart.forEach((products, index) => {
        const productTotal = products.price * products.quantity;
        totalPrice += productTotal;

        const productElement = document.createElement('article');
        productElement.classList.add('cart__card');
        productElement.innerHTML = `
            <div class="cart__product">
                <img class="cart__img" src="${products.imageUrl}" alt="${products.name}">
                <div class="cart__text">
                    <h4 class="cart__name">${products.name}</h4>
                    <p class="cart__quantity">Размер: 10 шт</p>
                    <p class="cart__price">${products.price} руб.</p>
                </div>
            </div>
            <div class="cart__box">
                <div class="cart__counter">
                    <img class="cart__counter-icon minus" src="/img/icon-header/minus.svg" alt="удалить" data-index="${index}">
                    <p>${products.quantity}</p>
                    <img class="cart__counter-icon plus" src="/img/icon-header/plus.svg" alt="добавить" data-index="${index}">
                </div>
                <div class="cart__icons">
                    <p class="cart__price">${productTotal} руб.</p>
                    <img class="cart__icon" src="/img/icon-header/favorite.png" alt="в избранное">
                    <img class="cart__icon delete" src="./img/icon-header/busket.svg" alt="удалить" data-index="${index}">
                </div>
            </div>
        `;

        cartProducts.appendChild(productElement);
    });

    totalPriceElement.textContent = `${totalPrice} руб.`;

    updateCartHeader();
    addCartEventListeners();
}

function addCartEventListeners() {
    document.querySelectorAll('.cart__counter-icon.plus').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(index, 1);
        });
    });

    document.querySelectorAll('.cart__counter-icon.minus').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(index, -1);
        });
    });

    document.querySelectorAll('.cart__icon.delete').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        });
    });
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index]) {
        cart[index].quantity += change;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart();
    }
}

function clearCart() {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        localStorage.removeItem('cart');
        loadCart();
    }
}

document.addEventListener('DOMContentLoaded', loadCart);

function checkoutOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Корзина пуста! Добавьте товары перед оформлением заказа.');
        return;
    }

    const order = {
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString(),
        products: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    localStorage.removeItem('cart');
    
    window.location.href = 'order.html';
}

function generateOrderNumber() {
    return 'ORD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}