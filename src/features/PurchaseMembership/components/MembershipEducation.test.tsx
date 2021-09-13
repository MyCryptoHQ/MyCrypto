import { simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import MembershipEducation from './MembershipEducation';

function getComponent() {
  return simpleRender(<MembershipEducation />);
}

describe('MembershipEducation', () => {
  it('renders', async () => {
    const { getByText } = getComponent();
    expect(getByText(translateRaw('MEMBERSHIP_DESC_SECOND')).textContent).toBeDefined();
  });
});
