import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Checkout = () => {
  const { token } = useAuth();
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("FAKE_CARD");

  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const total = (cart?.items || []).reduce((sum, item) => {
    const price =
      item.product?.discountPrice > 0
        ? item.product.discountPrice
        : item.product?.price || 0;

    return sum + price * item.quantity;
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/orders",
        {
          shippingAddress: address,
          paymentMethod,
          paymentDetails:
            paymentMethod === "FAKE_CARD"
              ? {
                  cardNumber: "4111111111111111",
                  cvv: "123",
                }
              : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();

      toast.success(response.data.message || "Order placed successfully");

      navigate("/my-orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <form onSubmit={placeOrder} className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Address */}
            <section className="rounded-lg border bg-white p-6">
              <h2 className="text-xl font-bold">Delivery Address</h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <input
                  name="fullName"
                  placeholder="Full Name"
                  required
                  value={address.fullName}
                  onChange={handleChange}
                  className="rounded border px-4 py-3"
                />

                <input
                  name="phone"
                  placeholder="Phone Number"
                  required
                  value={address.phone}
                  onChange={handleChange}
                  className="rounded border px-4 py-3"
                />

                <textarea
                  name="address"
                  placeholder="Complete Address"
                  required
                  value={address.address}
                  onChange={handleChange}
                  className="min-h-24 rounded border px-4 py-3 sm:col-span-2"
                />

                <input
                  name="city"
                  placeholder="City"
                  required
                  value={address.city}
                  onChange={handleChange}
                  className="rounded border px-4 py-3"
                />

                <input
                  name="state"
                  placeholder="State"
                  required
                  value={address.state}
                  onChange={handleChange}
                  className="rounded border px-4 py-3"
                />

                <input
                  name="pincode"
                  placeholder="Pincode"
                  required
                  value={address.pincode}
                  onChange={handleChange}
                  className="rounded border px-4 py-3"
                />
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-lg border bg-white p-6">
              <h2 className="text-xl font-bold">Payment</h2>

              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer gap-3 rounded border p-4">
                  <input
                    type="radio"
                    value="FAKE_CARD"
                    checked={paymentMethod === "FAKE_CARD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div>
                    <p className="font-semibold">💳 Card Payment</p>

                    <p className="text-sm text-gray-500">Demo payment</p>
                  </div>
                </label>

                <label className="flex cursor-pointer gap-3 rounded border p-4">
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <div>
                    <p className="font-semibold">💵 Cash on Delivery</p>

                    <p className="text-sm text-gray-500">Pay when delivered</p>
                  </div>
                </label>
              </div>

              <div className="mt-5 rounded bg-gray-50 p-4 text-sm text-gray-600">
                {paymentMethod === "FAKE_CARD"
                  ? "Demo card payment. No real money will be charged."
                  : "Payment will remain pending until the order is delivered."}
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-lg border bg-white p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-5 space-y-3">
              {cart?.items?.map((item) => {
                const price =
                  item.product.discountPrice > 0
                    ? item.product.discountPrice
                    : item.product.price;

                return (
                  <div
                    key={item.product._id}
                    className="flex justify-between text-sm"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>

                    <span className="font-medium">
                      ₹{(price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex justify-between border-t pt-5">
              <span className="font-semibold">Total</span>

              <span className="text-xl font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              disabled={loading || !cart?.items?.length}
              className="mt-5 w-full rounded bg-blue-600 py-3 font-semibold text-white disabled:bg-gray-400"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default Checkout;
