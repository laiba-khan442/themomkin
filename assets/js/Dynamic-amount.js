const selectEl = document.getElementById('product_size_select');
const amountEl = document.getElementById('product_amount');

selectEl.addEventListener('change', function () {
    const selectedSize = this.value;

    if (!selectedSize) return;

    const priceKey = `price-${selectedSize}`;
    const newPrice = this.getAttribute(`data-${priceKey}`);

    if (newPrice !== null) {
        amountEl.textContent = newPrice;
    }

    localStorage.setItem('selectedSize', selectedSize);
    localStorage.setItem('selectedPrice', newPrice);
});

document.addEventListener('DOMContentLoaded', function () {
    const savedSize = localStorage.getItem('selectedSize');
    const savedPrice = localStorage.getItem('selectedPrice');

    if (savedSize && savedPrice) {
        selectEl.value = savedSize;
        amountEl.textContent = savedPrice;
    }
});