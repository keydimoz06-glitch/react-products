import ProductCard from "./ProductCard";

function ProductList({ products, onEdit, onDelete }) {
  if (products.length === 0) {
    return <p>No hay productos para mostrar.</p>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default ProductList;
