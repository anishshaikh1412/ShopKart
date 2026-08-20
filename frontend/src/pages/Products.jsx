import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products", {
        params: {
          search,
          sort,
        },
      });

      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, sort]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-semibold text-violet-600">URBANCART SHOP</p>

            <h1 className="mt-1 text-3xl font-extrabold">Explore Products</h1>

            <p className="mt-2 text-slate-500">Find something you'll love.</p>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border bg-white px-4 py-3 outline-none focus:border-violet-500"
          >
            <option value="">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="mt-7">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-xl border bg-white px-5 py-3 outline-none focus:border-violet-500"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl">🔎</div>
            <h2 className="mt-4 text-xl font-bold">No products found</h2>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const price =
                product.discountPrice > 0
                  ? product.discountPrice
                  : product.price;

              return (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-56 items-center justify-center bg-slate-100 p-5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase text-violet-600">
                      {product.category}
                    </p>

                    <h2 className="mt-2 line-clamp-2 font-bold text-slate-900">
                      {product.name}
                    </h2>

                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xl font-extrabold">
                        ₹{price.toLocaleString("en-IN")}
                      </span>

                      {product.discountPrice > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 text-sm text-yellow-500">
                      ⭐ {product.rating || "New"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
