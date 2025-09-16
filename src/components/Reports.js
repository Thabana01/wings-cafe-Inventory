// src/components/Reports.js
import React from "react";
import "./Reports.css";

function Reports({ products = [], customers = [], sales = [], deleteSale }) {
  const activeSales = sales.filter((s) => s.status !== "deleted");
  const deletedSales = sales.filter((s) => s.status === "deleted");

  const totalRevenue = activeSales.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productId);
    return sum + (product ? product.price * s.quantity : 0);
  }, 0);

  const totalProfit = activeSales.reduce((sum, s) => {
    const product = products.find((p) => p.id === s.productId);
    return sum + (product ? (product.price - product.cost) * s.quantity : 0);
  }, 0);

  const productStock = products.map((p) => {
    const soldQty = activeSales
      .filter((s) => s.productId === p.id)
      .reduce((sum, s) => sum + s.quantity, 0);
    const deletedQty = deletedSales
      .filter((s) => s.productId === p.id)
      .reduce((sum, s) => sum + s.quantity, 0);

    return {
      ...p,
      quantityBought: soldQty + deletedQty,
      quantityLeft: (p.quantity || 0) - soldQty,
    };
  });

  // 🔹 Calculate total stock available (all quantityLeft)
  const totalStockAvailable = productStock.reduce(
    (sum, p) => sum + (p.quantityLeft || 0),
    0
  );

  return (
    <div className="reports-container">
      <h3>Reports</h3>

      {/* Summary Section */}
      <section className="summary-container">
        <h2>Inventory Summary</h2>
        <div className="summary-cards">
          <div className="card">
            <h4>Total Products</h4>
            <p>{products.length}</p>
          </div>
          <div className="card">
            <h4>Total Customers</h4>
            <p>{customers.length}</p>
          </div>
          <div className="card">
            <h4>Total Sales</h4>
            <p>{activeSales.length}</p>
          </div>
          <div className="card">
            <h4>Total Stock Available</h4>
            <p>{totalStockAvailable}</p>
          </div>
          <div className="card revenue">
            <h4>Total Revenue</h4>
            <p>M{totalRevenue.toFixed(2)}</p>
          </div>
          <div className="card profit">
            <h4>Total Profit</h4>
            <p>M{totalProfit.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Product Stock Section */}
      <section className="product-stock-container">
        <h3>Product Stock Overview</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Bought</th>
              <th>Quantity Left</th>
              <th>Price</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {productStock.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.quantityBought}</td>
                <td>{p.quantityLeft}</td>
                <td>M{p.price.toFixed(2)}</td>
                <td>M{p.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Active Sales Section */}
      <section className="active-sales-container">
        <h3>Active Sales Records</h3>
        {activeSales.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeSales.map((s) => {
                const product = products.find((p) => p.id === s.productId);
                const customer = customers.find((c) => c.id === s.customerId);
                const revenue = product ? product.price * s.quantity : 0;
                const cost = product ? product.cost * s.quantity : 0;
                const profit = revenue - cost;

                return (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{product ? product.name : "Unknown"}</td>
                    <td>{customer ? customer.name : "Unknown"}</td>
                    <td>{s.quantity}</td>
                    <td>{s.date ? new Date(s.date).toLocaleString() : "-"}</td>
                    <td>M{revenue.toFixed(2)}</td>
                    <td>M{cost.toFixed(2)}</td>
                    <td>M{profit.toFixed(2)}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteSale(s.id)}
                      >
                        Delete ❌
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No active sales recorded yet.</p>
        )}
      </section>

      {/* Deleted Sales Section */}
      {deletedSales.length > 0 && (
        <section className="deleted-sales-container">
          <h3>Deleted Sales History</h3>
          <table>
            <thead>
              <tr>
                <th>Sale ID</th>
                <th>Product</th>
                <th>Customer</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {deletedSales.map((s) => {
                const product = products.find((p) => p.id === s.productId);
                const customer = customers.find((c) => c.id === s.customerId);
                const revenue = product ? product.price * s.quantity : 0;
                const cost = product ? product.cost * s.quantity : 0;
                const profit = revenue - cost;

                return (
                  <tr key={s.id} className="deleted">
                    <td>{s.id}</td>
                    <td>{product ? product.name : "Unknown"}</td>
                    <td>{customer ? customer.name : "Unknown"}</td>
                    <td>{s.quantity}</td>
                    <td>{s.date ? new Date(s.date).toLocaleString() : "-"}</td>
                    <td>M{revenue.toFixed(2)}</td>
                    <td>M{cost.toFixed(2)}</td>
                    <td>M{profit.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default Reports;
