import { EnclaveMethods } from './types';

export const PROTOCOL_NAME = 'eth-enclave';

const eventTypes = Object.values(EnclaveMethods);
export const isValidEventType = (e: string): e is EnclaveMethods => e in eventTypes;
