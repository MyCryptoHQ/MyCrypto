import { useState, Dispatch, SetStateAction } from 'react';

interface FactoryArguments<T> {
  state: T;
  setState: Dispatch<SetStateAction<T>>;
}
interface FactoryApi {
  [key: string]: any;
}

export type TUseApiFactory<T> = (args: FactoryArguments<T>) => FactoryApi;
export type TUseApi<T> = (factory: TUseApiFactory<T>, initialState: T) => FactoryApi;

// Use a state hook like a reducer with a more custom API
// https://medium.com/free-code-camp/why-you-should-choose-usestate-instead-of-usereducer-ffc80057f815
export const useApi: TUseApi<object> = (apiFactory, initialState) => {
  const [state, setState] = useState(initialState);
  return apiFactory({ state, setState });
};
