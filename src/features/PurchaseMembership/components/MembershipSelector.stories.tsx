import React, { useState } from 'react';

import { noOp } from '@utils';

import MembershipSelector, {
  MembershipSelectorItem,
  MembershipSelectorProps
} from './MembershipSelector';
import { MEMBERSHIP_CONFIG, IMembershipConfig } from '../config';

export default { title: 'Selectors/MembershipSelector' };

const defaultProps: MembershipSelectorProps = {
  name: '',
  value: null,
  onSelect: noOp
};

export const Selector = () => {
  const [formValues, setFormValues] = useState<{ membership?: IMembershipConfig }>({
    membership: undefined
  });

  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <form>
        <MembershipSelector
          {...defaultProps}
          onSelect={(option) => setFormValues({ membership: option })}
        />
      </form>
      <pre>{JSON.stringify(formValues)}</pre>
    </div>
  );
};

export const DropdownItem = () => {
  const option = Object.assign({}, MEMBERSHIP_CONFIG.onemonth);
  return (
    <div className="sb-container" style={{ width: '100%', maxWidth: '300px' }}>
      <MembershipSelectorItem option={option} />
    </div>
  );
};
