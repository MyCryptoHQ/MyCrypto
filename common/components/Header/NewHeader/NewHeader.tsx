import React, { Component } from 'react';
import { MapStateToProps, connect } from 'react-redux';
import logo from 'assets/images/logo-mycrypto.svg';
import { getKeyByValue } from 'utils/helpers';
import { navigationLinks, languages } from 'config';
import NavigationLink from 'components/NavigationLink';
import { OldDropDown } from 'components/ui';
import './NewHeader.scss';
import { sendLinks, buyLinks, toolsLinks } from 'config/newNavigation';
import { NetworkConfig } from 'types/network';
import { AppState } from 'features/reducers';
import {
  configSelectors,
  configMetaSelectors,
  configNodesCustomActions,
  configMetaActions,
  configNetworksCustomActions,
  configNodesSelectedActions,
  configNodesSelectedSelectors,
  configNodesStaticSelectors
} from 'features/config';

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
  sidebarVisible: boolean;
}

interface StateProps {
  shouldSetNodeFromQS: boolean;
  network: NetworkConfig;
  languageSelection: ReturnType<typeof configMetaSelectors.getLanguageSelection>;
  isChangingNode: ReturnType<typeof configNodesSelectedSelectors.isNodeChanging>;
  isOffline: ReturnType<typeof configMetaSelectors.getOffline>;
}

interface DispatchProps {
  changeLanguage: configMetaActions.TChangeLanguage;
  changeNodeRequestedOneTime: configNodesSelectedActions.TChangeNodeRequestedOneTime;
  addCustomNode: configNodesCustomActions.TAddCustomNode;
  removeCustomNode: configNodesCustomActions.TRemoveCustomNode;
  addCustomNetwork: configNetworksCustomActions.TAddCustomNetwork;
}

interface OwnProps {
  networkParam: string | null;
}

type Props = OwnProps & StateProps & DispatchProps;

class NewHeader extends Component<Props, State> {
  public state: State = {
    visibleDropdowns: {
      buy: false,
      send: false,
      tools: false,
      language: false
    },
    sidebarVisible: false
  };

