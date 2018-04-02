import { AppState } from 'reducers';
import { getTimeBounty } from './fields';
import BN from 'bn.js';
import { timeBountyValidator } from 'libs/validators';

interface ICurrentTimeBounty {
  raw: string;
  value: BN;
}

const isValidCurrentTimeBounty = (state: AppState) => {
  const currentTimeBounty = getTimeBounty(state);

  return timeBountyValidator(currentTimeBounty.value);
};

const getCurrentTimeBounty = (state: AppState): ICurrentTimeBounty => getTimeBounty(state);

export { getCurrentTimeBounty, ICurrentTimeBounty, isValidCurrentTimeBounty };
