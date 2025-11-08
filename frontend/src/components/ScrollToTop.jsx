import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, key } = useLocation(); // key changes even for same path navigations
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    prevPathRef.current = pathname;
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;
