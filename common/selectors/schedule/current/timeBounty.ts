import { AppState } from 'reducers';
import { getTimeBounty } from '../fields';
import { timeBountyValidator } from 'libs/validators';
import { Wei } from 'libs/units';

interface ICurrentTimeBounty {
  raw: string;
  value: Wei | null;
}

const isValidCurrentTimeBounty = (state: AppState) => {
  const currentTimeBounty = getTimeBounty(state);

  return timeBountyValidator(currentTimeBounty.value);
};

const getCurrentTimeBounty = (state: AppState): ICurrentTimeBounty => getTimeBounty(state);

export { getCurrentTimeBounty, ICurrentTimeBounty, isValidCurrentTimeBounty };
