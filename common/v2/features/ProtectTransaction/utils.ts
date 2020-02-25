import { ITxConfig } from '../../types';

export abstract class ProtectTransactionUtils {
  public static getProtectTransactionFee(txConfig: ITxConfig) {
    if (txConfig.amount === null) return 0;
    /*debugger;*/
  }
}
