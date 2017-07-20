// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Footer, Header } from 'components';
import Notifications from './Notifications';
import * as actions from 'actions/config';

class App extends Component {
  props: {
    // FIXME
    children: any,
    location: any,
    router: any,
    isMobile: boolean,

    languageSelection: string,
    nodeSelection: string,

    gasPriceGwei: number,

    changeLanguage: typeof actions.changeLanguage,
    changeNode: typeof actions.changeNode,
    changeGasPrice: typeof actions.changeGasPrice,
    handleWindowResize: () => void
  };

  render() {
    let {
      children,
      // APP
      nodeSelection,
      languageSelection,
      gasPriceGwei,

      changeLanguage,
      changeNode,
      changeGasPrice
    } = this.props;

    let headerProps = {
      location,
      languageSelection,
      nodeSelection,
      gasPriceGwei,

      changeLanguage,
      changeNode,
      changeGasPrice
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
    languageToggle: state.config.languageToggle,

    gasPriceGwei: state.config.gasPriceGwei
  };
}

export default connect(mapStateToProps, actions)(App);
