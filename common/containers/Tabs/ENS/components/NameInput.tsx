import React, { Component } from 'react';
import { connect } from 'react-redux';

import translate from 'translations';
import { isValidENSName } from 'libs/validators';
import { AppState } from 'features/reducers';
import { nameServiceActions } from 'features/nameService';
import { Input } from 'components/ui';
import './NameInput.scss';

interface State {
  domainToCheck: string;
  isValidDomain: boolean;
  isFocused: boolean;
}

interface Props {
  domainRequests: AppState['nameService']['domainRequests'];
  resolveDomainRequested: nameServiceActions.TResolveDomainRequested;
}

class NameInput extends Component<Props, State> {
  public state = {
    isFocused: false,
    isValidDomain: false,
    domainToCheck: ''
  };

  public render() {
    const { domainRequests } = this.props;
    const { isValidDomain, domainToCheck } = this.state;
    const req = domainRequests[domainToCheck];
    const isLoading = req && !req.data && !req.error;

    return (
      <form className="ENSInput" onSubmit={this.onSubmit}>
        <div className="input-group-wrapper">
          <label className="input-group input-group-inline ENSInput-name">
            <Input
              value={domainToCheck.replace('.eth', '')}
              isValid={!!domainToCheck && isValidDomain}
              className="border-rad-right-0"
              type="text"
              placeholder="mycrypto"
              onChange={this.onChange}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              disabled={isLoading}
            />
            <span className="input-group-addon">.eth</span>
          </label>
          {domainToCheck &&
            !isValidDomain && (
              <p className="help-block is-invalid">{translate('ENS_INVALID_INPUT')}</p>
            )}
        </div>
        <button
          className="ENSInput-button btn btn-primary btn-block"
          disabled={!isValidDomain || isLoading}
        >
          {translate('ACTION_9')}
        </button>
      </form>
    );
  }

  // add delay to namehash computation / getting the availability
  private onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const domainToCheck = event.currentTarget.value.toLowerCase().trim();
    const isValidDomain = isValidENSName(domainToCheck);
    this.setState({
      domainToCheck,
      isValidDomain
    });
  };

  private onSubmit = (ev: React.FormEvent<HTMLElement>) => {
    ev.preventDefault();
    const { isValidDomain, domainToCheck } = this.state;
    return isValidDomain && this.props.resolveDomainRequested(domainToCheck + '.eth');
  };

  private onFocus = () => this.setState({ isFocused: true });
  private onBlur = () => this.setState({ isFocused: false });
}

function mapStateToProps(state: AppState) {
  return {
    domainRequests: state.nameService.domainRequests
  };
}

export default connect(mapStateToProps, {
  resolveDomainRequested: nameServiceActions.resolveDomainRequested
})(NameInput);
