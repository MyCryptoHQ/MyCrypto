// @flow
import { connect } from 'react-redux';
import ENS from './components/ENS';
import type { State } from 'reducers';
import { resolveDomainRequested } from 'actions/ens';

const mapStateToProps = (state: State) => {
  return { ensState: state.ens };
};

export default connect(mapStateToProps, {
  resolveDomainRequested
})(ENS);
