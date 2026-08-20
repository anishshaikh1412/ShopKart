import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-violet-600"
        >
          Urban<span className="text-slate-900">Cart</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-violet-600"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-slate-600 hover:text-violet-600"
          >
            Shop
          </Link>

          {user && (
            <Link
              to="/my-orders"
              className="text-sm font-medium text-slate-600 hover:text-violet-600"
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/cart"
            className="relative rounded-lg p-2 text-xl hover:bg-violet-50"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                Hi, {user.name}
              </span>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="hidden text-sm font-semibold text-red-500 hover:text-red-600 sm:block"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      <div className="border-t bg-white px-4 py-2 md:hidden">
        <div className="flex gap-5">
          <Link to="/" className="text-sm font-medium text-slate-600">
            Home
          </Link>

          <Link to="/products" className="text-sm font-medium text-slate-600">
            Shop
          </Link>

          {user && (
            <Link
              to="/my-orders"
              className="text-sm font-medium text-slate-600"
            >
              Orders
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-red-500"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
