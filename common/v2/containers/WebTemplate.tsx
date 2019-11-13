import React, { Component } from 'react';

import Footer from 'v2/features/Layout/Footer';

import OfflineTab from './OfflineTab';
import './WebTemplate.scss';

interface OwnProps {
  isUnavailableOffline?: boolean;
  children: string | React.ReactElement<string> | React.ReactElement<string>[];
}

type Props = OwnProps;

class WebTemplate extends Component<Props, {}> {
  public render() {
    const { isUnavailableOffline, children } = this.props;
    return (
      <React.Fragment>
        <div className="WebTemplate">
          <div className="Tab container">
            {isUnavailableOffline && false ? <OfflineTab /> : children}
          </div>
          <div className="WebTemplate-spacer" />
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}

export default WebTemplate;
