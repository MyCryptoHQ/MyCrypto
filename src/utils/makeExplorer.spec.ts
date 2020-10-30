import { fNetworks } from '@fixtures';
import { ITxHash, TAddress } from '@types';

import { buildAddressUrl, buildBlockUrl, buildTxUrl } from './makeExplorer';

test('buildTxUrl() returns a valid url', () => {
  expect(buildTxUrl(fNetworks[0].blockExplorer!, 'myTxHash' as ITxHash)).toEqual(
    'https://etherscan.io/tx/myTxHash'
  );
});

test('buildBlockUrl() returns a valid url', () => {
  expect(buildBlockUrl(fNetworks[0]!.blockExplorer!, 58960)).toEqual(
    'https://etherscan.io/block/myBlockNumber'
  );
});

test('buildAddressUrl() returns a valid url', () => {
  expect(buildAddressUrl(fNetworks[0].blockExplorer!, 'myAddress' as TAddress)).toEqual(
    'https://etherscan.io/address/myAddress'
  );
});
