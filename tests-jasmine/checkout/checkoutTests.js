import { cart, loadFromStorage } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliveryOptions.js";
import formatCurrency from "../../scripts/utils/money.js";

describe("test suite: checkout summary", () => {
  beforeEach(() => {
    spyOn(localStorage, "getItem").and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 2,
          deliveryOptionId: "2",
        },
      ]);
    });
    loadFromStorage();
  });

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
    document.querySelector(
      ".js-total-before-tax"
    ).innerHTML = `$${formatCurrency(totalBeforeTaxCents)}`;
    document.querySelector(".js-tax-cost").innerHTML = `$${formatCurrency(
      taxCents
    )}`;
    document.querySelector(".js-order-total").innerHTML = `$${formatCurrency(
      totalCents
    )}`;
    document.querySelector(".js-item-count").innerHTML = itemCount;
  }

  it("displays correct item count", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    updatePaymentSummary();
    expect(mockElements[".js-item-count"].innerHTML).toEqual("3");
  });

  it("displays correct items cost", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    updatePaymentSummary();
    const expectedItemsCost =
      products[0].priceCents * 1 + products[1].priceCents * 2;
    expect(mockElements[".js-items-cost"].innerHTML).toEqual(
      `$${formatCurrency(expectedItemsCost)}`
    );
  });

  it("displays correct shipping cost", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    updatePaymentSummary();
    const shippingCost =
      deliveryOptions[0].priceCents + deliveryOptions[1].priceCents;
    expect(mockElements[".js-shipping-cost"].innerHTML).toEqual(
      `$${formatCurrency(shippingCost)}`
    );
  });

  it("displays correct total before tax", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    updatePaymentSummary();
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

    const expectedTotal = itemsCostCents + shippingCostCents;
    expect(mockElements[".js-total-before-tax"].innerHTML).toEqual(
      `$${formatCurrency(expectedTotal)}`
    );
  });

  it("displays correct tax amount (10% of total before tax)", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    updatePaymentSummary();
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
    const expectedTax = totalBeforeTaxCents * 0.1;
    expect(mockElements[".js-tax-cost"].innerHTML).toEqual(
      `$${formatCurrency(expectedTax)}`
    );
  });

  it("displays correct order total (total before tax + tax)", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    updatePaymentSummary();
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
    const expectedTotal = totalBeforeTaxCents + taxCents;
    expect(mockElements[".js-order-total"].innerHTML).toEqual(
      `$${formatCurrency(expectedTotal)}`
    );
  });

  it("handles empty cart correctly", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    localStorage.getItem.and.callFake(() => {
      return JSON.stringify([]);
    });
    loadFromStorage();
    updatePaymentSummary();

    expect(mockElements[".js-item-count"].innerHTML).toEqual("0");
    expect(mockElements[".js-items-cost"].innerHTML).toEqual("$0.00");
    expect(mockElements[".js-shipping-cost"].innerHTML).toEqual("$0.00");
    expect(mockElements[".js-total-before-tax"].innerHTML).toEqual("$0.00");
    expect(mockElements[".js-tax-cost"].innerHTML).toEqual("$0.00");
    expect(mockElements[".js-order-total"].innerHTML).toEqual("$0.00");
  });

  it("updates summary when cart has single item", () => {
    const mockElements = {};
    spyOn(document, "querySelector").and.callFake((selector) => {
      if (!mockElements[selector]) {
        mockElements[selector] = document.createElement("div");
      }
      return mockElements[selector];
    });

    localStorage.getItem.and.callFake(() => {
      return JSON.stringify([
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 1,
          deliveryOptionId: "1",
        },
      ]);
    });
    loadFromStorage();
    updatePaymentSummary();

    expect(mockElements[".js-item-count"].innerHTML).toEqual("1");
  });
});
