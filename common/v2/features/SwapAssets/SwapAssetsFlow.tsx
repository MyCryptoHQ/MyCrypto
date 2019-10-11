import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import { SwapAssets, SelectAddress, ConfirmSwap, SwapTransactionReceipt } from './components';
import { ROUTE_PATHS } from 'v2/config';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from './types';
import { WalletId, StoreAccount, ITxReceipt, ISignedTx, ITxConfig } from 'v2/types';
import { DexService } from 'v2/services/ApiService/Dex';
import { ProviderHandler } from 'v2/services';
import { fromTxReceiptObj } from 'v2/components/TransactionFlow/helpers';
import {
  makeTxConfigFromTransaction,
  makeTradeTransactionFromDexTrade,
  WALLET_STEPS
} from './helpers';

interface TStep {
  title?: string;
  description?: string;
  component: any;
  action?(payload: ITxReceipt | ISignedTx): void;
}

const SwapAssetsFlow = (props: RouteComponentProps<{}>) => {
  const [step, setStep] = useState(0);
  const [fromAsset, setFromAsset] = useState<ISwapAsset>();
  const [toAsset, setToAsset] = useState<ISwapAsset>();
  const [fromAmount, setFromAmount] = useState();
  const [toAmount, setToAmount] = useState();
  const [account, setAccount] = useState<StoreAccount>();
  const [dexTrade, setDexTrade] = useState();
  const [rawTransaction, setRawTransaction] = useState<ITxConfig>();
  const [txReceipt, setTxReceipt] = useState();
  const [swapAssets, setSwapAssets] = useState([]);
  const [swapPrice, setSwapPrice] = useState(0);
  const [lastChangedAmount, setLastChagedAmount] = useState<LAST_CHANGED_AMOUNT>(
    LAST_CHANGED_AMOUNT.FROM
  );
  const [txConfig, setTxConfig] = useState();

  const goToFirstStep = () => {
    setStep(0);
  };

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

  const onAllowanceSigned = async (signResponse: any) => {
    if (!account) {
      return;
    }

    let allowanceTxHash;
    const provider = new ProviderHandler(account.network);

    try {
      if (account.wallet === WalletId.METAMASK) {
        allowanceTxHash = (signResponse && signResponse.hash) || signResponse;
      } else {
        const tx = await provider.sendRawTx(signResponse);
        allowanceTxHash = tx.hash;
      }
    } catch (hash) {
      const tx = await provider.getTransactionByHash(hash);
      allowanceTxHash = tx.hash;
    }

    // wait for allowance tx to be mined
    await provider.waitForTransaction(allowanceTxHash);

    const rawAllowanceTransaction = await makeTradeTransactionFromDexTrade(dexTrade, account);
    const mergedTxConfig = makeTxConfigFromTransaction(
      rawAllowanceTransaction,
      account,
      fromAsset!,
      fromAmount
    );
    setTxConfig(mergedTxConfig);
    setRawTransaction(rawAllowanceTransaction);
    goToNextStep();
  };

  const onComplete = async (signResponse: any) => {
    if (!account) {
      return;
    }

    if (account.wallet === WalletId.METAMASK) {
      const receipt =
        signResponse && signResponse.hash ? signResponse : { hash: signResponse, asset: {} };
      setTxReceipt(receipt);
      goToNextStep();
    } else {
      const provider = new ProviderHandler(account.network);

      /*    provider
        .getTransactionReceipt('0xc9dff224df247cacf5c2753779f8f66f19e1eccd25ed6409a92664a7a363f5b5')
        .then(retrievedTransactionReceipt => {
          setTxReceipt({ hash: retrievedTransactionReceipt.transactionHash, asset: {} });
          goToNextStep();
        }); */
      provider
        .sendRawTx(signResponse)
        .then(retrievedTxReceipt => retrievedTxReceipt)
        .catch(hash => provider.getTransactionByHash(hash))
        .then(retrievedTransactionReceipt => {
          const receipt = fromTxReceiptObj(retrievedTransactionReceipt);
          setTxReceipt(receipt);
        })
        .finally(goToNextStep);
    }
  };

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

  const steps: TStep[] = [
    {
      title: 'Swap Assets',
      description: 'How much do you want to send and receive?',
      component: SwapAssets
    },
    {
      title: 'Select Address',
      description: `Where will you be sending your ${fromAsset &&
        fromAsset.symbol} from? You will receive your ${toAsset &&
        toAsset.symbol} back to the same address after the swap.`,
      component: SelectAddress
    },
    {
      title: 'Confirm Swap',
      component: ConfirmSwap
    },
    ...(dexTrade && dexTrade.metadata.input
      ? [
          {
            title: 'Set allowance',
            component: account && WALLET_STEPS[account.wallet],
            action: onAllowanceSigned
          }
        ]
      : []),
    {
      title: 'Swap assets',
      component: account && WALLET_STEPS[account.wallet],
      action: onComplete
    },
    {
      title: 'Transaction Receipt',
      component: SwapTransactionReceipt
    }
  ];

  const stepObject = steps[step];
  const StepComponent = stepObject.component;

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
        key={`${stepObject.title}${step}`}
        goToNextStep={goToNextStep}
        setFromAsset={setFromAsset}
        setToAsset={setToAsset}
        setFromAmount={setFromAmount}
        setToAmount={setToAmount}
        fromAmount={fromAmount}
        toAmount={toAmount}
        assets={swapAssets}
        fromAsset={fromAsset}
        toAsset={toAsset}
        account={account}
        setAccount={setAccount}
        dexTrade={dexTrade}
        setDexTrade={setDexTrade}
        rawTransaction={rawTransaction}
        onSuccess={(payload: ITxReceipt | ISignedTx) =>
          stepObject.action && stepObject.action(payload)
        }
        setRawTransaction={setRawTransaction}
        txReceipt={txReceipt}
        lastChangedAmount={lastChangedAmount}
        setLastChagedAmount={setLastChagedAmount}
        swapPrice={swapPrice}
        setSwapPrice={setSwapPrice}
        goToFirstStep={goToFirstStep}
        txConfig={txConfig}
        setTxConfig={setTxConfig}
        senderAccount={account}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(SwapAssetsFlow);
