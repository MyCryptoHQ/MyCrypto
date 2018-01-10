import * as React from 'react';
import { generateMnemonic } from 'bip39';

interface Props {
  hasUnitDropdown?: boolean;
  value: string;
  onChange(ev: React.FormEvent<HTMLInputElement>);
}

export class SecretPhrase extends React.Component<Props> {
  public componentDidMount() {
    const placeholderPhraseList = generateMnemonic().split(' ');
    const placeholderPhrase = placeholderPhraseList
      .splice(placeholderPhraseList.length - 3)
      .join(' ');

    const fakeEvent = {
      currentTarget: {
        value: placeholderPhrase
      }
    };

    this.props.onChange(fakeEvent as React.FormEvent<HTMLInputElement>);
  }
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
            value={this.props.value}
            onChange={this.props.onChange}
          />
        </section>
      </section>
    );
  }
}
