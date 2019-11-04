import { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

// Scroll to top on route change
// https://reacttraining.com/react-router/web/guides/scroll-restoration
const ScrollToTop = ({ history, location: { pathname } }: RouteComponentProps<any>) => {
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => unlisten();
  }, [pathname]);
  return null;
};

export default withRouter(ScrollToTop);
