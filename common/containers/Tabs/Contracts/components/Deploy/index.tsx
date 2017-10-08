import React from 'react';
import translate from 'translations';
import WalletDecrypt from 'components/WalletDecrypt';
import { deployHOC } from './components/DeployHoc';
import { TTxCompare } from '../TxCompare';
import { TDeployModal } from '../TxModal';
interface Props {
  byteCode: string;
  gasLimit: string;
  walletExists: boolean;
  TxCompare: TTxCompare | null;
  displayModal: boolean;
  DeployModal: TDeployModal | null;
  handleInput(input: string): () => null;
  handleSignTx(): null;
  handleDeploy(): null;
}

const Deploy = (props: Props) => {
  const {
    handleSignTx,
    handleInput,
    handleDeploy,
    byteCode,
    gasLimit,
    walletExists,
    DeployModal,
    displayModal,
    TxCompare
  } = props;
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
            className="Sign-submit btn btn-primary"
            onClick={handleSignTx}
          >
            {translate('DEP_signtx')}
          </button>
        )) || <WalletDecrypt />}

        {TxCompare ? (
          <section>
            {TxCompare}
            <button
              className="Deploy-submit btn btn-primary"
              onClick={handleDeploy}
            >
              {translate('NAV_DeployContract')}
            </button>
          </section>
        ) : null}

        {displayModal && DeployModal}
      </section>
    </div>
  );
};

export default deployHOC(Deploy);
