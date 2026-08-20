import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const price =
    product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to add to cart");
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4">
      <Link to={`/products/${product._id}`}>
        <div className="flex h-48 items-center justify-center rounded bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </div>

        <h3 className="mt-4 font-semibold text-gray-900">{product.name}</h3>
      </Link>

      <p className="mt-1 text-sm text-gray-500">{product.brand}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg font-bold">
          ₹{price.toLocaleString("en-IN")}
        </span>

        {product.discountPrice > 0 && (
          <span className="text-sm text-gray-400 line-through">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        className="mt-4 w-full rounded bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
