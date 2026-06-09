import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash in the URL (e.g., /#features on the homepage), 
    // skip the scroll to top so the browser can jump to that block.
    if (hash) {
      return;
    }
    
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
