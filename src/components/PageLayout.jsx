import Navbar from "./Navbar";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900 pb-24 text-neutral-800">
      <Navbar />
      <main className="max-w-[900px] mx-auto px-7 pt-14">
        {children}
      </main>
    </div>
  );
}