import { default as Reducer } from './reducer';
import { bindActions } from './actions';

describe('MigrateLS actions', () => {
  test('reset calls RESET', () => {
    const dispatch = jest.fn();
    const { reset } = bindActions(dispatch);
    reset();
    expect(dispatch).toBeCalledWith({ type: Reducer.actionTypes.RESET });
  });
  test('destroySuccess', () => {
    const dispatch = jest.fn();
    const { destroySuccess } = bindActions(dispatch);
    destroySuccess();
    expect(dispatch).toBeCalledWith({ type: Reducer.actionTypes.DESTROY_SUCCESS });
  });
});
