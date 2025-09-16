// Basic validation for forms

export const isNotEmpty = (value) => value && value.trim() !== "";

export const validateProduct = (product) => {
  return isNotEmpty(product.name) && isNotEmpty(product.category) && product.price > 0;
};

export const validateCustomer = (customer) => {
  return isNotEmpty(customer.name) && isNotEmpty(customer.email);
};
