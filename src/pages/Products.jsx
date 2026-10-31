import { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import {
  getProducts,
  deleteProduct,
  searchProducts,
  getCategories,
  getProductsByCategory,
  createProduct,
  updateProduct,
} from "../services/productService";

const LIMIT = 10;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ title: "", price: "", category: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [page]);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      const skip = (page - 1) * LIMIT;
      const data = await getProducts(LIMIT, skip);
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      setError(error.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: product.price,
      category: product.category,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ title: "", price: "", category: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      const payload = {
        title: form.title,
        price: Number(form.price),
        category: form.category,
      };

      if (editingId) {
        const data = await updateProduct(editingId, payload);
        setProducts(
          products.map((product) => (product.id === editingId ? data : product))
        );
      } else {
        const data = await createProduct(payload);
        setProducts([data, ...products]);
      }

      cancelEdit();
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      if (query.trim() === "") {
        await loadProducts();
        return;
      }
      const data = await searchProducts(query);
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCategory(e) {
    const value = e.target.value;
    setCategory(value);
    try {
      setLoading(true);
      setError("");
      if (value === "") {
        await loadProducts();
        return;
      }
      const data = await getProductsByCategory(value);
      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  function nextPage() {
    if (page < totalPages) setPage(page + 1);
  }

  function prevPage() {
    if (page > 1) setPage(page - 1);
  }

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h1>Productos</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <select value={category} onChange={handleCategory}>
        <option value="">Todas las categorías</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <button type="submit">
          {editingId ? "Actualizar producto" : "Crear producto"}
        </button>
        {editingId && (
          <button type="button" onClick={cancelEdit}>
            Cancelar
          </button>
        )}
      </form>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div>
        <button onClick={prevPage} disabled={page === 1}>
          Anterior
        </button>
        <span>
          {" "}
          Página {page} de {totalPages}{" "}
        </span>
        <button onClick={nextPage} disabled={page >= totalPages}>
          Siguiente
        </button>
      </div>
    </section>
  );
}

export default Products;
