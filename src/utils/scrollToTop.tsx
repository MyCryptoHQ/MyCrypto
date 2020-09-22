import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

// Scroll to top on route change
// https://reacttraining.com/react-router/web/guides/scroll-restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
