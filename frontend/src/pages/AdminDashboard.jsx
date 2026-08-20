import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  category: "",
  brand: "",
  image: "",
  stock: "",
};

const AdminDashboard = () => {
  const { token, user } = useAuth();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [product, setProduct] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsResponse, ordersResponse] = await Promise.all([
        api.get("/products"),
        api.get("/orders/admin/all", { headers }),
      ]);

      setProducts(productsResponse.data);
      setOrders(ordersResponse.data);
    } catch (error) {
      toast.error("Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === "admin") {
      fetchData();
    }
  }, [token, user]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, product, { headers });
        toast.success("Product updated successfully");
      } else {
        await api.post("/products", product, { headers });
        toast.success("Product added successfully");
      }

      setProduct(emptyProduct);
      setEditingId(null);

      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save product");
    }
  };

  const editProduct = (item) => {
    setEditingId(item._id);

    setProduct({
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      discountPrice: item.discountPrice || "",
      category: item.category || "",
      brand: item.brand || "",
      image: item.image || "",
      stock: item.stock || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`, { headers });

      toast.success("Product deleted successfully");

      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete product");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/admin/${id}/status`, { status }, { headers });

      toast.success("Order status updated");

      await fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update status");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProduct(emptyProduct);
  };

  if (!user || user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="rounded-2xl border border-red-500/20 bg-slate-900 p-8 text-center">
          <div className="text-5xl">🔒</div>

          <h1 className="mt-4 text-2xl font-bold text-white">Access Denied</h1>

          <p className="mt-2 text-slate-400">
            Only administrators can access this page.
          </p>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-indigo-500"></div>

          <p className="mt-4 text-slate-400">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const revenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled"
  ).length;

  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "Paid"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-400">ADMIN PANEL</p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              Store Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your products, orders and payments.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-semibold">{user.name}</p>

              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Products</p>

              <span className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                📦
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{products.length}</p>

            <p className="mt-1 text-xs text-slate-500">Total products</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Orders</p>

              <span className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                🛍️
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{orders.length}</p>

            <p className="mt-1 text-xs text-slate-500">All customer orders</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Pending</p>

              <span className="rounded-lg bg-yellow-500/10 p-2 text-yellow-400">
                ⏳
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold">{pendingOrders}</p>

            <p className="mt-1 text-xs text-slate-500">Active orders</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">Revenue</p>

              <span className="rounded-lg bg-green-500/10 p-2 text-green-400">
                ₹
              </span>
            </div>

            <p className="mt-4 text-2xl font-bold">
              ₹{revenue.toLocaleString("en-IN")}
            </p>

            <p className="mt-1 text-xs text-slate-500">Total order value</p>
          </div>
        </div>

        {/* Product Management */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <div>
              <p className="text-sm font-medium text-indigo-400">INVENTORY</p>

              <h2 className="mt-1 text-2xl font-bold">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Add or update products in your store.
              </p>
            </div>
          </div>

          <form
            onSubmit={saveProduct}
            className="grid gap-4 p-6 sm:grid-cols-2"
          >
            <input
              name="name"
              placeholder="Product name"
              required
              value={product.name}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <input
              name="brand"
              placeholder="Brand"
              value={product.brand}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <input
              name="category"
              placeholder="Category"
              required
              value={product.category}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <input
              name="image"
              placeholder="Image URL"
              value={product.image}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <input
              name="price"
              type="number"
              placeholder="Original price"
              required
              value={product.price}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <input
              name="discountPrice"
              type="number"
              placeholder="Discount price"
              value={product.discountPrice}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <input
              name="stock"
              type="number"
              placeholder="Stock quantity"
              value={product.stock}
              onChange={handleChange}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />

            <textarea
              name="description"
              placeholder="Product description"
              required
              value={product.description}
              onChange={handleChange}
              className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 sm:col-span-2"
            />

            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold transition hover:bg-indigo-500"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Products */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-800 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-400">INVENTORY</p>

              <h2 className="mt-1 text-2xl font-bold">Products</h2>
            </div>

            <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
              {products.length} products
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="border-b border-slate-800 bg-slate-950">
                <tr className="text-slate-400">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {products.map((item) => (
                  <tr
                    key={item._id}
                    className="transition hover:bg-slate-800/40"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl bg-slate-800 object-contain"
                        />

                        <div>
                          <p className="font-semibold text-white">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.brand || "No brand"} · {item.category}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-white">
                        ₹
                        {(item.discountPrice || item.price).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      {item.discountPrice > 0 && (
                        <p className="text-xs text-slate-500 line-through">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.stock > 10
                            ? "bg-green-500/10 text-green-400"
                            : item.stock > 0
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {item.stock} in stock
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => editProduct(item)}
                          className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 font-medium text-indigo-400 transition hover:bg-indigo-500/20"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(item._id)}
                          className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-medium text-red-400 transition hover:bg-red-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Orders */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-indigo-400">SALES</p>

                <h2 className="mt-1 text-2xl font-bold">Customer Orders</h2>
              </div>

              <div className="flex gap-2">
                <span className="rounded-lg bg-green-500/10 px-3 py-2 text-xs font-semibold text-green-400">
                  {paidOrders} Paid
                </span>

                <span className="rounded-lg bg-yellow-500/10 px-3 py-2 text-xs font-semibold text-yellow-400">
                  {orders.length - paidOrders} Pending
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-800">
            {orders.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                No orders yet.
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="p-6 transition hover:bg-slate-800/30"
                >
                  <div className="flex flex-col justify-between gap-5 lg:flex-row">
                    {/* Order info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-bold">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            order.orderStatus === "Delivered"
                              ? "bg-green-500/10 text-green-400"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="mt-3">
                        <p className="font-semibold">
                          {order.user?.name || "Customer"}
                        </p>

                        <p className="text-sm text-slate-500">
                          {order.user?.email}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <span className="rounded-lg bg-slate-800 px-3 py-2 text-slate-300">
                          💳 {order.paymentMethod}
                        </span>

                        <span
                          className={`rounded-lg px-3 py-2 ${
                            order.paymentStatus === "Paid"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-yellow-500/10 text-yellow-400"
                          }`}
                        >
                          Payment: {order.paymentStatus}
                        </span>

                        {order.refundStatus &&
                          order.refundStatus !== "Not Applicable" && (
                            <span className="rounded-lg bg-purple-500/10 px-3 py-2 text-purple-400">
                              Refund: {order.refundStatus}
                            </span>
                          )}
                      </div>
                    </div>

                    {/* Amount + Status */}
                    <div className="flex flex-col items-start gap-4 lg:items-end">
                      <div>
                        <p className="text-xs text-slate-500">Order Amount</p>

                        <p className="mt-1 text-2xl font-bold">
                          ₹{order.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </div>

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <div className="py-8 text-center text-xs text-slate-600">
          ShopNest Admin Panel · Store Management
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
