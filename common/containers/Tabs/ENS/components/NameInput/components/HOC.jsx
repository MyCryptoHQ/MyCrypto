// @flow
import * as React from 'react';
import { isValidENSName } from 'libs/validators';

const HOC = PassedComponent =>
  class HOC extends React.Component {
    state = {
      isValidDomain: 'neither'
    };
    //add delay to namehash computation / getting the availability
    onChange = (event: SyntheticInputEvent<>) => {
      const domainToCheck = event.target.value;
      /* eslint-disable */
      this.setState({ domainToCheck });
      const isValidName = isValidENSName(domainToCheck);
      console.log('SETTING isValidDomain');
      this.setState({ isValidDomain: isValidName });
    };
    onClick = (event: SyntheticInputEvent<>) => {
      const { isValidDomain, domainToCheck } = this.state;
      const { resolveDomainRequested } = this.props;
      return isValidDomain && resolveDomainRequested(domainToCheck);
    };
    render() {
      const { onChange, onClick } = this;
      const { isValidDomain } = this.state;
      const props = {
        onChange,
        onClick,
        isValidDomain
      };
      return <PassedComponent {...props} />;
    }
  };
export default HOC;
