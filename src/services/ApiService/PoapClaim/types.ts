import { TURL } from '@types';

export type PoapClaimResult = PoapClaimSuccess | PoapClaimFailure;

interface PoapClaimSuccess {
  success: true;
  claim: TURL;
}

interface PoapClaimFailure {
  success: false;
  msg: string;
}
