import { verifySignedMessage } from './signing';

describe('lib/signing', () => {
  const msgToSign = 'Testing your code is great!';
  const msgToVerify = {
    address: '0x6980ba0ab378c2ed0efccd7ea6ab84d54615a2de',
    msg: msgToSign,
    sig:
      '0xf08688e9dddbb5e4e0d1fb685ee9f693accb3c9aac84fdcf327423ca4a1c50463ef7aeb70be3221fe028bc752e210a4c377db8090bc4efa5ea7d391049c3a4771c',
    version: '2'
  };

  it('verifySignedMessage properly verifies a signed message', () => {
    expect(verifySignedMessage(msgToVerify)).toBeTruthy();
  });
});
