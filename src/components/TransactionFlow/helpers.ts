import BigNumber from 'bignumber.js';
import isEmpty from 'ramda/src/isEmpty';
import mergeDeepWith from 'ramda/src/mergeDeepWith';
import pick from 'ramda/src/pick';
import { Brand, ValuesType } from 'utility-types';

import { WALLET_STEPS } from '@components';
import { TokenMigrationReceiptProps } from '@components/TokenMigration/components/TokenMigrationReceipt';
import { CONTRACT_INTERACTION_TYPES } from '@config';
import { IMembershipPurchaseReceiptProps } from '@features/PurchaseMembership/components/MembershipPurchaseReceipt';
import { fetchUniversalGasPriceEstimate } from '@services/ApiService/Gas';
import { getAccountBalance, getStoreAccount } from '@services/Store';
import {
  IFlowConfig,
  ISimpleTxFormFull,
  ITxConfig,
  ITxMultiConfirmProps,
  ITxObject,
  ITxType,
  Network,
  StoreAccount,
  TxParcel
} from '@types';
import { bigify, bigNumGasPriceToViewableGwei } from '@utils';
import { isType2Tx } from '@utils/typedTx';

import { ISender } from './types';

type FieldValue = ValuesType<ISender>;

const preferValueFromSender = (l: FieldValue, r: FieldValue): FieldValue => (isEmpty(r) ? l : r);

interface Props {
  backStepTitle: string;
  amount: string;
  account: StoreAccount;

  flowConfig: IFlowConfig;
  transactions: TxParcel[];
  isSubmitting: boolean;
  error?: CustomError;

  multiTxTitle: string;
  receiptTitle: string;
  multiTxComponent(props: ITxMultiConfirmProps): JSX.Element;
  receiptComponent(
    props: TokenMigrationReceiptProps | IMembershipPurchaseReceiptProps
  ): JSX.Element;

  prepareTx(tx: ITxObject): void;
  sendTx(walletResponse: Brand<string, 'TxHash'> | Brand<Uint8Array, 'TxSigned'>): Promise<void>;
}

export const createSignConfirmAndReceiptSteps = ({
  amount,
  backStepTitle,
  flowConfig,
  multiTxTitle,
  multiTxComponent,
  receiptTitle,
  receiptComponent,
  account,
  transactions,
  error,
  isSubmitting,
  sendTx,
  prepareTx
}: Props) => [
  ...transactions.flatMap((tx: Required<TxParcel>, idx) => [
    {
      label: multiTxTitle,
      backBtnText: backStepTitle,
      component: multiTxComponent,
      props: {
        account,
        isSubmitting,
        transactions,
        flowConfig,
        currentTxIdx: idx,
        amount,
        error: error?.reason ?? error?.message
      },
      actions: (_: ISimpleTxFormFull, goToNextStep: () => void) => {
        if (transactions.length > 1) {
          prepareTx(tx.txRaw);
        } else {
          goToNextStep();
        }
      }
    },
    {
      label: '',
      backBtnText: multiTxTitle,
      component: account && WALLET_STEPS[account.wallet],
      props: {
        network: account && account.network,
        senderAccount: account,
        rawTransaction: tx.txRaw,
        onSuccess: sendTx
      }
    }
  ]),
  {
    label: receiptTitle,
    component: receiptComponent,
    props: {
      amount,
      account,
      flowConfig,
      transactions
    }
  }
];

export const constructSenderFromTxConfig = (
  txConfig: ITxConfig,
  accounts: StoreAccount[]
): ISender => {
  const { senderAccount, from, networkId } = txConfig;
  const defaultSender: ISender = {
    address: from,
    assets: [],
    networkId
  };

  const sender: ISender = mergeDeepWith(
    preferValueFromSender,
    defaultSender,
    pick(['address', 'assets', 'network'], {
      ...senderAccount
    })
  );

  // if account exists in store add it to sender
  const account = getStoreAccount(accounts)(sender.address, networkId);
  if (account) {
    sender.account = account;
    sender.accountBalance = getAccountBalance(senderAccount);
  }

  return sender;
};

// replacement gas price must be at least 10% higher than the replaced tx's gas price
export const calculateReplacementGasPrice = async (txConfig: ITxConfig, network: Network) => {
  const { estimate: gas } = await fetchUniversalGasPriceEstimate(network, txConfig.senderAccount);

  return isType2Tx(txConfig.rawTransaction)
    ? {
        maxFeePerGas: BigNumber.max(
          bigify(gas.maxFeePerGas!),
          bigify(bigNumGasPriceToViewableGwei(txConfig.rawTransaction.maxFeePerGas)).multipliedBy(
            1.101
          )
        ).toString(10),
        maxPriorityFeePerGas: BigNumber.max(
          bigify(gas.maxPriorityFeePerGas!),
          bigify(
            bigNumGasPriceToViewableGwei(txConfig.rawTransaction.maxPriorityFeePerGas)
          ).multipliedBy(1.101)
        ).toString(10)
      }
    : {
        gasPrice: BigNumber.max(
          bigify(gas.gasPrice!),
          bigify(bigNumGasPriceToViewableGwei(txConfig.rawTransaction.gasPrice)).multipliedBy(1.101)
        ).toString(10)
      };
};

export const isContractInteraction = (data: string, type?: ITxType) => {
  if (type) {
    return CONTRACT_INTERACTION_TYPES.includes(type);
  }
  return data !== '0x';
};
