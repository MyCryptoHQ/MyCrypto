import React, { Component } from 'react';
import translate from 'translations';
import { isKeystorePassRequired } from 'libs/keystore';

export type KeystoreValue = {
  file: string,
  password: string,
  valid: boolean
};

function isPassRequired(file: string): boolean {
  let passReq = false;
  try {
    passReq = isKeystorePassRequired(file);
  } catch (e) {
    //TODO: communicate invalid file to user
  }
  return passReq;
}

export default class KeystoreDecrypt extends Component {
  props: {
    value: KeystoreValue,
    onChange: (value: KeystoreValue) => void,
    onUnlock: () => void
  };

  render() {
    const { file, password } = this.props.value;
    let passReq = isPassRequired(file);

    return (
      <section className="col-md-4 col-sm-6">
        <div id="selectedUploadKey">
          <h4>
            {translate('ADD_Radio_2_alt')}
          </h4>

          <div className="form-group">
            <input
              className={'hidden'}
              type="file"
              id="fselector"
              onChange={this.handleFileSelection}
            />
            <label htmlFor="fselector" style={{ width: '100%' }}>
              <a
                className="btn btn-default btn-block"
                id="aria1"
                tabIndex="0"
                role="button"
              >
                {translate('ADD_Radio_2_short')}
              </a>
            </label>
            <div className={file.length && passReq ? '' : 'hidden'}>
              <p>
                {translate('ADD_Label_3')}
              </p>
              <input
                className={`form-control ${password.length > 0
                  ? 'is-valid'
                  : 'is-invalid'}`}
                value={password}
                onChange={this.onPasswordChange}
                onKeyDown={this.onKeyDown}
                placeholder={translate('x_Password')}
                type="password"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  onKeyDown = (e: SyntheticKeyboardEvent) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.props.onUnlock();
    }
  };

  onPasswordChange = (e: SyntheticInputEvent) => {
    const valid = this.props.value.file.length && e.target.value.length;
    this.props.onChange({
      ...this.props.value,
      password: e.target.value,
      valid
    });
  };

  handleFileSelection = (e: SyntheticInputEvent) => {
    const fileReader = new FileReader();
    const inputFile = e.target.files[0];

    fileReader.onload = () => {
      const keystore = fileReader.result;
      let passReq = isPassRequired(keystore);

      this.props.onChange({
        ...this.props.value,
        file: keystore,
        valid: keystore.length && !passReq
      });
    };

    fileReader.readAsText(inputFile, 'utf-8');
  };
}
