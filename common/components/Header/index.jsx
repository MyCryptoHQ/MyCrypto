import React, {Component} from "react";
import NodeDropdownComponent from "./components/NodeDropdownComponent";
import LanguageDropDownComponent from "./components/LanguageDropdownComponent";
import PropTypes from "prop-types";
import TabsOptions from "./components/TabsOptions";


export default class Header extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        // LanguageDropDownComponentProps
        changeLanguage: PropTypes.func,
        toggleLanguageDropdown: PropTypes.func,
        languageSelection: PropTypes.number,
        languageToggle: PropTypes.bool,

        // NodeDropdownComponentProps
        changeNode: PropTypes.func,
        toggleNodeDropdown: PropTypes.func,
        nodeSelection: PropTypes.number,
        nodeToggle: PropTypes.bool
    };

    render() {
        let {
            languageSelection,
            changeLanguage,
            toggleLanguageDropdown,
            languageToggle,
            changeNode,
            toggleNodeDropdown,
            nodeSelection,
            nodeToggle
        } = this.props;

        let LanguageDropDownComponentProps = {
            languageSelection,
            changeLanguage,
            toggleLanguageDropdown,
            languageToggle
        }

        let NodeDropdownComponentProps = {
            changeNode,
            toggleNodeDropdown,
            nodeSelection,
            nodeToggle
        }

        return (
            <div>
                <section className="bg-gradient header-branding">
                    <section className="container">
                        <a className="brand" href="/" aria-label="Go to homepage">
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
                            <LanguageDropDownComponent {...LanguageDropDownComponentProps}/>
                            &nbsp;&nbsp;&nbsp;
                            <NodeDropdownComponent {...NodeDropdownComponentProps}/>
                        </div>
                    </section>
                </section>

                {/*{TODO - Re-enable for tab options}*/}
                {/*<TabsOptions {...{}}/>*/}

            </div>
        )
    }
}
