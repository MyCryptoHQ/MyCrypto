import React, {Component} from 'react';
import translate from 'translations';
/*import KeystoreDecrypt from './KeystoreDecrypt';
import PrivateKeyDecrypt from './PrivateKeyDecrypt';
import MnemonicDecrypt from './MnemonicDecrypt';
import LedgerNanoSDecrypt from './LedgerNanoSDecrypt';
import TrezorDecrypt from './TrezorDecrypt';
import ViewOnlyDecrypt from './ViewOnlyDecrypt';*/

export default class WalletDecrypt extends Component {
    buildDecryptionChoices() {
        const decryptionChoices = [
            {
                name: 'keystore-file',
                lid: 'x_Keystore2',
                // component: KeystoreDecrypt
            },
            {
                name: 'private-key',
                lid: 'x_PrivKey2',
                // component: PrivateKeyDecrypt
            },
            {
                name: 'mnemonic-phrase',
                lid: 'x_Mnemonic',
                // component: MnemonicDecrypt
            },
            {
                name: 'ledger-nano-s',
                lid: 'x_Ledger',
                // component: LedgerNanoSDecrypt
            },
            {
                name: 'trezor',
                lid: 'x_Trezor',
                // component: TrezorDecrypt
            },
            {
                name: 'view-only',
                lid: 'View with Address Only',
                // component: ViewOnlyDecrypt
            }
        ];

        return decryptionChoices.map((decryptionChoice, idx) => {
            return (
                <label className="radio">
                    <input
                        aria-flowto={`aria${idx}`}
                        aria-labelledby={`${decryptionChoice.name}-label`}
                        type="radio"
                    />
                    <span id={`${decryptionChoice.name}-label`}>
                        {translate(decryptionChoice.lid)}
                    </span>
                </label>
            );
        });
    }

    render() {
        return (
            <section className="container">
                <div className="tab-content">
                    <article className="tab-pane active">
                        <article className="collapse-container">
                            <div>
                                <h1>View Wallet Info</h1>
                            </div>
                            <div>
                                <p>{translate('VIEWWALLET_Subtitle')}</p>
                                <article className="well decrypt-drtv row">
                                    <section className="col-md-4 col-sm-6">
                                        <h4>{translate('decrypt_Access')}</h4>

                                        {this.buildDecryptionChoices()}
                                    </section>
                                </article>
                            </div>
                        </article>
                    </article>
                </div>
            </section>
        );
    }
}