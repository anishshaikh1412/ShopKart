import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        Loading your orders...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-extrabold">My Orders</h1>

        <p className="mt-2 text-slate-500">
          Track all your UrbanCart purchases.
        </p>

        {orders.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white py-20 text-center shadow-sm">
            <div className="text-6xl">📦</div>

            <h2 className="mt-5 text-xl font-bold">No orders yet</h2>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-violet-600 px-6 py-3 font-bold text-white"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 border-b pb-5 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-xs uppercase text-slate-400">Order ID</p>

                    <p className="font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {order.orderStatus}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center gap-4"
                    >
                      <img
                        src={item.image || item.product?.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-xl bg-slate-100 object-contain"
                      />

                      <div className="flex-1">
                        <p className="font-semibold">
                          {item.name || item.product?.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-bold">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex justify-between border-t pt-5">
                  <div>
                    <p className="text-sm text-slate-500">Payment</p>

                    <p className="font-semibold">{order.paymentMethod}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-slate-500">Total</p>

                    <p className="text-xl font-extrabold">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
