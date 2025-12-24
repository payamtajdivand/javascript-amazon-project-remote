import { cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import formatCurrency from "./utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
import { addOrder } from "../data/orders.js";

//import "../data/backend-practice.js"

async function loadPage() {
  try {
    await loadProductsFetch();
    //throw "error1";

    const value = await new Promise((resolve, reject) => {
      loadCart(() => {
        //reject("error3")
        resolve("value4");
      });
    });
  } catch (error) {
    console.log("Unexpected Error ,  please try again later!");
  }

  renderOrderSummary();
  updatePaymentSummary();
}

loadPage();
/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve("value2");
    });
  }),
]).then((values) => {
  console.log(values);
  renderOrderSummary();
  updatePaymentSummary();
});
*/
/*new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
})

  .then(() => {
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })

  .then(() => {
    renderOrderSummary();
    updatePaymentSummary();
  })*/

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = "";
  deliveryOptions.forEach((deliveryOption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

    const dateString = deliveryDate.format("dddd, MMMM D");

    const priceString =
      deliveryOption.priceCents === 0
        ? "FREE"
        : `$${formatCurrency(deliveryOption.priceCents)} -`;
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
    html += `
    <div class="delivery-option">
                  <input
                    type="radio"
                    ${isChecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                    data-delivery-option-id="${deliveryOption.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${dateString}</div>
                    <div class="delivery-option-price">${priceString} Shipping</div>
                  </div>
                </div>
  `;
  });
  return html;
}

function renderOrderSummary() {
  let cartSummaryHTML = "";
  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");

    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${
      matchingProduct.id
    }">
              <div class="delivery-date">Delivery date: ${dateString}</div>

              <div class="cart-item-details-grid">
                <img
                  class="product-image"
                  src="${matchingProduct.image}"
                />

                <div class="cart-item-details">
                  <div class="product-name">
                    ${matchingProduct.name}
                  </div>
                  <div class="product-price">$${formatCurrency(
                    matchingProduct.priceCents
                  )}</div>
                  <div class="product-quantity">
                    <span> Quantity: <span class="quantity-label">${
                      cartItem.quantity
                    }</span> </span>
                    <span class="update-quantity-link link-primary">
                      Update
                    </span>
                    <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                      matchingProduct.id
                    }">
                      Delete
                    </span>
                  </div>
                </div>

                <div class="delivery-options">
                  <div class="delivery-options-title">
                    Choose a delivery option:
                  </div>
                
                   ${deliveryOptionsHTML(matchingProduct, cartItem)}
                  
                </div>
              </div>
            </div>
    `;
  });

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  updatePaymentSummary();

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);
      console.log(cart);
      renderOrderSummary();
    });
  });

  document.querySelectorAll(".delivery-option-input").forEach((input) => {
    input.addEventListener("change", (event) => {
      const productId = event.target.name.replace("delivery-option-", "");
      const deliveryOptionId = event.target.dataset.deliveryOptionId;

      cart.forEach((cartItem) => {
        if (cartItem.productId === productId) {
          cartItem.deliveryOptionId = deliveryOptionId;
        }
      });

      renderOrderSummary();
    });
  });
}

function updatePaymentSummary() {
  let itemsCostCents = 0;
  let shippingCostCents = 0;

  cart.forEach((cartItem) => {
    let matchingProduct;
    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        matchingProduct = product;
      }
    });

    itemsCostCents += matchingProduct.priceCents * cartItem.quantity;

    let deliveryOption;
    deliveryOptions.forEach((option) => {
      if (option.id === cartItem.deliveryOptionId) {
        deliveryOption = option;
      }
    });

    shippingCostCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = itemsCostCents + shippingCostCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const itemCount = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  );

  document.querySelector(".js-items-cost").innerHTML = `$${formatCurrency(
    itemsCostCents
  )}`;
  document.querySelector(".js-shipping-cost").innerHTML = `$${formatCurrency(
    shippingCostCents
  )}`;
  document.querySelector(".js-total-before-tax").innerHTML = `$${formatCurrency(
    totalBeforeTaxCents
  )}`;
  document.querySelector(".js-tax-cost").innerHTML = `$${formatCurrency(
    taxCents
  )}`;
  document.querySelector(".js-order-total").innerHTML = `$${formatCurrency(
    totalCents
  )}`;
  document.querySelector(".js-item-count").innerHTML = itemCount;
}
/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    updatePaymentSummary();
  });
});
*/
/*loadProducts(() => {
  renderOrderSummary();
}); */

document
  .querySelector(".js-place-order")
  .addEventListener("click", async () => {
    try {
      const response = await fetch("https://supersimplebackend.dev/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
        }),
      });

      const order = await response.json();
      addOrder(order);
    } catch (error) {
      console.log("Unexpected Error , Try again later!");
    }

    window.location.href = "orders.html";
  });
