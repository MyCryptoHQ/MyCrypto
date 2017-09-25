import {
  changeGasPrice as dChangeGasPrice,
  changeLanguage as dChangeLanguage,
  changeNode as dChangeNode,
  TChangeGasPrice,
  TChangeLanguage,
  TChangeNode
} from 'actions/config';
import { AlphaAgreement, Footer, Header } from 'components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AppState } from 'reducers';
import Notifications from './Notifications';
interface Props {
  // FIXME
  children: any;
  location: any;
  router: any;
  isMobile: boolean;

  languageSelection: string;
  nodeSelection: string;

  gasPriceGwei: number;

  changeLanguage: TChangeLanguage;
  changeNode: TChangeNode;
  changeGasPrice: TChangeGasPrice;
}
class App extends Component<Props, {}> {
  public render() {
    const {
      children,
      // APP
      nodeSelection,
      languageSelection,
      gasPriceGwei,

      changeLanguage,
      changeNode,
      changeGasPrice
    } = this.props;

    const headerProps = {
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
          <div className="Tab container">
            {React.cloneElement(children, { languageSelection })}
          </div>
          <Footer />
        </main>
        <Notifications />
        <AlphaAgreement />
      </div>
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    nodeSelection: state.config.nodeSelection,
    languageSelection: state.config.languageSelection,
    gasPriceGwei: state.config.gasPriceGwei
  };
}

export default connect(mapStateToProps, {
  changeGasPrice: dChangeGasPrice,
  changeLanguage: dChangeLanguage,
  changeNode: dChangeNode
})(App);
