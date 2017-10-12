import React from 'react';
import NameInputHoc from './NameInputHOC';

interface Props {
  isValidDomain: boolean;
  domainToCheck: string;
  onClick(ev: React.FormEvent<HTMLButtonElement>): void;
  onChange(ev: React.FormEvent<HTMLInputElement>): void;
}
class ENSNameInput extends React.Component<Props, {}> {
  public render() {
    const { onChange, onClick, isValidDomain, domainToCheck } = this.props;
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

export default NameInputHoc(ENSNameInput);
