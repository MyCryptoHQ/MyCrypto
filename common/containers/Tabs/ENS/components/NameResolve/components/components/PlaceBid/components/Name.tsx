import * as React from 'react';
import { getCurrentDomainName } from 'selectors/ens';
import { connect } from 'react-redux';
import { AppState } from 'reducers';

interface StateProps {
  name: AppState['ens']['domainSelector']['currentDomain'];
}

class NameClass extends React.Component<StateProps> {
  public render() {
    return (
      <section className="form-group">
        <label>Name</label>
        <section className="input-group col-xs-12">
          <input
            readOnly={true}
            type="text"
            className="form-control"
            value={this.props.name || ''}
          />
          <div className="input-group-btn">
            <a className="btn btn-default">.eth</a>
          </div>
        </section>
      </section>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({ name: getCurrentDomainName(state) });

export const Name = connect(mapStateToProps)(NameClass);
