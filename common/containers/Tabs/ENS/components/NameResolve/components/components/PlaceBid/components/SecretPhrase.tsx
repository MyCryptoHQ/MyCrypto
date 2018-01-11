import * as React from 'react';
import { generateMnemonic } from 'bip39';
import { connect } from 'react-redux';
import { getSecret } from 'selectors/ens';
import { setSecretField, TSetSecretField } from 'actions/ens';
import { AppState } from 'reducers';

interface OwnProps {
  hasUnitDropdown?: boolean;
}

interface DispatchProps {
  setSecretField: TSetSecretField;
}

interface StateProps {
  secretPhrase: AppState['ens']['fields']['secret'];
}

type Props = OwnProps & DispatchProps & StateProps;

export class SecretPhraseClass extends React.Component<Props> {
  public componentDidMount() {
    const placeholderPhraseList = generateMnemonic().split(' ');
    const placeholderPhrase = placeholderPhraseList
      .splice(placeholderPhraseList.length - 3)
      .join(' ');
    this.props.setSecretField(placeholderPhrase);
  }

  public onChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.props.setSecretField(e.currentTarget.value);
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
            className="form-control"
            value={this.props.secretPhrase || ''}
            onChange={this.onChange}
          />
        </section>
      </section>
    );
  }
}

export const SecretPhrase = connect((state: AppState) => ({ secretPhrase: getSecret(state) }), {
  setSecretField
})(SecretPhraseClass);
