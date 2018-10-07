import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { AppState } from 'features/reducers';
import { configSelectors } from 'features/config';
import { sidebarActions } from 'features/sidebar';
import logo from 'assets/images/logo-mycrypto.svg';
import './NewHeader.scss';

const LINKSET = {
  SEND_AND_RECEIVE: [
    {
      to: '/account',
      title: 'Send Ether & Tokens'
    },
    {
      to: '/account/request',
      title: 'Request Payment'
    },
    {
      to: '/account/info',
      title: 'Wallet Info'
    },
    {
      to: '/account/recent-txs',
      title: 'View Recent Transactions'
    },
    {
      to: '/account/address-book',
      title: 'Address Book'
    }
  ],
  BUY_AND_EXCHANGE: [
    {
      to: '/swap',
      title: 'Swap ETH & Tokens'
    }
  ],
  TOOLS: [
    {
      to: '/sign-and-verify-message',
      title: 'Sign & Verify Message'
    },
    {
      to: '/contracts',
      title: 'Interact with Contracts'
    },
    {
      to: '/tx-status',
      title: 'Check Transaction Status'
    },
    {
      to: '/pushTx',
      title: 'Broadcast Transaction'
    },
    {
      to: '/ens',
      title: 'ENS Domains'
    }
  ]
};

interface StateProps {
  nodeLabel: ReturnType<typeof configSelectors.getSelectedNodeLabel>;
}

interface DispatchProps {
  toggleSidebar: sidebarActions.TToggleSidebar;
}

type Props = StateProps & DispatchProps;

interface State {
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

class NewHeader extends React.Component<Props> {
  public state: State = {
    visibleDropdowns: {
      sendAndReceive: false,
      buyAndExchange: false,
      tools: false
    }
  };

  public render() {
    const { nodeLabel, toggleSidebar } = this.props;
    const { visibleDropdowns: { sendAndReceive, buyAndExchange, tools } } = this.state;

    return (
      <section className="NewHeader">
        <section className="NewHeader-top">
          <section className="NewHeader-top-left">
            <ul className="NewHeader-top-links">
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
          <section className="NewHeader-top-center">
            <Link to="/">
              <img src={logo} alt="Our logo" />
            </Link>
          </section>
          <section className="NewHeader-top-right">
            <ul className="NewHeader-top-links">
              <li>
                English <i className="fa fa-caret-down" />
              </li>
              <li onClick={toggleSidebar}>
                {nodeLabel.network} ({nodeLabel.info}) <i className="fa fa-caret-down" />
              </li>
            </ul>
          </section>
        </section>
        <section className="NewHeader-bottom">
          <ul className="NewHeader-bottom-links">
            <li
              className="NewHeader-bottom-links-item"
              onMouseEnter={this.toggleSendAndReceive}
              onMouseLeave={this.toggleSendAndReceive}
            >
              Send & Receive <i className="fa fa-caret-down" />
              {sendAndReceive && (
                <ul className="NewHeader-bottom-links-dropdown">
                  {LINKSET.SEND_AND_RECEIVE.map(item => (
                    <li key={item.to} onClick={this.toggleSendAndReceive}>
                      <Link to={item.to}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li
              className="NewHeader-bottom-links-item"
              onMouseEnter={this.toggleBuyAndExchange}
              onMouseLeave={this.toggleBuyAndExchange}
            >
              Buy & Exchange <i className="fa fa-caret-down" />
              {buyAndExchange && (
                <ul className="NewHeader-bottom-links-dropdown">
                  {LINKSET.BUY_AND_EXCHANGE.map(item => (
                    <li key={item.to}>
                      <Link to={item.to}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li
              className="NewHeader-bottom-links-item"
              onMouseEnter={this.toggleTools}
              onMouseLeave={this.toggleTools}
            >
              Tools <i className="fa fa-caret-down" />
              {tools && (
                <ul className="NewHeader-bottom-links-dropdown">
                  {LINKSET.TOOLS.map(item => (
                    <li key={item.to} onClick={this.toggleTools}>
                      <Link to={item.to}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
            <li className="NewHeader-bottom-links-item">
              <Link to="/generate">
                <i className="fa fa-plus create-icon" /> Create Wallet
              </Link>
            </li>
          </ul>
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

const mapStateToProps = (state: AppState) => ({
  nodeLabel: configSelectors.getSelectedNodeLabel(state)
});

const mapDispatchToProps = {
  toggleSidebar: sidebarActions.toggleSidebar
};

export default connect(mapStateToProps, mapDispatchToProps)(NewHeader);
