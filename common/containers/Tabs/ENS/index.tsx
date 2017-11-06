import { connect } from 'react-redux';
import ENS from './components/ENS';
import { AppState } from 'reducers';
import { resolveDomainRequested } from 'actions/ens';

export default connect((state: AppState) => ({ ensState: state.ens }), {
  resolveDomainRequested
})(ENS);
