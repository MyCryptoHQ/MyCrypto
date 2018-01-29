import * as React from 'react';
import { connect } from 'react-redux';
import { getSecret } from 'selectors/ens';
import { inputSecretField, TInputSecretField } from 'actions/ens';
import { AppState } from 'reducers';

interface OwnProps {
  hasUnitDropdown?: boolean;
}

interface DispatchProps {
  inputSecretField: TInputSecretField;
}

interface StateProps {
  secretPhrase: AppState['ens']['fields']['secretPhrase'];
}

type Props = OwnProps & DispatchProps & StateProps;

export class SecretPhraseClass extends React.Component<Props> {
  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.inputSecretField(e.currentTarget.value);
  };

  public render() {
    return (
      <section className="form-group">
        <label>Secret Phrase</label>
        <em className="col-xs-12">
          <small>You must remember this to claim your name later.</small>
        </em>
        <section className="input-group col-xs-12">
          <input
            type="text"
            className={`form-control ${this.props.secretPhrase.value ? 'is-valid' : 'is-invalid'}`}
            value={this.props.secretPhrase.raw}
            onChange={this.onChange}
          />
        </section>
      </section>
    );
  }
}

export const SecretPhrase = connect((state: AppState) => ({ secretPhrase: getSecret(state) }), {
  inputSecretField
})(SecretPhraseClass);
