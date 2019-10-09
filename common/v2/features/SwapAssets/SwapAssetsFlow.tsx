import React, { useState, ReactType } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ethers } from 'ethers';
import BN from 'bn.js';
import { addHexPrefix } from 'ethereumjs-util';

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
import { getNonce, hexToNumber, inputGasPriceToHex, hexWeiToString } from 'v2/services/EthService';
import { getGasEstimate, fetchGasPriceEstimates } from 'v2/services/ApiService';

interface TStep {
  title?: string;
  description?: string;
  component: ReactType;
  action?(signResponse: any): void;
}

type SigningComponents = {
  readonly [k in WalletId]: React.ComponentType<ISignComponentProps> | null;
};

const network = getNetworkById('Ethereum');

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

  const makeAllowanceTransaction = async (trade: any) => {
    if (!network || !account) {
      return false;
    }

    const { address: to, spender, amount } = trade.metadata.input;

    // First 4 bytes of the hash of "fee()" for the sighash selector
    const funcHash = ethers.utils.hexDataSlice(ethers.utils.id('approve(address,uint256)'), 0, 4);

    const abi = new ethers.utils.AbiCoder();
    const inputs = [
      {
        name: 'spender',
        type: 'address'
      },
      {
        name: 'amount',
        type: 'uint256'
      }
    ];

    const params = [spender, amount];
    const bytes = abi.encode(inputs, params).substr(2);

    // construct approval data from function hash and parameters
    const inputData = `${funcHash}${bytes}`;

    const { fast } = await fetchGasPriceEstimates(network.id);
    let gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

    if (trade.metadata.gasPrice) {
      gasPrice = trade.metadata.gasPrice;
    }

    const transaction: any = {
      to,
      chainId: network.chainId,
      data: inputData,
      value: '0x0',
      gasPrice: addHexPrefix(new BN(gasPrice).toString(16))
    };

    if (account.wallet !== WalletId.METAMASK) {
      transaction.nonce = await getNonce(network, account);
      const gasLimit = await getGasEstimate(network, transaction);
      transaction.gasLimit = hexToNumber(gasLimit);
    }

    return transaction;
  };

  const makeTradeTransactionFromDexTrade = async (trade: any) => {
    if (!network || !account) {
      return false;
    }

    const { fast } = await fetchGasPriceEstimates(network.id);
    let gasPrice = hexWeiToString(inputGasPriceToHex(fast.toString()));

    if (trade.metadata.gasPrice) {
      gasPrice = trade.metadata.gasPrice;
    }

    const transaction = trade.trade;
    transaction.gasPrice = addHexPrefix(new BN(gasPrice).toString(16));
    transaction.value = addHexPrefix(new BN(transaction.value).toString(16));
    transaction.chainId = network.chainId;

    if (account.wallet !== WalletId.METAMASK) {
      transaction.from = account.address;
      transaction.nonce = await getNonce(network, account);
      const gasLimit = await getGasEstimate(network, transaction);
      transaction.gasLimit = hexToNumber(gasLimit);
    }

    return transaction;
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

    const rawAllowanceTransaction = await makeTradeTransactionFromDexTrade(dexTrade);
    setRawTransaction(rawAllowanceTransaction);
    goToNextStep();
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
        });
    }
  };

  // @ts-ignore
  const steps: TStep[] = [
    {
      title: 'Swap Assets',
      description: 'How much do you want to send and receive?',
      component: SwapAssets
    },
    {
      title: 'Swap Assets1',
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
            component: account && walletSteps[account.wallet],
            action: onAllowanceSigned
          }
        ]
      : []),
    {
      title: 'Swap assets',
      component: account && walletSteps[account.wallet],
      action: onComplete
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
        key={`${stepObject.title}${step}`}
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
        network={network}
        senderAccount={account}
        rawTransaction={rawTransaction}
        onSuccess={(payload: ITxReceipt | ISignedTx) =>
          stepObject.action && stepObject.action(payload)
        }
        setRawTransaction={setRawTransaction}
        txHash={txHash}
        txReceipt={txReceipt}
        lastChangedAmount={lastChangedAmount}
        setLastChagedAmount={setLastChagedAmount}
        swapPrice={swapPrice}
        setSwapPrice={setSwapPrice}
        makeAllowanceTransaction={makeAllowanceTransaction}
        makeTradeTransactionFromDexTrade={makeTradeTransactionFromDexTrade}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(SwapAssetsFlow);
