import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const fetchProducts = () => axios.get(`${BASE_URL}/products`);
export const fetchCustomers = () => axios.get(`${BASE_URL}/customers`);
export const fetchSales = () => axios.get(`${BASE_URL}/sales`);

export const addProduct = (product) => axios.post(`${BASE_URL}/products`, product);
export const updateProduct = (id, product) => axios.put(`${BASE_URL}/products/${id}`, product);
export const deleteProduct = (id) => axios.delete(`${BASE_URL}/products/${id}`);

export const addCustomer = (customer) => axios.post(`${BASE_URL}/customers`, customer);
export const updateCustomer = (id, customer) => axios.put(`${BASE_URL}/customers/${id}`, customer);
export const deleteCustomer = (id) => axios.delete(`${BASE_URL}/customers/${id}`);

export const recordSale = (sale) => axios.post(`${BASE_URL}/sales`, sale);
