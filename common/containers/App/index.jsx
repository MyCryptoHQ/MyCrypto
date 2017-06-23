// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, Header } from 'components';
import PropTypes from 'prop-types';
import Notifications from './Notifications';

import { CHANGE_LANGUAGE, CHANGE_NODE } from 'actions/config';

class App extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        children: PropTypes.node.isRequired,
        location: PropTypes.object,
        handleWindowResize: PropTypes.func,

        router: PropTypes.object,
        isMobile: PropTypes.bool,

        // BEGIN ACTUAL
        languageSelection: PropTypes.object,
        changeLanguage: PropTypes.func,

        changeNode: PropTypes.func,
        nodeSelection: PropTypes.object,

        showNotification: PropTypes.func
    };

    render() {
        let {
            children,
            // APP
            languageSelection,
            changeLanguage,
            changeNode,
            nodeSelection
        } = this.props;

        let headerProps = {
            location,
            changeLanguage,
            languageSelection,
            changeNode,
            nodeSelection
        };

        return (
            <div className="page-layout">
                <main>
                    <Header {...headerProps} />
                    <div className="main-content">
                        {React.cloneElement(children, { languageSelection })}
                    </div>
                    <Footer />
                </main>
                <Notifications />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        nodeSelection: state.config.nodeSelection,
        nodeToggle: state.config.nodeToggle,
        languageSelection: state.config.languageSelection,
        languageToggle: state.config.languageToggle
    };
}

function mapDispatchToProps(dispatch) {
    return {
        // FIXME replace with actual types
        changeNode: (i: any) => {
            dispatch(CHANGE_NODE(i));
        },
        changeLanguage: (i: any) => {
            dispatch(CHANGE_LANGUAGE(i));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
