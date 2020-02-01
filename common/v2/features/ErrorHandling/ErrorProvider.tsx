import React, { Component, createContext } from 'react';
import translate from 'v2/translations';
import { formatErrorEmail } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config';
import { IRoutePath } from 'v2/types';

interface IError {
  error: Error;
  path: IRoutePath;
}

interface ProviderState {
  error?: IError;
  getErrorMessage(error: IError): React.ReactElement<any>;
}

export const ErrorContext = createContext({} as ProviderState);

export class ErrorProvider extends Component {
  public state: ProviderState = {
    error: undefined,
    getErrorMessage: (error: IError) => {
      return this.getErrorMessage(error);
    }
  };

  public render() {
    const { children } = this.props;
    return <ErrorContext.Provider value={this.state}>{children}</ErrorContext.Provider>;
  }

  public componentDidCatch(error: Error) {
    const path = Object.values(ROUTE_PATHS).find(p => p.path === window.location.pathname);
    console.error(error);
    this.setState({
      error: { error, path }
    });
  }

  private getErrorMessage = (error: IError) => {
    return translate('GENERIC_ERROR', {
      $link: formatErrorEmail(`Issue with ${error.path.name}`, error.error.stack)
    });
  };
}
