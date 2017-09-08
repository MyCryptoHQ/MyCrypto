// @flow
import * as React from 'react';
import HOC from './HOC';

type NameInputProps = {
  onChange: (SyntheticInputEvent<>) => void,
  onClick: (SyntheticInputEvent<>) => void
};
class ENSNameInput extends React.Component {
  props: NameInputProps;
  render() {
    const { onChange, onClick } = this.props;
    return (
      <article className="row">
        <section className="col-xs-12 col-sm-6 col-sm-offset-3 text-center">
          <div className="input-group">
            <input
              className="form-control"
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
