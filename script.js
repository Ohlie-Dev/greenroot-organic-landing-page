document.addEventListener('DOMContentLoaded', () => {
    const vendorPhoneNumber = "2348012345678"; 
    let cart = [];

    const cartBadge = document.getElementById('cart-badge');
    const addToCartButtons = document.querySelectorAll('.addToCartBtn');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalElement = document.getElementById('cart-total');
    const checkoutBtn = document.querySelector('#cartDrawer .btn-neon');

    function updateCartUI() {
        const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartBadge) {
            cartBadge.textContent = totalItemsCount;
        }

        cartItemsList.innerHTML = '';

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li class="list-group-item text-muted text-center py-4">Your cart is empty.</li>';
            if (cartTotalElement) cartTotalElement.textContent = 'N 0';
            return;
        }

        let grandTotal = 0;

        cart.forEach((item, index) => {
            const itemSubtotal = item.price * item.quantity;
            grandTotal += itemSubtotal;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center px-0 py-3';
            li.innerHTML = `
                <div class="pe-2">
                    <h6 class="my-0 fw-bold">${item.name}</h6>
                    <small class="text-muted">
                        N ${item.price.toLocaleString()} × ${item.quantity} = <strong class="text-dark">N ${itemSubtotal.toLocaleString()}</strong>
                    </small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-dark decrease-qty" data-index="${index}">-</button>
                        <span class="btn btn-light disabled text-dark fw-bold px-2" style="opacity: 1;">${item.quantity}</span>
                        <button class="btn btn-outline-dark increase-qty" data-index="${index}">+</button>
                    </div>
                    <button class="btn btn-sm btn-outline-danger border-0 remove-item" data-index="${index}">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;
            cartItemsList.appendChild(li);
        });

        if (cartTotalElement) {
            cartTotalElement.textContent = `N ${grandTotal.toLocaleString()}`;
        }

        document.querySelectorAll('.decrease-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                if (cart[idx].quantity > 1) {
                    cart[idx].quantity -= 1;
                } else {
                    cart.splice(idx, 1);
                }
                updateCartUI();
            });
        });

        document.querySelectorAll('.increase-qty').forEach(button => {
            button.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                cart[idx].quantity += 1;
                updateCartUI();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const idx = e.currentTarget.getAttribute('data-index');
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            event.preventDefault();

            const btn = event.currentTarget;
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === name);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }

            updateCartUI();

            btn.style.transform = 'scale(1.25)';
            btn.style.transition = 'transform 0.15s ease-in-out';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
        });
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Your cart is empty! Please add some fresh produce before checking out.");
                return;
            }

            let message = "Hello GreenRoot! 🌿\nI'd like to place an order from your website:\n\n*Order Summary:*\n";
            let grandTotal = 0;

            cart.forEach((item, i) => {
                const subtotal = item.price * item.quantity;
                grandTotal += subtotal;
                message += `${i + 1}. *${item.name}* (x${item.quantity}) - N ${subtotal.toLocaleString()}\n`;
            });

            message += `\n*Grand Total:* N ${grandTotal.toLocaleString()}\n\nPlease confirm availability and payment details!`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${vendorPhoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    const searchInput = document.getElementById('shop-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const noProductsMsg = document.getElementById('no-products-msg');

    if (searchInput && filterButtons.length > 0) {
        let currentFilter = 'all';

        function filterProducts() {
            const query = searchInput.value.toLowerCase().trim();
            let visibleCount = 0;

            productItems.forEach(item => {
                const title = item.querySelector('h6').textContent.toLowerCase();
                const category = item.getAttribute('data-category');

                const matchesFilter = (currentFilter === 'all' || category === currentFilter);
                const matchesSearch = title.includes(query);

                if (matchesFilter && matchesSearch) {
                    item.classList.remove('d-none');
                    visibleCount++;
                } else {
                    item.classList.add('d-none');
                }

                const urlParams = new URLSearchParams(window.location.search);
                const categoryParam = urlParams.get('category');

               if (categoryParam) {
               const targetBtn = document.querySelector(`.filter-btn[data-filter="${categoryParam}"]`);
               if (targetBtn) {
                targetBtn.click(); 
                
        }
    }
            });

            if (noProductsMsg) {
                if (visibleCount === 0) {
                    noProductsMsg.classList.remove('d-none');
                } else {
                    noProductsMsg.classList.add('d-none');
                }
            }
        }

        searchInput.addEventListener('input', filterProducts);

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                filterButtons.forEach(btn => {
                    btn.classList.remove('btn-dark', 'active');
                    btn.classList.add('btn-light', 'text-muted');
                });

                e.target.classList.remove('btn-light', 'text-muted');
                e.target.classList.add('btn-dark', 'active');

                currentFilter = e.target.getAttribute('data-filter');
                filterProducts();
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!contactForm.checkValidity()) {
                alert("enter your details to submit");
                return;
            }

            alert("thanks for submitting");

            contactForm.classList.add('d-none');

            const thankYouMsg = document.createElement('div');
            thankYouMsg.className = 'alert alert-success text-center py-4 rounded-4 fw-bold';
            thankYouMsg.innerHTML = 'Thank you! Your message has been received.';
            contactForm.parentNode.appendChild(thankYouMsg);
        });
    }
});