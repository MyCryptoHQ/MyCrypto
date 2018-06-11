import logo from 'assets/images/logo-mycrypto.svg';
import classnames from 'classnames';
import CustomNodeModal from 'components/CustomNodeModal';
import { ColorDropdown, OldDropDown } from 'components/ui';
import { ANNOUNCEMENT_MESSAGE, ANNOUNCEMENT_TYPE, languages } from 'config';
import {
  AddCustomNodeAction,
  CustomNodeOption,
  NodeOption,
  TAddCustomNetwork,
  TAddCustomNode,
  TChangeLanguage,
<<<<<<< HEAD
  TChangeNodeIntent,
  TChangeNodeIntentOneTime,
=======
  TChangeNodeRequestedOneTime,
  TAddCustomNode,
>>>>>>> develop
  TRemoveCustomNode,
  getLanguageSelection,
  getNetworkConfig,
  getNodeConfig,
  getNodeId,
  getNodeOptions,
  getOffline,
  isNodeChanging,
  isStaticNodeId,
  changeLanguage,
  changeNodeRequestedOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
<<<<<<< HEAD
} from 'features/config';
import { AppState } from 'features/reducers';
import { TSetGasPriceField, setGasPriceField } from 'features/transaction';
=======
} from 'actions/config';
import logo from 'assets/images/logo-mycrypto.svg';
import { OldDropDown } from 'components/ui';
>>>>>>> develop
import React, { Component } from 'react';
import { MapStateToProps, connect } from 'react-redux';
import { Link } from 'react-router-dom';
import translate from 'translations';
import { NetworkConfig } from 'types/network';
import { NodeConfig } from 'types/node';
import { getKeyByValue } from 'utils/helpers';
import Navigation from './components/Navigation';
import OnlineStatus from './components/OnlineStatus';
<<<<<<< HEAD
=======
import NetworkDropdown from './components/NetworkDropdown';
import CustomNodeModal from 'components/CustomNodeModal';
import { getKeyByValue } from 'utils/helpers';
import { AppState } from 'reducers';
import {
  getOffline,
  isNodeChanging,
  getLanguageSelection,
  getNetworkConfig,
  isStaticNodeId
} from 'selectors/config';
import { NetworkConfig } from 'types/network';
import { connect, MapStateToProps } from 'react-redux';
>>>>>>> develop
import './index.scss';

interface OwnProps {
  networkParam: string | null;
}

interface DispatchProps {
  changeLanguage: TChangeLanguage;
  changeNodeRequestedOneTime: TChangeNodeRequestedOneTime;
  setGasPriceField: TSetGasPriceField;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

interface StateProps {
  shouldSetNodeFromQS: boolean;
  network: NetworkConfig;
  languageSelection: AppState['config']['meta']['languageSelection'];
  isChangingNode: AppState['config']['nodes']['selectedNode']['pending'];
  isOffline: AppState['config']['meta']['offline'];
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
  setGasPriceField,
  changeLanguage,
  changeNodeRequestedOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
};

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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
