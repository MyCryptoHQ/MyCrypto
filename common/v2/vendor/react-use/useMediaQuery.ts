import { useState, useEffect } from 'react';

// https://github.com/bence-toth/react-hook-media-query
const useMediaQuery = (query: string) => {
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    const updateMatch = () => setIsMatching(window.matchMedia(query).matches);

    updateMatch();
    window.matchMedia(query).addEventListener('change', updateMatch);
    return () => {
      window.matchMedia(query).removeEventListener('change', updateMatch);
    };
  }, [query]);

  return isMatching;
};

export default useMediaQuery;
