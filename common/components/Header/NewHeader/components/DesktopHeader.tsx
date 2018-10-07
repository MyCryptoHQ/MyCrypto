import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from 'features/reducers';
import {
  configSelectors,
  configNodesStaticSelectors,
  configNodesSelectedActions
} from 'features/config';
import { sidebarActions } from 'features/sidebar';
import logo from 'assets/images/logo-mycrypto.svg';
import { LINKSET } from '../constants';
import { generateCaretIcon } from '../helpers';
import './DesktopHeader.scss';

interface OwnProps {
  networkParam: string | null;
}

interface StateProps {
  shouldSetNodeFromQS: boolean;
  nodeLabel: ReturnType<typeof configSelectors.getSelectedNodeLabel>;
}

interface DispatchProps {
  openSidebar: sidebarActions.TOpenSidebar;
  changeNodeRequestedOneTime: configNodesSelectedActions.TChangeNodeRequestedOneTime;
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

class DesktopHeader extends Component<Props> {
  public state: State = {
    visibleDropdowns: {
      sendAndReceive: false,
      buyAndExchange: false,
      tools: false
    }
  };

  public componentDidMount() {
    this.attemptSetNodeFromQueryParameter();
  }

  public render() {
    const { nodeLabel, openSidebar } = this.props;
    const { visibleDropdowns: { sendAndReceive, buyAndExchange, tools } } = this.state;
    const sendAndReceiveIcon = generateCaretIcon(sendAndReceive);
    const buyAndExchangeIcon = generateCaretIcon(buyAndExchange);
    const toolsIcon = generateCaretIcon(tools);

    return (
      <section className="desktop-only-header">
        <section className="DesktopHeader">
          <section className="DesktopHeader-top">
            <section className="DesktopHeader-top-left">
              <ul className="DesktopHeader-top-links">
                <li>
                  <a href="https://support.mycrypto.com/">
                    Help & Support <i className="fa fa-caret-right" />
                  </a>
                </li>
                <li>
                  <a href="https://medium.com/@mycrypto">
                    Latest News <i className="fa fa-caret-right" />
                  </a>
                </li>
              </ul>
            </section>
            <section className="DesktopHeader-top-center">
              <Link to="/">
                <img src={logo} alt="Our logo" />
              </Link>
            </section>
            <section className="DesktopHeader-top-right">
              <ul className="DesktopHeader-top-links">
                <li>
                  English <i className="fa fa-caret-down" />
                </li>
                <li onClick={openSidebar}>
                  {nodeLabel.network} ({nodeLabel.info}) <i className="fa fa-caret-down" />
                </li>
              </ul>
            </section>
          </section>
          <section className="DesktopHeader-bottom">
            <ul className="DesktopHeader-bottom-links">
              <li
                className="DesktopHeader-bottom-links-item"
                onMouseEnter={this.toggleSendAndReceive}
                onMouseLeave={this.toggleSendAndReceive}
              >
                Send & Receive <i className={sendAndReceiveIcon} />
                {sendAndReceive && (
                  <ul className="DesktopHeader-bottom-links-dropdown">
                    {LINKSET.SEND_AND_RECEIVE.map(item => (
                      <li key={item.to} onClick={this.toggleSendAndReceive}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li
                className="DesktopHeader-bottom-links-item"
                onMouseEnter={this.toggleBuyAndExchange}
                onMouseLeave={this.toggleBuyAndExchange}
              >
                Buy & Exchange <i className={buyAndExchangeIcon} />
                {buyAndExchange && (
                  <ul className="DesktopHeader-bottom-links-dropdown">
                    {LINKSET.BUY_AND_EXCHANGE.map(item => (
                      <li key={item.to}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li
                className="DesktopHeader-bottom-links-item"
                onMouseEnter={this.toggleTools}
                onMouseLeave={this.toggleTools}
              >
                Tools <i className={toolsIcon} />
                {tools && (
                  <ul className="DesktopHeader-bottom-links-dropdown">
                    {LINKSET.TOOLS.map(item => (
                      <li key={item.to} onClick={this.toggleTools}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="DesktopHeader-bottom-links-item">
                <Link to="/generate">
                  <i className="fa fa-plus create-icon" /> Create Wallet
                </Link>
              </li>
            </ul>
          </section>
        </section>
      </section>
    );
  }

  private toggleDropdown = (dropdown: string) =>
    this.setState((prevState: State) => ({
      visibleDropdowns: {
        ...prevState.visibleDropdowns,
        [dropdown]: !prevState.visibleDropdowns[dropdown]
      }
    }));

  private toggleSendAndReceive = () => this.toggleDropdown('sendAndReceive');
  private toggleBuyAndExchange = () => this.toggleDropdown('buyAndExchange');
  private toggleTools = () => this.toggleDropdown('tools');

  private attemptSetNodeFromQueryParameter = () => {
    const { shouldSetNodeFromQS, networkParam, changeNodeRequestedOneTime } = this.props;

    if (shouldSetNodeFromQS) {
      changeNodeRequestedOneTime(networkParam!);
    }
  };
}

const mapStateToProps = (state: AppState, { networkParam }: any) => ({
  shouldSetNodeFromQS: !!(
    networkParam && configNodesStaticSelectors.isStaticNodeId(state, networkParam)
  ),
  nodeLabel: configSelectors.getSelectedNodeLabel(state)
});

const mapDispatchToProps = {
  openSidebar: sidebarActions.openSidebar,
  changeNodeRequestedOneTime: configNodesSelectedActions.changeNodeRequestedOneTime
};

export default connect(mapStateToProps, mapDispatchToProps)(DesktopHeader);
