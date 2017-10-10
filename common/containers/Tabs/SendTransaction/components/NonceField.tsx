// @flow
import React from 'react';
import Help from 'components/ui/Help';
import { translateRaw } from 'translations';
import { isPositiveInteger } from 'utils/helpers';

interface PublicProps {
  placeholder: string;
  value: number | null | undefined;
  onChange(value: number): void;
}

const isValidNonce = (value: number) => {
  return isPositiveInteger(value);
};

export default class NonceField extends React.Component<PublicProps, {}> {
  public render() {
    const { placeholder, value } = this.props;
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <Help
            size={'small'}
            link={
              'https://myetherwallet.github.io/knowledge-base/transactions/what-is-nonce.html'
            }
          />
          <label>Nonce</label>
          <input
            className={`form-control ${value && isValidNonce(value)
              ? 'is-valid'
              : 'is-invalid'}`}
            type="number"
            value={String(value)}
            placeholder={placeholder}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }

  private onChange = (e: any) => {
    this.props.onChange(e.target.value);
  };
}