  public render() {
    const { languageSelection } = this.props;
    const { visibleDropdowns, sidebarVisible } = this.state;
    const selectedLanguage = languageSelection;
    const LanguageDropDown = OldDropDown as new () => OldDropDown<typeof selectedLanguage>;
    return (
      <React.Fragment>
        <section className="NewHeader">
          <section className="NewHeader-TopRow ">
            <ul className="NewHeader-TopRow-Container">
              <li className="NewHeader-Support-Container desktop-only">
                <a href="https://support.mycrypto.com/" aria-label="MyCrypto Support">
                  Help & Support <i className="fa fa-angle-right" />
                </a>
                <a href="https://medium.com/@mycrypto" aria-label="MyCrypto Medium Account">
                  Latest News <i className="fa fa-angle-right" />
                </a>
              </li>
              <li className="NewHeader-Support-Container mobile-only">
                <button onClick={this.toggleSidebar}>
                  {sidebarVisible ? (
                    <i className="fa fa-close hamburger" />
                  ) : (
                    <i className="fa fa-bars hamburger" />
                  )}
                </button>
              </li>
              <li className="NewHeader-logo-container">
                <section className="NewHeader-logo-container-image">
                  <img src={logo} alt="Logo" />
                </section>
              </li>
              <li className="NewHeader-Feature-Container mobile-only" />
              <li className="NewHeader-Feature-Container desktop-only ">
                <LanguageDropDown
                  ariaLabel={`change language. current language ${languages[selectedLanguage]}`}
                  options={Object.values(languages)}
                  value={languages[selectedLanguage]}
                  onChange={this.changeLanguage}
                  size="smr"
                  color="white"
                />
              </li>
            </ul>
          </section>

          <div className="desktop-only">
            <HorizontalRule />
          </div>

          <section className="NewHeader-BottomRow desktop-only">
            <section className="NewHeader-BottomRow-Navigation-Container">
              <button
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
              </button>

              <button
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
              </button>
              {''}
              <button
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
              </button>
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

        <section
          className={
            sidebarVisible
              ? 'NewHeader-sidebar mobile-only visible'
              : 'NewHeader-sidebar mobile-only hidden'
          }
        >
          <section className="NewHeader-menu-container">
            <button
              className="NewHeader-menu-container-links NewHeader-menu-container-send"
              onClick={this.toggleSendMenu}
            >
              Send & Recieve{' '}
              {visibleDropdowns.send ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </button>
            {visibleDropdowns.send && (
              <div className="NewHeader-menu-container-links-container">
                <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                  {sendLinks.map(link => (
                    <button onClick={this.toggleSidebar}>
                      <NavigationLink
                        key={link.name}
                        link={link}
                        isHomepage={link === navigationLinks[0]}
                        className="NewHeader-menu-container-links-submenu-links"
                      />
                    </button>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="NewHeader-menu-container-links NewHeader-menu-container-buy"
              onClick={this.toggleBuyMenu}
            >
              Buy & Exchange{' '}
              {visibleDropdowns.buy ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </button>
            {visibleDropdowns.buy && (
              <div className="NewHeader-menu-container-links-container">
                <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                  {buyLinks.map(link => (
                    <button onClick={this.toggleSidebar}>
                      <NavigationLink
                        key={link.name}
                        link={link}
                        isHomepage={link === navigationLinks[0]}
                        className="NewHeader-menu-container-links-submenu-links"
                      />
                    </button>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="NewHeader-menu-container-links NewHeader-menu-container-send"
              onClick={this.toggleToolsMenu}
            >
              Tools{' '}
              {visibleDropdowns.tools ? (
                <i className="fa fa-angle-up" />
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </button>
            {visibleDropdowns.tools && (
              <div className="NewHeader-menu-container-links-container">
                <ul className="Navigation-links NewHeader-menu-container-links-submenu">
                  {toolsLinks.map(link => (
                    <button onClick={this.toggleSidebar}>
                      <NavigationLink
                        key={link.name}
                        link={link}
                        isHomepage={link === navigationLinks[0]}
                        className="NewHeader-menu-container-links-submenu-links"
                      />
                    </button>
                  ))}
                </ul>
              </div>
            )}
            <button className="NewHeader-menu-container-links NewHeader-menu-container-send">
              <i className="fa fa-plus" />{' '}
              <NavigationLink
                key={generateLink.name}
                link={generateLink}
                isHomepage={generateLink === navigationLinks[0]}
                className="NavigationLink CreateWallet-Link"
              />
            </button>

            <HorizontalRule />

            <button className="NewHeader-menu-container-links NewHeader-menu-container-send">
              Ethereum (Auto)
            </button>

            <button
              className="NewHeader-menu-container-links NewHeader-menu-container-send"
              onClick={this.toggleLanguageMenu}
            >
              English
            </button>
            <HorizontalRule />
            <button className="NewHeader-menu-container-links sidebar-support-links NewHeader-menu-container-send">
              <a
                className="sidebar-link"
                href="https://support.mycrypto.com/"
                aria-label="MyCrypto Support"
                onClick={this.toggleSidebar}
              >
                Help & Support <i className="fa fa-angle-right" />
              </a>
              <a
                className="sidebar-link"
                href="https://medium.com/@mycrypto"
                aria-label="MyCrypto Medium Account"
                onClick={this.toggleSidebar}
              >
                Latest News <i className="fa fa-angle-right" />
              </a>
            </button>
          </section>
        </section>
      </React.Fragment>
    );
  }

  public changeLanguage = (value: string) => {
    const key = getKeyByValue(languages, value);
    if (key) {
      this.props.changeLanguage(key);
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

  private toggleSidebar = () =>
    this.setState((prevState: State) => ({ sidebarVisible: !prevState.sidebarVisible }));
}

const mapStateToProps: MapStateToProps<StateProps, OwnProps, AppState> = (
  state,
  { networkParam }
): StateProps => ({
  shouldSetNodeFromQS: !!(
    networkParam && configNodesStaticSelectors.isStaticNodeId(state, networkParam)
  ),
  isOffline: configMetaSelectors.getOffline(state),
  isChangingNode: configNodesSelectedSelectors.isNodeChanging(state),
  languageSelection: configMetaSelectors.getLanguageSelection(state),
  network: configSelectors.getNetworkConfig(state)
});

const mapDispatchToProps: DispatchProps = {
  changeLanguage: configMetaActions.changeLanguage,
  changeNodeRequestedOneTime: configNodesSelectedActions.changeNodeRequestedOneTime,
  addCustomNode: configNodesCustomActions.addCustomNode,
  removeCustomNode: configNodesCustomActions.removeCustomNode,
  addCustomNetwork: configNetworksCustomActions.addCustomNetwork
};

export default connect(mapStateToProps, mapDispatchToProps)(NewHeader);
