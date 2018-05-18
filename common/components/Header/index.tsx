import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect, MapStateToProps } from 'react-redux';
import classnames from 'classnames';

import { ANNOUNCEMENT_MESSAGE, ANNOUNCEMENT_TYPE, languages } from 'config';
import translate from 'translations';
import { getKeyByValue } from 'utils/helpers';
import { NodeConfig } from 'types/node';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import { getOffline, getLanguageSelection } from 'features/config/meta/selectors';
import { isStaticNodeId } from 'features/config/nodes/static/selectors';
import { AddCustomNodeAction } from 'features/config/types';
import {
  TChangeLanguage,
  TChangeNodeIntent,
  TChangeNodeIntentOneTime,
  TAddCustomNode,
  TRemoveCustomNode,
  TAddCustomNetwork,
  changeLanguage,
  changeNodeIntent,
  changeNodeIntentOneTime,
  addCustomNode,
  removeCustomNode,
  addCustomNetwork
} from 'features/config/actions';
import {
  CustomNodeOption,
  NodeOption,
  getNodeOptions,
  getNetworkConfig
} from 'features/config/derivedSelectors';
import { getNodeConfig } from 'features/config/nodes/derivedSelectors';
import { isNodeChanging, getNodeId } from 'features/config/nodes/selected/selectors';
import { TSetGasPriceField, setGasPriceField } from 'features/transaction/actions';
import logo from 'assets/images/logo-mycrypto.svg';
import { OldDropDown, ColorDropdown } from 'components/ui';
import CustomNodeModal from 'components/CustomNodeModal';
import Navigation from './components/Navigation';
import OnlineStatus from './components/OnlineStatus';
import './index.scss';

interface OwnProps {
  networkParam: string | null;
}

interface DispatchProps {
  changeLanguage: TChangeLanguage;
  changeNodeIntent: TChangeNodeIntent;
  changeNodeIntentOneTime: TChangeNodeIntentOneTime;
  setGasPriceField: TSetGasPriceField;
  addCustomNode: TAddCustomNode;
  removeCustomNode: TRemoveCustomNode;
  addCustomNetwork: TAddCustomNetwork;
}

interface StateProps {
  shouldSetNodeFromQS: boolean;
  network: NetworkConfig;
  languageSelection: AppState['config']['meta']['languageSelection'];
  node: NodeConfig;
  nodeSelection: AppState['config']['nodes']['selectedNode']['nodeId'];
  isChangingNode: AppState['config']['nodes']['selectedNode']['pending'];
  isOffline: AppState['config']['meta']['offline'];
  nodeOptions: (CustomNodeOption | NodeOption)[];
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (
  state,
  { networkParam }
): StateProps => ({
  shouldSetNodeFromQS: !!(networkParam && isStaticNodeId(state, networkParam)),
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
  changeNodeIntentOneTime,
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
                      <a onClick={this.openCustomNodeModal}>{translate('NODE_ADD')}</a>
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
      this.props.changeNodeIntentOneTime(networkParam!);
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
