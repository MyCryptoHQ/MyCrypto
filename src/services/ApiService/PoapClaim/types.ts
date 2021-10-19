export type PoapClaimResult = PoapClaimSuccess | PoapClaimFailure;

interface PoapClaimSuccess {
  success: true;
  claim: string; // URL
}

interface PoapClaimFailure {
  success: false;
  msg: string;
}
