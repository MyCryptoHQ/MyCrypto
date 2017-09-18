import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NavigationLink from './NavigationLink';

import './Navigation.scss';

const tabs = [
  {
    name: 'NAV_GenerateWallet',
    to: '/'
  },
  {
    name: 'NAV_SendEther',
    to: 'send-transaction'
  },
  {
    name: 'NAV_Swap',
    to: 'swap'
  },
  {
    name: 'NAV_Offline'
  },
  {
    name: 'NAV_Contracts',
    to: 'contracts'
  },
  {
    name: 'NAV_ViewWallet'
    // to: 'view-wallet'
  },
  {
    name: 'NAV_ENS',
    to: 'ens'
  },
  {
    name: 'NAV_Help',
    to: 'https://myetherwallet.groovehq.com/help_center',
    external: true
  }
];

export default class TabsOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLeftArrow: false,
      showRightArrow: false
    };
  }

  static propTypes = {
    location: PropTypes.object
  };

  scrollLeft() {}

  scrollRight() {}

  render() {
    const { location } = this.props;
    return (
      <nav
        role="navigation"
        aria-label="main navigation"
        className="Navigation"
      >
        {this.state.showLeftArrow &&
          <a
            aria-hidden="true"
            className="Navigation-arrow Navigation-arrow--left"
            onClick={() => this.scrollLeft(100)}
          >
            &#171;
          </a>}

        <div className="Navigation-scroll container">
          <ul className="Navigation-links">
            {tabs.map(link => {
              return (
                <NavigationLink
                  key={link.name}
                  link={link}
                  location={location}
                />
              );
            })}
          </ul>
        </div>

        {this.state.showRightArrow &&
          <a
            aria-hidden="true"
            className="Navigation-arrow Navigation-arrow-right"
            onClick={() => this.scrollRight(100)}
          >
            &#187;
          </a>}
      </nav>
    );
  }
}
