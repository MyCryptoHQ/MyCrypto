import { useEffect, useRef } from 'react';

import { usePrevious } from '@vendor';

// https://stackoverflow.com/questions/62974717/useeffect-when-all-dependencies-have-changed
export const useEffectAllDepsChange = (fn: () => void, deps: unknown[]) => {
  const prevDeps = usePrevious(deps);
  const changeTarget = useRef<unknown[] | undefined>();

  useEffect(() => {
    // nothing to compare to yet
    if (changeTarget.current === undefined) {
      changeTarget.current = prevDeps;
    }

    // we're mounting, so call the callback
    if (changeTarget.current === undefined) {
      return fn();
    }

    // make sure every dependency has changed
    if (changeTarget.current.every((dep, i) => dep !== deps[i])) {
      changeTarget.current = deps;

      return fn();
    }
  }, [fn, prevDeps, deps]);
};
