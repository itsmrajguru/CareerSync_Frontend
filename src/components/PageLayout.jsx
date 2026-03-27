import Navbar from "./Navbar";
import Footer from "./Footer";

/* This is the page layout which is wrapper for every Page
annd strictly follows the Following the Page size and other properties */

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#f0fbfe] font-sans selection:bg-primary-100 selection:text-primary-900 pb-0 text-neutral-800 flex flex-col">
      <Navbar />
      <main className="max-w-[900px] mx-auto px-7 pt-10 flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}