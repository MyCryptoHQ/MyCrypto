import { useMediaQuery } from 'react-responsive';

import { BREAK_POINTS } from '@theme';

const useScreenSize = () => {
  const isXsScreen = useMediaQuery({ minWidth: BREAK_POINTS.SCREEN_XS });
  const isSmScreen = useMediaQuery({ minWidth: BREAK_POINTS.SCREEN_SM });
  const isMdScreen = useMediaQuery({ minWidth: BREAK_POINTS.SCREEN_MD });
  const isLgScreen = useMediaQuery({ minWidth: BREAK_POINTS.SCREEN_LG });
  const isXlScreen = useMediaQuery({ minWidth: BREAK_POINTS.SCREEN_XL });
  const isXxlScreen = useMediaQuery({ minWidth: BREAK_POINTS.SCREEN_XXL });

  const isMobile = useMediaQuery({ maxWidth: BREAK_POINTS.SCREEN_SM });

  return {
    isMobile,
    isXsScreen,
    isSmScreen,
    isMdScreen,
    isLgScreen,
    isXlScreen,
    isXxlScreen
  };
};

export default useScreenSize;
