import { connect } from 'react-redux';
import ENS from './components/ENS';
import { AppState } from 'reducers';
import { resolveDomainRequested } from 'actions/ens';

const mapStateToProps = (state: AppState) => {
  return { ensState: state.ens };
};

export default connect(mapStateToProps, {
  resolveDomainRequested
})(ENS);
