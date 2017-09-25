import React from 'react';
import './index.scss';

interface State {
  isFading: boolean;
  hasAcknowledged: boolean;
}
export default class UnfinishedBanner extends React.Component<{}, State> {
  public state = {
    isFading: false,
    hasAcknowledged: false
  };

  public render() {
    if (this.state.hasAcknowledged) {
      return null;
    }

    const isFading = this.state.isFading ? 'is-fading' : '';

    return (
      <div className={`UnfinishedBanner ${isFading}`} onClick={this.continue}>
        <div className="UnfinishedBanner-content">
          <h2>Under Contruction</h2>
          <p>The ENS section is still under contruction</p>
          <p>Expect unfinished components</p>
          <h3>Click to continue</h3>
        </div>
      </div>
    );
  }

  private continue = () => {
    this.setState({ isFading: true });

    setTimeout(() => {
      this.setState({ hasAcknowledged: true });
    }, 1000);
  };
}
