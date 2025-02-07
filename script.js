const apiURL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data.items);

    if (!data || !data.items || !Array.isArray(data.items)) { 
      console.error('Cart data not found in API response or items is not an array');
      return;
    }

    const cartItemsContainer = document.querySelector('#cart-items');
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    data.items.forEach((item, index) => { 
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;

      console.log(`Item ${index}:`, { price, quantity });

      if (price <= 0 || quantity <= 0) return;

      const itemSubtotal = price * quantity;
      subtotal += itemSubtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="product-info">
          <img src="${item.image}" alt="${item.name}" class="cart-image" />
          <span>${item.product_title}</span>
        </td>
        <td>₹ ${price.toFixed(2)}</td>
        <td><input type="number" value="${quantity}" min="1" class="cart-quantity" data-index="${index}"></td>
        <td>₹ <span class="item-subtotal">${itemSubtotal.toFixed(2)}</span></td>
        <td><span class="delete" data-index="${index}" style="cursor:pointer;">🗑️</span></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    updateCartTotals(subtotal);

    document.querySelectorAll('.cart-quantity').forEach(input => {
      input.addEventListener('change', updateQuantity);
    });

    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', removeItem);
    });
  })
  .catch(error => console.error('Error fetching cart data:', error));

function updateQuantity(event) {
  const index = event.target.dataset.index;
  const newQuantity = parseInt(event.target.value) || 1;
  if (newQuantity < 1) return;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      if (!data || !data.items) return;

      const item = data.items[index];
      const price = parseFloat(item.price) || 0;
      const newSubtotal = price * newQuantity;

      event.target.closest('tr').querySelector('.item-subtotal').textContent = newSubtotal.toFixed(2);

      let newTotal = 0;
      document.querySelectorAll('.item-subtotal').forEach(subtotal => {
        newTotal += parseFloat(subtotal.textContent) || 0;
      });

      updateCartTotals(newTotal);
    });
}

function removeItem(event) {
  const index = event.target.dataset.index;
  event.target.closest('tr').remove();

  let newTotal = 0;
  document.querySelectorAll('.item-subtotal').forEach(subtotal => {
    newTotal += parseFloat(subtotal.textContent) || 0;
  });

  updateCartTotals(newTotal);
}

function updateCartTotals(total) {
  console.log('Updating Total:', total); // Debugging: Check total value
  document.querySelector('.subtotal').textContent = `Subtotal: ₹ ${total.toFixed(2)}`;
  document.querySelector('.total').innerHTML = `Total: ₹ ${total.toFixed(2)}`;
}


document.getElementById('checkout').addEventListener('click', () => {
  alert('Proceeding to checkout...');
});
