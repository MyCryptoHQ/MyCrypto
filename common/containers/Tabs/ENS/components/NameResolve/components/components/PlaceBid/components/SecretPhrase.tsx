import * as React from 'react';
import { generateMnemonic } from 'bip39';
import { connect } from 'react-redux';
import { setSecretField, TSetSecretField } from 'actions/ens';

interface Props {
  hasUnitDropdown?: boolean;
  setSecretField: TSetSecretField;
}

export class SecretPhraseClass extends React.Component<Props> {
  public state = {
    phrase: ''
  };
  public componentDidMount() {
    const placeholderPhraseList = generateMnemonic().split(' ');
    const placeholderPhrase = placeholderPhraseList
      .splice(placeholderPhraseList.length - 3)
      .join(' ');
    this.setState({
      phrase: placeholderPhrase
    });
    this.props.setSecretField(placeholderPhrase);
  }
  public onChange = e => {
    this.setState({
      phrase: e.target.value
    });
    this.props.setSecretField(e.target.value);
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
            value={this.state.phrase}
            onChange={this.onChange}
          />
        </section>
      </section>
    );
  }
}

export const SecretPhrase = connect(null, {
  setSecretField
})(SecretPhraseClass);
