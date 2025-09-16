import React, { useState, useEffect } from "react";
import "./ProductForm.css"; 

function ProductForm({ addProduct, editProduct, updateProduct }) {
  const [form, setForm] = useState({ name: "", description: "", category: "", price: "", quantity: "" });

  useEffect(() => {
    if (editProduct) setForm(editProduct);
    else setForm({ name: "", description: "", category: "", price: "", quantity: "" });
  }, [editProduct]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
    if (editProduct) updateProduct(editProduct.id, payload);
    else addProduct(payload);
    setForm({ name: "", description: "", category: "", price: "", quantity: "" });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
      <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handleChange} required />
      <button type="submit">{editProduct ? "Update" : "Add"} Product</button>
    </form>
  );
}

export default ProductForm;
