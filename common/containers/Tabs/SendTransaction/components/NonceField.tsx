import React from 'react';
import Help from 'components/ui/Help';
import { knowledgeBaseURL } from 'config/data';
import { isPositiveInteger } from 'utils/helpers';

interface PublicProps {
  placeholder: string;
  value: number | null | undefined;
  onChange(value: number): void;
}

const isValidNonce = (value: string | null | undefined) => {
  let valid;
  if (value === '0') {
    valid = true;
  } else if (!value) {
    valid = false;
  } else {
    valid = isPositiveInteger(parseInt(value, 10));
  }
  return valid;
};

export default class NonceField extends React.Component<PublicProps, {}> {
  public render() {
    const { placeholder, value } = this.props;
    const strValue = value ? value.toString() : '';
    return (
      <div className="row form-group">
        <div className="col-xs-11">
          <label>Nonce</label>
          <Help link={`${knowledgeBaseURL}/transactions/what-is-nonce.html`} />
          <input
            className={`form-control ${isValidNonce(strValue) ? 'is-valid' : 'is-invalid'}`}
            type="number"
            value={strValue}
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
