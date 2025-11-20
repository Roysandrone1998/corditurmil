import CategoryList from "../components/CategoryList.jsx";

export default function Internacionales() {
  return (
    <main className="page bg-pattern-lg">
      <section className="container my-4">
        <h1 className="text-white font-tommy w-500 text-center ">Viajes Internacionales</h1>
        {/* Pasamos 'internacional' y el CategoryList se encarga de probar plural si hace falta */}
         <CategoryList categoria="internacional"  />
      </section>
    </main>
  );
}