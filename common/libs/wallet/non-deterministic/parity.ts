import EthTx from 'ethereumjs-tx';
import { translateRaw } from 'translations';
import { IFullWallet } from '../IWallet';
import { TSetWalletQrTransaction, TFinalizeQrTransaction } from 'actions/wallet';

export default class ParityWallet implements IFullWallet {
  public address: string;
  private setWalletQrTransaction: TSetWalletQrTransaction;
  private finalizeQrTransaction: TFinalizeQrTransaction;

  constructor(
    address: string,
    setWalletQrTransaction: TSetWalletQrTransaction,
    finalizeQrTransaction: TFinalizeQrTransaction
  ) {
    this.address = address;
    this.setWalletQrTransaction = setWalletQrTransaction;
    this.finalizeQrTransaction = finalizeQrTransaction;
  }

  public signRawTransaction(tx: EthTx): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const from = this.address;

      const onCancel = () => {
        this.finalizeQrTransaction();
        reject(new Error(translateRaw('ADD_PARITY_1')));
      };

      const onSignature = (signature: string) => {
        this.finalizeQrTransaction();

        const sigBuf = Buffer.from(signature.substr(2), 'hex');

        // Mimicking the way tx.sign() works
        let v = sigBuf[64] + 27;

        if (tx._chainId > 0) {
          v += tx._chainId * 2 + 8;
        }

        tx.r = sigBuf.slice(0, 32);
        tx.s = sigBuf.slice(32, 64);
        tx.v = Buffer.from([v]);

        resolve(tx.serialize());
      };

      this.setWalletQrTransaction(tx, from, onSignature, onCancel);
    });
  }

  public signMessage = () =>
    Promise.reject(new Error('Signing via Parity Signer not yet supported.'));

  public getAddressString() {
    return this.address;
  }
}
