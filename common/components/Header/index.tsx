import {
  TChangeLanguage,
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode,
  TAddCustomNetwork,
  AddCustomNodeAction,
  changeLanguage,
  changeNodeIntent,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
} from 'actions/config';
import logo from 'assets/images/logo-mycrypto.svg';
import { OldDropDown, ColorDropdown } from 'components/ui';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { TSetGasPriceField, setGasPriceField } from 'actions/transaction';
import { ANNOUNCEMENT_MESSAGE, ANNOUNCEMENT_TYPE, languages } from 'config';
import Navigation from './components/Navigation';
import CustomNodeModal from './components/CustomNodeModal';
import OnlineStatus from './components/OnlineStatus';
import { getKeyByValue } from 'utils/helpers';
import { NodeConfig } from 'types/node';
import './index.scss';
import { AppState } from 'reducers';
import {
  getOffline,
  isNodeChanging,
  getLanguageSelection,
  getNodeId,
  getNodeConfig,
  CustomNodeOption,
  NodeOption,
  getNodeOptions,
  getNetworkConfig
} from 'selectors/config';
import { NetworkConfig } from 'types/network';
import { connect } from 'react-redux';

interface DispatchProps {
  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  setGasPriceField: TSetGasPriceField;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

interface StateProps {
  network: NetworkConfig;
  languageSelection: AppState['config']['meta']['languageSelection'];
  node: NodeConfig;
  nodeSelection: AppState['config']['nodes']['selectedNode']['nodeId'];
  isChangingNode: AppState['config']['nodes']['selectedNode']['pending'];
  isOffline: AppState['config']['meta']['offline'];
  nodeOptions: (CustomNodeOption | NodeOption)[];
}

const mapStateToProps = (state: AppState): StateProps => ({
  isOffline: getOffline(state),
  isChangingNode: isNodeChanging(state),
  languageSelection: getLanguageSelection(state),
  nodeSelection: getNodeId(state),
  node: getNodeConfig(state),
  nodeOptions: getNodeOptions(state),
  network: getNetworkConfig(state)
});

const mapDispatchToProps: DispatchProps = {
  setGasPriceField,
  changeLanguage,
  changeNodeIntent,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
};

interface State {
  isAddingCustomNode: boolean;
}

type Props = StateProps & DispatchProps;

class Header extends Component<Props, State> {
  public state = {
    isAddingCustomNode: false
  };

  public render() {
    const {
      languageSelection,
      node,
      nodeSelection,
      isChangingNode,
      isOffline,
      nodeOptions,
      network
    } = this.props;
    const { isAddingCustomNode } = this.state;
    const selectedLanguage = languageSelection;
    const LanguageDropDown = OldDropDown as new () => OldDropDown<typeof selectedLanguage>;
    const options = nodeOptions.map(n => {
      if (n.isCustom) {
        const { label, isCustom, id, ...rest } = n;
        return {
          ...rest,
          name: (
            <span>
              {label.network} - {label.nodeName} <small>(custom)</small>
            </span>
          ),
          onRemove: () => this.props.removeCustomNode({ id })
        };
      } else {
        const { label, isCustom, ...rest } = n;
        return {
          ...rest,
          name: (
            <span>
              {label.network} <small>({label.service})</small>
            </span>
          )
        };
      }
    });

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
                <ColorDropdown
                  ariaLabel={`
                    change node. current node is on the ${node.network} network
                    provided by ${node.service}
                  `}
                  options={options}
                  value={nodeSelection || ''}
                  extra={
                    <li>
                      <a onClick={this.openCustomNodeModal}>Add Custom Node</a>
                    </li>
                  }
                  disabled={nodeSelection === 'web3'}
                  onChange={this.props.changeNodeIntent}
                  size="smr"
                  color="white"
                  menuAlign="right"
                />
              </div>
            </div>
          </section>
        </section>

        <Navigation color={!network.isCustom && network.color} />

        {isAddingCustomNode && (
          <CustomNodeModal
            addCustomNode={this.addCustomNode}
            handleClose={this.closeCustomNodeModal}
          />
        )}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
