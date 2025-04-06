import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="bg-[hsl(var(--background))] flex items-center justify-center h-full">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-[hsl(var(--accent))]">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-[hsl(var(--foreground))] md:text-4xl">
            {"Something's missing."}
          </p>
          <p className="mb-4 text-lg font-light text-[hsl(var(--muted-foreground))]">
            {
              " Sorry, we can't find that page. You'll find lots to explore on the home page."
            }
          </p>
          <Link
            to={"/"}
            className="inline-flex text-white bg-[hsl(var(--accent))] hover:bg-[hsl(var(--accent))/80] focus:ring-4 focus:outline-none focus:ring-[hsl(var(--ring))] font-medium rounded-full text-sm px-5 py-2.5 text-center my-4 shadow-md transition duration-300"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
