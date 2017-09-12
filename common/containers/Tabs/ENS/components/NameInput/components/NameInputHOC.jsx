// @flow
import React, { Component } from 'react';

import { isValidENSName } from 'libs/validators';
type State = {
  domainToCheck: string,
  isValidDomain: boolean
};
type Props = {
  resolveDomainRequested: (domain: string) => void
};
type HOCPassedComponent = any; //TODO: ComponentType (Property not found in exports of "react")

const HOC = (PassedComponent: HOCPassedComponent) =>
  class HOC extends Component {
    state: State;
    props: Props;
    state = {
      isValidDomain: false,
      domainToCheck: ''
    };
    //add delay to namehash computation / getting the availability
    onChange = (event: SyntheticInputEvent<>) => {
      const domainToCheck: string = event.target.value;
      this.setState({ domainToCheck });
      const isValidName: boolean = isValidENSName(domainToCheck);
      this.setState({ isValidDomain: isValidName });
    };
    onClick = (event: SyntheticInputEvent<>) => {
      const { isValidDomain, domainToCheck } = this.state;
      const { resolveDomainRequested } = this.props;
      return isValidDomain && resolveDomainRequested(domainToCheck);
    };
    render() {
      const { onChange, onClick } = this;
      const { isValidDomain, domainToCheck } = this.state;
      const props = {
        onChange,
        onClick,
        isValidDomain,
        domainToCheck
      };
      return <PassedComponent {...props} />;
    }
  };
export default HOC;
