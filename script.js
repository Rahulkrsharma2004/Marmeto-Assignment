const apiURL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    console.log('API Response:', data.items); // Debugging: Check actual response

    if (!data || !data.items || !Array.isArray(data.items)) {  // Ensure data and items exist and are an array
      console.error('Cart data not found in API response or items is not an array');
      return;
    }

    const cartItemsContainer = document.querySelector('#cart-items'); // Ensure correct ID
    cartItemsContainer.innerHTML = ""; // Clear existing content

    let subtotal = 0;

    data.items.forEach((item, index) => {  // Loop directly through data.items
      if (!item.price || !item.quantity) return; // Skip invalid items

      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="product-info">
          <img src="${item.image}" alt="${item.name}" class="cart-image" />
          <span>${item.product_title
          }</span>
        </td>
        <td>₹ ${item.price.toFixed(2)}</td>
        <td><input type="number" value="${item.quantity}" min="1" class="cart-quantity" data-index="${index}"></td>
        <td>₹ <span class="item-subtotal">${itemSubtotal.toFixed(2)}</span></td>
        <td><span class="delete" data-index="${index}" style="cursor:pointer;">🗑️</span></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    updateCartTotals(subtotal);

    // Attach event listeners for quantity change and delete button
    document.querySelectorAll('.cart-quantity').forEach(input => {
      input.addEventListener('change', updateQuantity);
    });

    document.querySelectorAll('.delete').forEach(button => {
      button.addEventListener('click', removeItem);
    });
  })
  .catch(error => console.error('Error fetching cart data:', error));

/**
 * Updates the subtotal and total when quantity is changed.
 */
function updateQuantity(event) {
  const index = event.target.dataset.index;
  const newQuantity = parseInt(event.target.value);
  if (newQuantity < 1) return;

  fetch(apiURL)
    .then(response => response.json())
    .then(data => {
      if (!data || !data.items) return;

      const item = data.items[index];
      const newSubtotal = item.price * newQuantity;
      event.target.closest('tr').querySelector('.item-subtotal').textContent = newSubtotal.toFixed(2);

      // Recalculate totals
      let newTotal = 0;
      document.querySelectorAll('.item-subtotal').forEach(subtotal => {
        newTotal += parseFloat(subtotal.textContent);
      });

      updateCartTotals(newTotal);
    });
}

/**
 * Removes an item from the cart.
 */
function removeItem(event) {
  const index = event.target.dataset.index;
  event.target.closest('tr').remove(); // Remove item row

  let newTotal = 0;
  document.querySelectorAll('.item-subtotal').forEach(subtotal => {
    newTotal += parseFloat(subtotal.textContent);
  });

  updateCartTotals(newTotal);
}

/**
 * Updates the cart total and subtotal values.
 */
function updateCartTotals(total) {
  document.querySelector('.subtotal').textContent = `Subtotal: ₹ ${total.toFixed(2)}`;
  document.querySelector('.total span').textContent = `₹ ${total.toFixed(2)}`;
}

/**
 * Checkout Button Functionality (Placeholder).
 */
document.getElementById('checkout').addEventListener('click', () => {
  alert('Proceeding to checkout...');
});
