// App.js
import React, { useState, useEffect, useRef } from "react";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import SaleForm from "./components/SaleForm";
import StockForm from "./components/StockForm";
import Reports from "./components/Reports";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [navHeight, setNavHeight] = useState(0); 
  const navRef = useRef(null);

  // Fetch data from backend
  const fetchData = async (endpoint, setState) => {
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`);
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
      const data = await res.json();
      setState(data || []);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err.message);
      setState([]);
    }
  };

  useEffect(() => {
    fetchData("products", setProducts);
    fetchData("sales", setSales);
  }, []);

  // Measure nav height dynamically
  useEffect(() => {
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    const handleResize = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Products ---
  const addProduct = async (product) => {
    await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, transactions: [] }),
    });
    fetchData("products", setProducts);
  };

  const updateProduct = async (id, updatedProduct) => {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });
    fetchData("products", setProducts);
    setEditProduct(null);
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    fetchData("products", setProducts);
  };

  // --- Sales ---
  const recordSale = async ({ productId, quantity }) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return alert("Product not found!");
    if (product.quantity < quantity) return alert("Not enough stock!");

    const updatedProduct = {
      ...product,
      quantity: product.quantity - quantity,
      transactions: [
        ...(product.transactions || []),
        { type: "deduct", quantity, date: new Date().toISOString() },
      ],
    };

    await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    await fetch("http://localhost:5000/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        quantity,
        date: new Date().toISOString(),
        status: "active",
      }),
    });

    fetchData("products", setProducts);
    fetchData("sales", setSales);

    alert(`Sale of ${quantity} unit(s) completed!`);
  };

  const deleteSale = async (id) => {
    const sale = sales.find((s) => s.id === id);
    if (!sale) return;
    await fetch(`http://localhost:5000/api/sales/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sale, status: "deleted" }),
    });
    fetchData("sales", setSales);
  };

  // --- Stock ---
  const updateStock = async ({ productId, type, quantity }) => {
    const product = products.find((p) => p.id === parseInt(productId));
    if (!product) return;

    const newQty =
      type === "add"
        ? product.quantity + quantity
        : Math.max(product.quantity - quantity, 0);

    const updatedProduct = {
      ...product,
      quantity: newQty,
      transactions: [
        ...(product.transactions || []),
        { type, quantity, date: new Date().toISOString() },
      ],
    };

    await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    fetchData("products", setProducts);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        ref={navRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          padding: "5px 5px",
          background: "#1e2a38",
          color: "#fff",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <h2 style={{ color: "blue" }}>Wings Inventory</h2>
        <ul
          style={{
            display: "flex",
            listStyle: "none",
            gap: "1.5rem",
            margin: 0,
          }}
        >
          {["dashboard", "products", "sales", "stock", "reports"].map((tab) => (
            <li
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                cursor: "pointer",
                fontWeight: activeTab === tab ? "bold" : "normal",
                borderBottom: activeTab === tab ? "2px solid #00c3ff" : "none",
                paddingBottom: "0.2rem",
                color: "#fff",
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </li>
          ))}
        </ul>
      </header>

      <main
        style={{
          flex: 1,
          padding: "2rem 20px",
          paddingTop: navHeight + 20,
        }}
      >
        {activeTab === "dashboard" && <Dashboard products={products} sales={sales} />}
        {activeTab === "products" && (
          <>
            <h2>Products</h2>
            <ProductTable
              products={products}
              setEditProduct={setEditProduct}
              deleteProduct={deleteProduct}
            />
            <ProductForm
              addProduct={addProduct}
              editProduct={editProduct}
              updateProduct={updateProduct}
            />
          </>
        )}
        {activeTab === "sales" && <SaleForm products={products} recordSale={recordSale} />}
        {activeTab === "stock" && <StockForm products={products} updateStock={updateStock} />}
        {activeTab === "reports" && <Reports products={products} sales={sales} deleteSale={deleteSale} />}
      </main>

      <footer
        style={{
          width: "100vw",
          padding: "1rem 20px",
          background: "linear-gradient(90deg, #1e2a38, #243b55)",
          color: "#e5e7eb",
          textAlign: "center",
          borderTop: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 -2px 6px rgba(0,0,0,0.25)",
          fontSize: "0.9rem",
          letterSpacing: "0.5px",
        }}
      >
        © {new Date().getFullYear()} Wings Inventory. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
