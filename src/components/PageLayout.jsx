import Navbar from "./Navbar";
import Footer from "./Footer";

/* This is the page layout which is wrapper for every Page
annd strictly follows the Following the Page size and other properties */

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-app-bg font-sans selection:bg-primary-100 selection:text-black pb-0 text-black flex flex-col">
      <Navbar />
      <main className="max-w-[960px] mx-auto px-7 pt-4 flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

