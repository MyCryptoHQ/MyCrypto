import React from 'react';
import { navigationLinks } from 'config';
import NavigationLink from 'components/NavigationLink';
import logo from 'assets/images/logo-mycrypto-transparent.svg';
import './ElectronNav.scss';

export default class ElectronNav extends React.Component<{}> {
  public render() {
    return (
      <div className="ElectronNav">
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
      </div>
    );
  }
}
