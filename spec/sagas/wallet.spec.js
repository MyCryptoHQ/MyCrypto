import { unlockPrivateKey } from 'sagas/wallet';

describe('Wallet saga', () => {
  it('Should show error notification on decryption failure', () => {
    const gen = unlockPrivateKey({
      key: '0000000000000000000000000000000000000000000000000000000000000000'
    });
    // FIXME fragile
    expect(gen.next().value.PUT.action.type).toEqual('SHOW_NOTIFICATION');
    expect(gen.next().done).toBeTruthy();
  });
});
