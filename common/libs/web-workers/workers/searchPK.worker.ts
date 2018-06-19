import { fromPrivateKey } from 'ethereumjs-wallet';
import { toBuffer } from 'ethereumjs-util';

const worker: Worker = self as any;

worker.onmessage = (event: MessageEvent) => {
  const { basePrivateKey, targetAddress } = event.data;

  const characters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ];

  let pk = null;

  for (const idx of Object.keys(basePrivateKey.split(''))) {
    for (const character of characters) {
      const pkArray = basePrivateKey.split('');
      pkArray.splice(Number(idx), 1, character);
      const privateKeyGuess = pkArray.join('');

      let wallet;

      try {
        wallet = fromPrivateKey(toBuffer('0x' + privateKeyGuess));
      } catch (error) {
        wallet = null;
      }

      if (wallet) {
        const publicAddress = wallet.getAddressString();

        if (publicAddress.toLowerCase() === targetAddress.toLowerCase()) {
          pk = privateKeyGuess;
          break;
        }
      }
    }

    if (pk) {
      break;
    }
  }

  worker.postMessage(pk);
};
