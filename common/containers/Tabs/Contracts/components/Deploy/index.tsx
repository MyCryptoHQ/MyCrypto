import React from 'react';
import translate from 'translations';
import WalletDecrypt from 'components/WalletDecrypt';
import { deployHOC } from './components/DeployHoc';
import { TTxCompare } from '../TxCompare';
import { TTxModal } from '../TxModal';
import classnames from 'classnames';
import { addProperties } from 'utils/helpers';
import { isValidGasPrice, isValidByteCode } from 'libs/validators';

export interface Props {
  byteCode: string;
  gasLimit: string;
  walletExists: boolean;
  txCompare: React.ReactElement<TTxCompare> | null;
  displayModal: boolean;
  deployModal: React.ReactElement<TTxModal> | null;
  handleInput(
    input: string
  ): (ev: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  handleSignTx(): Promise<void>;
  handleDeploy(): void;
}

const Deploy = (props: Props) => {
  const {
    handleSignTx,
    handleInput,
    handleDeploy,
    byteCode,
    gasLimit,
    walletExists,
    deployModal,
    displayModal,
    txCompare
  } = props;
  const validByteCode = isValidByteCode(byteCode);
  const validGasLimit = isValidGasPrice(gasLimit);
  const showSignTxButton = validByteCode && validGasLimit;
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
            className={classnames('Deploy-field-input', 'form-control', {
              'is-invalid': !validByteCode
            })}
            value={byteCode || ''}
          />
        </label>

        <label className="Deploy-field form-group">
          <h4 className="Deploy-field-label">Gas Limit</h4>
          <input
            name="gasLimit"
            value={gasLimit || ''}
            onChange={handleInput('gasLimit')}
            className={classnames('Deploy-field-input', 'form-control', {
              'is-invalid': !validGasLimit
            })}
          />
        </label>

        {walletExists ? (
          <button
            className="Sign-submit btn btn-primary"
            disabled={!showSignTxButton}
            {...addProperties(showSignTxButton, { onClick: handleSignTx })}
          >
            {translate('DEP_signtx')}
          </button>
        ) : (
          <WalletDecrypt />
        )}

        {txCompare ? (
          <section>
            {txCompare}
            <button
              className="Deploy-submit btn btn-primary"
              onClick={handleDeploy}
            >
              {translate('NAV_DeployContract')}
            </button>
          </section>
        ) : null}

        {displayModal && deployModal}
      </section>
    </div>
  );
};

export default deployHOC(Deploy);
