// @flow
import React from 'react';
import HOC from './EnsNameBarHOC';

type NameInputProps = {
  onChange: SyntheticInputEvent => void,
  onClick: SyntheticInputEvent => void,
  isValidDomain: boolean,
  domainToCheck: string
};
class ENSNameInput extends React.Component {
  props: NameInputProps;
  render() {
    const { onChange, onClick, isValidDomain, domainToCheck } = this.props;
    console.log('IS_VALID_DOMAIN', isValidDomain);
    return (
      <article className="row">
        <section className="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
          <div className="input-group">
            <input
              className={`form-control ${domainToCheck === ''
                ? ''
                : isValidDomain ? 'is-valid' : 'is-invalid'}`}
              type="text"
              placeholder="myetherwallet"
              onChange={onChange}
            />
            <div className="input-group-btn">
              <a className="btn btn-default">.eth</a>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onClick}>
            Check ENS Name
          </button>
        </section>
      </article>
    );
  }
}

export default HOC(ENSNameInput);
