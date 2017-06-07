import React, {Component} from 'react';
import translate from 'translations';
import KeystoreDecrypt from './KeystoreDecrypt';
import PrivateKeyDecrypt from './PrivateKeyDecrypt';
import MnemonicDecrypt from './MnemonicDecrypt';
import LedgerNanoSDecrypt from './LedgerNanoSDecrypt';
import TrezorDecrypt from './TrezorDecrypt';
import ViewOnlyDecrypt from './ViewOnlyDecrypt';

const decryptionChoices = [
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

export default class WalletDecrypt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            decryptionComponent: null
        };
    }

    buildDecryptionChoices() {
        return decryptionChoices.map((decryptionChoice, idx) => {
            return (
                <label className="radio" key={decryptionChoice.name}>
                    <input
                        aria-flowto={`aria${idx}`}
                        aria-labelledby={`${decryptionChoice.name}-label`}
                        type="radio"
                        name="decryption-choice-radio-group"
                        value={decryptionChoice.name}
                        onChange={this.handleDecryptionChoiceChange.bind(this)}
                    />
                    <span id={`${decryptionChoice.name}-label`}>
                        {translate(decryptionChoice.lid)}
                    </span>
                </label>
            );
        });
    }

    handleDecryptionChoiceChange(event)
    {
        const choiceObject = decryptionChoices.find(decryptionChoice => {
            return (decryptionChoice.name === event.target.value) ? decryptionChoice.component : false;
        });
        const decryptionComponent = choiceObject.component;

        this.setState({
            decryptionComponent
        });
    }

    render() {
        const decryptionComponent = this.state.decryptionComponent ?
            <this.state.decryptionComponent /> :
            <div />;

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

                                    {decryptionComponent}
                                </article>
                            </div>
                        </article>
                    </article>
                </div>
            </section>
        );
    }
}