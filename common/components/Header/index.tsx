import {
  TChangeLanguage,
  TChangeNodeIntent,
  TAddCustomNode,
  TRemoveCustomNode,
  TAddCustomNetwork
} from 'actions/config';
import logo from 'assets/images/logo-myetherwallet.svg';
import { Dropdown, ColorDropdown } from 'components/ui';
import React, { Component } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { TSetGasPriceField } from 'actions/transaction';
import {
  ANNOUNCEMENT_MESSAGE,
  ANNOUNCEMENT_TYPE,
  languages,
  NODES,
  VERSION,
  NodeConfig,
  CustomNodeConfig,
  CustomNetworkConfig
} from 'config/data';
import GasPriceDropdown from './components/GasPriceDropdown';
import Navigation from './components/Navigation';
import CustomNodeModal from './components/CustomNodeModal';
import OnlineStatus from './components/OnlineStatus';
import { getKeyByValue } from 'utils/helpers';
import { makeCustomNodeId } from 'utils/node';
import { getNetworkConfigFromId } from 'utils/network';
import './index.scss';
import { AppState } from 'reducers';

interface Props {
  languageSelection: string;
  node: NodeConfig;
  nodeSelection: string;
  isChangingNode: boolean;
  isOffline: boolean;
  gasPrice: AppState['transaction']['fields']['gasPrice'];
  customNodes: CustomNodeConfig[];
  customNetworks: CustomNetworkConfig[];
  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  setGasPriceField: TSetGasPriceField;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

interface State {
  isAddingCustomNode: boolean;
}

export default class Header extends Component<Props, State> {
  public state = {
    isAddingCustomNode: false
  };

  public render() {
    const {
      languageSelection,
      changeNodeIntent,
      node,
      nodeSelection,
      isChangingNode,
      isOffline,
      customNodes,
      customNetworks
    } = this.props;
    const { isAddingCustomNode } = this.state;
    const selectedLanguage = languageSelection;
    const selectedNetwork = getNetworkConfigFromId(node.network, customNetworks);
    const LanguageDropDown = Dropdown as new () => Dropdown<typeof selectedLanguage>;

    const nodeOptions = Object.keys(NODES)
      .map(key => {
        const n = NODES[key];
        const network = getNetworkConfigFromId(n.network, customNetworks);
        return {
          value: key,
          name: (
            <span>
              {network && network.name} <small>({n.service})</small>
            </span>
          ),
          color: network && network.color,
          hidden: n.hidden
        };
      })
      .concat(
        customNodes.map(cn => {
          const network = getNetworkConfigFromId(cn.network, customNetworks);
          return {
            value: makeCustomNodeId(cn),
            name: (
              <span>
                {network && network.name} - {cn.name} <small>(custom)</small>
              </span>
            ),
            color: network && network.color,
            hidden: false,
            onRemove: () => this.props.removeCustomNode(cn)
          };
        })
      );

    return (
      <div className="Header">
        {ANNOUNCEMENT_MESSAGE && (
          <div
            className={`Header-announcement is-${ANNOUNCEMENT_TYPE}`}
            dangerouslySetInnerHTML={{
              __html: ANNOUNCEMENT_MESSAGE
            }}
          />
        )}

        <section className="Header-branding">
          <section className="Header-branding-inner container">
            <Link to="/" className="Header-branding-title" aria-label="Go to homepage">
              <img
                className="Header-branding-title-logo"
                src={logo}
                height="64px"
                width="245px"
                alt="MyEtherWallet"
              />
            </Link>
            <div className="Header-branding-right">
              <span className="Header-branding-right-version hidden-xs">v{VERSION}</span>

              <div className="Header-branding-right-online">
                <OnlineStatus isOffline={isOffline} />
              </div>

              <div className="Header-branding-right-dropdown">
                <GasPriceDropdown
                  value={this.props.gasPrice.raw}
                  onChange={this.props.setGasPriceField}
                />
              </div>

              <div className="Header-branding-right-dropdown">
                <LanguageDropDown
                  ariaLabel={`change language. current language ${languages[selectedLanguage]}`}
                  options={Object.values(languages)}
                  value={languages[selectedLanguage]}
                  extra={
                    <li key="disclaimer">
                      <a data-toggle="modal" data-target="#disclaimerModal">
                        Disclaimer
                      </a>
                    </li>
                  }
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
                  options={nodeOptions}
                  value={nodeSelection}
                  extra={
                    <li>
                      <a onClick={this.openCustomNodeModal}>Add Custom Node</a>
                    </li>
                  }
                  disabled={nodeSelection === 'web3'}
                  onChange={changeNodeIntent}
                  size="smr"
                  color="white"
                  menuAlign="right"
                />
              </div>
            </div>
          </section>
        </section>

        <Navigation color={selectedNetwork && selectedNetwork.color} />

        {isAddingCustomNode && (
          <CustomNodeModal
            customNodes={customNodes}
            customNetworks={customNetworks}
            handleAddCustomNode={this.addCustomNode}
            handleAddCustomNetwork={this.props.addCustomNetwork}
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

  private addCustomNode = (node: CustomNodeConfig) => {
    this.setState({ isAddingCustomNode: false });
    this.props.addCustomNode(node);
  };
}
