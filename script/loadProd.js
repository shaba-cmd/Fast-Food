fetch('../data/products.json')
    .then(Response => Response.json())
    .then(data => {
        const arrayProduct = data.products;
        const modelProducts = data.modelProducts || [];
        const categories = {};
        arrayProduct.forEach(products => {
            const category = products.category;
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(products);
        });

        createProductCards(categories);
        createModals(modelProducts);

        addEventListeners();

        function createProductCards(categories) {
            const menuWrapper = document.querySelector('.product-box');

            for (let key in categories) {
                const productsOneCategory = categories[key];

                const categoryWrapper = document.createElement('section');
                categoryWrapper.classList.add('product-box__section');

                const titleCategory = document.createElement('h2');
                titleCategory.classList.add('product-box__title');
                titleCategory.textContent = key;

                const productsWrapper = document.createElement('div');
                productsWrapper.classList.add('product-box__cards');

                productsOneCategory.forEach(products => {
                    const cardProduct = document.createElement('article');
                    cardProduct.classList.add('product-box__card');

                    cardProduct.classList.add('openModal');

                    let badgeText = '';
                    let badgeClass = '';
                    let badgeTextTwo = '';
                    let badgeClassTwo = '';

                    if (products.badgeText) {
                        badgeText = products.badgeText;
                        if (products.badgeType) {
                            badgeClass = `badge-type-${products.badgeType}`;
                        }
                    }

                    if (products.badgeTextTwo) {
                        badgeTextTwo = products.badgeTextTwo;
                        if (products.badgeTypeTwo) {
                            badgeClassTwo = `badge-type-two-${products.badgeTypeTwo}`;
                        } else if (products.badgeTypeTwo) {
                            badgeClassTwo = `badge-type-two-${products.badgeTypeTwo}`
                        }
                    } else if (products.badgeTextTwo) {
                        badgeTextTwo = products.badgeTextTwo;
                    }

                    const badgeAttribute = badgeText ? `data-badge-text="${badgeText}"` : '';
                    const badgeClasses = badgeClass ? `${badgeClass}` : '';
                    const badgeAttributeTwo = badgeTextTwo ? `data-badge-text-two="${badgeTextTwo}"` : '';
                    const badgeClassesTwo = badgeClassTwo ? `${badgeClassTwo}` : '';

                    cardProduct.innerHTML = `
                        <div class="product-box_card-img ${badgeClassesTwo} ${badgeClasses}" ${badgeAttributeTwo} ${badgeAttribute}>
                            <img class="product-box__card-img" src="${products.imageUrl}" alt="${products.name}">
                        </div>
                        <h3 class="product-box__card-title">${products.name}</h3>
                        <div class="product-box__price-btn">
                            <div class="product-box__price-box">
                                ${products.oldPrice ? `<p class="product-box__old-price">${products.oldPrice} руб.</p>` : ''}
                                <p class="product-box__price">от ${products.price} руб.</p>
                            </div>
                            <button class="product-box__btn addProduct" data-product='${JSON.stringify(products)}'>Выбрать</button>
                        </div>
                    `;

                    productsWrapper.appendChild(cardProduct);
                });

                categoryWrapper.appendChild(titleCategory);
                categoryWrapper.appendChild(productsWrapper);
                menuWrapper.appendChild(categoryWrapper);
            }
        }

        function createModals(modelProducts) {
            const modalContainer = document.querySelector('.product-box__modal');

            modelProducts.forEach(product => {
                const modalId = `${product.name.toLowerCase().replace(/\s+/g, '')}Modal`;

                const modalHTML = `
                    <section id="${modalId}" class="modal">
                        <article class="modal__card">
                            <div class="modal__img-box">
                                <img class="modal__img" src="${product.imgUrl}" alt="${product.name}">
                            </div>
                            <div class="modal__info">
                                <div class="modal__box">
                                    <div class="modal__header">
                                        <h3 class="modal__title">${product.name}</h3>
                                        <img class="modal__icon" src="./img/icon-header/favorite.png" alt="favorite">
                                    </div>
                                    <p class="modal__art">Артикул: ${product.article}</p>
                                    <p class="modal__have">${product.inStock ? 'Есть в наличии' : 'Нет в наличии'}</p>
                                    <div class="modal_price-box">
                                        ${product.oldPrice ? `<p class="modal__old-price">${product.oldPrice} руб.</p>` : ''}
                                        <p class="modal__price">${product.price} руб.</p>
                                    </div>
                                </div>
                                <div class="modal__box">
                                    <p class="modal__text">${product.description}</p>
                                    <div class="modal__weight">
                                        <p class="modal__weightText">Основные характеристики</p>
                                        <div class="modal__weightNum">
                                            <p>Вес</p>
                                            <p>${product.weight}</p>
                                        </div>
                                    </div>
                                    <button class="modal__btn">Описание</button>
                                    <p class="modal__text">${product.description}</p>
                                </div>
                                <div class="modal__add">
                                    <button class="modal__bntAdd" data-product='${JSON.stringify({
                                        name: product.name,
                                        price: product.price,
                                        imageUrl: product.imgUrl,
                                        quantity: 1
                                    })}'>Добавить
                                    </button>
                                    <a class="modal__link" href="#">Купить в один клик</a>
                                </div>
                            </div>
                        </article>
                        <img class="modal__exit" src="./img/icon-header/exit.png" alt="exit" onclick="closeModal('${modalId}')">
                    </section>
                `;

                modalContainer.insertAdjacentHTML('beforeend', modalHTML);
            });
        }

        function addEventListeners() {
            document.addEventListener('click', (event) => {
                const card = event.target.closest('.product-box__card');
                if (card && card.classList.contains('openModal') && !event.target.classList.contains('addProduct')) {
                    const productName = card.querySelector('.product-box__card-title').textContent;
                    openModal(productName);
                }

                if (event.target.classList.contains('addProduct')) {
                    const productData = JSON.parse(event.target.getAttribute('data-product'));
                    addToCart(productData);
                }
            });

            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('modal__bntAdd')) {
                    const productData = JSON.parse(event.target.getAttribute('data-product'));
                    addToCart(productData);

                    const modal = event.target.closest('.modal');
                    if (modal) {
                        closeModal(modal.id);
                    }
                }
            });

            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('modal')) {
                    closeModal(event.target.id);
                }
            });
        }

        updateCartHeader();
    })
    .catch(error => console.error('Ошибка загрузки', error));

function openModal(productName) {
    const modalId = `${productName.toLowerCase().replace(/\s+/g, '')}Modal`;
    let modal = document.getElementById(modalId);

    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    let modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function updateCartHeader() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let cartTotalPrice = document.querySelector('.header__text');
    if (cartTotalPrice) {
        cartTotalPrice.textContent = `${totalPrice} руб.`;
    }
}







