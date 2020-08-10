import React, { useState, useContext } from 'react';
import { Input } from '@mycrypto/ui';
import { TransactionResponse } from 'ethers/providers';

import { Button, NetworkSelectDropdown, ContentPanel } from '@components';
import { getTransactionByHash } from '@services/EthService/transaction';
import { ITxHash, Network, ITxStatus } from '@types';
import {
  NetworkContext,
  AssetContext,
  SettingsContext,
  StoreContext,
  AddressBookContext,
  RatesContext
} from '@services';
import { TxReceiptUI } from '@components/TransactionFlow/TxReceipt';
import { makeTxConfigFromTransactionResponse } from '@utils/transaction';
import { constructSenderFromTxConfig } from '@components/TransactionFlow/helpers';
import { noOp } from '@utils';

export default function TransactionStatus() {
  const { getContactByAddressAndNetworkId } = useContext(AddressBookContext);
  const { getAssetRate } = useContext(RatesContext);
  const { assets } = useContext(AssetContext);
  const { getNetworkById, networks } = useContext(NetworkContext);
  const { settings } = useContext(SettingsContext);
  const { accounts } = useContext(StoreContext);
  const [txHash, setTxHash] = useState('');
  const [network, setNetwork] = useState<Network | undefined>(undefined);
  const [fetchedTx, setFetchedTx] = useState<TransactionResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchTx = async () => {
    setLoading(true);
    const tx = await getTransactionByHash(network!, txHash as ITxHash);
    setFetchedTx(tx);
    setLoading(false);
  };

  const txConfig =
    fetchedTx && makeTxConfigFromTransactionResponse(fetchedTx, assets, networks, accounts);

  const senderContact =
    txConfig &&
    txConfig.senderAccount &&
    getContactByAddressAndNetworkId(txConfig.senderAccount.address, txConfig.network.id);
  const recipientContact =
    txConfig && getContactByAddressAndNetworkId(txConfig.receiverAddress, txConfig.network.id);

  const sender = txConfig && constructSenderFromTxConfig(txConfig, accounts);
  const assetRate = () => txConfig && getAssetRate(txConfig.asset);

  return (
    <ContentPanel heading={'TX Status'}>
      {!fetchedTx && (
        <>
          <NetworkSelectDropdown
            network={network ? network.id : undefined}
            onChange={(n) => {
              setNetwork(getNetworkById(n));
            }}
          />
          <label htmlFor="txhash">TX Hash</label>
          <Input name="txhash" value={txHash} onChange={(e) => setTxHash(e.currentTarget.value)} />
          <Button loading={loading} onClick={fetchTx} fullwidth={true}>
            Fetch
          </Button>
        </>
      )}
      {fetchedTx && txConfig && (
        <>
          <TxReceiptUI
            settings={settings}
            sender={sender!}
            txConfig={txConfig}
            timestamp={fetchedTx.timestamp ? fetchedTx.timestamp : 0}
            senderContact={senderContact!}
            recipientContact={recipientContact!}
            assetRate={assetRate}
            resetFlow={noOp}
            // TODO
            txStatus={ITxStatus.SUCCESS}
          />
        </>
      )}
    </ContentPanel>
  );
}
