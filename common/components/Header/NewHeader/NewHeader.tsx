import React, { Component } from 'react';
import logo from 'assets/images/logo-mycrypto.svg';
import { navigationLinks } from 'config';
import NavigationLink from 'components/NavigationLink';
import './NewHeader.scss';
import { sendLinks, buyLinks, toolsLinks } from 'config/newNavigation';
import LanguageSelect from 'components/ElectronNav/LanguageSelect';

const generateLink = {
  name: 'NAV_GENERATEWALLET',
  to: '/generate'
};

const HorizontalRule = () => (
  <section className="HorizontalRule">
    <section className="HorizontalRule-line" />
  </section>
);

interface State {
  visibleDropdowns: {
    [key: string]: boolean;
  };
}

export default class NewHeader extends Component<{}, State> {
  public state: State = {
    visibleDropdowns: {
      buy: false,
      send: false,
      tools: false,
      language: false
    }
  };

  private toggleSendMenu = () => this.toggleDropdown('send');

  private toggleBuyMenu = () => this.toggleDropdown('buy');

  private toggleToolsMenu = () => this.toggleDropdown('tools');

  private toggleLanguageMenu = () => this.toggleDropdown('language');

  private toggleDropdown = (name: string) =>
    this.setState((prevState: State) => ({
      visibleDropdowns: {
        ...prevState.visibleDropdowns,
        [name]: !prevState.visibleDropdowns[name]
      }
    }));

  public render() {
    const { visibleDropdowns } = this.state;
    return (
      <React.Fragment>
        <section className="NewHeader">
          <section className="NewHeader-TopRow ">
            <ul className="NewHeader-TopRow-Container">
              <li className="NewHeader-Support-Container desktop-only">
                <a href="https://support.mycrypto.com/">
                  Help & Support <i className="fa fa-angle-right" />
                </a>
                <a href="https://medium.com/@mycrypto">
                  Latest News <i className="fa fa-angle-right" />
                </a>
              </li>
              <li className="NewHeader-logo-container">
                <section className="NewHeader-logo-container-image">
                  <img src={logo} alt="Logo" />
                </section>
              </li>
              <li className="NewHeader-Feature-Container desktop-only ">
                <a className="langauge-picker" onClick={this.toggleLanguageMenu}>
                  English <i className="fa fa-angle-down" />
                  {/* <LanguageSelect className="Language-Picker"/> */}
                </a>
              </li>
            </ul>
          </section>

          <div className="desktop-only">
            <HorizontalRule />
          </div>

          <section className="NewHeader-BottomRow desktop-only">
            <section className="NewHeader-BottomRow-Navigation-Container">
              <section
                className="NewHeader-menu-container-links NewHeader-menu-container-send NewHeader-BottomRow-Navigation-Link"
                onMouseEnter={this.toggleSendMenu}
                onMouseLeave={this.toggleSendMenu}
              >
                Send & Recieve{' '}
                {visibleDropdowns.send ? (
                  <i className="fa fa-angle-up" />
                ) : (
                  <i className="fa fa-angle-down" />
                )}
                <div className="submenu-container">
                  {true && (
                    <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                      {sendLinks.map(link => (
                        <NavigationLink
                          key={link.name}
                          link={link}
                          isHomepage={link === navigationLinks[0]}
                          className="NewHeader-menu-container-links-submenu-links"
                        />
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section
                className="NewHeader-menu-container-links NewHeader-menu-container-send NewHeader-BottomRow-Navigation-Link"
                onMouseEnter={this.toggleBuyMenu}
                onMouseLeave={this.toggleBuyMenu}
              >
                Buy & Exchange{' '}
                {visibleDropdowns.buy ? (
                  <i className="fa fa-angle-up" />
                ) : (
                  <i className="fa fa-angle-down" />
                )}
                {true && (
                  <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                    {buyLinks.map(link => (
                      <NavigationLink
                        key={link.name}
                        link={link}
                        isHomepage={link === navigationLinks[0]}
                        className="NewHeader-menu-container-links-submenu-links"
                      />
                    ))}
                  </ul>
                )}
              </section>
              {''}
              <section
                className="NewHeader-menu-container-links NewHeader-menu-container-send NewHeader-BottomRow-Navigation-Link"
                onMouseEnter={this.toggleToolsMenu}
                onMouseLeave={this.toggleToolsMenu}
              >
                Tools{' '}
                {visibleDropdowns.tools ? (
                  <i className="fa fa-angle-up" />
                ) : (
                  <i className="fa fa-angle-down" />
                )}
                {true && (
                  <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                    {toolsLinks.map(link => (
                      <NavigationLink
                        key={link.name}
                        link={link}
                        isHomepage={link === navigationLinks[0]}
                        className="NewHeader-menu-container-links-submenu-links"
                      />
                    ))}
                  </ul>
                )}
              </section>
              <section className="NewHeader-menu-container-links NewHeader-menu-container-send">
                <i className="fa fa-plus" />{' '}
                <NavigationLink
                  key={generateLink.name}
                  link={generateLink}
                  isHomepage={generateLink === navigationLinks[0]}
                  className="NewHeader-link"
                />
              </section>
            </section>
          </section>
        </section>
        <section className="NewHeader-sidebar mobile-only">
          <section className="NewHeader-menu-container">
            <section
              className="NewHeader-menu-container-links NewHeader-menu-container-send"
              onClick={this.toggleSendMenu}
            >
              Send & Recieve{' '}
              {visibleDropdowns.send ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </section>
            {visibleDropdowns.send && (
              <div>
                <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                  {sendLinks.map(link => (
                    <NavigationLink
                      key={link.name}
                      link={link}
                      isHomepage={link === navigationLinks[0]}
                      className="NewHeader-menu-container-links-submenu-links"
                    />
                  ))}
                </ul>
              </div>
            )}
            <section
              className="NewHeader-menu-container-links NewHeader-menu-container-buy"
              onClick={this.toggleBuyMenu}
            >
              Buy & Exchange{' '}
              {visibleDropdowns.buy ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </section>
            {visibleDropdowns.buy && (
              <div>
                <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                  {buyLinks.map(link => (
                    <NavigationLink
                      key={link.name}
                      link={link}
                      isHomepage={link === navigationLinks[0]}
                      className="NewHeader-menu-container-links-submenu-links"
                    />
                  ))}
                </ul>
              </div>
            )}
            <section
              className="NewHeader-menu-container-links NewHeader-menu-container-send"
              onClick={this.toggleToolsMenu}
            >
              Tools
            </section>
            <section className="NewHeader-menu-container-links NewHeader-menu-container-send">
              <i className="fa fa-plus" />{' '}
              <NavigationLink
                key={generateLink.name}
                link={generateLink}
                isHomepage={generateLink === navigationLinks[0]}
                className="NavigationLink"
              />
            </section>

            <HorizontalRule />

            <section className="NewHeader-menu-container-links NewHeader-menu-container-send">
              Ethereum (Auto)
            </section>

            <section
              className="NewHeader-menu-container-links NewHeader-menu-container-send"
              onClick={this.toggleLanguageMenu}
            >
              English
            </section>
            <HorizontalRule />
          </section>
        </section>
      </React.Fragment>
    );
  }
}
