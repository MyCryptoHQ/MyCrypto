import React, { Component } from 'react';
import { MapStateToProps, connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { ANNOUNCEMENT_MESSAGE, ANNOUNCEMENT_TYPE, languages } from 'config';
import { NetworkConfig } from 'types/network';
import { getKeyByValue } from 'utils/helpers';
import logo from 'assets/images/logo-mycrypto.svg';
import { OldDropDown } from 'components/ui';
import {
  AddCustomNodeAction,
  TAddCustomNetwork,
  TAddCustomNode,
  TChangeLanguage,
  TChangeNodeRequestedOneTime,
  TRemoveCustomNode,
  getLanguageSelection,
  getNetworkConfig,
  getOffline,
  isNodeChanging,
  isStaticNodeId,
  changeLanguage,
  changeNodeRequestedOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
} from 'features/config';
import { AppState } from 'features/reducers';
import { transactionFieldsActions } from 'features/transaction';
import CustomNodeModal from 'components/CustomNodeModal';
import NetworkDropdown from './components/NetworkDropdown';
import Navigation from './components/Navigation';
import OnlineStatus from './components/OnlineStatus';
import './index.scss';

interface OwnProps {
  networkParam: string | null;
}

interface DispatchProps {
  changeLanguage: TChangeLanguage;
  changeNodeRequestedOneTime: TChangeNodeRequestedOneTime;
  setGasPriceField: transactionFieldsActions.TSetGasPriceField;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

interface StateProps {
  shouldSetNodeFromQS: boolean;
  network: NetworkConfig;
  languageSelection: ReturnType<typeof getLanguageSelection>;
  isChangingNode: ReturnType<typeof isNodeChanging>;
  isOffline: ReturnType<typeof getOffline>;
}

interface State {
  isAddingCustomNode: boolean;
}

type Props = OwnProps & StateProps & DispatchProps;

class Header extends Component<Props, State> {
  public state = {
    isAddingCustomNode: false
  };

  public componentDidMount() {
    this.attemptSetNodeFromQueryParameter();
  }

  public render() {
    const { languageSelection, isChangingNode, isOffline, network } = this.props;
    const { isAddingCustomNode } = this.state;
    const selectedLanguage = languageSelection;
    const LanguageDropDown = OldDropDown as new () => OldDropDown<typeof selectedLanguage>;

    return (
      <div className="Header">
        {ANNOUNCEMENT_MESSAGE && (
          <div className={`Header-announcement is-${ANNOUNCEMENT_TYPE}`}>
            {ANNOUNCEMENT_MESSAGE}
          </div>
        )}

        <section className="Header-branding">
          <section className="Header-branding-inner container">
            <Link to="/" className="Header-branding-title" aria-label="Go to homepage">
              <img
                className="Header-branding-title-logo"
                src={logo}
                height="64px"
                width="245px"
                alt="MyCrypto logo"
              />
            </Link>
            <div className="Header-branding-right">
              <div className="Header-branding-right-online">
                <OnlineStatus isOffline={isOffline} />
              </div>

              <div className="Header-branding-right-dropdown">
                <LanguageDropDown
                  ariaLabel={`change language. current language ${languages[selectedLanguage]}`}
                  options={Object.values(languages)}
                  value={languages[selectedLanguage]}
                  onChange={this.changeLanguage}
                  size="smr"
                  color="white"
                />
              </div>
              <div
                className={classnames({
                  'Header-branding-right-dropdown': true,
                  'is-flashing': isChangingNode
                })}
              >
                <NetworkDropdown openCustomNodeModal={this.openCustomNodeModal} />
              </div>
            </div>
          </section>
        </section>

        <Navigation color={!network.isCustom && network.color} />

        <CustomNodeModal
          isOpen={isAddingCustomNode}
          addCustomNode={this.addCustomNode}
          handleClose={this.closeCustomNodeModal}
        />
      </div>
    );
  }

  public changeLanguage = (value: string) => {
    const key = getKeyByValue(languages, value);
    if (key) {
      this.props.changeLanguage(key);
    }
  };

  private openCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: true });
  };

  private closeCustomNodeModal = () => {
    this.setState({ isAddingCustomNode: false });
  };

  private addCustomNode = (payload: AddCustomNodeAction['payload']) => {
    this.setState({ isAddingCustomNode: false });
    this.props.addCustomNode(payload);
  };

  private attemptSetNodeFromQueryParameter() {
    const { shouldSetNodeFromQS, networkParam } = this.props;
    if (shouldSetNodeFromQS) {
      this.props.changeNodeRequestedOneTime(networkParam!);
    }
  }
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (
  state,
  { networkParam }
): StateProps => ({
  shouldSetNodeFromQS: !!(networkParam && isStaticNodeId(state, networkParam)),
  isOffline: getOffline(state),
  isChangingNode: isNodeChanging(state),
  languageSelection: getLanguageSelection(state),
  network: getNetworkConfig(state)
});

const mapDispatchToProps: DispatchProps = {
  setGasPriceField: transactionFieldsActions.setGasPriceField,
  changeLanguage,
  changeNodeRequestedOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
