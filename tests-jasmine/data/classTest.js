import { Product } from "../../data/products.js";
import { Clothing } from "../../data/products.js";
import { loadProducts } from "../../data/products.js";

describe("Test suit: Prodcut", () => {
  beforeAll((done) => {
    loadProducts(() => {
      done();
    });
  });
  it("has correct property and methods", () => {
    const product = new Product({
      id: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      image: "images/products/athletic-cotton-socks-6-pairs.jpg",
      name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
      rating: {
        stars: 4.5,
        count: 87,
      },
      priceCents: 1090,
      keywords: ["socks", "sports", "apparel"],
    });
    expect(product.name).toEqual(
      "Black and Gray Athletic Cotton Socks - 6 Pairs"
    );
    expect(product.getPrice()).toEqual("$10.90");
  });
});

describe("Test suit: Clothing", () => {
  beforeAll((done) => {
    loadProducts(() => {
      done();
    });
  });
  it("has correct Properties", () => {
    const clothing1 = new Clothing({
      id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
      name: "Adults Plain Cotton T-Shirt - 2 Pack",
      rating: {
        stars: 4.5,
        count: 56,
      },
      priceCents: 799,
      keywords: ["tshirts", "apparel", "mens"],
      type: "clothing",
      sizeChartLink: "images/clothing-size-chart.png",
    });
    expect(clothing1.name).toEqual("Adults Plain Cotton T-Shirt - 2 Pack");
  });

  it("has correct Methods", () => {
    const clothing2 = new Clothing({
      id: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
      image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
      name: "Adults Plain Cotton T-Shirt - 2 Pack",
      rating: {
        stars: 4.5,
        count: 56,
      },
      priceCents: 799,
      keywords: ["tshirts", "apparel", "mens"],
      type: "clothing",
      sizeChartLink: "images/clothing-size-chart.png",
    });
    expect(clothing2.getStarsUrl()).toEqual(
      `images/ratings/rating-${clothing2.rating.stars * 10}.png`
    );
  });
});
