// @flow
import React from 'react';
import translate from 'translations';
import WalletDecrypt from 'components/WalletDecrypt';
import HOC from './components/DeployHoc';
interface Props {
  data: string;
  gasLimit: string;
  walletExists: boolean;
  handleInput(input: string): () => null;
  handleSubmit(): null;
}

const Deploy = (props: Props) => {
  const {
    handleSubmit,
    handleInput,
    data: byteCode,
    gasLimit,
    walletExists
  } = props;
  // TODO: Use common components for byte code / gas price
  return (
    <div className="Deploy">
      <section>
        <label className="Deploy-field form-group">
          <h4 className="Deploy-field-label">
            {translate('CONTRACT_ByteCode')}
          </h4>
          <textarea
            name="byteCode"
            placeholder="0x8f87a973e..."
            rows={6}
            onChange={handleInput('data')}
            className="Deploy-field-input form-control"
            value={byteCode}
          />
        </label>

        <label className="Deploy-field form-group">
          <h4 className="Deploy-field-label">Gas Limit</h4>
          <input
            name="gasLimit"
            value={gasLimit}
            onChange={handleInput('gasLimit')}
            placeholder="30000"
            className="Deploy-field-input form-control"
          />
        </label>

        {(walletExists && (
          <button
            className="Deploy-submit btn btn-primary"
            onClick={handleSubmit}
          >
            Deploy Contract
          </button>
        )) || <WalletDecrypt />}
      </section>
    </div>
  );
};

export default HOC(Deploy);
