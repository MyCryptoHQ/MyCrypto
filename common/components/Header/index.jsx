import React, {Component} from 'react'

export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        title: React.PropTypes.string,
        toggleSidebar: React.PropTypes.func,
        onHeaderRightButtonClick: React.PropTypes.func,
        isLoggedIn: React.PropTypes.bool
    };

    render() {
        return (
            <section className="bg-gradient header-branding">
                <section className="container">
                    <a className="brand" href="https://www.myetherwallet.com/" aria-label="Go to homepage">
                        {/* TODO - don't hardcode image path*/}
                        <img
                            src={"https://www.myetherwallet.com/images/logo-myetherwallet.svg"} height="64px"
                            width="245px"
                            alt="MyEtherWallet"></img></a>
                    <div className="tagline"><span style={{maxWidth: "395px"}}>Open-Source &amp;
                        Client-Side Ether Wallet</span>
                        · v3.6.0 &nbsp;&nbsp;
                        <span className="dropdown">
          <a tabIndex="0" aria-haspopup="true" aria-expanded="false"
             aria-label="change language. current language English" className="dropdown-toggle ng-binding"
             ng-click="dropdown = !dropdown">English
                  <i className="caret"></i>
          </a>
                            {/*<ul className="dropdown-menu ng-hide" ng-show="dropdown">*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Deutsch']" ng-click="changeLanguage('de','Deutsch'     )"> Deutsch         </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Ελληνικά']" ng-click="changeLanguage('el','Ελληνικά'    )"> Ελληνικά        </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='English']" ng-click="changeLanguage('en','English'     )"*/}
                            {/*className="active"> English         </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Español']" ng-click="changeLanguage('es','Español'     )"> Español         </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Suomi']" ng-click="changeLanguage('fi','Suomi'       )"*/}
                            {/*className=""> Suomi           </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Français']" ng-click="changeLanguage('fr','Français'    )"> Français        </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Magyar']" ng-click="changeLanguage('hu','Magyar'      )"> Magyar          </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Indonesian']" ng-click="changeLanguage('id','Indonesian'  )"> Bahasa Indonesia</a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Italiano']" ng-click="changeLanguage('it','Italiano'    )"> Italiano        </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='日本語']"*/}
                            {/*ng-click="changeLanguage('ja','日本語'       )"> 日本語           </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Nederlands']" ng-click="changeLanguage('nl','Nederlands'  )"> Nederlands      </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Norsk Bokmål']"*/}
                            {/*ng-click="changeLanguage('no','Norsk Bokmål')"> Norsk Bokmål    </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Polski']" ng-click="changeLanguage('pl','Polski'      )"> Polski          </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Português']" ng-click="changeLanguage('pt','Português'   )"> Português       </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Русский']" ng-click="changeLanguage('ru','Русский'     )"> Русский         </a></li>*/}
                            {/*/!*<!--<li><a ng-className="{true:'active'}[curLang=='Slovenčina']"   ng-click="changeLanguage('sk','Slovenčina'  )"> Slovenčina      </a></li>-->*!/*/}
                            {/*/!*<!--<li><a ng-className="{true:'active'}[curLang=='Slovenščina']"  ng-click="changeLanguage('sl','Slovenščina' )"> Slovenščina     </a></li>-->*!/*/}
                            {/*/!*<!--<li><a ng-className="{true:'active'}[curLang=='Svenska']"      ng-click="changeLanguage('sv','Svenska'     )"> Svenska         </a></li>-->*!/*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Türkçe']" ng-click="changeLanguage('tr','Türkçe'      )"> Türkçe          </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='Tiếng Việt']" ng-click="changeLanguage('vi','Tiếng Việt'  )"> Tiếng Việt      </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='简体中文']"*/}
                            {/*ng-click="changeLanguage('zhcn','简体中文'   )"> 简体中文         </a></li>*/}
                            {/*<li><a ng-className="{true:'active'}[curLang=='繁體中文']"*/}
                            {/*ng-click="changeLanguage('zhtw','繁體中文'   )"> 繁體中文         </a></li>*/}
                            {/*<li role="separator" className="divider"></li>*/}
                            {/*<li><a data-toggle="modal" data-target="#disclaimerModal" className="ng-scope">Disclaimer</a></li>*/}
                            {/*</ul>*/}
                    </span>&nbsp;&nbsp;
                        <span className="dropdown">
          <a tabIndex="0" aria-haspopup="true" aria-label="change node. current node ETH node by MyEtherWallet"
             className="dropdown-toggle ng-binding" ng-click="dropdownNode = !dropdownNode"> ETH
              <small
                  className="ng-binding">(MyEtherWallet)</small>
              <i className="caret"></i>
          </a>
                            {/*<ul className="dropdown-menu ng-hide" ng-show="dropdownNode">*/}
                            {/*/!*<!-- ngRepeat: (key, value) in nodeList -->*!/*/}
                            {/*<li ng-repeat="(key, value) in nodeList" className="ng-scope"><a*/}
                            {/*ng-className="{true:'active'}[curNode == key]" ng-click="changeNode(key)" className="ng-binding">*/}
                            {/*ETH*/}
                            {/*<small className="ng-binding"> (MyEtherWallet) </small>*/}
                            {/*<img ng-show="value.service=='Custom'" img="" src="images/icon-remove.svg" className="node-remove ng-hide"*/}
                            {/*title="Remove Custom Node" ng-click="removeNodeFromLocal(value.name)"/>*/}
                            {/*</a></li>*/}
                            {/*/!*<!-- end ngRepeat: (key, value) in nodeList -->*!/*/}
                            {/*<li ng-repeat="(key, value) in nodeList" className="ng-scope"><a*/}
                            {/*ng-className="{true:'active'}[curNode == key]" ng-click="changeNode(key)" className="ng-binding">*/}
                            {/*ETH*/}
                            {/*<small className="ng-binding"> (Etherscan.io) </small>*/}
                            {/*<img ng-show="value.service=='Custom'" img="" src="images/icon-remove.svg" className="node-remove ng-hide"*/}
                            {/*title="Remove Custom Node" ng-click="removeNodeFromLocal(value.name)"/>*/}
                            {/*</a></li>*/}
                            {/*/!*<!-- end ngRepeat: (key, value) in nodeList -->*!/*/}
                            {/*<li ng-repeat="(key, value) in nodeList" className="ng-scope"><a*/}
                            {/*ng-className="{true:'active'}[curNode == key]" ng-click="changeNode(key)" className="ng-binding">*/}
                            {/*Ropsten*/}
                            {/*<small className="ng-binding"> (MyEtherWallet) </small>*/}
                            {/*<img ng-show="value.service=='Custom'" img="" src="images/icon-remove.svg" className="node-remove ng-hide"*/}
                            {/*title="Remove Custom Node" ng-click="removeNodeFromLocal(value.name)"/>*/}
                            {/*</a></li>*/}
                            {/*/!*<!-- end ngRepeat: (key, value) in nodeList -->*!/*/}
                            {/*<li ng-repeat="(key, value) in nodeList" className="ng-scope"><a*/}
                            {/*ng-className="{true:'active'}[curNode == key]" ng-click="changeNode(key)" className="ng-binding">*/}
                            {/*Kovan*/}
                            {/*<small className="ng-binding"> (Etherscan.io) </small>*/}
                            {/*<img ng-show="value.service=='Custom'" img="" src="images/icon-remove.svg" className="node-remove ng-hide"*/}
                            {/*title="Remove Custom Node" ng-click="removeNodeFromLocal(value.name)"/>*/}
                            {/*</a></li>*/}
                            {/*/!*<!-- end ngRepeat: (key, value) in nodeList -->*!/*/}
                            {/*<li ng-repeat="(key, value) in nodeList" className="ng-scope"><a*/}
                            {/*ng-className="{true:'active'}[curNode == key]" ng-click="changeNode(key)" className="ng-binding">*/}
                            {/*ETC*/}
                            {/*<small className="ng-binding"> (Epool.io) </small>*/}
                            {/*<img ng-show="value.service=='Custom'" img="" src="images/icon-remove.svg" className="node-remove ng-hide"*/}
                            {/*title="Remove Custom Node" ng-click="removeNodeFromLocal(value.name)"/>*/}
                            {/*</a></li>*/}
                            {/*/!*<!-- end ngRepeat: (key, value) in nodeList -->*!/*/}
                            {/*<li><a ng-click="customNodeModal.open(); dropdownNode = !dropdownNode;"> Add Custom Node </a></li>*/}
                            {/*</ul>*/}
                        </span>
                    </div>
                </section>
            </section>
        )
    }
}
