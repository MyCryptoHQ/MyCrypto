import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Identicon } from '@mycrypto/ui';

import { AccountScreen } from 'v2/features';
import { DrawerContext } from 'v2/providers';
import { linkset } from '../constants';
import { generateCaretIcon } from '../helpers';
import './DesktopHeader.scss';

// Legacy
import logo from 'assets/images/logo-mycrypto.svg';

interface State {
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

export default class DesktopHeader extends Component {
  public state: State = {
    visibleDropdowns: {
      sendAndReceive: false,
      buyAndExchange: false,
      tools: false
    }
  };

  public render() {
    const { visibleDropdowns: { sendAndReceive, buyAndExchange, tools } } = this.state;
    const sendAndReceiveIcon = generateCaretIcon(sendAndReceive);
    const buyAndExchangeIcon = generateCaretIcon(buyAndExchange);
    const toolsIcon = generateCaretIcon(tools);

    return (
      <section className="desktop-only-header">
        <section className="_DesktopHeader">
          <section className="_DesktopHeader-top">
            <section className="_DesktopHeader-top-left">
              <ul className="_DesktopHeader-top-links">
                <li>
                  <a href="https://support.mycrypto.com/" target="_blank" rel="noopener noreferrer">
                    Help & Support <i className="fa fa-caret-right" />
                  </a>
                </li>
                <li>
                  <a href="https://medium.com/@mycrypto" target="_blank" rel="noopener noreferrer">
                    Latest News <i className="fa fa-caret-right" />
                  </a>
                </li>
              </ul>
            </section>
            <section className="_DesktopHeader-top-center">
              <Link to="/">
                <img src={logo} alt="Our logo" />
              </Link>
            </section>
            <section className="_DesktopHeader-top-right">
              <ul className="_DesktopHeader-top-links">
                <li>
                  English <i className="fa fa-caret-down" />
                </li>
                <li>
                  Ethereum (Auto) <i className="fa fa-caret-down" />
                </li>
                <DrawerContext.Consumer>
                  {({ setScreen }) => (
                    <li
                      onClick={() => setScreen(AccountScreen)}
                      className="_DesktopHeader-top-links-account"
                    >
                      <Identicon address="0x80200997f095da94E404F7E0d581AAb1fFba9f7d" />
                      <span>Example #1</span>
                    </li>
                  )}
                </DrawerContext.Consumer>
              </ul>
            </section>
          </section>
          <section className="_DesktopHeader-bottom">
            <ul className="_DesktopHeader-bottom-links">
              <li
                className="_DesktopHeader-bottom-links-item"
                onMouseEnter={this.toggleSendAndReceive}
                onMouseLeave={this.toggleSendAndReceive}
              >
                Send & Receive <i className={sendAndReceiveIcon} />
                {sendAndReceive && (
                  <ul className="_DesktopHeader-bottom-links-dropdown">
                    {linkset.sendAndReceive.map(item => (
                      <li key={item.to} onClick={this.toggleSendAndReceive}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li
                className="_DesktopHeader-bottom-links-item"
                onMouseEnter={this.toggleBuyAndExchange}
                onMouseLeave={this.toggleBuyAndExchange}
              >
                Buy & Exchange <i className={buyAndExchangeIcon} />
                {buyAndExchange && (
                  <ul className="_DesktopHeader-bottom-links-dropdown">
                    {linkset.buyAndExchange.map(item => (
                      <li key={item.to} onClick={this.toggleBuyAndExchange}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li
                className="_DesktopHeader-bottom-links-item"
                onMouseEnter={this.toggleTools}
                onMouseLeave={this.toggleTools}
              >
                Tools <i className={toolsIcon} />
                {tools && (
                  <ul className="_DesktopHeader-bottom-links-dropdown">
                    {linkset.tools.map(item => (
                      <li key={item.to} onClick={this.toggleTools}>
                        <Link to={item.to}>{item.title}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              <li className="_DesktopHeader-bottom-links-item">
                <Link to="/create-wallet">
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
}
