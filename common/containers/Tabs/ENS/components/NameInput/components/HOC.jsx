// @flow
import * as React from 'react';
import { isValidENSName } from 'libs/validators';

const HOC = PassedComponent =>
  class HOC extends React.Component {
    //add delay to namehash computation / getting the availability
    onChange = (event: SyntheticInputEvent<>) => {
      const domainToCheck = event.target.value;
      /* eslint-disable */
      this.setState({ domainToCheck });
      const isValidName = isValidENSName(domainToCheck);
      this.setState({ isValidDomain: isValidName });
    };
    onClick = (event: SyntheticInputEvent<>) => {
      const { isValidDomain, domainToCheck } = this.state;
      const { resolveDomainRequested } = this.props;
      return isValidDomain && resolveDomainRequested(domainToCheck);
    };
    render() {
      const { onChange, onClick } = this;
      const props = {
        onChange,
        onClick
      };
      return <PassedComponent {...props} />;
    }
  };
export default HOC;
