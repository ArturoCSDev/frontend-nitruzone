export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Nutrition App</h1>
      <p className="text-gray-600 mb-8">Tu plataforma de nutrición personalizada</p>
      <a 
        href="/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Iniciar Sesión
      </a>
    </div>
  );
}