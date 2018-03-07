declare module 'redux-test-utils' {
  import { Store } from 'react-redux';

  export function createMockStore(testState: any): Store<any>;
  export function createMockDispatch(testAction: any): any;
}
