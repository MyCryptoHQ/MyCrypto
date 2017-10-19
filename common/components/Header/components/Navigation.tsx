import React, { Component } from 'react';
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
    name: 'NAV_ViewWallet'
    // to: 'view-wallet'
  },
  {
    name: 'NAV_Contracts',
    to: 'contracts'
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

interface Props {
  color?: string;
}

interface State {
  showLeftArrow: boolean;
  showRightArrow: boolean;
}

interface BorderStyle {
  borderTopColor?: string;
}

export default class Navigation extends Component<Props, State> {
  public state = {
    showLeftArrow: false,
    showRightArrow: false
  };

  /*
   *   public scrollLeft() {}
      public scrollRight() {}
   * 
   */

  public render() {
    const { color } = this.props;
    const borderStyle: BorderStyle = {};

    if (color) {
      borderStyle.borderTopColor = color;
    }

    return (
      <nav
        role="navigation"
        aria-label="main navigation"
        className="Navigation"
        style={borderStyle}
      >
        {this.state.showLeftArrow && (
          <a
            aria-hidden="true"
            className="Navigation-arrow Navigation-arrow--left"
          >
            &#171;
          </a>
        )}

        <div className="Navigation-scroll container">
          <ul className="Navigation-links">
            {tabs.map(link => {
              return <NavigationLink key={link.name} link={link} />;
            })}
          </ul>
        </div>

        {this.state.showRightArrow && (
          <a
            aria-hidden="true"
            className="Navigation-arrow Navigation-arrow-right"
          >
            &#187;
          </a>
        )}
      </nav>
    );
  }
}
