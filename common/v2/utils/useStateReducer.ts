import { useState, Dispatch, SetStateAction } from 'react';

interface FactoryArguments<T> {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
}
interface FactoryApi {
  [key: string]: any;
}

export type TUseStateReducerFactory<T> = (args: FactoryArguments<T>) => FactoryApi;
export type TUseStateReducer<T> = (
  factory: TUseStateReducerFactory<T>,
  initialState: T
) => FactoryApi;

// Use a state hook like a reducer with a more custom API
// https://medium.com/free-code-camp/why-you-should-choose-usestate-instead-of-usereducer-ffc80057f815
export const useStateReducer: TUseStateReducer<object> = (apiFactory, initialState) => {
  const [state, setState] = useState(initialState);
  return apiFactory({ state, setState });
};
