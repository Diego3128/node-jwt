import { calculateTotal, type Product, type CartItem } from "../cart";

describe("calculates cart total price", () => {
  const cart: Product[] = [
    { id: "1", name: "Laptop", price: 1000 },
    { id: "2", name: "Mouse", price: 50 },
  ];
  const cartItems: CartItem[] = [
    { product: cart[0], quantity: 1 },
    { product: cart[1], quantity: 2 },
  ];

  it("should calculate the total price properly", () => {
    expect(calculateTotal(cartItems)).toBe(1100);
  });
});
