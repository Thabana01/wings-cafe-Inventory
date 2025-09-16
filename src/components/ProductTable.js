import React from "react";
import "./ProductTable.css";

function ProductTable({ products = [], setEditProduct, deleteProduct }) {
  if (products.length === 0) {
    return <p style={{ textAlign: "center" }}>No products found</p>;
  }

  return (
    <div className="product-cards-container">
      {products.map((p) => (
        <div
          key={p.id}
          className={`product-card ${p.quantity <= 5 ? "low-stock" : ""}`}
        >
          <img
            src={p.image || "/images/default.webp"}
            alt={p.name}
            className="product-image"
          />
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>Category: {p.category}</p>
          <p>Price: M{p.price.toFixed(2)}</p>
          <p>Qty: {p.quantity}</p>
          <div className="product-actions">
            <button onClick={() => setEditProduct(p)}>Edit</button>
            <button onClick={() => deleteProduct(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductTable;
