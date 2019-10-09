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
import { ISwapAsset } from './types';
import {
  TSymbol,
  WalletId,
  StoreAccount,
  ITxReceipt,
  ISignedTx,
  ISignComponentProps
} from 'v2/types';

import {
  SignTransactionKeystore,
  SignTransactionLedger,
  SignTransactionMetaMask,
  SignTransactionPrivateKey,
  SignTransactionSafeT,
  SignTransactionTrezor,
  SignTransactionMnemonic
} from 'v2/features/SendAssets/components/SignTransactionWallets';

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
  const [asset, setAsset] = useState<ISwapAsset>();
  const [receiveAsset, setReceiveAsset] = useState<ISwapAsset>(dummyAssets[4]);
  const [sendAmount, setSendAmount] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [address, setAddress] = useState();
  const [account, setAccount] = useState<StoreAccount>();
  const [dexTrade, setDexTrade] = useState();
  const [rawTransaction, setRawTransaction] = useState(null);
  const [txHash, setTxHash] = useState();
  const [txReceipt, setTxReceipt] = useState();

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
      description: `Where will you be sending your ${asset &&
        asset.symbol} from? You will receive your ${receiveAsset &&
        receiveAsset.symbol} back to the same address after the swap.`,
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
        setAsset={setAsset}
        setReceiveAsset={setReceiveAsset}
        setSendAmount={setSendAmount}
        setReceiveAmount={setReceiveAmount}
        sendAmount={sendAmount}
        receiveAmount={receiveAmount}
        assets={dummyAssets}
        asset={asset}
        receiveAsset={receiveAsset}
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
        makeAllowanceTransaction={makeAllowanceTransaction}
        makeTradeTransactionFromDexTrade={makeTradeTransactionFromDexTrade}
      />
    </ExtendedContentPanel>
  );
};

export default withRouter(SwapAssetsFlow);

const dummyAssets: ISwapAsset[] = [
  { name: 'ETH ', symbol: 'ETH' as TSymbol },
  { name: 'Dai (DAI)', symbol: 'DAI' as TSymbol },
  { name: 'Maker (MKR)', symbol: 'MKR' as TSymbol },
  { name: 'USD Coin (USDC)', symbol: 'USDC' as TSymbol },
  { name: 'Basic Attention Token (BAT)', symbol: 'BAT' as TSymbol },
  { name: 'Wrapped Bitcoin (WBTC)', symbol: 'WBTC' as TSymbol },
  { name: 'Chainlink (LINK)', symbol: 'LINK' as TSymbol },
  { name: 'Augur (REP)', symbol: 'REP' as TSymbol },
  { name: '0x (ZRX)', symbol: 'ZRX' as TSymbol },
  { name: 'Kyber Network (KNC)', symbol: 'KNC' as TSymbol },
  { name: 'sUSD (SUSD)', symbol: 'SUSD' as TSymbol },
  { name: 'Synthetix Network Token (SNX)', symbol: 'SNX' as TSymbol },
  { name: 'Zilliqa (ZIL)', symbol: 'ZIL' as TSymbol },
  { name: 'cDAI (cDAI)', symbol: 'CDAI' as TSymbol },
  { name: 'Status (SNT)', symbol: 'SNT' as TSymbol },
  { name: 'Loom Network (LOOM)', symbol: 'LOOM' as TSymbol },
  { name: 'OmiseGO (OMG)', symbol: 'OMG' as TSymbol },
  { name: 'Grid+ (GRID)', symbol: 'GRID' as TSymbol },
  { name: 'Enjin (ENJ)', symbol: 'ENJ' as TSymbol },
  { name: 'Golem (GNT)', symbol: 'GNT' as TSymbol },
  { name: 'Gnosis (GNO)', symbol: 'GNO' as TSymbol },
  { name: 'Bancor (BNT)', symbol: 'BNT' as TSymbol },
  { name: 'USDT (USDT)', symbol: 'USDT' as TSymbol },
  { name: 'TrueUSD (TUSD)', symbol: 'TUSD' as TSymbol },
  { name: 'Decentraland (MANA)', symbol: 'MANA' as TSymbol },
  { name: 'district0x (DNT)', symbol: 'DNT' as TSymbol },
  { name: 'Aragon (ANT)', symbol: 'ANT' as TSymbol },
  { name: 'Fulcrum iDAI (iDAI)', symbol: 'IDAI' as TSymbol },
  { name: 'Melon (MLN)', symbol: 'MLN' as TSymbol },
  { name: 'SpankChain (SPANK)', symbol: 'SPANK' as TSymbol },
  { name: 'QASH (QASH)', symbol: 'QASH' as TSymbol },
  { name: 'Ontology Gas (ONG)', symbol: 'ONG' as TSymbol },
  { name: 'Loopring (LRC)', symbol: 'LRC' as TSymbol },
  { name: 'Huobi Token (HT)', symbol: 'HT' as TSymbol },
  { name: 'Waltonchain (WTC)', symbol: 'WTC' as TSymbol },
  { name: 'Bee Token (BEE)', symbol: 'BEE' as TSymbol },
  { name: 'Crypto.com (MCO)', symbol: 'MCO' as TSymbol },
  { name: 'Nexo (NEXO)', symbol: 'NEXO' as TSymbol },
  { name: 'Raiden Network Token (RDN)', symbol: 'RDN' as TSymbol },
  { name: 'TokenCard (TKN)', symbol: 'TKN' as TSymbol },
  { name: 'AMPL (AMPL)', symbol: 'AMPL' as TSymbol },
  { name: 'FOAM (FOAM)', symbol: 'FOAM' as TSymbol },
  { name: 'Ren (REN)', symbol: 'REN' as TSymbol },
  { name: 'WAX (WAX)', symbol: 'WAX' as TSymbol },
  { name: 'Storj (STORJ)', symbol: 'STORJ' as TSymbol },
  { name: 'Polymath (POLY)', symbol: 'POLY' as TSymbol },
  { name: 'Bloom (BLT)', symbol: 'BLT' as TSymbol },
  { name: 'iExec RLC (RLC)', symbol: 'RLC' as TSymbol },
  { name: 'QuarkChain (QKC)', symbol: 'QKC' as TSymbol },
  { name: 'Santiment Network Token (SAN)', symbol: 'SAN' as TSymbol },
  { name: 'Enigma (ENG)', symbol: 'ENG' as TSymbol },
  { name: 'SingularityNET (AGI)', symbol: 'AGI' as TSymbol },
  { name: 'FunFair (FUN)', symbol: 'FUN' as TSymbol },
  { name: 'Ripio (RCN)', symbol: 'RCN' as TSymbol },
  { name: 'Civic (CVC)', symbol: 'CVC' as TSymbol },
  { name: 'Power Ledger (POWR)', symbol: 'POWR' as TSymbol },
  { name: 'Eidoo (EDO)', symbol: 'EDO' as TSymbol },
  { name: 'IoTeX (IOTX)', symbol: 'IOTX' as TSymbol },
  { name: 'Live Peer (LPT)', symbol: 'LPT' as TSymbol },
  { name: 'Aelf (ELF)', symbol: 'ELF' as TSymbol },
  { name: 'Pax (PAX)', symbol: 'PAX' as TSymbol },
  { name: 'Numeraire (NMR)', symbol: 'NMR' as TSymbol }
];
