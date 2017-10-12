import PrivKeyWallet from '../../common/libs/wallet/privkey';
import { verifyAddrFromRecoveredSig } from '../../common/libs/signing';

const privKey = PrivKeyWallet.generate();

const addressPromise = privKey.getAddress();

describe('signingAndVerifying', () => {
  it(`given a private key and signing a message it should verify that it realigns to said private key's address`, () => {
    addressPromise
      .then(address => {
        return privKey.signMessage(
          'Remember, remember',
          address,
          new Date(1605, 11, 5).toISOString()
        );
      })
      .then(signedMsg => {
        console.log(signedMsg);
        let signedMessage = JSON.parse(signedMsg);
        expect(
          verifyAddrFromRecoveredSig(
            signedMessage.address,
            signedMessage.fullMessage,
            signedMessage.signature
          )
        ).toEqual(true);
      });
  });
  //expect(result).toBeInstanceOf(Buffer);
  //expect(result.toString('hex')).toEqual(mewV1PrivKey);
});
