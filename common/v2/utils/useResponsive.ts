import { useMediaQuery } from 'react-responsive';
import { BREAK_POINTS } from 'v2/theme';

// More examples available at
// https://www.npmjs.com/package/react-responsive
export const useResponsive = () => {
  const isMobile = useMediaQuery({ maxWidth: BREAK_POINTS.SCREEN_SM });

  return {
    isMobile
  };
};
