import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { sidebarActions } from 'features/sidebar';
import logo from 'assets/images/logo-mycrypto.svg';
import { LINKSET } from '../constants';
import { generateMenuIcon, generateCaretIcon } from '../helpers';
import './MobileHeader.scss';

interface StateProps {
  nodeLabel: ReturnType<typeof configSelectors.getSelectedNodeLabel>;
}

interface DispatchProps {
  openSidebar: sidebarActions.TOpenSidebar;
}

type Props = StateProps & DispatchProps;

interface State {
  menuVisible: boolean;
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

class MobileHeader extends Component<Props> {
  public state: State = {
    menuVisible: false,
    visibleDropdowns: {
      sendAndReceive: false,
      buyAndExchange: false,
      tools: false
    }
  };

  public render() {
    const { nodeLabel, openSidebar } = this.props;
    const { menuVisible, visibleDropdowns: { sendAndReceive, buyAndExchange, tools } } = this.state;
    const menuIcon = generateMenuIcon(menuVisible);
    const sendAndReceiveIcon = generateCaretIcon(sendAndReceive);
    const buyAndExchangeIcon = generateCaretIcon(buyAndExchange);
    const toolsIcon = generateCaretIcon(tools);

    return (
      <section className="MobileHeader">
        <section className="MobileHeader-top">
          <section className="MobileHeader-top-menu-button" onClick={this.toggleMenu}>
            <i className={menuIcon} />
          </section>
          <section className="MobileHeader-top-logo">
            <img src={logo} alt="Our logo" />
          </section>
          {/* Dummy <div /> for flex spacing */}
          <div />
        </section>
        {menuVisible && (
          <section className="MobileHeader-menu">
            <ul className="MobileHeader-menu-top">
              <li onClick={this.toggleSendAndReceive}>
                Send & Receive <i className={sendAndReceiveIcon} />
                {sendAndReceive && (
                  <ul className="MobileHeader-menu-subitems">
                    {LINKSET.SEND_AND_RECEIVE.map(item => (
                      <li key={item.to} onClick={this.toggleMenu}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li onClick={this.toggleBuyAndExchange}>
                Buy & Exchange <i className={buyAndExchangeIcon} />
                {buyAndExchange && (
                  <ul className="MobileHeader-menu-subitems">
                    {LINKSET.BUY_AND_EXCHANGE.map(item => (
                      <li key={item.to} onClick={this.toggleMenu}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li onClick={this.toggleTools}>
                Tools <i className={toolsIcon} />
                {tools && (
                  <ul className="MobileHeader-menu-subitems">
                    {LINKSET.TOOLS.map(item => (
                      <li key={item.to} onClick={this.toggleMenu}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li onClick={this.toggleMenu}>
                <i className="fa fa-plus" /> Create Wallet
              </li>
            </ul>
            <ul className="MobileHeader-menu-mid">
              <li onClick={this.toggleMenu}>
                English <i className="fa fa-caret-down" />
              </li>
              <li
                onClick={() => {
                  openSidebar();
                  this.toggleMenu();
                }}
              >
                {nodeLabel.network} ({nodeLabel.info}) <i className="fa fa-caret-down" />
              </li>
            </ul>
            <ul className="MobileHeader-menu-bottom">
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
        )}
      </section>
    );
  }

  private toggleMenu = () =>
    this.setState((prevState: State) => ({
      menuVisible: !prevState.menuVisible
    }));

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
}

const mapStateToProps = (state: AppState) => ({
  nodeLabel: configSelectors.getSelectedNodeLabel(state)
});

const mapDispatchToProps = {
  openSidebar: sidebarActions.openSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(MobileHeader);
