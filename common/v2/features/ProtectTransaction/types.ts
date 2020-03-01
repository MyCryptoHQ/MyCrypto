import { ProtectionThisTransaction } from './components/ProtectionThisTransaction';
import { SignProtectedTransaction } from './components/SignProtectedTransaction';
import { ProtectedTransactionReport } from './components/ProtectedTransactionReport';
import { IFormikFields } from '../../types';

export enum ProtectTransactionAction {
  SHOW_HIDE_TRANSACTION_PROTECTION,
  PROTECT_MY_TRANSACTION,
  SEND_FORM_CALLBACK
}

export type SendFormCallbackType = () => { isValid: boolean; values: IFormikFields | null };

export type ProtectTransactionActions =
  | {
      actionType: ProtectTransactionAction.SHOW_HIDE_TRANSACTION_PROTECTION;
      payload: boolean;
    }
  | {
      actionType: ProtectTransactionAction.SEND_FORM_CALLBACK;
      payload: SendFormCallbackType;
    }
  | {
      actionType: ProtectTransactionAction.PROTECT_MY_TRANSACTION;
      paylaod: {
        amount: string;
      };
    };

export interface IProtectTransactionProps {
  onProtectTransactionAction?(payload: ProtectTransactionActions): void;
}

export enum ProtectTransactionFlowCmp {
  STEP_1_PROTECT_THIS_TRANSACTION = 'ProtectThisTransaction',
  STEP_2_SIGN_PROTECTED_TRANSACTION = 'SignProtectedTransaction',
  STEP_3_PROTECTED_TRANSACTION_REPORT = 'ProtectedTransactionReport'
}

export const PROTECT_TRANSACTION_STEPS = {
  [ProtectTransactionFlowCmp.STEP_1_PROTECT_THIS_TRANSACTION]: ProtectionThisTransaction,
  [ProtectTransactionFlowCmp.STEP_2_SIGN_PROTECTED_TRANSACTION]: SignProtectedTransaction,
  [ProtectTransactionFlowCmp.STEP_3_PROTECTED_TRANSACTION_REPORT]: ProtectedTransactionReport
};
