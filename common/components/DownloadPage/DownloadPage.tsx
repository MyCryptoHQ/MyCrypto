import React from 'react';
import TabSection from 'containers/TabSection';
import { NewTabLink } from 'components/ui';
import ElectronOSX from 'assets/images/download/electron-osx.png';
import './DownloadPage.scss';

const features = [
  {
    title: 'Secure',
    color: '#2ecc71',
    icon: 'lock',
    text: `
    Don’t worry about malicious browser extensions or wifi networks, the desktop
    MyCrypto app runs in a sandbox with local resources, so your private keys
    are safe
  `
  },
  {
    title: 'Work Offline',
    color: '#9b59b6',
    icon: 'wifi',
    text: `
    No internet? No problem. Everything you need to generate transactions is on
    your computer. You can also run your own node to control your environment 100%.
  `
  },
  {
    title: 'Always Yours',
    color: '#e67e22',
    icon: 'user',
    text: `
    It doesn't matter if mycrypto.com goes down, the app will always be yours.
    Everything is configurable, which means you’ll always have access to the
    blockchain with MyCrypto.
  `
  },
  {
    title: 'Open Source',
    color: '#34495e',
    icon: 'github',
    text: `
    Built with the community in mind, the MyCrypto app is completely open source.
    Anyone can audit the code, and contribute changes on Github.
  `
  }
];

export default class DownloadPage extends React.Component<{}> {
  public render() {
    let os = 'the Desktop';
    const img = ElectronOSX;
    if (navigator.appVersion.includes('Win')) {
      os = 'Windows';
    } else if (navigator.appVersion.includes('Mac')) {
      os = 'OSX';
    } else if (navigator.appVersion.includes('Linux')) {
      os = 'Linux';
    } else if (navigator.appVersion.includes('X11')) {
      os = 'Unix';
    }

    return (
      <TabSection hideHeader={true}>
        <div className="DownloadPage">
          <div className="DownloadPage-top">
            <h1 className="DownloadPage-title">Download MyCrypto for {os}</h1>
            <p className="DownloadPage-description">
              Run MyCrypto securely and offline with the desktop application. Powered by Electron,
              it's the same MyCrypto app, running in a sandboxed environment.
            </p>

            <div className="DownloadPage-download">
              <NewTabLink
                className="DownloadPage-download-button"
                href="https://github.com/MyCryptoHQ/MyCrypto/releases/latest"
              >
                Download from Github <i className="fa fa-external-link" />
              </NewTabLink>
              <NewTabLink
                className="DownloadPage-download-link"
                href="https://github.com/MyCryptoHQ/MyCrypto/releases"
              >
                Release History
              </NewTabLink>
              <NewTabLink
                className="DownloadPage-download-link"
                href="https://github.com/MyCryptoHQ/MyCrypto/releases/latest"
              >
                Release Notes
              </NewTabLink>
            </div>
          </div>

          <img className="DownloadPage-screenshot" src={img} />

          <div className="DownloadPage-features">
            {features.map(ft => (
              <div className="DownloadPage-features-feature">
                <div
                  className="DownloadPage-features-feature-icon"
                  style={{
                    backgroundColor: ft.color
                  }}
                >
                  <i className={`fa fa-${ft.icon}`} />
                </div>
                <h3 className="DownloadPage-features-feature-title">{ft.title}</h3>
                <p className="DownloadPage-features-feature-text">{ft.text}</p>
              </div>
            ))}
          </div>
        </div>
      </TabSection>
    );
  }
}
