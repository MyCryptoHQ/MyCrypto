import { Dispatch, SetStateAction, useState } from 'react';

interface FactoryArguments<T> {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
}
interface FactoryApi {
  [key: string]: any;
}

export type TUseStateReducerFactory<T1, T2 = FactoryApi> = (args: FactoryArguments<T1>) => T2;
export type TUseStateReducer<T1, T2 = FactoryApi> = (
  factory: TUseStateReducerFactory<T1>,
  initialState: T1
) => T2;

// Use a state hook like a reducer with a more custom API
// https://medium.com/free-code-camp/why-you-should-choose-usestate-instead-of-usereducer-ffc80057f815
export const useStateReducer: TUseStateReducer<unknown> = (apiFactory, initialState) => {
  const [state, setState] = useState(initialState);
  return apiFactory({ state, setState });
};

export const useTStateReducer = <T1, T2 = FactoryApi>(
  apiFactory: TUseStateReducerFactory<T1, T2>,
  initialState: T1
): T2 => {
  const [state, setState] = useState<T1>(initialState);
  return apiFactory({ state, setState });
};
