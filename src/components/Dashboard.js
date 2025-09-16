// Dashboard.js
import React from "react";
import "./Dashboard.css";

function Dashboard({ products, sales }) {
  const totalProducts = products.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => {
    const product = products.find((p) => p.id === parseInt(sale.productId));
    return sum + (product ? product.price * sale.quantity : 0);
  }, 0);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="cards-horizontal">
        <div className="card">
          <h3>Products</h3>
          <p>{totalProducts}</p>
        </div>
        <div className="card">
          <h3>Sales</h3>
          <p>{totalSales}</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>M{totalRevenue}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>Products Menu</h2>
      <div className="cards-horizontal">
        {products.map((product) => (
          <div
            className="product-card"
            key={product.id}
          >
            <img
              src={product.image || "/images/default.webp"}
              alt={product.name}
              className="product-image"
            />
            <h3>{product.name}</h3>
            <p>Price: M{product.price}</p>
            <p style={{ color: product.quantity <= 5 ? "red" : "#007bff", fontWeight: product.quantity <= 5 ? "bold" : "normal" }}>
              Qty: {product.quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
