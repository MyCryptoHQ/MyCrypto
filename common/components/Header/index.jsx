import React, {Component} from 'react'
import NodeDropdownComponent from './components/NodeDropdownComponent'
import LanguageDropDownComponent from './components/LanguageDropdownComponent'

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
                            alt="MyEtherWallet"/>
                    </a>
                    <div className="tagline">
                        <span style={{maxWidth: '395px'}}>
                            Open-Source &amp; Client-Side Ether Wallet · v3.6.0
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <LanguageDropDownComponent/>
                        &nbsp;&nbsp;&nbsp;
                        <NodeDropdownComponent/>
                    </div>
                </section>
            </section>
        )
    }
}
