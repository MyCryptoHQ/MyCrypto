import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Transition } from 'react-spring';
import classnames from 'classnames';
import { Icon } from '@mycrypto/ui';

import { UnlockScreen } from 'v2/features';
import { links } from './constants';
import './Header.scss';

// Legacy
import logo from 'assets/images/logo-mycrypto.svg';

interface Props {
  drawerVisible: boolean;
  toggleDrawerVisible(): void;
  setDrawerScreen(screen: any): void;
}

interface State {
  menuOpen: boolean;
  visibleMenuDropdowns: {
    [dropdown: string]: boolean;
  };
  visibleDropdowns: {
    [dropdown: string]: boolean;
  };
}

export class Header extends Component<Props & RouteComponentProps<{}>, State> {
  public state = {
    menuOpen: false,
    visibleMenuDropdowns: {
      'Manage Assets': false,
      Tools: false
    },
    visibleDropdowns: {
      'Manage Assets': false,
      Tools: false
    }
  };

  public render() {
    const { history, drawerVisible, toggleDrawerVisible, setDrawerScreen } = this.props;
    const { menuOpen, visibleMenuDropdowns, visibleDropdowns } = this.state;
    const onUnlockClick = () => {
      this.closeMenu();
      drawerVisible ? toggleDrawerVisible() : setDrawerScreen(UnlockScreen);
    };

    return (
      <nav className="_Header">
        {/* Mobile Menu */}
        <Transition from={{ left: '-375px' }} enter={{ left: '0' }} leave={{ left: '-500px' }}>
          {menuOpen &&
            ((style: any) => (
              <div style={style} className="_Header-menu">
                <ul className="_Header-menu-links">
                  {Object.entries(links).map(([key, value]) => {
                    const iconClassName = classnames('_Header-icon', {
                      '_Header-caret': typeof value === 'string'
                    });

                    return (
                      <li
                        key={key}
                        onClick={e => {
                          e.stopPropagation();

                          if (typeof value === 'string') {
                            history.push(value);
                            this.toggleMenu();
                          } else {
                            this.toggleMenuDropdown(key);
                          }
                        }}
                      >
                        {key} <Icon icon="navDownCaret" className={iconClassName} />
                        {typeof value !== 'string' &&
                          visibleMenuDropdowns[key] && (
                            <ul>
                              {value.map(({ to, title }) => (
                                <li
                                  onClick={() => {
                                    this.toggleMenu();
                                    history.push(to);
                                  }}
                                >
                                  {title}
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    );
                  })}
                </ul>
                <div className="_Header-menu-mid">
                  English <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
                </div>
                <ul className="_Header-menu-links">
                  <li>
                    Help & Support{' '}
                    <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
                  </li>
                  <li>
                    Latest News <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
                  </li>
                </ul>
              </div>
            ))}
        </Transition>
        <div className="_Header-top">
          {/* Mobile Left */}
          <div className="_Header-top-mobileLeft" role="button" onClick={this.toggleMenu}>
            <Icon icon={menuOpen ? 'exit' : 'combinedShape'} />
          </div>
          {/* Desktop Left */}
          <ul className="_Header-top-desktopLeft">
            <li>
              Help & Support <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
            </li>
            <li>
              Latest News <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
            </li>
          </ul>
          <div className="_Header-top-center">
            <Link to="/">
              <img src={logo} alt="Our logo" />
            </Link>
          </div>
          {/* Mobile Right */}
          <div className="_Header-top-mobileLeft" onClick={onUnlockClick}>
            <Icon icon={drawerVisible ? 'exit' : 'unlock'} />
          </div>
          {/* Desktop Right */}
          <ul className="_Header-top-desktopRight">
            <li>
              English <Icon icon="navDownCaret" className="_Header-icon _Header-caret" />
            </li>
            <li className="_Header-top-desktopRight-unlock" onClick={onUnlockClick}>
              <Icon icon="unlock" /> Unlock
            </li>
          </ul>
        </div>
        <div className="_Header-bottom">
          <div>
            <ul className="_Header-bottom-links">
              {Object.entries(links).map(([key, value]) => {
                const iconClassName = classnames('_Header-icon', {
                  '_Header-caret': typeof value === 'string'
                });
                const liProps =
                  typeof value === 'string'
                    ? { onClick: () => history.push(value) }
                    : {
                        onMouseEnter: () => this.toggleDropdown(key),
                        onMouseLeave: () => this.toggleDropdown(key)
                      };

                return (
                  <li key={key} {...liProps}>
                    {key} <Icon icon="navDownCaret" className={iconClassName} />
                    {typeof value !== 'string' &&
                      visibleDropdowns[key] && (
                        <ul>
                          {value.map(({ to, title }) => (
                            <li onClick={() => history.push(to)}>{title}</li>
                          ))}
                        </ul>
                      )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    );
  }

  private toggleMenu = () => {
    const { drawerVisible, toggleDrawerVisible } = this.props;

    if (drawerVisible) {
      toggleDrawerVisible();
    }

    this.setState(prevState => ({
      menuOpen: !prevState.menuOpen
    }));
  };

  private closeMenu = () =>
    this.setState({
      menuOpen: false
    });

  private toggleMenuDropdown = (dropdown: string) =>
    this.setState(prevState => ({
      visibleMenuDropdowns: {
        ...prevState.visibleMenuDropdowns,
        [dropdown]: !prevState.visibleMenuDropdowns[dropdown]
      }
    }));

  private toggleDropdown = (dropdown: string) =>
    this.setState(prevState => ({
      visibleDropdowns: {
        ...prevState.visibleDropdowns,
        [dropdown]: !prevState.visibleDropdowns[dropdown]
      }
    }));
}

export default withRouter(Header);
