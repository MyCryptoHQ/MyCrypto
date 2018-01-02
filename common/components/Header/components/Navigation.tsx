import React, { Component } from 'react';
import NavigationLink from './NavigationLink';
import { knowledgeBaseURL } from 'config/data';
import './Navigation.scss';

export interface TabLink {
  name: string;
  to: string;
  external?: boolean;
}

const tabs: TabLink[] = [
  {
    name: 'NAV_GenerateWallet',
    to: '/generate'
  },

  {
    name: 'Account View & Send',
    to: '/account'
  },
  {
    name: 'NAV_Swap',
    to: '/swap'
  },
  {
    name: 'NAV_Contracts',
    to: '/contracts'
  },
  {
    name: 'NAV_ENS',
    to: '/ens'
  },
  {
    name: 'Sign & Verify Message',
    to: '/sign-and-verify-message'
  },
  {
    name: 'Broadcast Transaction',
    to: '/pushTx'
  },
  {
    name: 'NAV_Help',
    to: `${knowledgeBaseURL}`,
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
          <a aria-hidden="true" className="Navigation-arrow Navigation-arrow--left">
            &#171;
          </a>
        )}

        <div className="Navigation-scroll container">
          <ul className="Navigation-links">
            {tabs.map(link => {
              return <NavigationLink key={link.name} link={link} isHomepage={link === tabs[0]} />;
            })}
          </ul>
        </div>

        {this.state.showRightArrow && (
          <a aria-hidden="true" className="Navigation-arrow Navigation-arrow-right">
            &#187;
          </a>
        )}
      </nav>
    );
  }
}
