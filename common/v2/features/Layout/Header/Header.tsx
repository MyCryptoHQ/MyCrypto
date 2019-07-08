import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';
import { Transition } from 'react-spring/renderprops.cjs';
import { Icon } from '@mycrypto/ui';
import styled from 'styled-components';

import { UnlockScreen, SelectLanguage } from 'v2/features';
import { links } from './constants';
import { COLORS } from 'v2/features/constants';
import { translate } from 'translations';
import { AnalyticsService, ANALYTICS_CATEGORIES } from 'v2/services';
import { KNOWLEDGE_BASE_URL } from 'v2/config';

import { AppState } from 'features/reducers';
import { configMetaSelectors } from 'features/config';
import { languages } from 'config';

// Legacy
import logo from 'assets/images/logo-mycrypto.svg';

const { BRIGHT_SKY_BLUE } = COLORS;

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 4;
  width: 100%;
  background: #163150;

  @media (min-width: 850px) {
    position: initial;
  }
`;

const Menu = styled.div`
  position: fixed;
  top: 77px;
  left: 0;
  overflow: auto;
  width: 375px;
  height: calc(100vh - 77px);
  background: #163150;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 77px;
  padding: 0 40px;
  border-bottom: 1px solid #3e546d;

  @media (min-width: 850px) {
    padding: 0;
  }
