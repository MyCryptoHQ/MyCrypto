import React, { PureComponent } from 'react';

import { navigationLinks } from 'config';
import NavigationLink from 'components/NavigationLink';
import './Navigation.scss';

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
            {navigationLinks.map(link => (
              <NavigationLink
                key={link.name}
                link={link}
                isHomepage={link === navigationLinks[0]}
                className="NavigationLink"
              />
            ))}
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
