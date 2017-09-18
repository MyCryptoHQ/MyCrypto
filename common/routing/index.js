import { browserHistory } from 'react-router';
import { useBasename } from 'history';

export const history = getHistory();

function getHistory() {
  const basename = '';
  return useBasename(() => browserHistory)({ basename });
}
