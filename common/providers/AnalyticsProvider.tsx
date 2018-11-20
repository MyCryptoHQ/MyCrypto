import React, { Component } from 'react';

export interface AnalyticsAcknowledgement {
  basic: boolean;
  analytics: boolean;
}

export interface AnalyticsAcknowledgementInteractions {
  acknowledgement?: AnalyticsAcknowledgement | null;
  setAcknowledgement(options: AnalyticsAcknowledgement): void;
}

export const ANALYTICS_LOCALSTORAGE_KEY = 'MyCrypto Analytics';
export const AnalyticsContext = React.createContext();
export const getAcknowledgement = () => {
  const acknowledgement = window.localStorage.getItem(ANALYTICS_LOCALSTORAGE_KEY);

  return acknowledgement ? JSON.parse(acknowledgement) : null;
};
export const setAcknowledgement = (options: AnalyticsAcknowledgement) =>
  window.localStorage.setItem(ANALYTICS_LOCALSTORAGE_KEY, JSON.stringify(options));
export const clearAcknowledgement = () =>
  window.localStorage.removeItem(ANALYTICS_LOCALSTORAGE_KEY);

interface State {
  acknowledgement: AnalyticsAcknowledgement;
  setAcknowledgement(options: AnalyticsAcknowledgement): void;
  clearAcknowledgement(): void;
}

export default class AnalyticsProvider extends Component {
  public state: State = {
    setAcknowledgement: (options: AnalyticsAcknowledgement) => {
      setAcknowledgement(options);
      this.setState({ acknowledgement: options });
      window.addEventListener('storage', this.listenForAcknowledgementRemoval);
    },
    clearAcknowledgement: () => {
      clearAcknowledgement();
      this.setState({ acknowledgement: null });
      window.removeEventListener('storage', this.listenForAcknowledgementRemoval);
    },
    acknowledgement: getAcknowledgement()
  };

  public componentDidMount() {
    const acknowledgement = getAcknowledgement();

    if (acknowledgement) {
      this.state.setAcknowledgement(acknowledgement);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('storage', this.listenForAcknowledgementRemoval);
  }

  public render() {
    return (
      <AnalyticsContext.Provider value={this.state}>
        {this.props.children}
      </AnalyticsContext.Provider>
    );
  }

  private listenForAcknowledgementRemoval = ({ key, newValue }: StorageEvent) => {
    if (key === ANALYTICS_LOCALSTORAGE_KEY && !newValue) {
      this.state.clearAcknowledgement();
    }
  };
}
