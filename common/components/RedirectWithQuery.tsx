import React from 'react';
import { Redirect } from 'react-router';

interface RouterProps {
  from: string;
  to: string;
  strictArg?: boolean;
  exactArg?: boolean;
  pushArg?: boolean;
}

export class RedirectWithQuery extends React.Component<RouterProps> {
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
