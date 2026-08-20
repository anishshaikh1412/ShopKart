import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const navigate = useNavigate();

  const items = cart?.items || [];

  const total = items.reduce((sum, item) => {
    const price =
      item.product?.discountPrice > 0
        ? item.product.discountPrice
        : item.product?.price || 0;

    return sum + price * item.quantity;
  }, 0);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id);
      toast.success("Product removed");
    } catch (error) {
      toast.error("Unable to remove product");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white py-20 text-center shadow-sm">
            <div className="text-7xl">🛒</div>

            <h2 className="mt-5 text-2xl font-bold">Your cart is empty</h2>

            <p className="mt-2 text-slate-500">
              Add some products and come back here.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-block rounded-xl bg-violet-600 px-6 py-3 font-bold text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <section className="space-y-4 lg:col-span-2">
              {items.map((item) => {
                const price =
                  item.product?.discountPrice > 0
                    ? item.product.discountPrice
                    : item.product?.price || 0;

                return (
                  <div
                    key={item.product._id}
                    className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-28 w-28 rounded-xl bg-slate-100 object-contain"
                    />

                    <div className="flex-1">
                      <h2 className="font-bold">{item.product.name}</h2>

                      <p className="mt-1 text-lg font-bold text-violet-600">
                        ₹{price.toLocaleString("en-IN")}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex rounded-lg border">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="px-3 py-2"
                          >
                            −
                          </button>

                          <span className="px-4 py-2 font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-2"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="text-sm font-semibold text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <p className="text-xl font-bold">
                      ₹{(price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="mt-6 flex justify-between border-b pb-4">
                <span className="text-slate-500">Items</span>

                <span className="font-semibold">{items.length}</span>
              </div>

              <div className="flex justify-between py-5">
                <span className="font-semibold">Total</span>

                <span className="text-2xl font-extrabold">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white hover:bg-violet-700"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="mt-3 block text-center text-sm font-semibold text-violet-600"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
