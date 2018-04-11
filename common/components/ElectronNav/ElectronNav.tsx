import React from 'react';
import classnames from 'classnames';
import translate from 'translations';
import { navigationLinks } from 'config';
import NavigationLink from 'components/NavigationLink';
import LanguageSelect from './LanguageSelect';
import NodeSelect from './NodeSelect';
import NetworkStatus from './NetworkStatus';
import logo from 'assets/images/logo-mycrypto-transparent.svg';
import './ElectronNav.scss';

interface State {
  panelContent: React.ReactElement<any> | null;
}

export default class ElectronNav extends React.Component<{}, State> {
  public state: State = {
    panelContent: null
  };

  public render() {
    const { panelContent } = this.state;

    return (
      <div
        className={classnames({
          ElectronNav: true,
          'is-panel-open': !!panelContent
        })}
      >
        <div className="ElectronNav-branding">
          <img className="ElectronNav-branding-logo" src={logo} />
        </div>

        <ul className="ElectronNav-links">
          {navigationLinks.map(link => (
            <NavigationLink
              key={link.to}
              link={link}
              isHomepage={link === navigationLinks[0]}
              className="ElectronNavLink"
            />
          ))}
        </ul>

        <div className="ElectronNav-controls">
          <button className="ElectronNav-controls-btn" onClick={this.openLanguageSelect}>
            Change Language
            <i className="ElectronNav-controls-btn-icon fa fa-arrow-circle-right" />
          </button>
          <button className="ElectronNav-controls-btn" onClick={this.openNodeSelect}>
            Change Network
            <i className="ElectronNav-controls-btn-icon fa fa-arrow-circle-right" />
          </button>
        </div>

        <div className="ElectronNav-status">
          <NetworkStatus />
        </div>

        <div className="ElectronNav-panel">
          <button className="ElectronNav-panel-back" onClick={this.closePanel}>
            <i className="ElectronNav-panel-back-icon fa fa-arrow-circle-left" />
            {translate('MODAL_BACK')}
          </button>
          <div className="ElectronNav-panel-content">{panelContent}</div>
        </div>
      </div>
    );
  }

  private openLanguageSelect = () => {
    const panelContent = <LanguageSelect closePanel={this.closePanel} />;
    this.setState({ panelContent });
  };

  private openNodeSelect = () => {
    const panelContent = <NodeSelect closePanel={this.closePanel} />;
    this.setState({ panelContent });
  };

  private closePanel = () => {
    this.setState({ panelContent: null });
  };
}
