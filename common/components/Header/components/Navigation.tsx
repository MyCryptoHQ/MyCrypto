import React, { PureComponent } from 'react';
import NavigationLink from './NavigationLink';
import { knowledgeBaseURL } from 'config';
import './Navigation.scss';

export interface TabLink {
  name: string;
  to: string;
  external?: boolean;
}

const tabs: TabLink[] = [
  {
    name: 'NAV_VIEW',
    to: '/account'
  },
  {
    name: 'NAV_GENERATEWALLET',
    to: '/generate'
  },
  {
    name: 'NAV_SWAP',
    to: '/swap'
  },
  {
    name: 'NAV_CONTRACTS',
    to: '/contracts'
  },
  {
    name: 'NAV_ENS',
    to: '/ens'
  },
  {
    name: 'NAV_SIGN',
    to: '/sign-and-verify-message'
  },
  {
    name: 'NAV_TXSTATUS',
    to: '/tx-status'
  },
  {
    name: 'NAV_BROADCAST',
    to: '/pushTx'
  },
  {
    name: 'NAV_HELP',
    to: `${knowledgeBaseURL}`,
    external: true
  }
];

interface Props {
  color?: string | false;
}

interface State {
  showLeftArrow: boolean;
  showRightArrow: boolean;
}

interface BorderStyle {
  borderTopColor?: string;
}

export default class Navigation extends PureComponent<Props, State> {
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
