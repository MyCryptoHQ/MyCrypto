import React, { Component } from 'react';

import { isValidENSName } from 'libs/validators';
interface State {
  domainToCheck: string;
  isValidDomain: boolean;
}
interface Props {
  resolveDomainRequested(domain: string): void;
}

const NameInputHoc = PassedComponent =>
  class HOC extends Component<Props, State> {
    public state = {
      isValidDomain: false,
      domainToCheck: ''
    };
    //add delay to namehash computation / getting the availability
    public onChange = (event: React.FormEvent<HTMLButtonElement>) => {
      const domainToCheck: string = event.currentTarget.value;
      this.setState({ domainToCheck });
      const isValidName: boolean = isValidENSName(domainToCheck);
      this.setState({ isValidDomain: isValidName });
    };
    public onClick = (event: React.FormEvent<HTMLInputElement>) => {
      const { isValidDomain, domainToCheck } = this.state;
      const { resolveDomainRequested } = this.props;
      return isValidDomain && resolveDomainRequested(domainToCheck);
    };
    public render() {
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
export default NameInputHoc;
