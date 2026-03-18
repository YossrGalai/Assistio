export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="p-4 bg-blue-600 text-white flex justify-between">
        <h1 className="font-bold text-xl">Assistio</h1>
        <nav> {/* liens navigation */} </nav>
      </header>
      <main className="p-4">{children}</main>
      <footer className="p-4 text-center text-gray-500">© 2026 Assistio</footer>
    </>
  );
}