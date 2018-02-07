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
    let searchString = window.location.search;
    if (window.location.hash) {
      const hashString = window.location.hash.replace('?', ',?').split(',');
      searchString = hashString[1];
    }
    return (
      <Redirect
        from={from}
        to={{ pathname: to, search: searchString }}
        strict={strictArg}
        exact={exactArg}
        push={pushArg}
      />
    );
  }
}
