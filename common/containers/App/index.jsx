import React, {Component} from "react";
import {connect} from "react-redux";
import {Footer, Header} from "components";
import PropTypes from "prop-types";

import {CHANGE_LANGUAGE, CHANGE_NODE, TOGGLE_LANGUAGE_DROPDOWN, TOGGLE_NODE_DROPDOWN} from "actions/config";


class App extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        children: PropTypes.node.isRequired,
        location: PropTypes.object,
        handleWindowResize: PropTypes.func,

        router: PropTypes.object,
        isMobile: PropTypes.bool,

        // BEGIN ACTUAL
        languageSelection: PropTypes.number,
        languageToggle: PropTypes.bool,
        changeLanguage: PropTypes.func,
        toggleLanguageDropdown: PropTypes.func,

        changeNode: PropTypes.func,
        toggleNodeDropdown: PropTypes.func,
        nodeSelection: PropTypes.number,
        nodeToggle: PropTypes.bool,
    }


    componentWillMount() {
        let {handleWindowResize} = this.props
        window.addEventListener('resize', handleWindowResize)
    }


    render() {
        let {
            children,
            // APP
            languageSelection,
            changeLanguage,
            languageToggle,
            toggleLanguageDropdown,
            changeNode,
            toggleNodeDropdown,
            nodeSelection,
            nodeToggle
        } = this.props;

        // let title = children.props.route.name;

        let headerProps = {
            changeLanguage,
            toggleLanguageDropdown,
            languageSelection,
            languageToggle,

            changeNode,
            toggleNodeDropdown,
            nodeSelection,
            nodeToggle
        }

        return (
            <div className="page-layout">
                <main>
                    <Header {...headerProps}/>
                    <div className="main-content">
                        { children}
                    </div>
                    <Footer/>
                </main>

            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        nodeSelection: state.config.nodeSelection,
        nodeToggle: state.config.nodeToggle,
        languageSelection: state.config.languageSelection,
        languageToggle: state.config.languageToggle
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeNode: (i: number) => {
            dispatch(CHANGE_NODE(i))
        },
        toggleNodeDropdown: () => {
            dispatch(TOGGLE_NODE_DROPDOWN())
        },
        changeLanguage: (i: number) => {
            dispatch(CHANGE_LANGUAGE(i))
        },
        toggleLanguageDropdown: () => {
            dispatch(TOGGLE_LANGUAGE_DROPDOWN())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
