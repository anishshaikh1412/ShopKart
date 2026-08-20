import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-600 via-indigo-600 to-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2">
          <div>
            <p className="mb-4 font-semibold text-violet-200">
              WELCOME TO URBANCART
            </p>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Everything you need.
              <span className="block text-violet-200">All in one place.</span>
            </h1>

            <p className="mt-5 max-w-xl text-lg text-violet-100">
              Discover quality products, great prices and a simple shopping
              experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-xl bg-white px-6 py-3 font-bold text-violet-700 shadow-lg hover:bg-violet-50"
              >
                Shop Now →
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white hover:bg-white/10"
              >
                Create Account
              </Link>
            </div>
          </div>

          <div className="hidden justify-center md:flex">
            <div className="flex h-80 w-80 items-center justify-center rounded-full bg-white/10 text-9xl shadow-2xl backdrop-blur">
              🛍️
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 mt-5">
        <div className="rounded-3xl bg-slate-900 p-10 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to start shopping?</h2>

          <p className="mt-3 text-slate-400">
            Find your next favourite product today.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-violet-600 px-7 py-3 font-bold hover:bg-violet-700"
          >
            Explore Products
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
