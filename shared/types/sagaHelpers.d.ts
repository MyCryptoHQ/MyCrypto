import { Effect } from 'redux-saga/effects';

type ExtPromise<T> = T extends Promise<infer U> ? U : T;

type ExtSaga<T> = T extends IterableIterator<infer U> ? Exclude<U, Effect | Effect[]> : T;

/**
 * Use this helper to unwrap return types from effects like Call / Apply
 * In the case of calling a function that returns a promise, this helper will unwrap the
 * promise and return the type inside it. In the case of calling another saga / generator,
 * this helper will return the actual return value of the saga / generator, otherwise,
 * it'll return the original type.
 *
 * NOTE 1: When using this to extract the type of a Saga, make sure to remove the `SagaIterator`
 * return type of the saga if it contains one, since that masks the actual return type of the saga.
 *
 * NOTE 2: You will most likely need to use the `typeof` operator to use this helper.
 * E.g type X = UnwrapEffects<typeof MyFunc/MySaga>
 */
export type UnwrapEffects<T> = T extends (...args: any[]) => any
  ? ExtSaga<ReturnType<T>>
  : ExtPromise<T>;
