import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Transition } from 'react-spring';
import { Identicon } from '@mycrypto/ui';

import logo from 'assets/images/logo-mycrypto.svg';
import { linkset } from '../constants';
import { generateMenuIcon, generateCaretIcon } from '../helpers';
import './MobileHeader.scss';

interface State {
  menuVisible: boolean;
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

export default class MobileHeader extends Component {
  public state: State = {
    menuVisible: false,
    visibleDropdowns: {
      sendAndReceive: false,
      buyAndExchange: false,
      tools: false
    }
  };

  public render() {
    const { menuVisible, visibleDropdowns: { sendAndReceive, buyAndExchange, tools } } = this.state;
    const menuIcon = generateMenuIcon(menuVisible);
    const sendAndReceiveIcon = generateCaretIcon(sendAndReceive);
    const buyAndExchangeIcon = generateCaretIcon(buyAndExchange);
    const toolsIcon = generateCaretIcon(tools);

    return (
      <section className="_MobileHeader">
        <section className="_MobileHeader-top">
          <section className="_MobileHeader-top-menu-button" onClick={this.toggleMenu}>
            <i className={menuIcon} />
          </section>
          <section className="_MobileHeader-top-logo">
            <Link to="/">
              <img src={logo} alt="Our logo" />
            </Link>
          </section>
          <section className="_MobileHeader-top-menu-account">
            <Identicon address="0x80200997f095da94E404F7E0d581AAb1fFba9f7d" />
          </section>
          <div />
        </section>
        <Transition from={{ left: '-320px' }} enter={{ left: '0' }} leave={{ left: '-500px' }}>
          {menuVisible &&
            (props => (
              <section className="_MobileHeader-menu" style={props}>
                <ul className="_MobileHeader-menu-top">
                  <li onClick={this.toggleSendAndReceive}>
                    Send & Receive <i className={sendAndReceiveIcon} />
                    {sendAndReceive && (
                      <ul className="_MobileHeader-menu-subitems">
                        {linkset.sendAndReceive.map(item => (
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
                      <ul className="_MobileHeader-menu-subitems">
                        {linkset.buyAndExchange.map(item => (
                          <li key={item.to} onClick={this.toggleMenu}>
                            <Link to={item.to}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li onClick={this.toggleTools}>
                    Tools
                    <i className={toolsIcon} style={{ marginLeft: '3px' }} />
                    {tools && (
                      <ul className="_MobileHeader-menu-subitems">
                        {linkset.tools.map(item => (
                          <li key={item.to} onClick={this.toggleMenu}>
                            <Link to={item.to}>{item.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                  <li>
                    <Link to="/create-wallet">
                      <i className="fa fa-plus" /> Create Wallet
                    </Link>
                  </li>
                </ul>
                <ul className="_MobileHeader-menu-mid">
                  <li
                    onClick={() => {
                      this.toggleMenu();
                    }}
                  >
                    English <i className="fa fa-caret-down" />
                  </li>
                  <li
                    onClick={() => {
                      this.toggleMenu();
                    }}
                  >
                    Ethereum (Auto) <i className="fa fa-caret-down" />
                  </li>
                </ul>
                <ul className="_MobileHeader-menu-bottom">
                  <li>
                    <a
                      href="https://support.mycrypto.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Help & Support <i className="fa fa-caret-right" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://medium.com/@mycrypto"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Latest News <i className="fa fa-caret-right" />
                    </a>
                  </li>
                </ul>
              </section>
            ))}
        </Transition>
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
