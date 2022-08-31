import { useCallback } from 'react';

import useMountedState from './useMountedState';

export type UsePromise = () => <T>(promise: Promise<T>) => Promise<T>;

// Cancel a promise whenever the component is unMounted.
// ref. https://github.com/streamich/react-use/blob/master/src/usePromise.ts
const usePromise: UsePromise = () => {
  const isMounted = useMountedState();
  return useCallback(
    (promise: Promise<any>) =>
      new Promise<any>((resolve, reject) => {
        const onValue = (value: any) => {
          // tslint:disable-next-line:no-unused-expression e.g https://github.com/palantir/tslint/issues/4021
          isMounted() && resolve(value);
        };
        const onError = (error: any) => {
          // tslint:disable-next-line:no-unused-expression e.g https://github.com/palantir/tslint/issues/4021
          isMounted() && reject(error);
        };
        promise.then(onValue, onError);
      }),
    []
  );
};

export default usePromise;
