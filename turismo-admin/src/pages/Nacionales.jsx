import CategoryList from "../components/CategoryList.jsx";

export default function Nacionales() {
  return (
    <main className="page bg-pattern-lg">
      <section className="container my-4">
        <h1 className="text-white font-tommy w-500 text-center ">Viajes Nacionales</h1>
        <CategoryList categoria="nacional" />
      </section>
    </main>
  );
}