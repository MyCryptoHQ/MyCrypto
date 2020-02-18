import React, { Component, createContext } from 'react';
import translate from 'v2/translations';
import { formatErrorEmail } from 'v2/utils';
import { ROUTE_PATHS } from 'v2/config';
import { IRoutePath } from 'v2/types';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IError {
  error: Error;
  path: IRoutePath;
}

interface ProviderState {
  error?: IError;
  suppressErrors: boolean;
  toggleSuppressErrors(): void;
  shouldShowError(): boolean;
  getErrorMessage(error: IError): React.ReactElement<any>;
}

const ERROR_TIMEOUT_MS = 30 * 1000;
let errorTimer: any = null;

export const ErrorContext = createContext({} as ProviderState);

class ErrorProvider extends Component<RouteComponentProps<{}>> {
  public state: ProviderState = {
    error: undefined,
    suppressErrors: false,
    toggleSuppressErrors: () => {
      this.setState((prevState: ProviderState) => {
        return { suppressErrors: !prevState.suppressErrors };
      });
    },
    shouldShowError: () => {
      return this.shouldShowError();
    },
    getErrorMessage: (error: IError) => {
      return this.getErrorMessage(error);
    }
  };

  public render() {
    const { children } = this.props;
    return <ErrorContext.Provider value={this.state}>{children}</ErrorContext.Provider>;
  }

  public componentDidCatch(error: Error) {
    console.error(error);
    if (!this.state.suppressErrors) {
      const path = Object.values(ROUTE_PATHS).find(p => p.path === window.location.pathname);
      this.props.history.replace(ROUTE_PATHS.HOME.path);
      this.setState({
        error: { error, path }
      });
      clearTimeout(errorTimer);
      errorTimer = setTimeout(() => {
        this.setState({ error: undefined });
      }, ERROR_TIMEOUT_MS);
    }
  }

  private shouldShowError = () => {
    return this.state.error !== undefined && !this.state.suppressErrors;
  };

  private getErrorMessage = (error: IError) => {
    return translate('GENERIC_ERROR', {
      $link: formatErrorEmail(`Issue with ${error.path.name}`, error.error.stack)
    });
  };
}

export default withRouter(ErrorProvider);
