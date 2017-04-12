import React, {Component} from 'react'

export default class Footer extends Component {
    constructor(props) {
        super(props)
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <footer role="contentinfo" aria-label="footer">
                <div className="container">
                    <section className="row">
                        <section className="row">
                            <div className="col-sm-3 footer-1">
                                <p aria-hidden="true">
                                    <a href="https://www.myetherwallet.com/">
                                        {/* TODO - don't hardcode image path*/}
                                        <img
                                            src={"https://www.myetherwallet.com/images/logo-myetherwallet.svg"}
                                            height="55px" width="auto" alt="Ether Wallet"/></a>
                                </p>
                                <p><span >Open-Source, client-side tool for easily & securely interacting with the Ethereum network.</span>
                                    <span >Created by</span> <a aria-label="kvhnuke's github"
                                                                href="https://github.com/kvhnuke"
                                                                target="_blank">kvhnuke</a> & <a
                                        aria-label="tayvano's github" href="https://github.com/tayvano" target="_blank">tayvano</a>.
                                </p>
                                <br/>
                            </div>
                            <div className="col-sm-6 footer-2">
                                <h5><i aria-hidden="true">💝</i> Donations are always appreciated!</h5>
                                <ul>
                                    <li> ETH: <span
                                        className="mono wrap">0x7cB57B5A97eAbe94205C07890BE4c1aD31E486A8</span>
                                    </li>
                                    <li> BTC: <span className="mono wrap">1MEWT2SGbqtz6mPCgFcnea8XmWV5Z4Wc6</span></li>
                                </ul>

                                <h5><i aria-hidden="true">👫</i> You can also support us by supporting our
                                    blockchain-family.</h5>
                                <p>Consider using our affiliate links to...</p>
                                <ul>
                                    <li><a aria-label="Swap Ether or Bitcoin via Bity.com"
                                           href="https://bity.com/af/jshkb37v" target="_blank">Swap ETH/BTC/EUR/CHF via
                                        Bity.com</a></li>
                                    <li><a href="https://www.ledgerwallet.com/r/fa4b?path=/products/" target="_blank">Buy
                                        a
                                        Ledger Nano S</a></li>
                                    <li><a href="https://trezor.io/?a=myetherwallet.com" target="_blank">Buy a
                                        TREZOR</a>
                                    </li>
                                </ul>
                                <ul>
                                    <li>
                                        {/*<span translate="TranslatorName_1"></span>*/}
                                        {/*<span translate="TranslatorName_2"></span>*/}
                                        {/*<span translate="TranslatorName_3"></span>*/}
                                        {/*<span translate="TranslatorName_4"></span>*/}
                                        {/*<span translate="TranslatorName_5"></span>*/}
                                    </li>
                                </ul>
                            </div>
                            <div className="col-sm-3 footer-3">
                                <h5><i aria-hidden="true">🌎</i> On the Web</h5>
                                <ul>
                                    <li><a aria-label="my ether wallet.com" href="https://www.MyEtherWallet.com"
                                           target="_blank">www.MyEtherWallet.com</a></li>
                                    <li><a aria-label="my ether wallet github"
                                           href="https://github.com/kvhnuke/etherwallet"
                                           target="_blank">Github: MyEtherWallet.com & CX</a></li>
                                    <li><a aria-label="our organization on github"
                                           href="https://github.com/MyEtherWallet"
                                           target="_blank">Github: MyEtherWallet (Org)</a></li>
                                    <li><a aria-label="join our slack" href="https://myetherwallet.herokuapp.com/"
                                           target="_blank">Join Our Slack</a></li>
                                    <li><a aria-label="twitter" href="https://twitter.com/myetherwallet"
                                           target="_blank">Twitter</a>
                                    </li>
                                    <li><a aria-label="facebook" href="https://www.facebook.com/MyEtherWallet/"
                                           target="_blank">Facebook</a></li>
                                </ul>

                                <h5><i aria-hidden="true">🙏</i> Support</h5>
                                <ul>
                                    <li><a aria-label="email support at myetherwallet.com"
                                           href="mailto:support@myetherwallet.com" target="_blank">Email</a></li>
                                    <li><a aria-label="open a github issue"
                                           href="https://github.com/kvhnuke/etherwallet/issues" target="_blank">Github
                                        Issue</a></li>
                                </ul>
                            </div>
                        </section>
                    </section>
                </div>
            </footer>
        )
    }
}
