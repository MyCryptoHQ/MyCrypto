import { create, read, update, destroy, readAll } from 'v2/services/LocalCache';

export const createDerivationPathOptions = create('derivationPathOptions');
export const readDerivationPathOptions = read('derivationPathOptions');
export const updateDerivationPathOptions = update('derivationPathOptions');
export const deleteDerivationPathOptions = destroy('derivationPathOptions');
export const readAllDerivationPathOptions = readAll('derivationPathOptions');
