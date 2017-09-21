import actions, {
  TChangeGasPrice,
  TChangeLanguage,
  TChangeNode
} from 'actions/config/actionCreators';
import { AlphaAgreement, Footer, Header } from 'components';
import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  changeNode: TChangeGasPrice;
  changeGasPrice: TChangeNode;
  handleWindowResize(): void;
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
