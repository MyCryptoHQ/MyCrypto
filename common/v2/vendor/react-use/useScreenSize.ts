import useMediaQuery from './useMediaQuery';
import { BREAK_POINTS } from 'v2/theme';

const useScreenSize = () => {
  const isXsScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_XS})`);
  const isSmScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_SM})`);
  const isMdScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_MD})`);
  const isLgScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_LG})`);
  const isXlScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_XL})`);
  const isXllScreen = useMediaQuery(`(min-width: ${BREAK_POINTS.SCREEN_XXL})`);

  return { isXsScreen, isSmScreen, isMdScreen, isLgScreen, isXlScreen, isXllScreen };
};

export default useScreenSize;
