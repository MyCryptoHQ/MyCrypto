import React, {Component} from 'react';

export default class ViewWallet extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <section className="container" style={{minHeight: '50%'}}>
                <div className="tab-content">
                    <article className="tab-pane active ng-scope"
                        // ng-if="globalService.currentTab==globalService.tabs.viewWalletInfo.id"
                        // ng-controller="viewWalletCtrl"
                    >

                        <article className="collapse-container">
                            <div
                                // ng-click="wd = !wd"
                            >
                                {/*<a className="collapse-button"><span ng-show="wd" className="ng-hide">+</span><span*/}
                                {/*ng-show="!wd">-</span></a>*/}

                                <h1 className="ng-scope">View Wallet Info</h1>

                            </div>
                            <div
                                // ng-show="!wd"
                            >
                                <p className="ng-scope">This allows you to download different versions
                                    of
                                    private keys and re-print your paper wallet. You may want to do this in order to
                                    <a
                                        target="_blank"
                                        href="http://ethereum.stackexchange.com/questions/465/how-to-import-a-plain-private-key-into-geth/">
                                        import
                                        your account into Geth/Mist</a>. If you want to check your balance, we
                                    recommend
                                    using a blockchain explorer like <a target="_blank" href="http://etherscan.io/">etherscan.io</a>.
                                </p>
                                {/*<wallet-decrypt-drtv/><article className="well decrypt-drtv row ng-scope" ng-controller="decryptWalletCtrl as $crtl">*/}
                                <article className="well decrypt-drtv row ng-scope"
                                    // ng-controller="decryptWalletCtrl as $crtl"
                                >
                                    <section className="col-md-4 col-sm-6">
                                        <h4 className="ng-scope">How would you like to access your
                                            wallet?</h4>
                                        <label className="radio">
                                            <input aria-flowto="aria1"
                                                   aria-label="Keystore JSON file"
                                                   type="radio"
                                                // ng-model="walletType"
                                                   value="fileupload"
                                                   className="ng-pristine ng-untouched ng-valid ng-empty"
                                                   name="133"/>
                                            <span

                                                // translate=""
                                                className="ng-scope">Keystore File (UTC / JSON)</span></label>
                                        <label className="radio"><input aria-flowto="aria2" aria-label="private key"
                                                                        type="radio"
                                            // ng-model="walletType"
                                                                        value="pasteprivkey"
                                                                        className="ng-pristine ng-untouched ng-valid ng-empty"
                                                                        name="135"/><span
                                            // translate=""
                                            className="ng-scope">Private Key</span></label>
                                        <label className="radio">
                                            <input aria-flowto="aria3" aria-label="mnemonic phrase"
                                                   type="radio"
                                                // ng-model="walletType"
                                                   value="pastemnemonic"
                                                   className="ng-pristine ng-untouched ng-valid ng-empty"
                                                   name="137"/><span

                                            // translate=""
                                            className="ng-scope">Mnemonic Phrase</span></label>
                                        <label className="radio">
                                            <input aria-flowto="aria4" aria-label="parity phrase"
                                                   type="radio"
                                                // ng-model="walletType"
                                                   value="parityBWallet"
                                                   className="ng-pristine ng-untouched ng-valid ng-empty"
                                                   name="139"/><span
                                            // translate=""
                                            className="ng-scope">Parity Phrase</span></label>
                                        <label className="radio"
                                            // ng-hide="globalService.currentTab==globalService.tabs.signMsg.id"
                                        >
                                            <input
                                                aria-flowto="aria5" type="radio"
                                                aria-label="Ledger Nano S hardware wallet"
                                                // ng-model="walletType"

                                                value="ledger"
                                                className="ng-pristine ng-untouched ng-valid ng-empty" name="141"/>Ledger
                                            Nano S</label>
                                        <label className="radio"
                                            // ng-hide="globalService.currentTab==globalService.tabs.signMsg.id"
                                        >
                                            <input
                                                aria-flowto="aria6" type="radio" aria-label="Trezor hardware wallet"
                                                // ng-model="walletType"
                                                value="trezor"
                                                className="ng-pristine ng-untouched ng-valid ng-empty"
                                                name="142"/>TREZOR</label>
                                        <label className="radio"
                                            // ng-hide="globalService.currentTab!==globalService.tabs.viewWalletInfo.id"

                                        >
                                            <input
                                                aria-label="address" type="radio"
                                                // ng-model="walletType"
                                                value="addressOnly"
                                                className="ng-pristine ng-untouched ng-valid ng-empty"
                                                name="143"/><span>View with Address Only</span></label>
                                    </section>
                                </article>
                            </div>
                        </article>
                    </article>
                </div>
            </section>
        )
    }
}
