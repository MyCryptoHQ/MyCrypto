import { Component } from 'react';

import { Redirect, Switch, withRouter } from 'react-router-dom';

interface RouterProps {
  from: string;
  to: string;
  strictArg?: boolean;
  exactArg?: boolean;
  pushArg?: boolean;
}

class RedirectWithQuery extends Component<RouterProps> {
  public render() {
    const { from, to, strictArg, exactArg, pushArg } = this.props;
    return (
      <Redirect
        from={from}
        to={{ pathname: to, search: window.location.search }}
        strict={strictArg}
        exact={exactArg}
        push={pushArg}
      />
    );
  }
}

export const LegacyRoutesHandler = withRouter((props) => {
  const { history } = props;
  const { pathname, search } = props.location;
  let { hash } = props.location;

  if (search.includes('redirectToSignMessage')) {
    history.push('/sign-and-verify-message');
    return null;
  }

  if (pathname === '/') {
    hash = hash.split('?')[0];
    switch (hash) {
      case '#send-transaction':
      case '#offline-transaction':
        return <RedirectWithQuery from={pathname} to={'account/send'} />;
      case '#generate-wallet':
        history.push('/');
        break;
      case '#swap':
        history.push('/swap');
        break;
      case '#contracts':
        history.push('/contracts');
        break;
      case '#ens':
        history.push('/ens');
        break;
      case '#view-wallet-info':
        history.push('/account/info');
        break;
      case '#check-tx-status':
        return <RedirectWithQuery from={pathname} to={'/tx-status'} />;
    }
  }

  return (
    <Switch>
      <RedirectWithQuery from="/signmsg.html" to="/sign-and-verify-message" />
      <RedirectWithQuery from="/helpers.html" to="/helpers" />
      <RedirectWithQuery from="/send-transaction" to={'/account/send'} />
    </Switch>
  );
});
