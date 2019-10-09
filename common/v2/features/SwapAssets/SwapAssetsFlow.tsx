import React, { useState, ReactType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import {
  SwapAssets,
  SelectAddress,
  ConfirmSwap,
  WaitingDeposit,
  SwapTransactionReceipt
} from './components';
import { ROUTE_PATHS } from 'v2/config';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from './types';
import { WalletId, StoreAccount, ITxReceipt, ISignedTx, ISignComponentProps } from 'v2/types';

import {
  SignTransactionKeystore,
  SignTransactionLedger,
  SignTransactionMetaMask,
  SignTransactionPrivateKey,
  SignTransactionSafeT,
  SignTransactionTrezor,
  SignTransactionMnemonic
} from 'v2/features/SendAssets/components/SignTransactionWallets';
import { DexService } from 'v2/services/ApiService/Dex';

import { getNetworkById, ProviderHandler } from 'v2/services';
import { fromTxReceiptObj } from 'v2/components/TransactionFlow/helpers';

interface TStep {
  title?: string;
  description?: string;
  component: ReactType;
}

const SwapAssetsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [fromAsset, setFromAsset] = useState<ISwapAsset>();
  const [toAsset, setToAsset] = useState<ISwapAsset>();
  const [fromAmount, setFromAmount] = useState();
  const [toAmount, setToAmount] = useState();
  const [address, setAddress] = useState();
  const [account, setAccount] = useState<StoreAccount>();
  const [dexTrade, setDexTrade] = useState();
  const [rawTransaction, setRawTransaction] = useState(null);
  const [txHash, setTxHash] = useState();
  const [txReceipt, setTxReceipt] = useState();
  const [swapAssets, setSwapAssets] = useState([]);
  const [swapPrice, setSwapPrice] = useState(0);
  const [lastChangedAmount, setLastChagedAmount] = useState<LAST_CHANGED_AMOUNT>(
    LAST_CHANGED_AMOUNT.FROM
  );

  type SigningComponents = {
    readonly [k in WalletId]: React.ComponentType<ISignComponentProps> | null;
  };

  const walletSteps: SigningComponents = {
    [WalletId.PRIVATE_KEY]: SignTransactionPrivateKey,
    [WalletId.METAMASK]: SignTransactionMetaMask,
    [WalletId.LEDGER_NANO_S]: SignTransactionLedger,
    [WalletId.TREZOR]: SignTransactionTrezor,
    [WalletId.SAFE_T_MINI]: SignTransactionSafeT,
    [WalletId.KEYSTORE_FILE]: SignTransactionKeystore,
    [WalletId.PARITY_SIGNER]: null,
    [WalletId.MNEMONIC_PHRASE]: SignTransactionMnemonic,
    [WalletId.VIEW_ONLY]: null
  };

  const steps: TStep[] = [
    {
      title: 'Swap Assets',
      description: 'How much do you want to send and receive?',
      component: SwapAssets
    },
    {
      title: 'Select Address',
      description: `Where will you be sending your ${fromAsset &&
        fromAsset.symbol} from? You will receive  your ${toAsset &&
        toAsset.symbol} back to the same address after the swap.`,
      component: SelectAddress
    },
    {
      title: 'Confirm Swap',
      component: ConfirmSwap
    },
    {
      // @ts-ignore
      component: account && walletSteps[account.wallet]
    },
    {
      title: 'Waiting on Deposit',
      component: WaitingDeposit
    },
    {
      title: 'Transaction Receipt',
      component: SwapTransactionReceipt
    }
  ];

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const goToPreviousStep = () => {
    const { history } = props;
    if (step === 0) {
      history.push(ROUTE_PATHS.DASHBOARD.path);
    } else {
      setStep(step - 1);
    }
  };

  const onComplete = (signResponse: any) => {
    if (!account) {
      return;
    }

    if (account.wallet === WalletId.METAMASK) {
      setTxHash(signResponse);
    } else {
      const provider = new ProviderHandler(account.network);
      provider
        .sendRawTx(signResponse)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const receipt = fromTxReceiptObj(retrievedTransactionReceipt);
          setTxReceipt(receipt);
          /*      console.log('RECEIPT', receipt); */
        });
    }
  };

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

  const fetchSwapAssets = async () => {
    try {
      const assets = await DexService.instance.getTokenList();
      setSwapAssets(assets);
      if (assets.length > 1) {
        setFromAsset(assets[0]);
        setToAsset(assets[1]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (swapAssets.length === 0) {
    fetchSwapAssets();
  }

  return (
    <ExtendedContentPanel
      onBack={goToPreviousStep}
      stepper={{ current: step + 1, total: steps.length }}
      width="650px"
      heading={stepObject.title}
      description={stepObject.description}
    >
      <StepComponent
        goToNextStep={goToNextStep}
        setStep={setStep}
        setFromAsset={setFromAsset}
        setToAsset={setToAsset}
        setFromAmount={setFromAmount}
        setToAmount={setToAmount}
        fromAmount={fromAmount}
        toAmount={toAmount}
        assets={swapAssets}
        fromAsset={fromAsset}
        toAsset={toAsset}
        address={address}
        setAddress={setAddress}
        account={account}
        setAccount={setAccount}
        dexTrade={dexTrade}
        setDexTrade={setDexTrade}
        network={getNetworkById('Ethereum')}
        senderAccount={account}
        rawTransaction={rawTransaction}
        onSuccess={(payload: ITxReceipt | ISignedTx) => onComplete(payload)}
        setRawTransaction={setRawTransaction}
        txHash={txHash}
        txReceipt={txReceipt}
        lastChangedAmount={lastChangedAmount}
        setLastChagedAmount={setLastChagedAmount}
        swapPrice={swapPrice}
        setSwapPrice={setSwapPrice}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(SwapAssetsFlow);
