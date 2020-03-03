import { withProtectTransaction } from '../../ProtectTransaction/components/WithProtectTransaction';
import SignTransaction from './SignTransaction';
export { default as SendAssetsForm } from './SendAssetsForm';
export * from './validators';
export * from './fields';

const SignTransactionWithProtection = withProtectTransaction(SignTransaction, SignTransaction);

export { SignTransaction, SignTransactionWithProtection };
