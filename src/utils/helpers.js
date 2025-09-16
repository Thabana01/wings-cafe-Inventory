// src/utils/helpers.js

// Format numbers as currency
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Check if a product is low in stock
export const lowStockAlert = (quantity, threshold = 5) => {
  return quantity <= threshold ? "⚠️ Low Stock" : "";
};
