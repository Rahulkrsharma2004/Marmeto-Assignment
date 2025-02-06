const apiURL = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';

fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    const cartItemsContainer = document.getElementById('cart-items');
    let subtotal = 0;

    data.cart.forEach(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-image" />
        <div class="cart-details">
          <h3>${item.name}</h3>
          <p>Price: Rs. ${item.price.toFixed(2)}</p>
          <input type="number" value="${item.quantity}" class="cart-quantity" />
          <p>Subtotal: Rs. ${itemSubtotal.toFixed(2)}</p>
          <button class="delete-item">Delete</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('subtotal').textContent = `Subtotal: Rs. ${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `Total: Rs. ${subtotal.toFixed(2)}`;
  })
  .catch(error => console.error('Error fetching cart data:', error));
