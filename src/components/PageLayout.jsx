import Navbar from "./Navbar";

/* This is the page layout which is wrapper for every Page
annd strictly follows the Following the Page size and other properties */

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f0fbfe] font-sans selection:bg-primary-100 selection:text-primary-900 pb-24 text-neutral-800">
      <Navbar />
      <main className="max-w-[900px] mx-auto px-7 pt-10">
        {children}
      </main>
    </div>
  );
}