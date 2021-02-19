import { createTransportReplayer, RecordStore } from '@ledgerhq/hw-transport-mocker';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

import { DPathsList } from '@config';
import { fAccount, fTxConfig } from '@fixtures';

import { LedgerWallet } from './ledger';

jest.mock('@ledgerhq/hw-transport-webusb', () => ({
  ...jest.requireActual('@ledgerhq/hw-transport-webusb').TransportWebUSB,
  isSupported: jest.fn().mockImplementation(() => Promise.resolve(true)),
  create: jest.fn()
}));

describe('Ledger', () => {
  it('signs a transaction', async () => {
    const store = RecordStore.fromString(`
    => e00400003b048000002c8000003c8000000000000000e93284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a400080038080
    <= 292bd827ea378f4856ff2ea5997f48ea63045da64bb09ce494c886c1934d29d6270af001168b5e8db5cc47ff1f985629ddad535b334060846facb8a7c43cf9c6f19000
    `);
    const transport = await createTransportReplayer(store).open();
    (TransportWebUSB.create as jest.Mock).mockImplementation(() => transport);
    const wallet = new LedgerWallet(fAccount.address, DPathsList.ETH_LEDGER.value, 0);
    const result = await wallet.signRawTransaction(fTxConfig.rawTransaction);
    expect(result).toStrictEqual(
      Buffer.from(
        'f8693284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a40008029a02bd827ea378f4856ff2ea5997f48ea63045da64bb09ce494c886c1934d29d627a00af001168b5e8db5cc47ff1f985629ddad535b334060846facb8a7c43cf9c6f1',
        'hex'
      )
    );
  });

  it('signs a transaction with a large chain id', async () => {
    const store = RecordStore.fromString(`
    => e004000040058000002c800000f6800000000000000000000000ea3284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a40008081f68080
    <= 102bd827ea378f4856ff2ea5997f48ea63045da64bb09ce494c886c1934d29d6270af001168b5e8db5cc47ff1f985629ddad535b334060846facb8a7c43cf9c6f19000
    `);
    const transport = await createTransportReplayer(store).open();
    (TransportWebUSB.create as jest.Mock).mockImplementation(() => transport);
    const wallet = new LedgerWallet(fAccount.address, DPathsList.EWC_DEFAULT.value, 0);
    const result = await wallet.signRawTransaction({ ...fTxConfig.rawTransaction, chainId: 246 });
    expect(result).toStrictEqual(
      Buffer.from(
        'f86b3284ee6b280082520894909f74ffdc223586d0d30e78016e707b6f5a45e2865af3107a400080820210a02bd827ea378f4856ff2ea5997f48ea63045da64bb09ce494c886c1934d29d627a00af001168b5e8db5cc47ff1f985629ddad535b334060846facb8a7c43cf9c6f1',
        'hex'
      )
    );
  });
});
