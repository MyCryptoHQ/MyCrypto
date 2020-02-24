export enum ProtectTransactionAction {
  SHOW_HIDE_TRANSACTION_PROTECTION,
  PROTECT_MY_TRANSACTION,
  SEND_FORM_CALLBACK
}

export type SendFormCallbackType = () => { isValid: boolean; values: any };

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
    };

export interface IProtectTransactionProps {
  onProtectTransactionAction?(payload: ProtectTransactionActions): void;
}
