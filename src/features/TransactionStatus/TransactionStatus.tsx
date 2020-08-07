import React, { useState, useContext } from 'react';
import { Input } from '@mycrypto/ui';
import { TransactionResponse } from 'ethers/providers';

import { Button, NetworkSelectDropdown, ContentPanel } from '@components';
import { getTransactionByHash } from '@services/EthService/transaction';
import { ITxHash, TAddress, Network } from '@types';
import { NetworkContext, getBaseAssetByNetwork, AssetContext } from '@services';
import { TransactionDetailsDisplay } from '@components/TransactionFlow/displays';

export default function TransactionStatus() {
  const { assets } = useContext(AssetContext);
  const { getNetworkById } = useContext(NetworkContext);
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

  const baseAsset = network && getBaseAssetByNetwork({ network, assets });

  return (
    <ContentPanel heading={'TX Status'}>
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
      {fetchedTx && (
        <>
          <TransactionDetailsDisplay
            baseAsset={baseAsset!}
            asset={baseAsset!}
            data={fetchedTx.data}
            sender={{ address: fetchedTx.from as TAddress, assets: [], network: network! }}
            gasLimit={fetchedTx.gasLimit.toString()}
            gasPrice={fetchedTx.gasPrice.toString()}
            nonce={fetchedTx.nonce.toString()}
          />
        </>
      )}
    </ContentPanel>
  );
}
