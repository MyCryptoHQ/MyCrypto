import { RecordStore } from '@ledgerhq/hw-transport-mocker';

import { DPathsList } from '@config';

import LedgerUSB from './LedgerUSB';

jest.mock('./LedgerUSB');

const LedgerUSBMock = LedgerUSB as jest.Mocked<typeof LedgerUSB> &
  (new (store: RecordStore) => LedgerUSB);

describe('Ledger', () => {
  it('generates an address from a derivation path', async () => {
    const store = RecordStore.fromString(`
      => e00200010d038000002c8000003c80000000
      <= 4104e0767c6bb7382e3ba6a39605fc4a413e7158659dac9ebcc9732b17d372f2d22b7383d42c9b9d520a4ad34d5bf40fb6c1437dc83a74cf6c772bb80be76615e4672845454233323041373935306330333935663445393264653666453442644234313445363537383734ec9f64ace5a02fd098d12f83d3f11daf59b2abbba20b3469d975d46f28a8a7509000
      => e002000111048000002c8000003c8000000000000000
      <= 4104a3a964e545e708cc6b0063140eb8452eabb1d0ab23c376a74f050a6344389b903dcf6c344fd15e916e2d6b15d41e65862f82104142c3b77c8c226af22083721d283932626664396165363734324238374530413343303543453233463461344635413039393831613897648e0796b9c53a8f1bf2c56b8387ce55614f485eba495527b3550412b7a8039000
`);

    const wallet = new LedgerUSBMock(store);
    await wallet.initialize(DPathsList.ETH_LEDGER);

    await expect(wallet.getAddress(DPathsList.ETH_DEFAULT, 10)).resolves.toMatchSnapshot();
    await expect(wallet.getAddress(DPathsList.ETH_DEFAULT, 15)).resolves.toMatchSnapshot();
  });

  it('generates an address from a hardened derivation path', async () => {
    const store = RecordStore.fromString(`
      => e00200010d038000002c8000003c80000000
      <= 4104e0767c6bb7382e3ba6a39605fc4a413e7158659dac9ebcc9732b17d372f2d22b7383d42c9b9d520a4ad34d5bf40fb6c1437dc83a74cf6c772bb80be76615e4672845454233323041373935306330333935663445393264653666453442644234313445363537383734ec9f64ace5a02fd098d12f83d3f11daf59b2abbba20b3469d975d46f28a8a7509000
      => e002000015058000002c8000003c8000000a0000000000000000
      <= 4104a0a2bb448941f9d8d8b85562551a1a28c4e9bc04e520ed471bdb48fa92ba20b3c74405449cf47b1afe1e4f3fad9e286416bdba7e54eb40826256455528884f5328316244376638643133354337353635663633653665423234453941383730346432654239306636399000
      => e002000015058000002c8000003c8000000f0000000000000000
      <= 4104378ec8f53cd11d9a89cd5173e386cba33170e8d1cf8620572a0af6d2b1139224918dcc4943ae92ef50adbb8555231a5eb8383817038676d26d92e3b13913f4bd28626134416439383141343133393066353663414234333534394343313530353042443034313845389000
    `);

    const wallet = new LedgerUSBMock(store);
    await wallet.initialize(DPathsList.ETH_LEDGER);

    await expect(wallet.getAddress(DPathsList.ETH_LEDGER_LIVE, 10)).resolves.toMatchSnapshot();
    await expect(wallet.getAddress(DPathsList.ETH_LEDGER_LIVE, 15)).resolves.toMatchSnapshot();
  });
});
