import React, { Component } from 'react';
import logo from 'assets/images/logo-mycrypto.svg';
import { navigationLinks } from 'config';
import NavigationLink from 'components/NavigationLink';
import './NewHeader.scss';
import { sendLinks, buyLinks, toolsLinks } from 'config/newNavigation';

const generateLink = {
  name: 'NAV_GENERATEWALLET',
  to: '/generate'
};

const HorizontalRule = () => (
  <section className="HorizontalRule">
    <section className="HorizontalRule-line" />
  </section>
);

export default class NewHeader extends Component {
  public state = {
    sendMenuVisible: false,
    buyMenuVisible: false,
    toolsMenuVisible: false,
    LanguageMenuVisible: false
  };

  public toggleSendMenu = () => {
    this.setState({ sendMenuVisible: !this.state.sendMenuVisible });
  };

  public toggleBuyMenu = () => {
    this.setState({ buyMenuVisible: !this.state.buyMenuVisible });
  };

  public toggleToolsMenu = () => {
    this.setState({ toolsMenuVisible: !this.state.toolsMenuVisible });
  };

  public toggleLanguageMenu = () => {
    this.setState({ LanguageMenuVisible: !this.state.LanguageMenuVisible });
  };

  public render() {
    const { sendMenuVisible, buyMenuVisible } = this.state;
    return (
      <React.Fragment>
        <section className="NewHeader">
          <section className="NewHeader-TopRow ">
            <section className="NewHeader-Support-Container desktop-only">
              <a href="https://support.mycrypto.com/">
                Help & Support <i className="fa fa-angle-right" />
              </a>
              <a href="https://medium.com/@mycrypto">
                Latest News <i className="fa fa-angle-right" />
              </a>
            </section>
            <section className="NewHeader-logo-container">
              <section className="NewHeader-logo-container-image">
                <img src={logo} alt="Logo" />
              </section>
            </section>
            <section className="NewHeader-Support-Container desktop-only">
              English <i className="fa fa-angle-down" />
            </section>
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
                {sendMenuVisible ? (
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
                onMouseEnter={this.toggleSendMenu}
                onMouseLeave={this.toggleSendMenu}
              >
                Buy & Exchange{' '}
                {buyMenuVisible ? (
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
                onMouseEnter={this.toggleSendMenu}
                onMouseLeave={this.toggleSendMenu}
              >
                Tools{' '}
                {buyMenuVisible ? (
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
                  className="NavigationLink"
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
              {sendMenuVisible ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </section>
            {sendMenuVisible && (
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
              {buyMenuVisible ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </section>
            {buyMenuVisible && (
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
