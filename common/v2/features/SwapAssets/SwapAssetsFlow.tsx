import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ExtendedContentPanel } from 'v2/components';
import {
  SwapAssets,
  SelectAddress,
  ConfirmSwap,
  SwapTransactionReceipt,
  SetAllowance
} from './components';
import { ROUTE_PATHS } from 'v2/config';
import { ISwapAsset, LAST_CHANGED_AMOUNT } from './types';
import { StoreAccount, ITxReceipt, ISignedTx, ITxConfig } from 'v2/types';
import { DexService } from 'v2/services/ApiService';
import { ProviderHandler } from 'v2/services';
import { fromTxReceiptObj } from 'v2/components/TransactionFlow/helpers';
import {
  makeTxConfigFromTransaction,
  makeTradeTransactionFromDexTrade,
  WALLET_STEPS
} from './helpers';
import { translateRaw } from 'translations';
import { isWeb3Wallet } from 'v2/utils/web3';

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
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
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
  const [isSettingAllowance, setSettingAllowance] = useState<boolean>(false);

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
      if (isWeb3Wallet(account.wallet)) {
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
    setSettingAllowance(true);
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
    setSettingAllowance(false);
    goToNextStep();
  };

  const onTxSigned = async (signResponse: any) => {
    if (!account) {
      return;
    }

    if (isWeb3Wallet(account.wallet)) {
      const receipt =
        signResponse && signResponse.hash ? signResponse : { hash: signResponse, asset: {} };
      setTxReceipt(receipt);
      goToNextStep();
    } else {
      const provider = new ProviderHandler(account.network);
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
      title: translateRaw('SWAP_ASSETS_TITLE'),
      component: SwapAssets
    },
    {
      title: translateRaw('ACCOUNT_SELECTION_PLACEHOLDER'),
      description: translateRaw('SWAP_ACCOUNT_SELECT_DESC', {
        $fromAsset: (fromAsset && fromAsset.symbol) || 'ETH',
        $toAsset: (toAsset && toAsset.symbol) || 'ETH'
      }),
      component: SelectAddress
    },
    {
      title: translateRaw('SWAP_CONFIRM_TITLE'),
      component: ConfirmSwap
    },
    ...(dexTrade && dexTrade.metadata.input
      ? [
          {
            title: translateRaw('SWAP_ALLOWANCE_TITLE'),
            component: SetAllowance,
            action: onAllowanceSigned
          }
        ]
      : []),
    {
      title: translateRaw('SWAP_ASSETS_TITLE'),
      component: account && WALLET_STEPS[account.wallet],
      action: onTxSigned
    },
    {
      title: translateRaw('SWAP_RECEIPT_TITLE'),
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
        network={account && account.network}
        isSettingAllowance={isSettingAllowance}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(SwapAssetsFlow);
