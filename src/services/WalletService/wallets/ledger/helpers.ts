import { translateRaw } from '@translations';

import { ErrorWithId, LedgerError, U2FError } from './types';

export const isU2FError = (err: LedgerError): err is U2FError =>
  !!err && !!(err as U2FError).metaData;
export const isStringError = (err: LedgerError): err is string => typeof err === 'string';
export const isErrorWithId = (err: LedgerError): err is ErrorWithId =>
  Object.prototype.hasOwnProperty.call(err, 'id') &&
  Object.prototype.hasOwnProperty.call(err, 'message');

/*
 * Note: U2F Timeout is 30s
 * Some error codes (hex):
 * 6804,6d00 - Wrong app
 * 6700      - Too long..? Not sure what this is
 * 6801      - Locked device (timeout...?)
 * 6985      - Signature request denied
 * 6a80      - Invalid data received (contract data turned off)
 */

export const ledgerErrToMessage = (err: LedgerError) => {
  // https://developers.yubico.com/U2F/Libraries/Client_error_codes.html
  if (isU2FError(err)) {
    // Timeout
    if (err.metaData.code === 5) {
      return translateRaw('LEDGER_TIMEOUT');
    }

    return err.metaData.type;
  }

  if (isStringError(err)) {
    // Wrong app logged into || Not in an app
    if (err.includes('6804') || err.includes('6d00') || err.includes('6700')) {
      return translateRaw('LEDGER_WRONG_APP');
    }
    // Ledger locked
    if (err.includes('6801')) {
      return translateRaw('LEDGER_LOCKED');
    }

    return err;
  }

  if (isErrorWithId(err)) {
    // Browser doesn't support U2F
    if (err.message.includes('U2F not supported')) {
      return translateRaw('U2F_NOT_SUPPORTED');
    }
  }

  // Other
  return err.toString();
};
