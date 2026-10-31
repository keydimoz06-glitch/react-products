const BASE_URL = "https://dummyjson.com/products";

export async function getProducts(limit = 10, skip = 0) {
  const response = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
  if (!response.ok) throw new Error("Error al obtener productos");
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Error al obtener el producto");
  return response.json();
}

export async function searchProducts(query) {
  const response = await fetch(`${BASE_URL}/search?q=${query}`);
  if (!response.ok) throw new Error("Error en la búsqueda");
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error("Error al obtener categorías");
  return response.json();
}

export async function getProductsByCategory(category) {
  const response = await fetch(`${BASE_URL}/category/${category}`);
  if (!response.ok) throw new Error("Error al filtrar por categoría");
  return response.json();
}

export async function createProduct(product) {
  const response = await fetch(`${BASE_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Error al crear el producto");
  return response.json();
}

export async function updateProduct(id, product) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error("Error al actualizar el producto");
  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el producto");
  return response.json();
}
