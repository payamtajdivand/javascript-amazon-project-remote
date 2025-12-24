import { cart, addToCart } from "../data/cart.js";
import { products, loadProductsFetch } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

loadProductsFetch().then(() => {
  renderProductsGrid();
});

function renderProductsGrid() {
  let productsHTML = "";

  products.forEach((product) => {
    productsHTML += `
  <div class="product-container">
          <div class="product-image-container">
            <img
              class="product-image"
              src="${product.image}"
            />
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${product.name}
          </div>

          <div class="product-rating-container">
            <img
              class="product-rating-stars"
              src="${product.getStarsUrl()}"
            />
            <div class="product-rating-count link-primary">${
              product.rating.count
            }</div>
          </div>

          <div class="product-price">${product.getPrice()}</div>

          <div class="product-quantity-container">
            <select>
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
            ${product.extraInfoHTML()}
          <div class="product-spacer"></div>

          <div class="added-to-cart">
            <img src="images/icons/checkmark.png" />
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart"  data-product-id = "${
            product.id
          }">Add to Cart</button>
        </div>
  
  `;
  });

  document.querySelector(".js-products-grid").innerHTML = productsHTML;

  function updateCartQuantity() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
      cartQuantity += Number(cartItem.quantity);
    });

    document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
  }

  document.querySelectorAll(".js-add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;

      // Get the quantity from the dropdown next to the button
      const quantityDropdown = button.parentElement.querySelector("select");
      const quantity = quantityDropdown.value;

      addToCart(productId, quantity);
      updateCartQuantity();

      // Show "Added" message
      const addedMessage = button.parentElement.querySelector(".added-to-cart");
      addedMessage.classList.add("added-to-cart-show");

      // Hide "Added" message after 2 seconds
      setTimeout(() => {
        addedMessage.classList.remove("added-to-cart-show");
      }, 2000);
    });
  });
}
