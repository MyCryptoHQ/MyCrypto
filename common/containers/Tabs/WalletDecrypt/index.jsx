import React, {Component} from 'react';
import translate from 'translations';


export default class WalletDecrypt extends Component {
    constructor(props) {
        super(props);
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
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria1"
                                                aria-labelledby="keystore-file-label"
                                                type="radio"
                                                value="fileupload"
                                                name="133"
                                            />
                                            <span id="keystore-file-label">
                                                {translate('x_Keystore2')}
                                            </span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria2"
                                                aria-labelledby="private-key-label"
                                                type="radio"
                                                value="pasteprivkey"
                                                name="135"
                                            />
                                            <span id="private-key-label">
                                                {translate('x_PrivKey2')}
                                            </span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria3"
                                                aria-labelledby="mnemonic-phrase-label"
                                                type="radio"
                                                value="pastemnemonic"
                                                name="137"
                                            />
                                            <span id="mnemonic-phrase-label">
                                                {translate('x_Mnemonic')}
                                            </span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria4"
                                                aria-labelledby="parity-phrase-label"
                                                type="radio"
                                                value="parityBWallet"
                                                name="139"
                                            />
                                            <span id="parity-phrase-label">
                                                {translate('x_ParityPhrase')}
                                            </span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria5"
                                                aria-labelledby="ledger-nano-s-label"
                                                type="radio"
                                                value="ledger"
                                                name="141"
                                            />
                                            <span id="ledger-nano-s-label">
                                                {translate('x_Ledger')}
                                            </span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria6"
                                                aria-labelledby="trezor-label"
                                                type="radio"
                                                value="trezor"
                                                name="142"
                                            />
                                            <span id="trezor-label">
                                                {translate('x_Trezor')}
                                            </span>
                                        </label>
                                        <label className="radio">
                                            <input
                                                aria-flowto="aria7"
                                                aria-labelledby="view-only-label"
                                                type="radio"
                                                value="addressOnly"
                                                name="143"
                                            />
                                            <span id="view-only-label">
                                                View with Address Only
                                            </span>
                                        </label>
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