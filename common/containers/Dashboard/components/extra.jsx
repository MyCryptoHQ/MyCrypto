import React, {PureComponent} from 'react';
import {Card, Image} from 'semantic-ui-react'

export default class DashboardCardComponent extends PureComponent {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        title: React.PropTypes.string,
        body: React.PropTypes.string,
        userId: React.PropTypes.number,
        id: React.PropTypes.number
    }

    render() {
        let {title, body, id, userId} = this.props

        return (
            <main>
                <section role="main" className="row ng-hide" ng-show="wallet &amp;&amp; !showPaperWallet">
                    <h1 className="ng-scope">Save your Wallet File. Don't forget your
                        password.</h1>
                    <br/>
                    <div className="col-sm-8 col-sm-offset-2">
                        <div aria-hidden="true" className="account-help-icon"><img
                            src="images/icon-help.svg" className="help-icon"/>
                            <p className="account-help-text ng-scope">This
                                Keystore file matches the format used by Mist so you can easily import it in
                                the future. It is the recommended file to download and back up.</p>
                            <h4 className="ng-scope">Keystore File (UTC / JSON)</h4>
                        </div>
                        <a tabIndex="0" role="button" className="btn btn-primary btn-block ng-scope" href=""
                           download="" aria-label="Download
 Keystore File (UTC / JSON · Recommended · Encrypted)
" aria-describedby="x_KeystoreDesc">Download</a>
                        <p className="sr-only ng-scope" id="x_KeystoreDesc">This
                            Keystore file matches the format used by Mist so you can easily import it in the
                            future. It is the recommended file to download and back up.</p>
                        <br/><br/><br/><br/>
                    </div>
                    <div className="col-xs-12 alert alert-danger">
                  <span>
                  MyEtherWallet.com is not a web wallet &amp; does not store or transmit this secret information at any time. <br/>
                  <strong>If you do not save your wallet file and password, we cannot recover them.</strong><br/>
                  Save your wallet file now &amp; back it up in a second location (not on your computer).
                  <br/><br/>
                  <a tabIndex="0" role="button" className="btn btn-info disabled"
                     ng-className="fileDownloaded ? '' : 'disabled' "
                     n> I understand. Continue. </a>
                </span></div>
                </section>


                <section className="row ng-hide" ng-show="showPaperWallet">
                    <h1 className="ng-scope">Optional: Print your paper wallet or store
                        a QR code.</h1>
                    <h4> If you think you may <u>ever</u> forget your password, save one of these, please! Keep
                        it safe!</h4>
                    <div className="col-sm-8 col-sm-offset-2">
                        <div aria-hidden="true" className="account-help-icon"><img src="images/icon-help.svg"
                                                                                   className="help-icon"/>
                            <p className="account-help-text ng-scope" id="x_PrivKeyDesc"
                            >This is the unencrypted text version of your private
                                key, meaning no password is necessary. If someone were to find your unencrypted
                                private key, they could access your wallet without a password. For this reason,
                                encrypted versions are typically recommended.</p>
                            <label className="ng-scope">Private Key (unencrypted)</label>
                        </div>
                        <textarea aria-label="Private Key (unencrypted)
" aria-describedby="x_PrivKeyDesc" className="form-control bigger-on-mobile ng-binding" type="text"
                                  readOnly="readonly"></textarea>
                        <div aria-hidden="true" className="account-help-icon"><img src="images/icon-help.svg"
                                                                                   className="help-icon"/>
                            <p className="account-help-text ng-scope" id="x_PrintDesc">
                                ProTip: Click print and save this as a PDF, even if you do not own a
                                printer!</p>
                            <label className="ng-scope">Print Paper Wallet</label>
                        </div>
                        <a tabIndex="0" aria-label="Print Paper Wallet
" aria-describedby="x_PrintDesc" role="button" className="btn btn-primary btn-block ng-scope"
                        >Print</a>
                    </div>
                    <br/><br/>
                    <div className="col-sm-4 col-sm-offset-4">
                        <label className="ng-scope">Private Key (unencrypted)</label>
                        <div qr-code="" watch-var="showPaperWallet" width="100%">
                            <canvas width="0" height="0"></canvas>
                            <img style={{display: 'none'}}/>

                        </div>
                        <br/>
                        <br/>
                        <a className="btn btn-info"> Next: Save your
                            Address </a>
                    </div>
                </section>

                <article className="row text-left ng-hide" ng-show="showGetAddress">
                    <section className="clearfix collapse-container">
                        <div className="text-center">
                            <a className="collapse-button"><span ng-show="wd" className="ng-hide">+</span><span
                                ng-show="!wd" className="">-</span></a>
                            <h1 traslate="SWAP_unlock">Unlock your wallet to see your address</h1>
                        </div>
                        <div ng-show="!wd" className="">
                            <wallet-decrypt-drtv>
                                <article className="well decrypt-drtv row ng-scope"
                                         ng-controller="decryptWalletCtrl as $crtl">
                                    {/*<!-- Column 1 - Select Type of Key -->*/}
                                    <section className="col-md-4 col-sm-6">
                                        <h4 className="ng-scope">How would you like
                                            to access your wallet?</h4>
                                        <label className="radio"><input aria-flowto="aria1"
                                                                        aria-label="Keystore JSON file"
                                                                        type="radio" ng-model="walletType"
                                                                        value="fileupload"
                                                                        className="ng-pristine ng-untouched ng-valid ng-empty"
                                                                        name="68"/><span
                                            className="ng-scope">Keystore File (UTC / JSON)</span></label>
                                        <label className="radio"><input aria-flowto="aria2"
                                                                        aria-label="private key" type="radio"
                                                                        ng-model="walletType"
                                                                        value="pasteprivkey"
                                                                        className="ng-pristine ng-untouched ng-valid ng-empty"
                                                                        name="70"/><span
                                            className="ng-scope">Private Key</span></label>
                                        <label className="radio"><input aria-flowto="aria3"
                                                                        aria-label="mnemonic phrase"
                                                                        type="radio" ng-model="walletType"
                                                                        value="pastemnemonic"
                                                                        className="ng-pristine ng-untouched ng-valid ng-empty"
                                                                        name="72"/><span
                                            className="ng-scope">Mnemonic Phrase</span></label>
                                        <label className="radio"><input aria-flowto="aria4"
                                                                        aria-label="parity phrase" type="radio"
                                                                        ng-model="walletType"
                                                                        value="parityBWallet"
                                                                        className="ng-pristine ng-untouched ng-valid ng-empty"
                                                                        name="74"/><span
                                            className="ng-scope">Parity Phrase</span></label>
                                        <label className="radio"
                                               ng-hide="globalService.currentTab==globalService.tabs.signMsg.id">
                                            <input
                                                aria-flowto="aria5" type="radio"
                                                aria-label="Ledger Nano S hardware wallet" ng-model="walletType"
                                                value="ledger"
                                                className="ng-pristine ng-untouched ng-valid ng-empty"
                                                name="76"/>Ledger
                                            Nano S</label>
                                        <label className="radio"
                                               ng-hide="globalService.currentTab==globalService.tabs.signMsg.id"><input
                                            aria-flowto="aria6" type="radio" aria-label="Trezor hardware wallet"
                                            ng-model="walletType" value="trezor"
                                            className="ng-pristine ng-untouched ng-valid ng-empty"
                                            name="77"/>TREZOR</label>
                                        <label className="radio ng-hide"
                                               ng-hide="globalService.currentTab!==globalService.tabs.viewWalletInfo.id">
                                            <input
                                                aria-label="address" type="radio" ng-model="walletType"
                                                value="addressOnly"
                                                className="ng-pristine ng-untouched ng-valid ng-empty"
                                                name="78"/><span>View with Address Only</span></label>
                                    </section>
                                    {/*<!-- Column 1 - Select Type of Key -->*/}
                                    {/*<!-- Column 2 - Unlock That Key -->*/}
                                    <section className="col-md-4 col-sm-6">
                                        {/*<!-- if selected upload -->*/}
                                        {/*<!-- ngIf: walletType=='fileupload' -->*/}
                                        {/*<!-- /if selected upload -->*/}
                                        {/*<!-- if selected type key-->*/}
                                        {/*<!-- ngIf: walletType=='pasteprivkey' -->*/}
                                        {/*<!-- /if selected type key-->*/}
                                        {/*<!-- if selected type mnemonic-->*/}
                                        {/*<!-- ngIf: walletType=='pastemnemonic' -->*/}
                                        {/*<!-- /if selected type mnemonic-->*/}
                                        {/*<!-- if selected parity phrase-->*/}
                                        {/*<!-- ngIf: walletType=='parityBWallet' -->*/}
                                        {/*<!-- /if selected parity phrase-->*/}
                                        {/*<!-- if selected type ledger-->*/}
                                        {/*<!-- ngIf: walletType=='ledger' -->*/}
                                        {/*<!-- /if selected type ledger-->*/}
                                        {/*<!-- if selected type trezor-->*/}
                                        <br/>
                                        {/*<!-- ngIf: walletType=='trezor' -->*/}
                                        {/*<!-- /if selected type ledger-->*/}
                                        {/*<!-- if selected addressOnly-->*/}
                                        {/*<!-- ngIf: walletType=='addressOnly' -->*/}
                                        {/*<!-- /if selected addressOnly-->*/}
                                    </section>
                                    {/*<!-- / Column 2 - Unlock That Key -->*/}
                                    {/*<!-- Column 3 -The Unlock Button -->*/}
                                    <section className="col-md-4 col-sm-6 ng-hide"
                                             ng-show="showFDecrypt||showPDecrypt||showMDecrypt||walletType=='ledger'||walletType=='trezor'||showAOnly||showParityDecrypt">
                                        <h4 id="uploadbtntxt-wallet"
                                            ng-show="showFDecrypt||showPDecrypt||showMDecrypt"
                                            className="ng-scope ng-hide">Unlock your
                                            Wallet</h4>
                                        <div className="form-group"><a tabIndex="0" role="button"
                                                                       className="btn btn-primary btn-block ng-scope ng-hide"
                                                                       ng-show="showFDecrypt||showPDecrypt||showMDecrypt||showParityDecrypt"
                                        >Unlock</a>
                                        </div>
                                        <div className="form-group"><a tabIndex="0" role="button"
                                                                       className="btn btn-primary btn-block ng-scope ng-hide"
                                                                       ng-show="showAOnly"
                                        >Unlock</a>
                                        </div>
                                        <div className="form-group"><a tabIndex="0" role="button"
                                                                       className="btn btn-primary btn-block ng-scope ng-hide"
                                                                       ng-show="walletType=='ledger'"
                                        >Connect to
                                            Ledger Nano S</a></div>
                                    </section>
                                    {/*<!-- / Column 3 -The Unlock Button -->*/}
                                    {/*<!-- MODAL -->*/}
                                    <article className="modal fade" id="mnemonicModel" tabIndex="-1"
                                             role="dialog" aria-labelledby="modalTitle">
                                        <section className="modal-dialog">
                                            <section className="modal-content">
                                                <div className="modal-body" role="document">
                                                    <button aria-label="Close" type="button" className="close"
                                                            data-dismiss="modal">×
                                                    </button>
                                                    {/*<!-- Select HD Path -->*/}
                                                    <span ng-show="showMDecrypt" className="ng-hide">
                  <h3 id="modalTitle" className="modal-title ng-scope">Select HD derivation path</h3>
                  <label className="radio">
                  <input aria-describedby="modalTitle" type="radio" id="hd_derivation_path_default"
                         ng-model="HDWallet.dPath" value="m/44'/60'/0'/0" ng-change="onHDDPathChange()"
                         className="ng-pristine ng-untouched ng-valid ng-not-empty" name="84"/>
                  <span ng-bind="HDWallet.defaultDPath" className="ng-binding">m/44'/60'/0'/0</span>
                      {/*<!-- ngIf: !showTrezorSeparate -->*/}

                      <span ng-if="!showTrezorSeparate"
                            className="ng-scope">(Jaxx, Metamask, Exodus, imToken, TREZOR)</span>

                      {/*<!-- end ngIf: !showTrezorSeparate -->*/}
                      {/*<!-- ngIf: showTrezorSeparate -->*/}
                  </label>
                  <label className="radio">
                  <input aria-describedby="modalTitle" type="radio" id="hd_derivation_path_alternative"
                         ng-model="HDWallet.dPath" value="m/44'/60'/0'" ng-change="onHDDPathChange()"
                         className="ng-pristine ng-untouched ng-valid ng-not-empty" name="85"/>
                  <span ng-bind="HDWallet.alternativeDPath" className="ng-binding">m/44'/60'/0'</span>
                  <span className="ng-scope">(Ledger)</span>
                  </label>
                                                        {/*<!-- ngIf: showTrezorSeparate -->*/}
                                                        <label className="radio">
                  <input aria-describedby="modalTitle" type="radio" id="hd_derivation_path_custom"
                         ng-model="HDWallet.dPath" value="m/44'/60'/1'/0" ng-change="onHDDPathChange()"
                         className="ng-pristine ng-untouched ng-valid ng-not-empty" name="87"/>
                                                            {/*// style="display:inline;width:70%;max-width:15rem;" ng-model="HDWallet.customDPath"*/}

                                                            <input type="text"
                                                                   className="form-control ng-pristine ng-untouched ng-valid ng-not-empty"
                                                                   id="hd_derivation_path_custom_value"
                                                                   ng-change="onCustomHDDPathChange()"/>
                  <span className="ng-scope">(Custom)</span>
                  </label>
               </span>
                                                    {/*<!-- END Select HD Path --><!-- Select Address -->*/}
                                                    <hr/>
                                                    <h3 id="modalTitle2" className="modal-title ng-scope"
                                                    >Please select the address you
                                                        would like to interact with.</h3>
                                                    <p className="small ng-scope">Your
                                                        single HD mnemonic phrase can access a number of
                                                        wallets / addresses. Please select the address you
                                                        would like to interact with at this time.</p>
                                                    <table
                                                        className="small table table-striped table-mnemonic">
                                                        <tbody>
                                                        <tr>
                                                            <th></th>
                                                            <th className="ng-scope">
                                                                Your Address
                                                            </th>
                                                            <th className="ng-scope">
                                                                Balance
                                                            </th>
                                                        </tr>
                                                        {/*<!-- ngRepeat: wallet in HDWallet.wallets track by $index -->*/}
                                                        <tr className="m-addresses">
                                                            <td className="small"><a role="link" tabIndex="0"
                                                                                     ng-show="HDWallet.numWallets > 5"
                                                                                     ng-click="AddRemoveHDAddresses(false)"

                                                                                     className="ng-scope ng-hide">Previous
                                                                Addresses</a></td>
                                                            <td></td>
                                                            <td className="small"><a role="link" tabIndex="0"
                                                                                     ng-click="AddRemoveHDAddresses(true)"

                                                                                     className="ng-scope">More
                                                                Addresses</a></td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    {/*<!-- END Select Address -->*/}
                                                </div>
                                                <div className="modal-footer">
                                                    <button tabIndex="0" role="button"
                                                            aria-label="Cancel - Will close dialog"
                                                            className="btn btn-default ng-scope"
                                                            data-dismiss="modal">Cancel
                                                    </button>
                                                    <button tabIndex="0" role="button"
                                                            aria-label="Unlock this Wallet"
                                                            className="btn btn-primary ng-scope"
                                                            ng-click="setHDWallet()"
                                                    >Unlock
                                                    </button>
                                                </div>
                                            </section>
                                        </section>
                                    </article>
                                    {/*<!-- / MODAL -->*/}
                                </article>
                            </wallet-decrypt-drtv>

                        </div>
                    </section>

                    <section className="clearfix ng-scope ng-hide" ng-show="wallet!=null"
                             ng-controller="viewWalletCtrl">


                        <section className="col-sm-4">
                            <br/>
                            <wallet-balance-drtv>
                                <aside ng-controller="walletBalanceCtrl" className="ng-scope">
                                    <h5 className="ng-scope">Account
                                        Address</h5>
                                    <ul className="account-info">
                                        <div className="addressIdenticon med float"
                                             title="Address Indenticon" blockie-address=""
                                             watch-var="wallet">

                                        </div>
                                        <span className="mono wrap ng-binding"></span>
                                    </ul>
                                    <hr/>
                                    <h5 className="ng-scope">Account
                                        Balance</h5>
                                    <ul className="account-info">
                                        <li className="ng-binding"><span
                                            className="mono wrap ng-binding"></span> ETH
                                        </li>
                                    </ul>
                                    <section className="token-balances">
                                        <h5 className="ng-scope">Token
                                            Balances</h5>
                                        <table className="account-info">
                                            <tbody>
                                            {/*<!-- ngRepeat: token in wallet.tokenObjs track by $index -->*/}
                                            </tbody>
                                        </table>
                                        <a className="btn btn-default btn-sm"
                                           ng-click="tokenVisibility='shown'"
                                           ng-show="tokenVisibility=='hidden'">Show All Tokens</a>
                                        <a className="btn btn-default btn-sm ng-hide"
                                           ng-click="tokenVisibility='hidden'"
                                           ng-show="tokenVisibility=='shown'">Hide Tokens</a>
                                        <a className="btn btn-default btn-sm"
                                           ng-click="customTokenField=!customTokenField"><span

                                            className="ng-scope">Add Custom Token</span></a>
                                        <div className="custom-token-fields ng-hide"
                                             ng-show="customTokenField">
                                            <label
                                                className="ng-scope">Address</label>
                                            <input
                                                className="form-control input-sm ng-pristine ng-untouched ng-valid ng-empty is-invalid"
                                                type="text" ng-model="localToken.contractAdd"
                                                ng-className="Validator.isValidAddress(localToken.contractAdd) ? 'is-valid' : 'is-invalid'"/>
                                            <label className="ng-scope">Token
                                                Symbol</label>
                                            <input
                                                className="form-control input-sm ng-pristine ng-untouched ng-valid ng-empty is-invalid"
                                                type="text" ng-model="localToken.symbol"
                                                ng-className="localToken.symbol!='' ? 'is-valid' : 'is-invalid'"/>
                                            <label className="ng-scope">Decimals</label>
                                            <input
                                                className="form-control input-sm ng-pristine ng-untouched ng-valid ng-empty is-invalid"
                                                type="text" ng-model="localToken.decimals"
                                                ng-className="Validator.isPositiveNumber(localToken.decimals) ? 'is-valid' : 'is-invalid'"/>
                                            <div className="btn btn-primary btn-sm ng-scope"
                                                 ng-click="saveTokenToLocal()"
                                            >Save
                                            </div>
                                            <div ng-bind-html="validateLocalToken"
                                                 className="ng-binding"></div>
                                        </div>
                                    </section>
                                    <hr/>
                                    <section ng-show="ajaxReq.type=='ETH'" className="">
                                        <h5 className="ng-scope">
                                            Equivalent Values</h5>
                                        <ul className="account-info">
                                            <li><span className="mono wrap ng-binding"></span> BTC
                                            </li>
                                            <li><span className="mono wrap ng-binding"></span> REP
                                            </li>
                                            <li><span className="mono wrap ng-binding"></span> EUR
                                            </li>
                                            <li><span className="mono wrap ng-binding"></span> CHF
                                            </li>
                                            <li><span className="mono wrap ng-binding"></span> USD
                                            </li>
                                        </ul>
                                        <a target="_blank"
                                           ng-click="globalService.currentTab=globalService.tabs.swap.id"
                                           className="btn btn-primary btn-sm">Swap via Bity</a>
                                    </section>
                                </aside>
                            </wallet-balance-drtv>
                            <hr/>
                            <h5 className="ng-scope">Transaction
                                History</h5>
                            <ul className="account-info">
                                <li><a href="https://etherscan.io/address/undefined" target="_blank"
                                       className="ng-binding">https://etherscan.io/address/undefined</a>
                                </li>
                            </ul>
                            <hr/>
                            <h5 className="ng-scope">Your Address</h5>
                            <div className="qr-code" qr-code="" watch-var="wallet" width="100%">
                                <canvas width="0" height="0"></canvas>
                                {/*// style="display: none;"*/}


                                <img


                                />

                            </div>
                            <h5 ng-show="wallet.type=='default'"
                                className="ng-scope ng-hide">Private Key (unencrypted)</h5>
                            <div ng-show="wallet.type=='default'" className="qr-code ng-hide"
                                 qr-code="" watch-var="wallet" width="100%">
                                <canvas width="0" height="0"></canvas>
                                {/*// style="display: none;"*/}

                                <img


                                />

                            </div>
                        </section>

                        <section className="col-sm-8 view-wallet-content">

                            <div className="row">
                                <h1 className="col-xs-12 ng-scope">Success!
                                    Here are your wallet details.</h1>
                                <div className="col-sm-10">
                                    <div className="account-help-icon">
                                        <img src="images/icon-help.svg" className="help-icon"/>
                                        <p className="account-help-text ng-scope">
                                            You may know this as your "Account #" or your "Public Key". It
                                            is what you send people so they can send you ether. That icon is
                                            an easy way to recognize your address.</p>
                                        <h5 className="ng-scope">Your Address</h5>
                                    </div>
                                    <input className="form-control" type="text"
                                           ng-value="wallet.getChecksumAddressString()" readOnly="readonly"/>
                                </div>
                                <div className="col-sm-2 address-identicon-container">
                                    <div className="addressIdenticon" title="Address Indenticon"
                                         blockie-address="" watch-var="wallet"
                                    >

                                    </div>
                                </div>
                            </div>

                            <div ng-show="wallet.type=='default'" className="ng-hide">
                                <div className="account-help-icon">
                                    <img src="images/icon-help.svg" className="help-icon"/>
                                    <p className="account-help-text ng-scope">This
                                        is the unencrypted text version of your private key, meaning no
                                        password is necessary. If someone were to find your unencrypted
                                        private key, they could access your wallet without a password. For
                                        this reason, encrypted versions are typically recommended.</p>
                                    <h5 className="ng-scope">Private Key
                                        (unencrypted)</h5>
                                </div>
                                <textarea className="form-control ng-binding" type="text"
                                          readOnly="readonly"></textarea>
                            </div>

                            <div ng-show="wallet.type=='default'" className="ng-hide">
                                <div className="account-help-icon">
                                    <img src="images/icon-help.svg" className="help-icon"/>
                                    <p className="account-help-text ng-scope">
                                        ProTip: Click print and save this as a PDF, even if you do not own a
                                        printer!</p>
                                    <h5 className="ng-scope">Print Paper Wallet</h5>
                                </div>
                                <a className="btn btn-info btn-block ng-scope" ng-click="printQRCode()"
                                >Print Paper Wallet</a>
                            </div>

                            <div ng-show="showEnc" className="ng-hide">
                                <div className="account-help-icon">
                                    <img src="images/icon-help.svg" className="help-icon"/>
                                    <p className="account-help-text ng-scope">
                                        This Keystore file matches the format used by Mist so you can easily
                                        import it in the future. It is the recommended file to download and
                                        back up.</p>
                                    <h5 className="ng-scope">Keystore File (UTC /
                                        JSON · Recommended · Encrypted)</h5>
                                </div>
                                <a className="btn btn-info btn-block ng-scope" href="" download=""
                                >Download</a>
                            </div>


                        </section>
                    </section>
                </article>

                {/*<!-- end ngIf: globalService.currentTab==globalService.tabs.generateWallet.id -->*/
                }


                {/*<!-- View Wallet Info Panel -->*/
                }
                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.viewWalletInfo.id -->*/
                }
                {/*<!-- / View Wallet Info Tab -->*/
                }


                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.sendTransaction.id -->*/
                }


                {/*<!-- Swap Page -->*/
                }
                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.swap.id -->*/
                }
                {/*<!-- / Swap Page -->*/
                }


                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.offlineTransaction.id -->*/
                }


                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.contracts.id -->*/
                }


                {/*<!-- Help -->*/
                }
                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.help.id -->*/
                }
                {/*<!-- / Help -->*/
                }


                {/*<!-- ngIf: globalService.currentTab==globalService.tabs.bulkGenerate.id -->*/
                }


                {/*<!-- print -->*/
                }
                <div className="tab-pane" id="panePrint" style={{display: 'none'}}>
                    <div className="print-container">
                        <span id="printwalletjson" style={{display: 'none'}}></span>
                        <img src="images/logo-ethereum-1.png" className="ether-logo-1" height="100%" width="auto"/>
                        <img src="images/logo-ethereum-2.png" className="ether-logo-2"/>
                        <img src="images/print-sidebar.png" height="100%" width="auto"
                             className="print-title"/>
                        <div className="print-qr-code-1">
                            <div id="paperwalletaddqr"></div>
                            {/*<!--<img src="images/qrcode_test.png" width="90%;" height="auto" className="pull-left" />-->*/}
                            <p className="print-text" style={{paddingTop: '25px'}}>YOUR ADDRESS</p>
                        </div>
                        <div className="print-notes">
                            <img src="images/notes-bg.png" width="90%;" height="auto"
                                 className="pull-left"/>
                            <p className="print-text">AMOUNT / NOTES</p>
                        </div>
                        <div className="print-qr-code-2">
                            <div id="paperwalletprivqr"></div>
                            <p className="print-text" style={{paddingTop: '30px'}}>YOUR PRIVATE KEY</p>
                        </div>
                        <div className="print-address-container">
                            <p>
                                <strong>Your Address:</strong>
                                <br/>
                                <span id="paperwalletadd"></span>
                            </p>
                            <p>
                                <strong>Your Private Key:</strong>
                                <br/>
                                <span id="paperwalletpriv"></span>
                            </p>
                        </div>
                    </div>
                </div>
                {/*<!-- /print -->*/
                }


                <div className="alert popup  animated-show-hide ng-hide" ng-show="notifier.show" role="alert"
                     aria-live="assertive">
                    <span className="sr-only ng-binding"></span>
                    <div className="container ng-binding" ng-bind-html="notifier.message"></div>
                    <i tabIndex="0" aria-label="dismiss" className="icon-close" ng-click="notifier.close()"></i>
                </div>


            </main>
        )
    }

}