`;

const HeaderBottom = styled.div`
  display: none;
  height: 77px;
  border-bottom: 1px solid #3e546d;

  @media (min-width: 850px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const HeaderBottomLinks = styled.ul`
  display: none;

  li {
    position: relative;

    ul {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 200px;
      margin: 0;
      padding: 0;
      background: #163150;
      border: 1px solid #3e546d;
      text-transform: none;
      z-index: 1;

      li {
        padding: 13px;
        font-weight: 300;
      }
    }
  }

  @media (min-width: 850px) {
    margin: 0;
    padding: 0;
    color: #ffffff;
    text-transform: uppercase;
    font-weight: bold;
    list-style-type: none;

    display: flex;
    align-items: center;
    height: 100%;

    li {
      height: 100%;
      margin: 0;
      padding: 0 25px;
      font-weight: 500;
      display: flex;
      align-items: center;

      transition: background 0.2s ease-in;

      &:hover {
        background: #304b6a;
        cursor: pointer;
      }
    }
  }
`;

const HeaderTopLeft = styled.div`
  display: none;

  @media (min-width: 850px) {
    margin: 0;
    padding: 0;
    color: #ffffff;
    text-transform: uppercase;
    font-weight: bold;
    list-style-type: none;

    display: flex;
    align-items: center;
    height: 100%;

    li {
      height: 100%;
      margin: 0;
      padding: 0 25px;
      font-weight: 500;
      display: flex;
      align-items: center;

      transition: background 0.2s ease-in;

      &:hover {
        background: #304b6a;
        cursor: pointer;
      }
    }
  }
`;

const MenuLinks = styled.ul`
  margin: 0;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: bold;
  list-style-type: none;

  padding: 15px 0;
  border-bottom: 1px solid #3e546d;

  li {
    height: 100%;
    margin: 0;
    font-weight: 500;
    padding: 20px 35px;

    ul {
      list-style-type: none;
      margin: 15px 0;
      padding: 0;

      li {
        margin: 0;
        padding: 0;
        text-transform: none;

        &:not(:last-of-type) {
          margin-bottom: 15px;
        }
      }
    }
  }
`;

const MenuMid = styled.div`
  padding: 35px;
  border-bottom: 1px solid #3e546d;
  color: #ffffff;
  text-transform: uppercase;
  font-weight: normal;
`;

const MobileTopLeft = styled.div`
  display: block;
  color: #ffffff;
  font-size: 1.5rem;

  svg {
    color: #ffffff;
  }

  @media (min-width: 850px) {
    display: none;
  }
  &:hover {
    cursor: pointer;
  }
`;

const CenterImg = styled.img`
  width: 160px;
  height: 39px;
`;

const Unlock = styled.li`
  display: flex;
  align-items: center;
  border-left: 1px solid #3e546d;

  svg {
    margin-right: 6px;
    color: #1eb8e7;
  }
`;

interface IconWrapperProps {
  subItems?: boolean;
}

// prettier-ignore
const IconWrapper = styled(Icon)<IconWrapperProps>`
  margin: 0;
  margin-left: 6px;
  font-size: 0.75rem;

  svg {
    color: ${BRIGHT_SKY_BLUE};
    ${props => props.subItems && 'transform: rotate(270deg);'};
  }
`;

const TitleIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

interface PrefixIconProps {
  width: string;
  height: string;
}

// prettier-ignore
const PrefixIcon = styled.img<PrefixIconProps>`
  ${props => props.width && `width: ${props.width};`}
  ${props => props.height && `height: ${props.height};`}
  margin-right: 3px;

  svg {
    color: ${BRIGHT_SKY_BLUE};
  }
`;

interface Props {
  languageSelection: ReturnType<typeof configMetaSelectors.getLanguageSelection>;
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

interface LinkElement {
  to: string;
  title?: string;
  subItems?: LinkElement;
}

export class Header extends Component<Props & RouteComponentProps<{}>, State> {
  public state: State = {
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
    const {
      history,
      drawerVisible,
      toggleDrawerVisible,
      setDrawerScreen,
      languageSelection
    } = this.props;
    const { menuOpen, visibleMenuDropdowns, visibleDropdowns } = this.state;
    const onUnlockClick = () => {
      this.closeMenu();
      drawerVisible ? toggleDrawerVisible() : setDrawerScreen(UnlockScreen);
    };

    const onLanguageClick = () => {
      this.closeMenu();
      drawerVisible ? toggleDrawerVisible() : setDrawerScreen(SelectLanguage);
    };

    return (
      <Navbar>
        {/* Mobile Menu */}
        <Transition
          items={menuOpen}
          from={{ left: '-375px' }}
          enter={{ left: '0' }}
          leave={{ left: '-500px' }}
        >
          {open =>
            open &&
            ((style: any) => (
              <Menu style={style}>
                <MenuLinks>
                  {links.map(({ title, to, subItems, icon }) => {
                    return (
                      <li
                        key={title}
                        onClick={e => {
                          e.stopPropagation();

                          if (to) {
                            history.push(to);
                            this.toggleMenu();
                          } else {
                            this.toggleMenuDropdown(title);
                          }
                        }}
                      >
                        <TitleIconWrapper>
                          {icon && <PrefixIcon {...icon} />} {title}
                          {!icon && <IconWrapper subItems={!subItems} icon="navDownCaret" />}
                        </TitleIconWrapper>
                        {subItems &&
                          visibleMenuDropdowns[title] && (
                            <ul>
                              {subItems.map(({ to: innerTo, title: innerTitle }: LinkElement) => (
                                <li
                                  key={innerTitle}
                                  onClick={() => {
                                    this.toggleMenu();
                                    history.push(innerTo);
                                  }}
                                >
                                  {innerTitle}
                                </li>
                              ))}
                            </ul>
                          )}
                      </li>
                    );
                  })}
                </MenuLinks>
                <MenuMid onClick={onLanguageClick}>
                  {languages[languageSelection]} <IconWrapper subItems={true} icon="navDownCaret" />
                </MenuMid>
                <MenuLinks>
                  <li onClick={this.openHelpSupportPage}>
                    {translate('NEW_HEADER_TEXT_1')}
                    <IconWrapper subItems={true} icon="navDownCaret" />
                  </li>
                  <li>
                    Latest News <IconWrapper subItems={true} icon="navDownCaret" />
                  </li>
                </MenuLinks>
              </Menu>
            ))
          }
        </Transition>
        <HeaderTop>
          {/* Mobile Left */}
          <MobileTopLeft role="button" onClick={this.toggleMenu}>
            <Icon icon={menuOpen ? 'exit' : 'combinedShape'} />
          </MobileTopLeft>
          {/* Desktop Left */}
          <HeaderTopLeft>
            <li onClick={this.openHelpSupportPage}>
              {translate('NEW_HEADER_TEXT_1')}
              <IconWrapper subItems={true} icon="navDownCaret" />
            </li>
            <li>
              Latest News <IconWrapper subItems={true} icon="navDownCaret" />
            </li>
          </HeaderTopLeft>
          <div>
            <Link to="/">
              <CenterImg src={logo} alt="Our logo" />
            </Link>
          </div>
          {/* Mobile Right */}
          <MobileTopLeft onClick={onUnlockClick}>
            <Icon icon={drawerVisible ? 'exit' : 'unlock'} />
          </MobileTopLeft>
          {/* Desktop Right */}
          <HeaderTopLeft>
            <li onClick={onLanguageClick}>
              {languages[languageSelection]} <IconWrapper subItems={true} icon="navDownCaret" />
            </li>
            <Unlock onClick={onUnlockClick}>
              <IconWrapper icon="unlock" /> Unlock
            </Unlock>
          </HeaderTopLeft>
        </HeaderTop>
        <HeaderBottom>
          <HeaderBottomLinks>
            {links.map(({ title, to, subItems, icon }) => {
              const liProps = to
                ? { onClick: () => history.push(to) }
                : {
                    onMouseEnter: () => this.toggleDropdown(title),
                    onMouseLeave: () => this.toggleDropdown(title)
                  };

              return (
                <li key={title} {...liProps}>
                  {icon && <PrefixIcon {...icon} />} {title}{' '}
                  {!icon && <IconWrapper subItems={!subItems} icon="navDownCaret" />}
                  {subItems &&
                    visibleDropdowns[title] && (
                      <ul>
                        {subItems.map(({ to: innerTo, title: innerTitle }: LinkElement) => (
                          <li key={innerTitle} onClick={() => history.push(innerTo)}>
                            {innerTitle}
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              );
            })}
          </HeaderBottomLinks>
        </HeaderBottom>
      </Navbar>
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

  private openHelpSupportPage = (): void => {
    window.open(KNOWLEDGE_BASE_URL, '_blank');
    AnalyticsService.instance.track(ANALYTICS_CATEGORIES.HEADER, 'Help & Support clicked');
  };
}

const mapStateToProps = (state: AppState) => ({
  languageSelection: configMetaSelectors.getLanguageSelection(state)
});

export default withRouter(connect(mapStateToProps)(Header));
