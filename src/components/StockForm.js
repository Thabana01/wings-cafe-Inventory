import React, { useState } from "react";
import "./StockForm.css";

function StockForm({ products = [], updateStock }) {
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [type, setType] = useState("add");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Please select a product!");
      return;
    }
    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    updateStock({
      productId: parseInt(selectedProductId),
      type,
      quantity: parseInt(quantity),
    });

    // Reset form
    setSelectedProductId(null);
    setType("add");
    setQuantity(1);
  };

  return (
    <div className="stock-form-container">
      <h3>Stock Management</h3>
      <form className="stock-form" onSubmit={handleSubmit}>
        <table className="stock-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Image</th>
              <th>Name</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.quantity <= 5 ? "low-stock" : ""}>
                <td>
                  <input
                    type="radio"
                    name="selectedProduct"
                    value={p.id}
                    checked={selectedProductId === p.id}
                    onChange={() => setSelectedProductId(p.id)}
                  />
                </td>
                <td>
                  <img
                    src={p.image || "/images/default.webp"}
                    alt={p.name}
                    className="product-thumb"
                  />
                </td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="stock-controls">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="add">Add Stock</option>
            <option value="deduct">Deduct Stock</option>
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />

          <button type="submit">Update Stock</button>
        </div>
      </form>
    </div>
  );
}

export default StockForm;
