import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);

      toast.success("Added to cart!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Please login first");
    }
  };

  if (loading) {
    return <div className="py-20 text-center">Loading product...</div>;
  }

  if (!product) {
    return <div className="py-20 text-center">Product not found.</div>;
  }

  const price =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid overflow-hidden rounded-3xl bg-white shadow-sm lg:grid-cols-2">
          <div className="flex min-h-[450px] items-center justify-center bg-slate-100 p-10">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[420px] max-w-full object-contain"
            />
          </div>

          <div className="p-7 sm:p-10">
            <p className="font-semibold uppercase text-violet-600">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3">
              <span className="rounded-lg bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-600">
                ⭐ {product.rating || "New"}
              </span>

              <span className="text-sm text-slate-500">
                {product.numReviews || 0} reviews
              </span>
            </div>

            <div className="mt-7">
              <span className="text-4xl font-extrabold">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {product.discountPrice > 0 && (
                <span className="ml-3 text-lg text-slate-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <p className="mt-6 leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <span className="font-semibold">Stock:</span>{" "}
              {product.stock > 0 ? (
                <span className="text-green-600">
                  {product.stock} available
                </span>
              ) : (
                <span className="text-red-500">Out of stock</span>
              )}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="flex items-center rounded-xl border bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-lg"
                >
                  −
                </button>

                <span className="px-3 font-bold">{quantity}</span>

                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-4 py-3 text-lg"
                >
                  +
                </button>
              </div>

              <button
                disabled={product.stock === 0}
                onClick={handleAddToCart}
                className="flex-1 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white hover:bg-violet-700 disabled:bg-slate-400"
              >
                Add to Cart
              </button>
            </div>

            <button
              onClick={() => navigate("/cart")}
              className="mt-3 w-full rounded-xl border border-violet-200 py-3 font-bold text-violet-600 hover:bg-violet-50"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;
