import { useState, useEffect } from 'react';
import isFunction from 'lodash/isFunction';

// https://github.com/bence-toth/react-hook-media-query
const useMediaQuery = (query: string) => {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    const updateMatch = () => setIsMatching(window.matchMedia(query).matches);

    updateMatch();
    if (window.hasOwnProperty('matchMedia') && isFunction(window.matchMedia)) {
      const matchMediaQuery = window.matchMedia(query);
      if (
        matchMediaQuery.hasOwnProperty('addEventListener') &&
        isFunction(matchMediaQuery.addEventListener)
      ) {
        matchMediaQuery.addEventListener('change', updateMatch);
      }
    }
    return () => {
      if (window.hasOwnProperty('matchMedia') && isFunction(window.matchMedia)) {
        const matchMediaQuery = window.matchMedia(query);
        if (
          matchMediaQuery.hasOwnProperty('addEventListener') &&
          isFunction(matchMediaQuery.removeEventListener)
        ) {
          matchMediaQuery.removeEventListener('change', updateMatch);
        }
      }
    };
  }, [query]);

  return isMatching;
};

export default useMediaQuery;
