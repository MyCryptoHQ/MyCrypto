// Generic Action type according to Flux Standard Action (FSA)
export interface TAction<T, P> {
  type: T;
  payload?: P;
  error?: boolean;
  meta?: TObject;
}

export type TStateGetter<S> = () => S;
