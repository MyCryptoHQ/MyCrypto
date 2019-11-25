import { useCallback, useEffect, useRef } from 'react';

// Save a reference to the components mounted state.
// This will later allow us to cancel async requests inside requests
// ref. https://github.com/streamich/react-use/blob/master/src/useMountedState.ts
export default function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false);
  const get = useCallback(() => mountedRef.current, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  });

  return get;
}
