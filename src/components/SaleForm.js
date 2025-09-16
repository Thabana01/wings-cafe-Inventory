import React, { useState } from "react";
import "./SaleForm.css";

function SaleForm({ products = [], recordSale }) {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState(""); // <-- success message

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: parseInt(value),
    });
  };

  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;
    if (quantity <= 0) return;
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Record sales
    cart.forEach(({ product, quantity }) => {
      recordSale({
        productId: product.id,
        quantity,
      });
    });

    setCart([]);
    setQuantities({});
    setMessage("✅ Sale completed successfully!"); // <-- show message

    // Hide the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="sale-form-container">
      <h3>Sales</h3>

      {message && <p className="sale-message">{message}</p>} {/* message display */}

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className={p.quantity <= 5 ? "low-stock" : ""}>
              <td>
                <img
                  src={p.image || "/images/default.webp"}
                  alt={p.name}
                  className="product-thumb"
                />
              </td>
              <td>{p.name}</td>
              <td>{p.quantity}</td>
              <td>M{p.price}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max={p.quantity}
                  value={quantities[p.id] || 1}
                  onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                />
              </td>
              <td>
                <button type="button" onClick={() => addToCart(p)}>
                  ➕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cart.length > 0 && (
        <div className="cart">
          <h4>Cart</h4>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>M{item.product.price * item.quantity}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.product.id)}>
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Total: M
            {cart.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            )}
          </p>

          <button onClick={handleSubmit}>💰 Complete Sale</button>
        </div>
      )}
    </div>
  );
}

export default SaleForm;
