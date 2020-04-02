import React, { Component } from 'react';

import closeIcon from 'assets/images/close.svg';
import './Survey.scss';

interface State {
  displaySurvey: boolean;
}

const STORAGE_NAME = 'SurveyDismissed';

const Container = ({ children }: any) => <div className="SurveyContainer">{children}</div>;

export default class Survey extends Component {
  public state: State = {
    displaySurvey: this.isSurveyPrompted()
  };

  public render() {
    if (this.state.displaySurvey) {
      return (
        <Container>
          <span>
            We're trying to learn more about how people use the MyCrypto Desktop App. Please check
            out our short survey:{' '}
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSdwg-UDXIOQVCQfzcXOaCazZXuAs2OVNjtRzJHdziCYHKH4dw/viewform">
              https://docs.google.com/forms/d/e/1FAIpQLSdwg-UDXIOQVCQfzcXOaCazZXuAs2OVNjtRzJHdziCYHKH4dw/viewform
            </a>
          </span>
          <button className="Modal-header-close" onClick={this.handleClose}>
            <img className="Modal-header-close-icon" src={closeIcon} alt="Close" />
          </button>
        </Container>
      );
    }

    return null;
  }

  public componentWillMount() {
    this.setState({ displaySurvey: this.isSurveyPrompted() });
  }

  private isSurveyPrompted() {
    if (sessionStorage.getItem(STORAGE_NAME) !== null) {
      return false;
    }
    return true;
  }

  private handleClose = () => {
    this.setState({ displaySurvey: false });
    sessionStorage.setItem(
      STORAGE_NAME,
      JSON.stringify({
        dismissed: true,
        ts: Math.floor(Date.now() / 1000)
      })
    );
  };
}
