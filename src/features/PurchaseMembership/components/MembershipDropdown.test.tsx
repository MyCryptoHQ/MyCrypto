import React from 'react';
import selectEvent from 'react-select-event';

import { simpleRender } from 'test-utils';

import MembershipDropdown, { Props } from './MembershipDropdown';
import { MEMBERSHIP_CONFIG } from '../config';

const defaultProps: Props = {
  name: 'MembershipPlan',
  value: undefined,
  onSelect: jest.fn()
};

function getComponent(props: Props) {
  return simpleRender(
    <form role="form">
      <label htmlFor={defaultProps.name}>Membership</label>
      <MembershipDropdown {...props} />
    </form>
  );
}

describe('MembershipDropdown', () => {
  test('it displays placeholder text when selectedMembershipPlan is undefined', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText('Select membership plan').textContent).toBeDefined();
  });

  test('it displays the list of membership plans on click', async () => {
    const props = Object.assign({}, defaultProps);
    const { getByText, getByLabelText } = getComponent(props);

    await selectEvent.openMenu(getByLabelText('Membership'));

    // Ensure each plan is displayed in the list.
    Object.values(MEMBERSHIP_CONFIG)
      .map((p) => p.title)
      .forEach((t) => expect(getByText(t)).toBeInTheDocument());
  });

  test('it calls the success handler with the correct value', async () => {
    const props = Object.assign({}, defaultProps);
    const { getByRole, getByLabelText } = getComponent(props);

    expect(getByRole('form')).toHaveFormValues({ [defaultProps.name]: '' });
    await selectEvent.select(getByLabelText('Membership'), MEMBERSHIP_CONFIG.onemonth.title);
    expect(defaultProps.onSelect).toBeCalledWith({
      label: MEMBERSHIP_CONFIG.onemonth.title,
      value: MEMBERSHIP_CONFIG.onemonth
    });
  });
});
