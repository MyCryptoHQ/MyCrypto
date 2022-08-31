import { expectSaga, mockAppState } from 'test-utils';

import { fAccounts } from '@fixtures';
import { NotificationTemplates } from '@types';

import { displayNotification } from './notification.slice';
import slice, {
  checkForPromos,
  claimPromo,
  initialState,
  promoPoapsSaga
} from './promoPoaps.slice';

const reducer = slice.reducer;

describe('Promo POAPs slice', () => {
  it('has an initial state', () => {
    const actual = reducer(undefined, { type: null });
    const expected = initialState;
    expect(actual).toEqual(expected);
  });

  it('claimPromo(): sets claimed', () => {
    const actual = reducer(initialState, claimPromo({ key: 'halloween2021', claim: 'foo' }));
    const expected = {
      promos: { halloween2021: { key: 'halloween2021', claim: 'foo', claimed: true } }
    };
    expect(actual).toEqual(expected);
  });
});

describe('promoPoapsSaga()', () => {
  it('displays notifications if needed', async () => {
    Date.now = jest
      .fn()
      .mockImplementation(() => new Date('Wed Dec 1 2021 09:00:00 PST').getTime());
    await expectSaga(promoPoapsSaga)
      .withState(
        mockAppState({
          accounts: fAccounts
        })
      )
      .put(displayNotification({ templateName: NotificationTemplates.winterPoap }))
      .dispatch(checkForPromos())
      .silentRun();
  });
});
