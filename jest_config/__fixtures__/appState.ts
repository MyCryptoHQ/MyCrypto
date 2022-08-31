import { fLocalStorage } from '@fixtures';
import { marshallState } from '@services/Store/DataManager/utils';

export default marshallState(fLocalStorage);
