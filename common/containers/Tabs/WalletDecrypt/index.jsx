import React, {Component} from 'react';
import translate from 'translations';
import KeystoreDecrypt from './KeystoreDecrypt';
import PrivateKeyDecrypt from './PrivateKeyDecrypt';
import MnemonicDecrypt from './MnemonicDecrypt';
import LedgerNanoSDecrypt from './LedgerNanoSDecrypt';
import TrezorDecrypt from './TrezorDecrypt';
import ViewOnlyDecrypt from './ViewOnlyDecrypt';

export default class WalletDecrypt extends Component {
    constructor(props) {
        super(props);

        this.decryptionChoices = [
            {
                name: 'keystore-file',
                lid: 'x_Keystore2',
                component: KeystoreDecrypt
            },
            {
                name: 'private-key',
                lid: 'x_PrivKey2',
                component: PrivateKeyDecrypt
            },
            {
                name: 'mnemonic-phrase',
                lid: 'x_Mnemonic',
                component: MnemonicDecrypt
            },
            {
                name: 'ledger-nano-s',
                lid: 'x_Ledger',
                component: LedgerNanoSDecrypt
            },
            {
                name: 'trezor',
                lid: 'x_Trezor',
                component: TrezorDecrypt
            },
            {
                name: 'view-only',
                lid: 'View with Address Only',
                component: ViewOnlyDecrypt
            }
        ];

        this.state = {
            decryptionChoice: this.decryptionChoices[0].name // auto-select first option.
        };
    }

    getDecryptionComponent() {
        const selectedDecryptionChoice = this.decryptionChoices.find((decryptionChoice) => {
            return this.state.decryptionChoice === decryptionChoice.name;
        });

        return selectedDecryptionChoice.component;
    }

    buildDecryptionChoices() {
        return this.decryptionChoices.map((decryptionChoice, idx) => {
            const isSelected = this.state.decryptionChoice === decryptionChoice.name;

            return (
                <label className="radio" key={decryptionChoice.name}>
                    <input
                        aria-flowto={`aria${idx}`}
                        aria-labelledby={`${decryptionChoice.name}-label`}
                        type="radio"
                        name="decryption-choice-radio-group"
                        value={decryptionChoice.name}
                        checked={isSelected}
                        onChange={this.handleDecryptionChoiceChange}
                    />
                    <span id={`${decryptionChoice.name}-label`}>
                        {translate(decryptionChoice.lid)}
                    </span>
                </label>
            );
        });
    }

    handleDecryptionChoiceChange = (event) => {
        const choiceObject = this.decryptionChoices.find(decryptionChoice => {
            return (decryptionChoice.name === event.target.value) ? decryptionChoice.component : false;
        });

        const decryptionChoice = choiceObject.name;

        this.setState({
            decryptionChoice
        });
    }

    render() {
        const DecryptionComponent = this.getDecryptionComponent();

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

                                    <DecryptionComponent />
                                </article>
                            </div>
                        </article>
                    </article>
                </div>
            </section>
        );
    }
}